import { useState, useMemo, useRef } from "react";
import { type EventInput, type EventClickArg, type DatesSetArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";

import CalendarComponent from "../components/pageCalendar/CalendarComponent";
import SidebarCalendar from "../components/pageCalendar/SidebarCalendar";
import { CATEGORIAS_CONSULTA } from "../components/pageCalendar/dataCalendar";
import { AgendamentoService } from "../components/pageCalendar/AgendamentoService";

export default function Calendar() {
  const [eventos, setEventos] = useState<EventInput[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filtrosAtivos, setFiltrosAtivos] = useState<string[]>(
    CATEGORIAS_CONSULTA.map((c) => c.id)
  );
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const calendarRef = useRef<FullCalendar>(null);

  function dtoToEventInput(dto: any): EventInput {
    const especialidade = dto.extended?.["Especialidade"] as string | undefined;
    const colorFromCategory = CATEGORIAS_CONSULTA.find(
      (c) => c.title.toLowerCase() === (especialidade ?? "").toLowerCase()
    )?.color;
    const color =
      colorFromCategory ??
      CATEGORIAS_CONSULTA[Math.floor(Math.random() * CATEGORIAS_CONSULTA.length)].color;
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

  const eventosFiltrados = useMemo(() => {
    return eventos.filter((evento) =>
      evento.extendedProps?.categoriaId
        ? filtrosAtivos.includes(evento.extendedProps.categoriaId)
        : true
    );
  }, [eventos, filtrosAtivos]);

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

  const handleMiniCalDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
    calendarRef.current?.getApi().changeView("timeGridDay", newDate);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    console.log("Evento clicado:", clickInfo.event);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarCalendar
        filtrosAtivos={filtrosAtivos}
        onChangeFiltros={setFiltrosAtivos}
        currentDate={currentDate}
        onDateChange={handleMiniCalDateChange}
      />

      <div className="flex-1 p-4">
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
