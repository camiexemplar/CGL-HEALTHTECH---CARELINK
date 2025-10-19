import { TotalConsultas } from "./TotalConsultas";
import { AlertasPendentes } from "./AlertasPendentes";
import GraficoDeBarras from "./GraficoDeBarras";
import GraficoDePizza from "./GraficoDePizza";
import { AcoesTomadas } from "./AcoesTomadas";
import type { AlertaItem } from "../../../types/Alerta";

export interface InformacoesGeraisProps {
  alertaItem: AlertaItem[] | null;
}


export function InformacoesGerais({ alertaItem, }: InformacoesGeraisProps) {

    const consultasAgendadas = alertaItem?.length ?? 0;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Métricas Chave de Risco</h1>

            <div className="grid grid-cols-2 gap-4">
                <TotalConsultas consultasAgendadas={consultasAgendadas}/>
                <AlertasPendentes />
                <AcoesTomadas /> 
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">Distribuição de Alertas (Hoje)</h3>
                <GraficoDePizza alertaItem={alertaItem}/>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">Top 5 Fatores Contribuintes</h3>
                <GraficoDeBarras />
            </div>
        </div>
    );
};