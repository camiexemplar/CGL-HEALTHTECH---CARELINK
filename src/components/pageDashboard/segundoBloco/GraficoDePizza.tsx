import { Chart } from 'react-google-charts';
import type { AlertaItem } from '../../../types/Alerta';

export interface GraficoDePizzaProps {
  alertaItem: AlertaItem[] | null;
}

export function GraficoDePizza({ alertaItem }: GraficoDePizzaProps) {
  
  const pacientesAltoRisco = alertaItem?.filter(
      (item) => item.nivelDeRisco === "ALTO"
  ).length ?? 0;
  
  const pacienteMedioRisco = alertaItem?.filter(
      (item) =>  item.nivelDeRisco === "MEDIO"
  ).length ?? 0;
  
  const pacienteBaixoRisco = alertaItem?.filter(
      (item) => item.nivelDeRisco === "BAIXO"
  ).length ?? 0;

  const dados = [
    ['Nível de Risco', 'Contagem de Pacientes'],
    ['Alto Risco (Score > 80)', pacientesAltoRisco],
    ['Médio Risco (Score 60-80)', pacienteMedioRisco],
    ['Baixo Risco (Score < 60)', pacienteBaixoRisco],
  ];

    
  const opcoes = {
    title: 'Distribuição de Pacientes por Nível de Risco',
    pieHole: 0.4,
    colors: ['#DC3545', '#FFC107', '#007BFF'],
    legend: { position: 'right' },
    chartArea: { left: 10, top: 30, width: '95%', height: '85%' },
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