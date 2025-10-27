import { Chart } from "react-google-charts";
import type { AlertaItem } from "../../../types/Alerta";

export interface GraficoDePizzaProps {
  alertaItem: AlertaItem[] | null;
}

export function GraficoDePizza({ alertaItem }: GraficoDePizzaProps) {
  const pacientesRiscoCritico =
    alertaItem?.filter((item) => item.nivelDeRisco === "CRITICO").length ?? 0;

  const pacientesRiscoAlto =
    alertaItem?.filter((item) => item.nivelDeRisco === "ALTO").length ?? 0;

  const pacienteRiscoMedio =
    alertaItem?.filter((item) => item.nivelDeRisco === "MEDIO").length ?? 0;

  const pacienteRiscoBaixo =
    alertaItem?.filter((item) => item.nivelDeRisco === "BAIXO").length ?? 0;

  const dados = [
    ["Nível de Risco", "Contagem de Pacientes"],
    ["Crítico (Score > 800)", pacientesRiscoCritico],
    ["Alto Risco (Score 501-800)", pacientesRiscoAlto],
    ["Médio Risco (Score 201-500)", pacienteRiscoMedio],
    ["Baixo Risco (Score < 200)", pacienteRiscoBaixo],
  ];

  const opcoes = {
    title: "Distribuição de Pacientes por Nível de Risco",
    pieHole: 0.4,
    colors: ["#DC3545", "Orange", "#FFC107", "#007BFF"],
    legend: { position: "right" },
    chartArea: { left: 10, top: 30, width: "95%", height: "85%" },
  };

  return (
    <Chart
      chartType="PieChart"
      data={dados}
      options={opcoes}
      width={"100%"}
      height={"300px"}
    />
  );
}

export default GraficoDePizza;
