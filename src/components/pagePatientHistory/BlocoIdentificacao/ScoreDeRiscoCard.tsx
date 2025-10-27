export interface ScoreDeRiscoProps {
  scoreDeRisco: number | null;
  nivelDeRisco: "CRITICO" | "ALTO" | "MEDIO" | "BAIXO" | null;
}

export function ScoreDeRiscoCard({
  scoreDeRisco,
  nivelDeRisco,
}: ScoreDeRiscoProps) {
  let classificacaoBg = "bg-gray-400";
  let nivelTexto = "";

  if (nivelDeRisco === "CRITICO") {
    classificacaoBg = "bg-red-700";
    nivelTexto = "Crítico";
  } else if (nivelDeRisco === "ALTO") {
    classificacaoBg = "bg-orange-500";
    nivelTexto = "Alto";
  } else if (nivelDeRisco === "MEDIO") {
    classificacaoBg = "bg-yellow-500";
    nivelTexto = "Medio";
  } else if (nivelDeRisco === "BAIXO") {
    classificacaoBg = "bg-blue-500";
    nivelTexto = "Baixo";
  }

  const isScoreAvailable = scoreDeRisco != null && nivelDeRisco != null;

  return (
    <div className="relative">
      {!isScoreAvailable ? (
        <p className="text-center text-gray-500 p-8 bg-white rounded-lg">
          Não há score de risco disponível para este paciente.
        </p>
      ) : (
        <div
          className={`p-4 rounded-lg text-white shadow-md mt-6 ${classificacaoBg}`}
        >
          <div className="font-bold uppercase text-sm">
            Score de Risco de Absenteísmo Atual:
          </div>
          <div className="text-3xl font-extrabold flex justify-between items-center">
            <span>{scoreDeRisco}/1000</span>
            {nivelTexto && (
              <span className="text-base font-semibold">{nivelTexto}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
