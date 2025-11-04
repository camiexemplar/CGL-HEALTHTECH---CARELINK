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
import { AgendamentoService } from "../components/pageCalendar/AgendamentoService";
import { type AgendamentoApiDto } from "../types/Calendario";

export default function Calendar() {
  const [eventos, setEventos] = useState<EventInput[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filtrosAtivos, setFiltrosAtivos] = useState<string[]>(
    CATEGORIAS_CONSULTA.map((c) => c.id)
  );
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const calendarRef = useRef<FullCalendar>(null);

  /** Converte o DTO da API para o formato aceito pelo FullCalendar */
  function dtoToEventInput(dto: AgendamentoApiDto): EventInput {
    const especialidade = dto.extended?.["Especialidade"] as string | undefined;
    const colorFromCategory = CATEGORIAS_CONSULTA.find(
      (c) =>
        c.title.toLowerCase() === (especialidade ?? "").toLowerCase()
    )?.color;

    const color =
      colorFromCategory ??
      CATEGORIAS_CONSULTA[
        Math.floor(Math.random() * CATEGORIAS_CONSULTA.length)
      ].color;

    return {
      id: String(dto.id),
      title: dto.title,
      start: dto.start,
      end: dto.end,
      color,
      extendedProps: {
        ...dto.extended,
        codigoConsulta: dto.id,
      },
    };
  }

  /**  filtros de categoria */
  const eventosFiltrados = useMemo(() => {
    return eventos.filter((evento) =>
      evento.extendedProps?.categoriaId
        ? filtrosAtivos.includes(evento.extendedProps.categoriaId)
        : true
    );
  }, [eventos, filtrosAtivos]);

  /** Busca os agendamentos conforme o intervalo visível do calendário */
  const handleMainCalNavigate = async (dateInfo: DatesSetArg) => {
    setCurrentDate(dateInfo.start);
    setIsLoading(true);
    setEventos([]);

    try {
      const dtos = await AgendamentoService.fetchAll();
      const visibleStart = new Date(dateInfo.start);
      const visibleEnd = new Date(dateInfo.end);

      const eventsInRange = dtos
        .filter((d) => {
          const start = new Date(d.start);
          return start >= visibleStart && start < visibleEnd;
        })
        .map(dtoToEventInput);

      setEventos(eventsInRange);
    } catch (err) {
      console.error("Erro ao buscar/agregar eventos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /** Navegação  mini calendário */
  const handleMiniCalDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
    calendarRef.current?.getApi().changeView("timeGridDay", newDate);
  };

  /** modal para mostrar detalhes (a fazer) */
  const handleEventClick = (clickInfo: EventClickArg) => {
    console.log("Evento clicado:", clickInfo.event);
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
    </div>
  );
}
