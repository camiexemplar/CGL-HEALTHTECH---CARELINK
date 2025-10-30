import { useState, useMemo, useEffect, useRef } from 'react';
import {
  type EventInput,
  type DateSelectArg,
  type EventDropArg,
  type EventClickArg,
  type DatesSetArg
} from '@fullcalendar/core';
import { type EventResizeDoneArg } from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import CalendarComponent from '../components/pageCalendar/CalendarComponent';
import EventModal, { type FormData as ModalFormData } from '../components/pageCalendar/EventModal';
import SidebarCalendar from '../components/pageCalendar/SidebarCalendar';
import { CATEGORIAS_CONSULTA } from '../components/pageCalendar/dataCalendar';
import { AgendamentoService } from '../components/pageCalendar/AgendamentoService'; // Ajuste o caminho


export default function Calendar() {
    // Estados principais
  const [eventos, setEventos] = useState<EventInput[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<DateSelectArg | undefined>();
  const [eventoSelecionado, setEventoSelecionado] = useState<EventInput | undefined>();
  const [filtrosAtivos, setFiltrosAtivos] = useState<string[]>(
    CATEGORIAS_CONSULTA.map((c) => c.id)
  );
  const [currentDate, setCurrentDate] = useState(new Date()); // Usando a data atual por padrão

  const calendarRef = useRef<FullCalendar>(null);

// carregando agendamentos do back
  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        setIsLoading(true);
        // busca os eventos na API do Quarkus
        const data = await AgendamentoService.fetchAll(); 
        setEventos(data);
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAgendamentos();
  }, []);

  const eventosFiltrados = useMemo(() => {
    return eventos.filter((evento) =>
      evento.extendedProps?.category
        ? filtrosAtivos.includes(evento.extendedProps.category)
        : true
    );
  }, [eventos, filtrosAtivos]);

  const handleSelectSlot = (slotInfo: DateSelectArg) => {
    setSelectedSlot(slotInfo);
    setEventoSelecionado(undefined);
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const start = clickInfo.event.start;
    const end = clickInfo.event.end;
    
    setEventoSelecionado({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: start as Date, 
      end: end as Date,
      color: clickInfo.event.backgroundColor,
      extendedProps: clickInfo.event.extendedProps
    });

    setSelectedSlot(undefined);
    setIsModalOpen(true);
  };

  const handleCreateEvent = async (data: ModalFormData) => {
      try {
        const novoEvento = await AgendamentoService.create(data); 
        setEventos((prev) => [...prev, novoEvento]);
        handleCloseModal();
      } catch (error) {
        console.error('Erro ao criar agendamento:', error);
      }
  };

  const handleUpdateEvent = async (data: ModalFormData) => {
      if (!eventoSelecionado || !eventoSelecionado.id) return;
      
      try {
        const eventoAtualizado = await AgendamentoService.update(eventoSelecionado.id, data);
        
        setEventos((prev) =>
          prev.map((evento) =>
            evento.id === eventoSelecionado.id ? eventoAtualizado : evento
          )
        );
        handleCloseModal();
      } catch (error) {
        console.error('Erro ao atualizar agendamento:', error);
      }
  };  

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await AgendamentoService.delete(eventId); 
      
      setEventos((prev) => prev.filter((evento) => evento.id !== eventId));
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
    }
  };

  const handleEventDropOrResize = async (changeInfo: EventDropArg | EventResizeDoneArg) => {
    const localUpdate = eventos.map((evento) =>
      evento.id === changeInfo.event.id
        ? {
            ...evento,
            start: changeInfo.event.startStr,
            end: changeInfo.event.endStr,
          }
        : evento
    );
    setEventos(localUpdate);
  
    try {
      const originalEvent = eventos.find(e => e.id === changeInfo.event.id);
      
      if (originalEvent && originalEvent.extendedProps) {
        const dataToUpdate: ModalFormData = {
          ...(originalEvent.extendedProps as ModalFormData),
          start: changeInfo.event.start as Date,
          end: changeInfo.event.end as Date,
        };
        
        const eventoAtualizado = await AgendamentoService.update(originalEvent.id!, dataToUpdate);
        

        setEventos((prev) =>
          prev.map((evento) =>
            evento.id === changeInfo.event.id ? eventoAtualizado : evento
          )
        );
      }

    } catch (error) {
      console.error('Erro ao mover/redimensionar agendamento:', error);

    }
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(undefined);
    setEventoSelecionado(undefined);
  };

  const handleMainCalNavigate = (dateInfo: DatesSetArg) => {
    setCurrentDate(dateInfo.start);
  };

  const handleMiniCalDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
    calendarRef.current?.getApi().changeView('timeGridDay', newDate);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando agendamentos...
      </div>
    );
  }

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
          onSelectSlot={handleSelectSlot}
          onEventDrop={handleEventDropOrResize as (changeInfo: EventDropArg) => void}
          onEventResize={handleEventDropOrResize as (changeInfo: EventResizeDoneArg) => void} 
          onSelectEvent={handleEventClick}
          currentDate={currentDate}
          onNavigate={handleMainCalNavigate}
        />
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        slotInfo={selectedSlot}
        eventoParaEditar={eventoSelecionado}
        onCreateEvent={handleCreateEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </div>
  );
}