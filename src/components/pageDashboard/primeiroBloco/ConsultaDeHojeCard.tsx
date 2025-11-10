// --- ConsultaDeHojeCard.tsx ---
import { useNavigate } from "react-router-dom";
import type { AlertaItem } from "../../../types/Alerta";

export interface ConsultaDeHojeCardProps {
  consultaDeHoje: AlertaItem;
}

export function ConsultaDeHojeCard({ consultaDeHoje }: ConsultaDeHojeCardProps) {
  const score = consultaDeHoje.scoreDeRisco;

  const riskLevel =
    score > 850
      ? "CRITICO"
      : score > 700
      ? "ALTO"
      : score > 400
      ? "MEDIO"
      : "BAIXO";

  const borderClass =
    riskLevel === "CRITICO"
      ? "border-purple-700"
      : riskLevel === "ALTO"
      ? "border-red-500"
      : riskLevel === "MEDIO"
      ? "border-yellow-500"
      : "border-blue-500";

  const scoreColor =
    riskLevel === "CRITICO"
      ? "text-purple-700"
      : riskLevel === "ALTO"
      ? "text-red-600"
      : riskLevel === "MEDIO"
      ? "text-yellow-600"
      : "text-blue-600";

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/historico/${consultaDeHoje.idPaciente}`);
  };

  return (
    <div
      className={`p-4 border-l-4 ${borderClass} bg-white rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition duration-200 hover:shadow-lg`}
    >
      <div className="flex flex-col sm:flex-row sm:space-x-6 items-start sm:items-center w-full sm:w-auto">
        <div
          className={`flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 border-current ${scoreColor} bg-gray-50 self-center sm:self-auto`}
        >
          <span className="text-xs font-bold uppercase">Risco</span>
          <span className="text-xl font-extrabold">
            {consultaDeHoje.scoreDeRisco}
          </span>
        </div>

        <div className="mt-2 sm:mt-0">
          <h5 className="font-bold text-base sm:text-lg text-gray-800">
            {consultaDeHoje.nomePaciente}
          </h5>
          <p className="text-xs text-gray-500">
            Tel: {consultaDeHoje.telefonePaciente}
          </p>

          <p className="text-sm text-gray-700 mt-1">
            Consulta: {consultaDeHoje.horaConsulta} com Dr(a).{" "}
            {consultaDeHoje.nomeMedico} | {consultaDeHoje.especialidadeConsulta}
          </p>

          <p className="text-xs text-red-500 mt-1 flex items-center">
            <span className="mr-1">⚠️</span> Fatores críticos: histórico de
            faltas, não aderência ao tratamento.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleClick}
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-200 shadow-md flex justify-center sm:justify-between items-center"
      >
        VER HISTÓRICO
      </button>
    </div>
  );
}
