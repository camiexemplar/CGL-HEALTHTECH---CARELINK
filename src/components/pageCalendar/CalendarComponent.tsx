import { forwardRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBr from '@fullcalendar/core/locales/pt-br';

import {
  type EventInput,
  type DateSelectArg,
  type EventDropArg,
  type EventClickArg,
  type DatesSetArg
} from '@fullcalendar/core';

interface Props {
  eventos: EventInput[];
  onSelectSlot: (selectInfo: DateSelectArg) => void;
  onEventChange: (changeInfo: EventDropArg) => void;
  onSelectEvent: (clickInfo: EventClickArg) => void;
  currentDate: Date;
  onNavigate: (dateInfo: DatesSetArg) => void;
}

const CalendarComponent = forwardRef<FullCalendar, Props>(
  (
    {
      eventos,
      onSelectSlot,
      onSelectEvent,
      onEventChange,
      onNavigate
    },
    ref
  ) => {
    return (
      <main className="flex-1 p-4 bg-white rounded-lg shadow-md">
        <FullCalendar
          ref={ref} 
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={eventos}
          height="90vh"
          slotMinTime="06:00:00"
          slotMaxTime="18:00:00"
          slotEventOverlap={false}
          editable
          eventDurationEditable
          selectable
          select={onSelectSlot}
          eventClick={onSelectEvent}
          eventDrop={onEventChange}
          datesSet={onNavigate}
           locale={ptBr}
        />
      </main>
    );
  }
);

CalendarComponent.displayName = 'CalendarComponent';
export default CalendarComponent;
