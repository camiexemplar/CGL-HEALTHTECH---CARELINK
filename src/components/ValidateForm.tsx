import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ProcessedData } from "./FileUploader";

export default function ValidateForm() {
  const [processedData, setProcessedData] = useState<ProcessedData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = localStorage.getItem("tempPatientData");
    if (savedData) {
      setProcessedData(JSON.parse(savedData) as ProcessedData[]);
    }
  }, []);

  const handleDeleteRow = (rowIndexToDelete: number) => {
    const updatedData = processedData.filter(
      (_, index) => index !== rowIndexToDelete
    );
    setProcessedData(updatedData);
    localStorage.setItem("tempPatientData", JSON.stringify(updatedData));
  };

  const handleCellChange = (
    rowIndex: number,
    key: string,
    newValue: string
  ) => {
    const newData = processedData.map((row, index) =>
      index === rowIndex ? { ...row, [key]: newValue } : row
    );
    setProcessedData(newData);
    localStorage.setItem("tempPatientData", JSON.stringify(newData));
  };

  const headers = Array.from(
    processedData.reduce((acc, row) => {
      Object.keys(row).forEach((key) => acc.add(key));
      return acc;
    }, new Set<string>())
  );

  // salvando no banco de dados:
  const handleFinishValidation = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/upload/salvar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processedData),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar no banco de dados");
      }

      const savedData: ProcessedData[] = await response.json();

      // remove temporário
      localStorage.setItem("patientData", JSON.stringify(savedData));
      localStorage.removeItem("tempPatientData");

      navigate("/historico");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar no banco");
    }
  };

  const handleBackToUpload = () => {
    localStorage.removeItem("tempPatientData");
    navigate("/importar");
  };

  const formatHeader = (key: string) => {
    const result = key.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1).trim();
  };

  if (processedData.length === 0) {
    return <p className="text-gray-600 text-center">Nenhum dado carregado.</p>;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-10 bg-white min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-6 bg">
        Validação dos Dados
      </h1>
      <div className="flex justify-center items-center text-sm sm:text-base text-gray-600 mb-6">
        <span>1. Realizando o Upload</span>
        <span className="mx-4">|</span>
        <span className="font-semibold text-gray-800">2. Validando</span>
        <span className="mx-4">|</span>
        <span>3. Finalização</span>
      </div>

      <div className="overflow-x-auto w-full mb-4 bg-white rounded-lg shadow-lg">
        <table className="w-full divide-y divide-gray-200 text-sm sm:text-base">
          <thead className="bg-blue-200">
            <tr>
              {headers.map((key) => (
                <th
                  key={key}
                  className="px-3 sm:px-4 py-3 text-left font-bold text-black uppercase tracking-wider"
                >

                  {formatHeader(key)}
                </th>
              ))}
              <th className="px-3 sm:px-4 py-3 text-center font-bold text-black uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {processedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((key) => (
                  <td
                    key={key}
                    className="px-2 sm:px-2 py-2 sm:py-2 whitespace-nowrap text-gray-900"
                  >
                    <input
                      type="text"
                      value={row[key] !== undefined ? String(row[key]) : "-"}
                      onChange={(e) =>
                        handleCellChange(rowIndex, key, e.target.value)
                      }
                      className="w-full border rounded px-4 py-2 sm:px-1 sm:py-3 m-4
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                                   transition-all duration-200 text-sm sm:text-base"
                    />
                  </td>
                ))}
                <td className="px-3 sm:px-6 py-2 sm:py-4 text-center">
                  <button
                    onClick={() => handleDeleteRow(rowIndex)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    title="Deletar registro"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center sm:justify-end w-full gap-4">
        <button
          onClick={handleBackToUpload}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gray-600 text-white font-medium rounded-lg shadow hover:bg-gray-700 transition"
        >
          Voltar para Upload
        </button>

        <button
          onClick={handleFinishValidation}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
        >
          Terminar Validação
        </button>
      </div>
    </div>
  );
}