import { type EventInput } from '@fullcalendar/core';

// categorias 
export const CATEGORIAS_CONSULTA = [
  { id: 'fisio', title: 'Fisioterapia', color: '#10b981' }, // Verde
  { id: 'terapia', title: 'Terapia Ocupacional', color: '#3b82f6' }, // Azul
  { id: 'fisia', title: 'Fisiatria', color: '#f59e0b' }, // Laranja
  { id: 'fono', title: 'Fonoaudiologia', color: '#6b2280' },    // roxo
  { id: 'psico', title: 'Psicologia', color: '#3b5280' },    // azul
  { id: 'outros', title: 'Outros', color: '#6b7280' },    // cinza
];

export const EVENTOS_INICIAIS: EventInput[] = [
];

export { EVENTOS_INICIAIS as eventosDaSemana };