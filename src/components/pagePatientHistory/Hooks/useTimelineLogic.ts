import { useState } from "react";
import type { LinhaDoTempoDTO } from "../../../types/Paciente";

export function useTimelineLogic(rawHistory: LinhaDoTempoDTO[] | undefined) {
  const [filter, setFilter] = useState<"TODOS" | LinhaDoTempoDTO["tipo"]>(
    "TODOS"
  );
  const [sortOrder, setSortOrder] = useState<"RECENTE" | "ANTIGA">("RECENTE");

  const historyToUse = rawHistory || [];

  const parseDateTime = (data: string, hora: string) => {
    const [dia, mes, ano] = data.split("/");
    return new Date(`${ano}-${mes}-${dia}T${hora}`);
  };

  const filteredAndSortedHistory = historyToUse
    .filter((item) => filter === "TODOS" || item.tipo === filter)
    .sort((a, b) => {
      const timestampA = parseDateTime(a.data, a.hora).getTime();
      const timestampB = parseDateTime(b.data, b.hora).getTime();

      return sortOrder === "RECENTE"
        ? timestampB - timestampA
        : timestampA - timestampB;
    });

  return {
    filter,
    setFilter,
    sortOrder,
    setSortOrder,
    filteredAndSortedHistory,
  };
}
