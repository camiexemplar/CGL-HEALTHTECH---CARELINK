/* eslint-disable react-refresh/only-export-components */
import { API_JAVA_URL } from "../ApiService";
export { type AgendamentoApiDto } from "../../types/Calendario";
import {
  type ProcessedData,
  type AgendamentoApiDto,
} from "../../types/Calendario";

const ENDPOINT = `${API_JAVA_URL}/agendamentos`;

function parseDateTime(dateStr?: string, timeStr?: string): string | null {
  if (!dateStr) return null;
  if (dateStr.includes("T")) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toISOString();
  }
  try {
    const dateParts = dateStr.trim().split("/");
    if (dateParts.length !== 3) return null;
    const day = dateParts[0];
    const month = dateParts[1];
    const year = dateParts[2];
    const dateOnly = `${year}-${month}-${day}`;

    const timeOnly = timeStr?.trim() ?? "00:00";
    const combined = `${dateOnly}T${timeOnly}:00`;
    const d = new Date(combined);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  } catch {
    return null;
  }
}

function mapProcessedToDto(p: ProcessedData): AgendamentoApiDto {
  const startIso = parseDateTime(p["dataConsulta"], p["horaConsulta"]);
  let endIso: string | null = null;
  if (startIso) {
    const s = new Date(startIso);
    const e = new Date(s.getTime() + 60 * 60 * 1000);
    endIso = e.toISOString();
  }
  const title = `${p["especialidadeProfissional"] ?? ""} - ${
    p["nomePaciente"] ?? "Paciente"
  }`;
  return {
    title,
    start: startIso ?? new Date().toISOString(),
    end: endIso ?? new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    extended: p,
  };
}

export const AgendamentoService = {
  async fetchByPeriod(
    dataInicio: Date,
    dataFim: Date
  ): Promise<AgendamentoApiDto[]> {
    const params = new URLSearchParams({
      dataInicio: dataInicio.toISOString().split("T")[0], // YYYY-MM-DD
      dataFim: dataFim.toISOString().split("T")[0], // YYYY-MM-DD
    });

    const res = await fetch(`${ENDPOINT}?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Falha ao buscar agendamentos. Status: ${res.status}`);
    }

    const raw: ProcessedData[] = await res.json();
    return raw.map((p) => mapProcessedToDto(p)); // ✅ Removido o `i` desnecessário
  },
};
