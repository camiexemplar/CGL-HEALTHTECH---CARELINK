import { useState, useMemo, useRef, useEffect } from "react";
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
import { API_BASE_URL } from "../components/ApiService";

export default function Calendar() {
  const [eventos, setEventos] = useState<EventInput[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filtrosAtivos, setFiltrosAtivos] = useState<string[]>(
    CATEGORIAS_CONSULTA.map((c) => c.id)
  );
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<any>(null);
  const calendarRef = useRef<FullCalendar>(null);

  const ENDPOINT = `${API_BASE_URL}/agendamentos`;

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
        categoriaId: categoria?.id ?? "outros", // 🔥 usado no filtro
        codigoConsulta: dto.extended?.["idConsulta"] ?? "",
      },
    };
  }

  /** Aplica os filtros de categoria */
  const eventosFiltrados = useMemo(() => {
    return eventos.filter((evento) => {
      const categoriaId = evento.extendedProps?.categoriaId as
        | string
        | undefined;
      return !categoriaId || filtrosAtivos.includes(categoriaId);
    });
  }, [eventos, filtrosAtivos]);

  /** Busca os agendamentos conforme o intervalo visível do calendário */
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

  /** Navegação pelo mini calendário lateral */
  const handleMiniCalDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
    calendarRef.current?.getApi().changeView("timeGridDay", newDate);
  };

  /** Clique em um evento (abre modal) */
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

  // Efeito para inicializar os dados de edição quando um evento é selecionado
  useEffect(() => {
    if (selectedEvent) {
      const start = new Date(selectedEvent.start as string);
      setEditedEvent({
        date: start.toISOString().split("T")[0], // Formato YYYY-MM-DD
        time: start.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: selectedEvent.extendedProps?.["statusConsulta"] ?? "AGENDADO",
      });
    }
  }, [selectedEvent]);

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedEvent((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // TODO: Implementar a lógica de chamada de API para salvar as alterações.
    console.log("Salvando alterações:", {
      id: selectedEvent?.id,
      ...editedEvent,
    });

    try {
      const response = await fetch(`${ENDPOINT}/${selectedEvent?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedEvent),
      });

      if (!response.ok) {
        throw new Error("Falha ao salvar as alterações no banco.");
      }

      const eventoModificado = {
        ...selectedEvent, // Mantém id, title, color
        start: `${editedEvent.date}T${editedEvent.time}:00`, // Combina nova data e tempo
        end: `${editedEvent.date}T${editedEvent.time}:00`, // (Assumindo que start e end são iguais)
        extendedProps: {
          ...selectedEvent?.extendedProps, // Mantém nomePaciente, médico, etc.
          statusConsulta: editedEvent.status,
        },
      };

      setEventos((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent?.id // ✅ Compara com o ID do evento selecionado
            ? (eventoModificado as any) // ✅ Usa o objeto local e completo
            : event
        )
      );

      // Aqui você atualizaria o estado 'eventos' com os dados retornados pela API
      setIsEditing(false);

      alert("Alterações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      alert("ERRO: Não foi possível salvar as alterações. Consulte o log.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Opcional: resetar 'editedEvent' se necessário, mas o useEffect já cuida disso na reabertura.
  };

  /** Fechar modal */
  const closeModal = () => {
    setSelectedEvent(null);
    setIsEditing(false); // Garante que o modo de edição seja resetado ao fechar
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar com filtros e mini calendário */}
      <SidebarCalendar
        filtrosAtivos={filtrosAtivos}
        onChangeFiltros={setFiltrosAtivos}
        currentDate={currentDate}
        onDateChange={handleMiniCalDateChange}
      />

      {/* Área principal */}
      <div className="flex-1 p-4 relative">
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

      {/* Modal de Detalhes da Consulta */}
      {selectedEvent && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white/90 rounded-3xl shadow-2xl w-full max-w-3xl p-10 border border-gray-200 backdrop-blur-md"
          >
            {/* Faixa colorida lateral */}
            <div
              className="absolute top-0 left-0 h-full w-3 rounded-l-3xl"
              style={{ backgroundColor: selectedEvent.color }}
            />

            {/* Botão de fechar */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-6 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              ×
            </button>

            {/* Cabeçalho */}
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-3">
              {selectedEvent.title ?? "Detalhes da Consulta"}
            </h2>

            {/* Corpo em 2 colunas */}
            <div className="grid grid-cols-2 gap-6 text-gray-700">
              <div>
                <div className="mb-2">
                  <label className="font-medium text-gray-900 block">
                    Data:
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="date"
                      value={editedEvent.date}
                      onChange={handleEditChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  ) : (
                    <span>
                      {new Date(selectedEvent.start ?? "").toLocaleDateString(
                        "pt-BR"
                      )}
                    </span>
                  )}
                </div>

                <div className="mb-2">
                  <label className="font-medium text-gray-900 block">
                    Horário:
                  </label>
                  {isEditing ? (
                    <input
                      type="time"
                      name="time"
                      value={editedEvent.time}
                      onChange={handleEditChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  ) : (
                    <span>
                      {new Date(selectedEvent.start ?? "").toLocaleTimeString(
                        "pt-BR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  )}
                </div>

                <p className="mb-2">
                  <span className="font-medium text-gray-900">Médico(a):</span>
                  <br />
                  {selectedEvent.extendedProps?.["nomeProfissional"] ?? "—"}
                </p>
                <p className="mb-2">
                  <span className="font-medium text-gray-900">
                    Especialidade:
                  </span>
                  <br />
                  {selectedEvent.extendedProps?.["especialidadeProfissional"] ??
                    "—"}
                </p>
              </div>

              <div>
                <p className="mb-2">
                  <span className="font-medium text-gray-900">
                    Código da Consulta:
                  </span>
                  <br />
                  {selectedEvent.extendedProps?.["codigoConsulta"] ?? "—"}
                </p>

                <p className="mb-2">
                  <span className="font-medium text-gray-900">
                    Nome do Cuidador:
                  </span>
                  <br />
                  {selectedEvent.extendedProps?.["nomeCuidador"] || "—"}
                </p>

                <p className="mb-2">
                  <span className="font-medium text-gray-900">
                    Telefone Paciente:
                  </span>
                  <br />
                  {selectedEvent.extendedProps?.["telefonePaciente"] || "—"}
                </p>

                <p className="mb-2">
                  <span className="font-medium text-gray-900">
                    Telefone Cuidador:
                  </span>
                  <br />
                  {selectedEvent.extendedProps?.["telefoneCuidador"] || "—"}
                </p>
              </div>
            </div>

            {/* Status, Link e anotações */}
            <div className="mt-8">
              <div className="mb-3">
                <label className="font-medium text-gray-900 block">
                  Status da Consulta:
                </label>
                {isEditing ? (
                  <select
                    name="status"
                    value={editedEvent.status}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="AGENDADO">Agendada</option>
                    <option value="REALIZADA">Realizada</option>
                    <option value="PACIENTE NAO COMPARECEU">Paciente não compareceu</option>
                    <option value="CANCELADA">Cancelada</option>
                  </select>
                ) : (
                  <span className="whitespace-pre-line">
                    {selectedEvent.extendedProps?.["statusConsulta"] ??
                      "AGENDADO"}
                  </span>
                )}
              </div>

              {selectedEvent.extendedProps?.["linkConsulta"] && (
                <p className="mb-3">
                  <span className="font-medium text-gray-900">
                    Link da Consulta:
                  </span>
                  <br />
                  <a
                    href={selectedEvent.extendedProps["linkConsulta"]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-words"
                  >
                    {selectedEvent.extendedProps["linkConsulta"]}
                  </a>
                </p>
              )}

              {selectedEvent.extendedProps?.["anotacoes"] && (
                <p className="mt-4">
                  <span className="font-medium text-gray-900">Anotações:</span>
                  <br />
                  <span className="whitespace-pre-line">
                    {selectedEvent.extendedProps["anotacoes"]}
                  </span>
                </p>
              )}
            </div>

            {/* Rodapé */}
            <div className="mt-10 flex justify-end">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 rounded-xl bg-gray-500 text-white font-medium hover:bg-gray-600 transition mr-4"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
                  >
                    Salvar
                  </button>
                </>
              ) : (
                <>
                  {/* O botão "Editar" agora verifica o status da consulta */}
                  <button
                    onClick={() => setIsEditing(true)}
                    disabled={
                      ["REALIZADA", "CANCELADA"].includes(
                        selectedEvent.extendedProps?.["statusConsulta"]
                      )
                    }
                    className={`px-6 py-2 rounded-xl text-white font-medium transition mr-4 ${
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
                    className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
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