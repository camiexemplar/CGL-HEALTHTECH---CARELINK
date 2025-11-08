export interface ListaDeFatoresProps {
  fatoresDeRisco: string[];
}

export function ListaDeFatores({ fatoresDeRisco: fatoresDeRisco }: ListaDeFatoresProps) {
  return (
      <div className="relative">
        {fatoresDeRisco.length === 0 ? (
          <p className="text-center text-gray-500 p-8 bg-white rounded-lg">
            Não foram registrdos fatores de risco contribuintes para este paciente.
          </p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-2">
              FATORES CONTRIBUINTES:
            </h3>
            <ul className="text-sm space-y-1">
              {(fatoresDeRisco ?? []).map((factor, index) => (
                <li key={index} className="text-gray-600 flex items-center">
                  <span className="mr-2 text-blue-500">•</span> {factor}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

    
  );
}
