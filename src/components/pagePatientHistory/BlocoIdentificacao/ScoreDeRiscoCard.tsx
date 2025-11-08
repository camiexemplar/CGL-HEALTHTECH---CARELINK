export interface ScoreDeRiscoProps {
  scoreDeRisco: number | null;
  nivelDeRisco: 'CRITICO' | 'ALTO' | 'MEDIO' | 'BAIXO' | null;
}

export function ScoreDeRiscoCard({ scoreDeRisco, nivelDeRisco }: ScoreDeRiscoProps) {
  
  const classificacaoScore =
    nivelDeRisco === "CRITICO"
      ? "bg-purple-700"
      : nivelDeRisco === "ALTO"
      ? "bg-red-500"
      : nivelDeRisco === "MEDIO"
      ? "bg-yellow-500"
      : "bg-blue-500"; // azul para baixo risco

  const descricaoRisco =
    nivelDeRisco === "CRITICO"
      ? "Risco Crítico — atenção imediata"
      : nivelDeRisco === "ALTO"
      ? "Risco Alto — intervenção recomendada"
      : nivelDeRisco === "MEDIO"
      ? "Risco Médio — monitoramento sugerido"
      : nivelDeRisco === "BAIXO"
      ? "Risco Baixo — dentro da normalidade"
      : "";

  return (
    <div className="relative">
      {scoreDeRisco == null && nivelDeRisco == null ? (
        <p className="text-center text-gray-500 p-8 bg-white rounded-lg">
          Não há score de risco disponível para este paciente.
        </p>
      ) : (
        <div
          className={`p-4 rounded-lg text-white shadow-md mt-6 transition-all duration-300 ${classificacaoScore}`}
        >
          <div className="font-bold uppercase text-sm mb-2">
            Score de Risco de Absenteísmo Atual:
          </div>
          <div className="text-3xl font-extrabold flex justify-between items-center">
            {scoreDeRisco !== null && <span>{scoreDeRisco.toFixed(0)}/1000</span>}
          </div>
          <div className="mt-2 text-sm font-medium opacity-90">
            {descricaoRisco}
          </div>
        </div>
      )}
    </div>
  );
}
