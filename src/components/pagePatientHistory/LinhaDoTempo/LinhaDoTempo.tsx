import type { Dispatch, SetStateAction } from "react";
import type {
  DadosPaciente,
  LinhaDoTempoDTO,
  TipoInteracao,
} from "../../../types/Paciente";
import { InteracaoConsultaCard } from "./InteracaoConsultaCard";
import { InteracaoSistemaCard } from "./InteracaoSistemaCard";
import { InteracaoEquipeCard } from "./InteracaoEquipeCard";

export interface LinhaDoTempoProps {
  linhaDoTempo: LinhaDoTempoDTO[];
  setPaciente: Dispatch<SetStateAction<DadosPaciente | null>>;
  filtro: "TODOS" | TipoInteracao;
  setFiltro: (filter: "TODOS" | TipoInteracao) => void;
  ordenacao: "RECENTE" | "ANTIGA";
  setOrdenacao: (order: "RECENTE" | "ANTIGA") => void;
}

export function LinhaDoTempo({
  linhaDoTempo: linhaDoTempo,
  setPaciente: setPaciente,
  filtro: filtro,
  setFiltro: setFiltro,
  ordenacao: ordenacao,
  setOrdenacao: setOrdenacao,
}: LinhaDoTempoProps) {
  const renderInteractionCard = (item: LinhaDoTempoDTO) => {
    switch (item.tipo) {
      case "CONSULTA":
        return <InteracaoConsultaCard InteracaoConsulta={item} />;
      case "INTERACAO_SISTEMA":
        return <InteracaoSistemaCard interacaoSistema={item} />;
      case "ANOTACAO_EQUIPE":
        return (
          <InteracaoEquipeCard
            interacaoEquipe={item}
            setPaciente={setPaciente}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Linha do Tempo (Histórico Cronológico)
      </h1>

      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md sticky top-0 z-10">
        <label className="font-medium text-sm text-gray-700">
          FILTRAR POR:
        </label>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value as "TODOS" | TipoInteracao)}
          className="p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="TODOS">Tipo de Interação (Todos)</option>
          <option value="CONSULTA">Consultas</option>
          <option value="INTERACAO_SISTEMA">Interações do Sistema</option>
          <option value="ANOTACAO_EQUIPE">Anotações da Equipe</option>
        </select>

        <label className="font-medium text-sm text-gray-700">ORDENAR:</label>
        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value as "RECENTE" | "ANTIGA")}
          className="p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="RECENTE">Mais Recente</option>
          <option value="ANTIGA">Mais Antiga</option>
        </select>
      </div>

      <div className="relative">
        {linhaDoTempo.length === 0 ? (
          <p className="text-center text-gray-500 p-8 bg-white rounded-lg">
            Nenhuma interação encontrada para este paciente.
          </p>
        ) : (
          linhaDoTempo.map((item) => (
            <div key={item.id} className="relative mb-6">
              {renderInteractionCard(item)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
