import { useState, useMemo, useRef, useEffect, type ChangeEvent } from "react";
import {
  type EventInput,
  type EventClickArg,
  type DatesSetArg,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";

import CalendarComponent from "../components/pageCalendar/CalendarComponent";
import SidebarCalendar from "../components/pageCalendar/SidebarCalendar";
import { CATEGORIAS_CONSULTA } from "../components/pageCalendar/dataCalendar";
import {
  AgendamentoService,
  type AgendamentoApiDto,
} from "../components/pageCalendar/AgendamentoService";
import { API_JAVA_URL } from "../components/ApiService";

interface EditedEvent {
  date: string;
  time: string;
  status: string;
}

export default function Calendar() {
  const [eventos, setEventos] = useState<EventInput[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filtrosAtivos, setFiltrosAtivos] = useState<string[]>(
    CATEGORIAS_CONSULTA.map((c) => c.id)
  );
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<EditedEvent | null>(null);
  const calendarRef = useRef<FullCalendar>(null);

  const ENDPOINT = `${API_JAVA_URL}/agendamentos`;

  /** Converte o DTO da API para o formato aceito pelo FullCalendar */
  function dtoToEventInput(dto: AgendamentoApiDto): EventInput {
    const especialidade = dto.extended?.["especialidadeProfissional"] ?? "";
    const categoria = CATEGORIAS_CONSULTA.find(
      (c) =>
        c.title.toLowerCase() === especialidade.toLowerCase() ||
        c.id.toLowerCase() === especialidade.toLowerCase()
    );

    return {
      id: String(dto.extended?.["idConsulta"] ?? ""),
      title: dto.title,
      start: dto.start,
      end: dto.end,
      color: categoria?.color ?? "#6b7280",
      extendedProps: {
        ...dto.extended,
        categoriaId: categoria?.id ?? "outros",
        codigoConsulta: dto.extended?.["idConsulta"] ?? "",
      },
    };
  }

  const eventosFiltrados = useMemo(() => {
    return eventos.filter((evento) => {
      const categoriaId = evento.extendedProps?.categoriaId as string | undefined;
      return !categoriaId || filtrosAtivos.includes(categoriaId);
    });
  }, [eventos, filtrosAtivos]);

  const handleMainCalNavigate = async (dateInfo: DatesSetArg) => {
    setCurrentDate(dateInfo.start);
    setIsLoading(true);
    setEventos([]);

    try {
      const eventsInRange = (
        await AgendamentoService.fetchByPeriod(dateInfo.start, dateInfo.end)
      ).map(dtoToEventInput);

      setEventos(eventsInRange);
    } catch (err) {
      console.error("Erro ao buscar/agregar eventos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMiniCalDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
    calendarRef.current?.getApi().changeView("timeGridDay", newDate);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start?.toISOString() ?? "",
      end: event.end?.toISOString() ?? "",
      color: event.backgroundColor,
      extendedProps: event.extendedProps,
    });
  };

  useEffect(() => {
    if (selectedEvent) {
      const start = new Date(selectedEvent.start as string);
      setEditedEvent({
        date: start.toISOString().split("T")[0],
        time: start.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: (selectedEvent.extendedProps?.["statusConsulta"] as string) ?? "AGENDADO",
      });
    }
  }, [selectedEvent]);

  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedEvent((prev) =>
      prev ? { ...prev, [name]: value } : { date: "", time: "", status: "" }
    );
  };

  const handleSave = async () => {
    if (!selectedEvent || !editedEvent) return;

    console.log("Salvando alterações:", {
      id: selectedEvent.id,
      ...editedEvent,
    });

    try {
      const response = await fetch(`${ENDPOINT}/${selectedEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedEvent),
      });

      if (!response.ok) {
        throw new Error("Falha ao salvar as alterações no banco.");
      }

      const eventoModificado: EventInput = {
        ...selectedEvent,
        start: `${editedEvent.date}T${editedEvent.time}:00`,
        end: `${editedEvent.date}T${editedEvent.time}:00`,
        extendedProps: {
          ...selectedEvent.extendedProps,
          statusConsulta: editedEvent.status,
        },
      };

      setEventos((prevEvents) =>
        prevEvents.map((event) => (event.id === selectedEvent.id ? eventoModificado : event))
      );

      setIsEditing(false);
      closeModal();
      alert("Alterações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      alert("ERRO: Não foi possível salvar as alterações. Consulte o log.");
    }
  };

  const handleCancel = () => setIsEditing(false);

  const closeModal = () => {
    setSelectedEvent(null);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen md:overflow-hidden bg-gray-100">
      <SidebarCalendar
        filtrosAtivos={filtrosAtivos}
        onChangeFiltros={setFiltrosAtivos}
        currentDate={currentDate}
        onDateChange={handleMiniCalDateChange}
      />

      <div className="flex-1 p-4 relative overflow-auto">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
            <span className="text-gray-600 text-lg font-medium">
              Carregando agendamentos...
            </span>
          </div>
        )}

        <CalendarComponent
          ref={calendarRef}
          eventos={eventosFiltrados}
          onSelectEvent={handleEventClick}
          currentDate={currentDate}
          onNavigate={handleMainCalNavigate}
        />
      </div>

      {selectedEvent && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white/95 rounded-2xl shadow-2xl w-[95%] sm:w-[90%] md:w-full max-w-xl md:max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-10 border border-gray-200"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute top-0 left-0 h-full w-2 sm:w-3 rounded-l-2xl"
              style={{ backgroundColor: selectedEvent.color }}
              aria-hidden
            />

            <button
              onClick={closeModal}
              className="absolute top-3 right-3 md:top-4 md:right-6 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              aria-label="Fechar"
            >
              ×
            </button>

            <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 border-b pb-3">
              {selectedEvent.title ?? "Detalhes da Consulta"}
            </h2>

            {/* Bloco principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
              <div>
<div className="mb-3">
                <label className="font-medium text-gray-900 block mb-1">Data:</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="date"
                    value={editedEvent?.date ?? ""}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  />
                ) : (
                  <span className="text-sm">
                    {new Date((selectedEvent.start ?? "") as string).toLocaleDateString("pt-BR")}
                  </span>
                )}
              </div>

              <div className="mb-3">
                <label className="font-medium text-gray-900 block mb-1">Horário:</label>
                {isEditing ? (
                  <input
                    type="time"
                    name="time"
                    value={editedEvent?.time ?? ""}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  />
                ) : (
                  <span className="text-sm">
                    {new Date((selectedEvent.start ?? "") as string).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>

                <p className="mb-3 text-sm">
                  <span className="font-medium text-gray-900">Médico(a):</span>
                  <br />
                  {selectedEvent.extendedProps?.["nomeProfissional"] ?? "—"}
                </p>

                <p className="mb-3 text-sm">
                  <span className="font-medium text-gray-900">Especialidade:</span>
                  <br />
                  {selectedEvent.extendedProps?.["especialidadeProfissional"] ?? "—"}
                </p>
              </div>

              <div>
                <p className="mb-3 text-sm">
                  <span className="font-medium text-gray-900">Código da Consulta:</span>
                  <br />
                  {selectedEvent.extendedProps?.["codigoConsulta"] ?? "—"}
                </p>

                <p className="mb-3 text-sm">
                  <span className="font-medium text-gray-900">Nome do Cuidador:</span>
                  <br />
                  {selectedEvent.extendedProps?.["nomeCuidador"] || "—"}
                </p>

                <p className="mb-3 text-sm">
                  <span className="font-medium text-gray-900">Telefone Paciente:</span>
                  <br />
                  {selectedEvent.extendedProps?.["telefonePaciente"] || "—"}
                </p>

                <p className="mb-3 text-sm">
                  <span className="font-medium text-gray-900">Telefone Cuidador:</span>
                  <br />
                  {selectedEvent.extendedProps?.["telefoneCuidador"] || "—"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-3">
                <label className="font-medium text-gray-900 block mb-1">Status da Consulta:</label>
                {isEditing ? (
                  <select
                    name="status"
                    value={editedEvent?.status ?? "AGENDADO"}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  >
                    <option value="AGENDADA">Agendada</option>
                    <option value="REALIZADA">Realizada</option>
                    <option value="PACIENTE NAO COMPARECEU">
                      Paciente não compareceu
                    </option>
                    <option value="CANCELADA">Cancelada</option>
                  </select>
                ) : (
                  <span className="text-sm whitespace-pre-line">
                    {selectedEvent.extendedProps?.["statusConsulta"] ?? "AGENDADO"}
                  </span>
                )}
              </div>

              {selectedEvent.extendedProps?.["linkConsulta"] && (
                <p className="mb-3 text-sm break-words">
                  <span className="font-medium text-gray-900">Link da Consulta:</span>
                  <br />
                  <a
                    href={selectedEvent.extendedProps["linkConsulta"]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {selectedEvent.extendedProps["linkConsulta"]}
                  </a>
                </p>
              )}

              {selectedEvent.extendedProps?.["anotacoes"] && (
                <p className="mt-4 text-sm">
                  <span className="font-medium text-gray-900">Anotações:</span>
                  <br />
                  <span className="whitespace-pre-line">
                    {selectedEvent.extendedProps["anotacoes"]}
                  </span>
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="w-full sm:w-auto px-5 py-2 rounded-lg bg-gray-500 text-white font-medium hover:bg-gray-600 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="w-full sm:w-auto px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
                  >
                    Salvar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    disabled={["REALIZADA", "CANCELADA"].includes(
                      selectedEvent.extendedProps?.["statusConsulta"]
                    )}
                    className={`w-full sm:w-auto px-5 py-2 rounded-lg text-white font-medium transition ${
                      selectedEvent.extendedProps?.["statusConsulta"] === "REALIZADA" ||
                      selectedEvent.extendedProps?.["statusConsulta"] === "CANCELADA"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    }`}
                  >
                    Editar
                  </button>
                  <button
                    onClick={closeModal}
                    className="w-full sm:w-auto px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                  >
                    Fechar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
