import { Chart } from "react-google-charts";

const data = [
  ["Fator de Risco", "Frequência"],
  ["Baixa Afinidade Digital", 25],
  ["Histórico de Faltas", 18],
  ["Falha no Contato", 12],
  ["Não Visualizou Vídeo", 9],
  ["Teleconsulta", 5],
];

const options = {
    title: "Top 5 Fatores Críticos de Absenteísmo",
    hAxis: { 
        title: "Frequência (Contagem)",
        minValue: 0,
    },
    vAxis: { 
        title: "Fator de Risco",
    },
    legend: 'none',
    chartArea: { width: "75%", height: "80%" }, 
};

export function GraficoDeBarras() {
  return (
    <Chart
      chartType="BarChart"
      width="100%"
      height="300px"
      data={data}
      options={options}
    />
  );
}

export default GraficoDeBarras;