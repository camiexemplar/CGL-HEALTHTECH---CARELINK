// src/types/Calendario.ts
export interface ProcessedData {
  "dataConsulta": string;           // ex: "2025-11-03" ou "2025-11-03T00:00:00"
  "horaConsulta": string;           // ex: "08:30"
  "nomePaciente": string;
  "telefonePaciente": string;
  "nomeCuidador": string;
  "telefoneCuidador": string;
  "nomeProfissional": string;
  "especialidadeProfissional": string;
  "statusConsulta": string;
  "codigoConsulta": number;
  "anotacoes": string;
}

// Event DTO que usaremos internamente (opcional)
export interface AgendamentoApiDto {
  id: string | number;
  title: string;
  start: string; // ISO string
  end: string;   // ISO string
  extended: ProcessedData;
}
