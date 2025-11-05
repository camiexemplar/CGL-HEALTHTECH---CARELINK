import { type EventInput } from "@fullcalendar/core";

// aqui é possivel adicionar categorias para os filtros na lateral do calendário

export const CATEGORIAS_CONSULTA = [
  { id: "cardio", title: "Cardiologia", color: "#dc2626" },
  { id: "enfermagem", title: "Enfermagem", color: "#2563eb" },
  { id: "fisiatria", title: "Fisiatria", color: "#f59e0b" },
  { id: "fisioterapia", title: "Fisioterapia", color: "#10b981" },
  { id: "fono", title: "Fonoaudiologia", color: "#9333ea" },
  { id: "infecto", title: "Infectologia", color: "#f43f5e" },
  { id: "sono", title: "Medicina do Sono", color: "#0ea5e9" },
  { id: "neuro", title: "Neurologia", color: "#7c3aed" },
  { id: "nutri", title: "Nutrição", color: "#84cc16" },
  { id: "odonto", title: "Odontologia", color: "#14b8a6" },
  { id: "psico", title: "Psicologia", color: "#3b5280" },
  { id: "psiquiatria", title: "Psiquiatria", color: "#e11d48" },
  { id: "to", title: "Terapia Ocupacional", color: "#3b82f6" },
  { id: "uro", title: "Urologia", color: "#6366f1" },
];


export const EVENTOS_INICIAIS: EventInput[] = [];
export { EVENTOS_INICIAIS as eventosDaSemana };
