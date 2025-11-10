import { useAlertaData } from "../components/pageDashboard/Hooks/useAlertaData";
import { InformacoesDashboard } from "../components/pageDashboard/primeiroBloco/InformacoesDashboard";
import { InformacoesGerais } from "../components/pageDashboard/segundoBloco/InformacoesGerais";

export function Dashboard() {
  const { alertas, carregando } = useAlertaData();

  if (!alertas || carregando) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        {carregando ? (
          <div className="text-xl text-blue-600">Carregando o dashboard...</div>
        ) : (
          <div className="text-xl text-red-600">
            Nenhum alerta para hoje ou erro na API.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">

      <div className="w-full lg:w-[65%] p-4 lg:p-8 bg-gray-100 border-b lg:border-b-0 lg:border-r border-gray-200">
        <InformacoesDashboard alertaItem={alertas} />
      </div>


      <div className="w-full lg:w-[35%] p-4 lg:p-8 bg-white shadow-lg overflow-y-auto">
        <InformacoesGerais alertaItem={alertas} />
      </div>
    </div>
  );
}
