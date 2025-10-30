import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CATEGORIAS_CONSULTA } from './dataCalendar';

interface Props {
  filtrosAtivos: string[];
  onChangeFiltros: (novosFiltros: string[]) => void;
  currentDate: Date;
  onDateChange: (newDate: Date) => void;
}
// filtros
export default function SidebarCalendar({
  filtrosAtivos,
  onChangeFiltros,
  currentDate,
  onDateChange
}: Props) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const novosFiltros = checked
      ? [...filtrosAtivos, value]
      : filtrosAtivos.filter((f) => f !== value);
    onChangeFiltros(novosFiltros);
  };

  const handleMiniCalChange = (value: Date | [Date, Date] | null) => {
    if (value && !Array.isArray(value)) {
      onDateChange(value);
    }
  };

 //estiliza 
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const sameDay =
        date.getFullYear() === currentDate.getFullYear() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getDate() === currentDate.getDate();
      if (sameDay) return 'bg-blue-500 text-white rounded-full';
    }
    return '';
  };

  return (
    <aside className="w-64 p-4 space-y-6 bg-gray-50 border-r border-gray-200">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Filtros de Consulta</h2>
        <div className="flex flex-col space-y-3 mt-4">
          {CATEGORIAS_CONSULTA.map((categoria) => (
            <label
              key={categoria.id}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <input
                type="checkbox"
                value={categoria.id}
                checked={filtrosAtivos.includes(categoria.id)}
                onChange={handleCheckboxChange}
                className="h-5 w-5 rounded border-gray-300"
                style={{ accentColor: categoria.color }}
              />
              <span className="text-gray-700">{categoria.title}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <Calendar
          onChange={handleMiniCalChange}
          value={currentDate}
          locale="pt-BR"
          tileClassName={tileClassName}
          className="border-none"
        />
      </div>
    </aside>
  );
}
