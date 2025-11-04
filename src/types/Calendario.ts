// src/types/Calendario.ts
export interface ProcessedData {
  "Data agenda": string;           // ex: "2025-11-03" ou "2025-11-03T00:00:00"
  "Hora Agenda": string;           // ex: "08:30"
  "Nome paciente": string;
  "Número celular": string;
  "Data nascimento": string;
  "Nome acompanhante": string;
  "Número acompanhante": string;
  "Nome medico": string;
  "Especialidade": string;
  "Link da consulta": string;
  "Código da consulta": number;
  "anotações": string;
}

// Event DTO que usaremos internamente (opcional)
export interface AgendamentoApiDto {
  id: string | number;
  title: string;
  start: string; // ISO string
  end: string;   // ISO string
  extended: ProcessedData;
}
