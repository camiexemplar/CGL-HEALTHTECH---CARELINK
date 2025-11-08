import { useAlertaData } from "../components/pageDashboard/Hooks/useAlertaData";
import { InformacoesDashboard } from "../components/pageDashboard/primeiroBloco/InformacoesDashboard";
import { InformacoesGerais } from "../components/pageDashboard/segundoBloco/InformacoesGerais";

export function Dashboard(){
    const {
        alertas,
        carregando,
    } = useAlertaData();

    if (!alertas || carregando) {
        return (
        <div className="justify-center">
            {carregando ? (
            <div className="text-xl text-blue-600">
                Carregando o dashboard...
            </div>
            ) : (
            <div className="text-xl text-red-600">
                Nenhum alerta para hoje ou erro na API. 
            </div>
            )}
        </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-[65%] p-8 bg-gray-100 border-r border-gray-200">
                <InformacoesDashboard alertaItem={alertas}/>
            </div>

            <div className="w-[35%] overflow-y-auto p-8 bg-white shadow-lg">
                <InformacoesGerais alertaItem={alertas}/> 
            </div>
        </div>
    );
}