import { useState, type Dispatch, type SetStateAction } from "react";
import type { AnotacaoInputDTO, DadosPaciente, InteracaoEquipe } from "../../../types/Paciente";
import { API_BASE_URL } from "../../ApiService";
import { toast } from "sonner";

export interface AnotacoesCardProps {
  idPaciente: string;
  setPaciente: Dispatch<SetStateAction<DadosPaciente | null>>;
}

export function AnotacoesCard({ idPaciente: idPaciente, setPaciente: setPaciente }: AnotacoesCardProps) {
  const [novaAnotacao, setNovaAnotacao] = useState("");

  const salvarAnotacao = async () => {
    if (novaAnotacao.trim() === "") return;

    const novaInteracao: InteracaoEquipe = {
      id: Date.now().toString(),
      tipo: "ANOTACAO_EQUIPE",
      data: new Date().toLocaleDateString("pt-BR"),
      hora: new Date().toLocaleTimeString("pt-BR"),
      anotacao: novaAnotacao.trim(),
      idUsuario: "1",
      nomeUsuario: "Gustavo",
    };

    const anotacaoInput: AnotacaoInputDTO = {
      idPaciente: idPaciente,
      idUsuario: novaInteracao.idUsuario,
      conteudoAnotacao: novaAnotacao.trim(),
    };

      try {
        const response = await fetch(`${API_BASE_URL}/api/anotacoes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(anotacaoInput),
        });

        if (!response.ok) {
            throw new Error("Falha ao salvar a anotação no servidor.");
        }

        setPaciente((prevState) => {
        if (!prevState) return null;

        const timelineExistente = prevState.linhaDoTempo;
        const novaTimeline = [novaInteracao, ...timelineExistente];

        // Remove duplicados pelo `id`
        const timelineUnica = Array.from(new Map(novaTimeline.map(item => [item.id, item])).values());

        return {
          ...prevState,
          linhaDoTempo: timelineUnica,
        };
      });

      setNovaAnotacao("");
      toast.success("Anotação registrada com sucesso!", {
        description: "Você poderá vê-la imediatamente na linha do tempo.",
      });

    } catch (error) {
        console.error("Erro na persistência da anotação:", error);
        alert("ERRO: Não foi possível salvar a anotação. Consulte o log.");
    }
  };
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700">AÇÕES E REGISTRO</h2>
      <textarea
        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
        rows={4}
        placeholder="Registrar novas observações... (opcional)"
        value={novaAnotacao}
        onChange={(e) => setNovaAnotacao(e.target.value)}
      />
      <button
        onClick={salvarAnotacao}
        className="mt-2 w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        disabled={novaAnotacao.trim() === ""}
      >
        <span className="mr-2">Salvar Anotação</span>
      </button>
    </div>
  );
}
