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

import EventModal from '../components/pageCalendar/EventModal';

import SidebarCalendar from '../components/pageCalendar/SidebarCalendar';

import { CATEGORIAS_CONSULTA } from '../components/pageCalendar/dataCalendar';



interface NewEventData {

  title: string;

  color: string;

  start: Date;

  end: Date;

  patientName: string;

  profissionalName: string;

  category: string;

  status: 'Agendada' | 'Realizada' | 'Paciente Faltou' | 'Cancelada' | '';

  modalidadeReal?: 'Presencial' | 'Teleconsulta' | '';

  anotacoes: string;

}





export default function Calendar() {

  const [eventos, setEventos] = useState<EventInput[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedSlot, setSelectedSlot] = useState<DateSelectArg | undefined>();

  const [eventoSelecionado, setEventoSelecionado] = useState<EventInput | undefined>();

  const [filtrosAtivos, setFiltrosAtivos] = useState<string[]>(

    CATEGORIAS_CONSULTA.map((c) => c.id)

  );

  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 26));



  const calendarRef = useRef<FullCalendar>(null);



  useEffect(() => {

    const fetchAgendamentos = async () => {

      try {

        setIsLoading(true);

        const { eventosDaSemana } = await import(

          '../components/pageCalendar/dataCalendar'

        );

        await new Promise((resolve) => setTimeout(resolve, 500));

        setEventos(eventosDaSemana);

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

      evento.extendedProps?.categoriaId

        ? filtrosAtivos.includes(evento.extendedProps.categoriaId)

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



  const handleCreateEvent = async (data: NewEventData) => {

      const newId = String(Date.now());

      const categoria = CATEGORIAS_CONSULTA.find((c) => c.title === data.category);

      const novoEvento: EventInput = {

        id: newId,

        title: data.title,

        start: data.start,

        end: data.end,

        color: data.color,

     extendedProps: {

        patientName: data.patientName,

        profissionalName: data.profissionalName,

        category: data.category,

        categoriaId: categoria ? categoria.id : 'outros',

        status: data.status,

        modalidadeReal: data.modalidadeReal,

        anotacoes: data.anotacoes,

      }



      };

      setEventos((prev) => [...prev, novoEvento]);

    };



  const handleUpdateEvent = async (data: NewEventData) => {

      if (!eventoSelecionado || !eventoSelecionado.id) return;

      setEventos((prev) =>

        prev.map((evento) =>

          evento.id === eventoSelecionado.id

            ? {

                ...evento,

                title: data.title,

                start: data.start,

                end: data.end,

                color: data.color,

                extendedProps: {

                  ...evento.extendedProps, // Mantém props antigas se houver

                  patientName: data.patientName,

                  category: data.category,

                  categoriaId: CATEGORIAS_CONSULTA.find((c) => c.title === data.category)?.id ?? 'outros',

                  // Atualiza os novos campos

                  status: data.status,

                  modalidadeReal: data.modalidadeReal,

                  anotacoes: data.anotacoes,

                }

              }

            : evento

        )

      );

    };  



  const handleDeleteEvent = async (eventId: string) => {

    setEventos((prev) => prev.filter((evento) => evento.id !== eventId));

  };



  const handleEventDropOrResize = (changeInfo: EventDropArg | EventResizeDoneArg) => {

    setEventos((prev) =>

      prev.map((evento) =>

            evento.id === changeInfo.event.id

              ? {

                  ...evento,

                  start: changeInfo.event.startStr,

                  end: changeInfo.event.endStr,

                  color: changeInfo.event.backgroundColor || evento.color

                }

              : evento

          )

        );

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

          onEventDrop={handleEventDropOrResize}

          onEventResize={handleEventDropOrResize}

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

