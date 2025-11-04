import { type EventInput } from "@fullcalendar/core";

// aqui é possivel adicionar categorias para os filtros na lateral do calendário

export const CATEGORIAS_CONSULTA = [
  { id: "fisio", title: "Fisioterapia", color: "#10b981" },
  { id: "terapia", title: "Terapia Ocupacional", color: "#3b82f6" },
  { id: "fisia", title: "Fisiatria", color: "#f59e0b" },
  { id: "fono", title: "Fonoaudiologia", color: "#6b2280" },
  { id: "psico", title: "Psicologia", color: "#3b5280" },
  { id: "outros", title: "Outros", color: "#6b7280" },
];

export const EVENTOS_INICIAIS: EventInput[] = [];
export { EVENTOS_INICIAIS as eventosDaSemana };
