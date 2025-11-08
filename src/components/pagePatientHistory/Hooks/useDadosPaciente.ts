import { useEffect, useState } from "react";
import type { DadosPaciente } from "../../../types/Paciente";
import { API_BASE_URL } from "../../ApiService";

export function useDadosPaciente() {
  const [idPaciente, setIdPaciente] = useState<string | null>(null);
  const [paciente, setPaciente] = useState<DadosPaciente | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!idPaciente) {
      setPaciente(null);
      return;
    }

    const buscarDadosDoPaciente = async () => {
      setCarregando(true);
      setPaciente(null);

      // Dentro da função async buscarDadosDoPaciente

      try {
        const url = `${API_BASE_URL}/api/paciente/${idPaciente}/historico`;
      const resposta = await fetch(url);

        if (resposta.ok) {
          const dados = await resposta.json();
          setPaciente(dados); // Sucesso! Paciente encontrado.
        } else {
          // A API respondeu, mas com um erro (ex: 404 Not Found)
          console.error("Falha ao buscar paciente:", resposta.status);
          setPaciente(null); // Garante que a tela de "não encontrado" apareça
        }
      } catch (erro) {
        // Houve um erro de rede ou algo impediu a requisição de completar
        console.error("Erro de conexão com a API:", erro);
        setPaciente(null);
      } finally {
        setCarregando(false);
      }


    };

    buscarDadosDoPaciente();
  }, [idPaciente]);

  return {
    idPaciente: idPaciente,
    setIdPaciente: setIdPaciente,
    paciente: paciente,
    setPaciente: setPaciente,
    carregando: carregando,
  };
}
