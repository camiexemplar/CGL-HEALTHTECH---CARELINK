import { API_BASE_URL } from "../ApiService";
export { type AgendamentoApiDto } from "../../types/Calendario";
import { type ProcessedData, type AgendamentoApiDto } from "../../types/Calendario";


// aqui a mágica acontece, temos a nossa APi quarkus \/ (apiService)

const ENDPOINT = `${API_BASE_URL}/agendamentos`;

// aqui a conversão dos formatos de hora que o quarkus nos dá

/** Converte data + hora em formato ISO (padrão que o Quarkus entende) */
function parseDateTime(dateStr?: string, timeStr?: string): string | null {
  if (!dateStr) return null;
  if (dateStr.includes("T")) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toISOString();
  }
  try {
    const dateOnly = dateStr.trim();
    const timeOnly = timeStr?.trim() ?? "00:00";
    const combined = `${dateOnly}T${timeOnly}:00`;
    const d = new Date(combined);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  } catch {
    return null;
  }
}

// aqui convertemos a data vinda do backend (o mesmo conteudo do ProcessedData)

/** Converte um objeto ProcessedData (vindo do backend) para AgendamentoApiDto (formato que o calendário entende) */
function mapProcessedToDto(p: ProcessedData, idx: number): AgendamentoApiDto {
  const startIso = parseDateTime(p["Data agenda"], p["Hora Agenda"]);
  let endIso: string | null = null;
  if (startIso) {
    const s = new Date(startIso);
    const e = new Date(s.getTime() + 60 * 60 * 1000);
    endIso = e.toISOString();
  }
  const title = `${p["Nome paciente"] ?? "Paciente"} - ${p["Especialidade"] ?? ""}`;
  return {
    id: p["Código da consulta"] ?? `api-${idx}-${Date.now()}`,
    title,
    start: startIso ?? new Date().toISOString(),
    end: endIso ?? new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    extended: p,
  };
}

// aqui temos a busca de agendamentos do backend


export const AgendamentoService = {
  /** Busca todos os agendamentos do backend e converte para o formato do FullCalendar */
  async fetchAll(): Promise<AgendamentoApiDto[]> {
    const res = await fetch(ENDPOINT);
    if (!res.ok) {
      throw new Error(`Falha ao buscar agendamentos. Status: ${res.status}`);
    }
    const raw: ProcessedData[] = await res.json();
    return raw.map((p, i) => mapProcessedToDto(p, i));
  },
};
