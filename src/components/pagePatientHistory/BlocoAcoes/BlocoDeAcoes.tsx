"use client";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { DadosPaciente } from "../../../types/Paciente";
import { toast } from "sonner";
import { AnotacoesCard } from "./AnotacoesCard";
import { API_JAVA_URL } from "../../ApiService";

export interface BlocoDeAcoesProps {
  idPaciente: string;
  setPaciente: Dispatch<SetStateAction<DadosPaciente | null>>;
}

export function BlocoDeAcoes({ idPaciente, setPaciente }: BlocoDeAcoesProps) {
  const [enviando, setEnviando] = useState(false);

  //enviando lembrete ao paciente via whatsapp \/ por ID
  const handleReenviarLembrete = async () => {
    setEnviando(true);
    try {
      // idPaciente na URL como path parameter
      const response = await fetch(
        `${API_JAVA_URL}/alerta-webhook/enviar-lembrete/${idPaciente}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao reenviar lembrete.");
      }

      toast.success("Lembrete reenviado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao reenviar lembrete. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="sticky top-0 space-y-6">
      <AnotacoesCard idPaciente={idPaciente} setPaciente={setPaciente} />

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700">AÇÕES RÁPIDAS</h3>
        <button
          onClick={handleReenviarLembrete}
          disabled={enviando}
          className={`w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition duration-200 ${
            enviando ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {enviando ? "Enviando..." : "Reenviar Lembrete"}
        </button>
      </div>
    </div>
  );
}
