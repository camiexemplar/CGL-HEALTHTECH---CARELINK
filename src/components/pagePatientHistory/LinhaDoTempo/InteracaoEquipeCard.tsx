import { useState, type Dispatch, type SetStateAction } from "react";
import type {
  DadosPaciente,
  AnotacaoUpdateDTO,
  InteracaoEquipe,
} from "../../../types/Paciente";
import { API_BASE_URL } from "../../ApiService";

export interface InteracaoEquipeCardProps {
  interacaoEquipe: InteracaoEquipe;
  setPaciente: Dispatch<SetStateAction<DadosPaciente | null>>;
}

export function InteracaoEquipeCard({
  interacaoEquipe: interacaoEquipe,
  setPaciente: setPaciente,
}: InteracaoEquipeCardProps) {
  const LOGGED_USER_ID = "1";

  const [estaEditando, setEstaEditando] = useState(false);
  const [textoEditado, setTextoEditado] = useState(interacaoEquipe.anotacao);
  const [estaSalvando, setEstaSalvando] = useState(false);

  const salvarEdicao = async () => {
    const textoFinal = textoEditado.trim();
    if (textoFinal === "" || textoFinal === interacaoEquipe.anotacao) {
      return setEstaEditando(false);
    }
    const novaAnotacaoInput: AnotacaoUpdateDTO = {
      idAnotacao: interacaoEquipe.id,
      idUsuario: interacaoEquipe.idUsuario,
      novoConteudo: textoEditado.trim(),
    };

    try {
      setEstaSalvando(true);
      const response = await fetch(`${API_BASE_URL}/api/anotacoes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaAnotacaoInput),
      });

      if (!response.ok) {
        throw new Error("Falha ao salvar a anotação editada no servidor.");
      }

      setPaciente((prevState) => {
        if (!prevState) return null;
        const novaLinhaDoTempo = prevState.linhaDoTempo.map((item) => {
          if (item.id === interacaoEquipe.id) {
            return { ...item, anotacao: textoFinal };
          }
          return item;
        });
        return {
          ...prevState,
          linhaDoTempo: novaLinhaDoTempo,
        };
      });
    } catch (error) {
      console.error("Erro na persistência da anotação editada:", error);
      alert(
        "ERRO: Não foi possível salvar a anotação editada. Consulte o log."
      );
      setTextoEditado(interacaoEquipe.anotacao);
    } finally {
      setEstaSalvando(false);
      setEstaEditando(false);
    }
  };

  return (
    <div className="p-4 border-l-4 border-blue-500 bg-white rounded-lg shadow-sm mb-4">
      <h4 className="font-bold text-gray-800">ANOTAÇÃO DA EQUIPE</h4>

      {estaEditando ? (
        <div className="mt-2">
          <textarea
            value={textoEditado}
            onChange={(e) => setTextoEditado(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            rows={3}
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => setEstaEditando(false)} // Cancela a edição
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-3 rounded-md text-xs transition duration-200"
              disabled={estaSalvando}
            >
              Cancelar
            </button>
            <button
              onClick={salvarEdicao}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-md text-xs transition duration-200"
              disabled={estaSalvando}
            >
              {estaSalvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-700 mt-1 italic">{textoEditado}</p>
          {interacaoEquipe.idUsuario === LOGGED_USER_ID && (
            <button
              onClick={() => {
                setTextoEditado(interacaoEquipe.anotacao);
                setEstaEditando(true);
              }}
              className="mt-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-3 rounded-md text-xs transition duration-200"
            >
              Editar
            </button>
          )}
        </>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Registrado por: {interacaoEquipe.nomeUsuario} em {interacaoEquipe.data}{" "}
        às {interacaoEquipe.hora}
      </p>
    </div>
  );
}
