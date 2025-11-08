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
    setIdPaciente: setIdPaciente,
    paciente: paciente,
    setPaciente: setPaciente,
    carregando: carregando,
  } = useDadosPaciente();

  useEffect(() => {
    // Se há um ID na URL, mas o Hook ainda não tem esse ID (para evitar loops)
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
      <div className="justify-center">
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
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-1/4 p-6 bg-gray-50 border-r border-gray-200">
        <BlocoIdentificacao paciente={paciente} />
      </div>

      <div className="w-2/4 overflow-y-auto p-6">
        <LinhaDoTempo
          linhaDoTempo={filteredAndSortedHistory}
          setPaciente={setPaciente}
          filtro={filter}
          setFiltro={setFilter}
          ordenacao={sortOrder}
          setOrdenacao={setSortOrder}
        />
      </div>

      <div className="w-1/4 p-6 bg-gray-100 border-l border-gray-200">
        <BlocoDeAcoes
          idPaciente={paciente.idPaciente}
          setPaciente={setPaciente}
        />
      </div>
    </div>
  );
}
