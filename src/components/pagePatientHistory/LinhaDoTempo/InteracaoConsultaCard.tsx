import type { InteracaoConsulta } from "../../../types/Paciente";

export interface InteracaoConsultaCardProps {
  InteracaoConsulta: InteracaoConsulta;
}

export function InteracaoConsultaCard({
  InteracaoConsulta: interacaoConsulta,
}: InteracaoConsultaCardProps) {
  const corStatus =
    interacaoConsulta.status === "PACIENTE NAO COMPARECEU" ||
    interacaoConsulta.status === "CANCELADA"
      ? "bg-red-500"
      : interacaoConsulta.status === "REALIZADA"
      ? "bg-green-500"
      : "bg-yellow-500";

  return (
    <div className="p-4 border-l-4 border-red-500 bg-white rounded-lg shadow-sm mb-4">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-gray-800">CONSULTA</h4>
        <div
          className={`px-2 py-0.5 text-xs font-semibold rounded text-white ${corStatus}`}
        >
          STATUS: {interacaoConsulta.status.toUpperCase()}
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-1">
        Data: {interacaoConsulta.data} - {interacaoConsulta.hora}
      </p>
      <p className="text-sm text-gray-600">
        Profissional: {interacaoConsulta.profissional} | Especialidade:{" "}
        {interacaoConsulta.especialidade}
      </p>
      <p className="text-sm text-gray-600">
        Modalidade: {interacaoConsulta.modalidade}
      </p>
    </div>
  );
}