import { BlocoDeAcoes } from "../components/pagePatientHistory/BlocoAcoes/BlocoDeAcoes";
import { LinhaDoTempo } from "../components/pagePatientHistory/LinhaDoTempo/LinhaDoTempo";
import { useDadosPaciente } from "../components/pagePatientHistory/Hooks/useDadosPaciente";
import { useTimelineLogic } from "../components/pagePatientHistory/Hooks/useTimelineLogic";
import { BlocoIdentificacao } from "../components/pagePatientHistory/BlocoIdentificacao/BlocoIdentificacao";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { PesquisaPaciente } from "../components/pagePatientHistory/PesquisaPaciente";

export function HistoricoPaciente() {
  const { idPaciente: idPacienteUrl } = useParams<{ idPaciente: string }>();

  const {
    idPaciente: idPacienteDoHook,
    setIdPaciente,
    paciente,
    setPaciente,
    carregando,
  } = useDadosPaciente();

  useEffect(() => {
    if (idPacienteUrl && idPacienteUrl !== idPacienteDoHook) {
      setIdPaciente(idPacienteUrl);
    }
  }, [idPacienteUrl, idPacienteDoHook, setIdPaciente]);

  const {
    filter,
    setFilter,
    sortOrder,
    setSortOrder,
    filteredAndSortedHistory,
  } = useTimelineLogic(paciente?.linhaDoTempo);

  if (!idPacienteDoHook || carregando) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        {carregando ? (
          <div className="text-xl text-blue-600">
            Carregando Histórico de {idPacienteDoHook}...
          </div>
        ) : (
          <PesquisaPaciente setIdPaciente={setIdPaciente} />
        )}
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100">
        <p className="text-xl text-red-500 p-8">
          Paciente com ID "{idPacienteDoHook}" não encontrado.
        </p>
        <button
          onClick={() => setIdPaciente(null)}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
        >
          Nova Busca
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">

      <div className="w-full lg:w-1/4 p-4 lg:p-6 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200">
        <BlocoIdentificacao paciente={paciente} />
      </div>


      <div className="w-full lg:w-2/4 overflow-y-auto p-4 lg:p-6 order-3 lg:order-none">
        <LinhaDoTempo
          linhaDoTempo={filteredAndSortedHistory}
          setPaciente={setPaciente}
          filtro={filter}
          setFiltro={setFilter}
          ordenacao={sortOrder}
          setOrdenacao={setSortOrder}
        />
      </div>


      <div className="w-full lg:w-1/4 p-4 lg:p-6 bg-gray-100 border-t lg:border-t-0 lg:border-l border-gray-200 order-2 lg:order-none">
        <BlocoDeAcoes
          idPaciente={paciente.idPaciente}
          setPaciente={setPaciente}
        />
      </div>
    </div>
  );
}
