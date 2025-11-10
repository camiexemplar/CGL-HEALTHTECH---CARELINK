// --- InformacoesDashboard.tsx ---
import { useState } from "react";
import { ConsultaDeHojeCard } from "./ConsultaDeHojeCard";
import type { AlertaItem } from "../../../types/Alerta";

export interface InformacoesDashboardProps {
  alertaItem: AlertaItem[] | null;
}

export function InformacoesDashboard({ alertaItem }: InformacoesDashboardProps) {
  const [input, setInput] = useState("");
  const data = new Date();

  const filteredConsultas =
    alertaItem?.filter((item) =>
      item.nomePaciente.toLowerCase().includes(input.toLowerCase())
    ) ?? [];

  const pacientesAltoRisco =
    alertaItem?.filter(
      (item) => item.nivelDeRisco === "ALTO" || item.nivelDeRisco === "CRITICO"
    ).length ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
        Fila de Intervenção Diária
      </h1>
      <h2 className="text-lg sm:text-xl font-semibold text-gray-600 mb-4">
        Consultas Agendadas para hoje ({data.toLocaleDateString()})
      </h2>

      <div
        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center text-white p-4 rounded-lg shadow-md space-y-2 sm:space-y-0 ${
          pacientesAltoRisco > 0 ? "bg-red-600" : "bg-green-600"
        }`}
      >
        <h2 className="text-lg sm:text-xl font-semibold">
          Priorização de Atendimento
        </h2>

        {pacientesAltoRisco > 0 && pacientesAltoRisco === 1 ? (
          <h2 className="text-lg sm:text-2xl font-extrabold">
            {pacientesAltoRisco} paciente em ALTO RISCO
          </h2>
        ) : pacientesAltoRisco > 1 ? (
          <h2 className="text-lg sm:text-2xl font-extrabold">
            {pacientesAltoRisco} pacientes em ALTO RISCO
          </h2>
        ) : (
          <h2 className="text-lg sm:text-2xl font-extrabold">
            Nenhum paciente em ALTO RISCO
          </h2>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:space-x-3 mb-4 gap-3">
          <input
            type="text"
            placeholder="Pesquisar por nome do paciente..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />

          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Filtros Avançados
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
          <button className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200">
            Status: TODOS
          </button>
          <button className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            EM TRATAMENTO
          </button>
          <button className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 hover:bg-green-200">
            RESOLVIDO
          </button>
        </div>
      </div>

      <div className="relative space-y-4">
        {filteredConsultas.length === 0 ? (
          <p className="text-center text-gray-500 p-8 bg-white rounded-lg shadow-sm">
            Nenhuma consulta encontrada para hoje.
          </p>
        ) : (
          filteredConsultas.map((item) => (
            <ConsultaDeHojeCard key={item.idPaciente} consultaDeHoje={item} />
          ))
        )}
      </div>
    </div>
  );
}
