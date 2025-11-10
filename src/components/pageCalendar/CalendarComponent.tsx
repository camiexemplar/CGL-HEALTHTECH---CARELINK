import { forwardRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBr from "@fullcalendar/core/locales/pt-br";
import {
  type EventInput,
  type EventClickArg,
  type DatesSetArg,
} from "@fullcalendar/core";

interface Props {
  eventos: EventInput[];
  onSelectEvent?: (clickInfo: EventClickArg) => void;
  currentDate: Date;
  onNavigate: (dateInfo: DatesSetArg) => void;
}

const CalendarComponent = forwardRef<FullCalendar, Props>(
  ({ eventos, onSelectEvent, onNavigate }, ref) => {
    return (
      <main className="p-4 bg-white rounded-lg shadow-md h-full w-full overflow-x-auto">
        <div className="min-w-[300px] md:min-w-0">
          <FullCalendar
            ref={ref}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={eventos}
            height="auto"
            slotMinTime="06:00:00"
            slotMaxTime="18:00:00"
            editable={false}
            selectable={false}
            eventDurationEditable={false}
            eventClick={onSelectEvent}
            datesSet={onNavigate}
            slotEventOverlap={false}
            locale={ptBr}
            eventContent={(arg) => (
              <div className="p-1 text-xs md:text-sm">
                <div className="font-bold truncate">{arg.event.title}</div>
              </div>
            )}
            views={{
              timeGridWeek: {
                titleFormat: { year: "numeric", month: "short", day: "numeric" },
              },
            }}
          />
        </div>

        <style>
          {`
            /* Ajuste responsivo do FullCalendar */
            @media (max-width: 768px) {
              .fc .fc-toolbar.fc-header-toolbar {
                flex-direction: column;
                gap: 0.5rem;
              }

              .fc-toolbar-title {
                font-size: 1rem !important;
              }

              .fc-button {
                font-size: 0.75rem !important;
                padding: 0.25rem 0.5rem !important;
              }

              .fc-timegrid-axis {
                font-size: 0.6rem !important;
              }

              .fc-timegrid-slot-label {
                font-size: 0.6rem !important;
              }

              .fc-daygrid-day-number {
                font-size: 0.7rem !important;
              }

              .fc-col-header-cell-cushion {
                white-space: nowrap;
                font-size: 0.65rem !important;
              }

              .fc-timegrid-slots {
                overflow-x: auto;
              }
            }
          `}
        </style>
      </main>
    );
  }
);

CalendarComponent.displayName = "CalendarComponent";
export default CalendarComponent;
