export interface AlertaItem {
  idPaciente: string;
  nomePaciente: string;
  telefonePaciente: string;
  nomeMedico: string;
  especialidadeConsulta: string;
  horaConsulta: string;
  scoreDeRisco: number;
  nivelDeRisco: "CRITICO" | "ALTO" | "MEDIO" | "BAIXO" | null;
  fatoresDeRisco: string[] | null;
  idConsulta: string;
  statusAlerta: "NOVO" | "EM_TRATAMENTO" | "RESOLVIDO";
  prioridadeAlerta: "ALTA" | "MEDIA" | "BAIXA";
}
