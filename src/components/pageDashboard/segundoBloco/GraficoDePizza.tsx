import { Chart } from 'react-google-charts';
import type { AlertaItem } from '../../../types/Alerta';

export interface GraficoDePizzaProps {
  alertaItem: AlertaItem[] | null;
}

export function GraficoDePizza({ alertaItem }: GraficoDePizzaProps) {

  const pacientesCriticoRisco = alertaItem?.filter(
    (item) => item.nivelDeRisco === "CRITICO"
  ).length ?? 0;

  const pacientesAltoRisco = alertaItem?.filter(
    (item) => item.nivelDeRisco === "ALTO"
  ).length ?? 0;

  const pacienteMedioRisco = alertaItem?.filter(
    (item) => item.nivelDeRisco === "MEDIO"
  ).length ?? 0;

  const pacienteBaixoRisco = alertaItem?.filter(
    (item) => item.nivelDeRisco === "BAIXO"
  ).length ?? 0;

  const dados = [
    ['Nível de Risco', 'Contagem de Pacientes'],
    ['Crítico (Score > 850)', pacientesCriticoRisco],
    ['Alto (Score 701-850)', pacientesAltoRisco],
    ['Médio (Score 401-700)', pacienteMedioRisco],
    ['Baixo (Score ≤ 400)', pacienteBaixoRisco],
  ];

  const opcoes = {
    title: 'Distribuição de Pacientes por Nível de Risco',
    pieHole: 0.4,
    colors: ['#6F42C1', '#DC3545', '#FFC107', '#007BFF'], // Crítico, Alto, Médio, Baixo
    legend: { position: 'right', alignment: 'center' },
    chartArea: { left: 10, top: 30, width: '95%', height: '85%' },
    titleTextStyle: {
      fontSize: 16,
      bold: true,
    },
    slices: {
      0: { offset: 0.05 }, // destaque leve no nível crítico
    },
  };

  return (
    <Chart
      chartType="PieChart"
      data={dados}
      options={opcoes}
      width={'100%'}
      height={'300px'}
    />
  );
}

export default GraficoDePizza;
