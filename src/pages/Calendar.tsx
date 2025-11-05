import { useState, useMemo, useRef } from "react";
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

export default function Calendar() {
  const [eventos, setEventos] = useState<EventInput[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filtrosAtivos, setFiltrosAtivos] = useState<string[]>(
    CATEGORIAS_CONSULTA.map((c) => c.id)
  );
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null);
  const calendarRef = useRef<FullCalendar>(null);

  /** Converte o DTO da API para o formato aceito pelo FullCalendar */
  function dtoToEventInput(dto: AgendamentoApiDto): EventInput {
    const especialidade =
      dto.extended?.["especialidadeProfissional"] ??
      dto.especialidadeProfissional ??
      "";
    const categoria = CATEGORIAS_CONSULTA.find(
      (c) =>
        c.title.toLowerCase() === especialidade.toLowerCase() ||
        c.id.toLowerCase() === especialidade.toLowerCase()
    );

    return {
      id: String(dto.id),
      title: dto.title,
      start: dto.start,
      end: dto.end,
      color: categoria?.color ?? "#6b7280",
      extendedProps: {
        ...dto.extended,
        categoriaId: categoria?.id ?? "outros", // 🔥 usado no filtro
        codigoConsulta: dto.id,
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

  /** Fechar modal */
  const closeModal = () => setSelectedEvent(null);

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
              {selectedEvent.extendedProps?.["nomePaciente"] ??
                selectedEvent.title ??
                "Detalhes da Consulta"}
            </h2>

            {/* Corpo em 2 colunas */}
            <div className="grid grid-cols-2 gap-6 text-gray-700">
              <div>
                <p className="mb-2">
                  <span className="font-medium text-gray-900">Data:</span>
                  <br />
                  {new Date(selectedEvent.start ?? "").toLocaleDateString(
                    "pt-BR"
                  )}
                </p>

                <p className="mb-2">
                  <span className="font-medium text-gray-900">Horário:</span>
                  <br />
                  {new Date(selectedEvent.start ?? "").toLocaleTimeString(
                    "pt-BR",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>

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

            {/* Link e anotações */}
            <div className="mt-8">
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
              <button
                onClick={closeModal}
                className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
