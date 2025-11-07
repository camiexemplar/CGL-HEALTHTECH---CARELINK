import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ProcessedData } from "./FileUploader";
import { toast } from "sonner";

type ErrorState = Record<string, boolean>;

export default function ValidateForm() {
  const [processedData, setProcessedData] = useState<ProcessedData[]>([]);
  const [errors, setErrors] = useState<ErrorState>({});
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 5;

  const OPTIONAL_KEYS = new Set([
    "nomeAcompanhante",
    "numeroAcompanhante",
    "obsAgendamento",
    "OBS",
  ]);

  useEffect(() => {
    const savedData = localStorage.getItem("tempPatientData");
    if (savedData) {
      setProcessedData(JSON.parse(savedData) as ProcessedData[]);
    } else {
      toast.info("Nenhum dado encontrado para validar.", {
        description: "Você será redirecionado para a página de upload.",
      });
      navigate("/importar");
    }
  }, [navigate]);

  const validateCell = (key: string, value: unknown): boolean => {
    if (OPTIONAL_KEYS.has(key)) return false;
    return value === undefined || value === null || String(value).trim() === "";
  };

  const applyMask = (key: string, value: string): string => {
    let cleanValue = value.replace(/[^\w\s@.-]/gi, "");

    if (key.toLowerCase().includes("numero")) {
      cleanValue = value.replace(/\D/g, "").slice(0, 11);
      if (cleanValue.length > 2)
        cleanValue = `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2)}`;
      if (cleanValue.length > 9)
        cleanValue = `${cleanValue.slice(0, 10)}-${cleanValue.slice(10)}`;
      return cleanValue;
    }

    if (key === "cep") {
      cleanValue = value.replace(/\D/g, "").slice(0, 8);
      if (cleanValue.length > 5)
        cleanValue = `${cleanValue.slice(0, 5)}-${cleanValue.slice(5)}`;
      return cleanValue;
    }

    if (key.toLowerCase().includes("data")) {
      cleanValue = value.replace(/\D/g, "").slice(0, 8);
      if (cleanValue.length > 2)
        cleanValue = `${cleanValue.slice(0, 2)}/${cleanValue.slice(2)}`;
      if (cleanValue.length > 5)
        cleanValue = `${cleanValue.slice(0, 5)}/${cleanValue.slice(5)}`;
      return cleanValue;
    }

    if (key.toLowerCase().includes("hora")) {
      cleanValue = value.replace(/\D/g, "").slice(0, 4);
      if (cleanValue.length > 2)
        cleanValue = `${cleanValue.slice(0, 2)}:${cleanValue.slice(2)}`;
      return cleanValue;
    }

    return value;
  };

  const handleDeleteRow = (rowIndexToDelete: number) => {
    const deletedRow = processedData[rowIndexToDelete];
    const updatedData = processedData.filter(
      (_, index) => index !== rowIndexToDelete
    );
    setProcessedData(updatedData);
    localStorage.setItem("tempPatientData", JSON.stringify(updatedData));

    toast.info("Registro removido.", {
      description: "Deseja desfazer a exclusão?",
      action: {
        label: "Desfazer",
        onClick: () => {
          const restoredData = [
            ...updatedData.slice(0, rowIndexToDelete),
            deletedRow,
            ...updatedData.slice(rowIndexToDelete),
          ];
          setProcessedData(restoredData);
          localStorage.setItem("tempPatientData", JSON.stringify(restoredData));
          toast.success("Registro restaurado com sucesso!");
        },
      },
      duration: 5000,
    });
  };

  const handleCellChange = (rowIndex: number, key: string, newValue: string) => {
    const maskedValue = applyMask(key, newValue);
    const errorKey = `${rowIndex}-${key}`;
    const isInvalid = validateCell(key, maskedValue);

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (isInvalid) newErrors[errorKey] = true;
      else delete newErrors[errorKey];
      return newErrors;
    });

    const newData = processedData.map((row, i) =>
      i === rowIndex ? { ...row, [key]: maskedValue } : row
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

  const formatHeader = (key: string) => {
    const result = key.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1).trim();
  };

  const handleFinishValidation = async () => {
    const newErrors: ErrorState = {};
    let hasError = false;

    for (let i = 0; i < processedData.length; i++) {
      const row = processedData[i];
      for (const key of headers) {
        if (validateCell(key, row[key])) {
          newErrors[`${i}-${key}`] = true;
          hasError = true;
        }
      }
    }

    setErrors(newErrors);

    if (hasError) {
      toast.error("Existem campos obrigatórios vazios.", {
        description: "Verifique os campos destacados em vermelho.",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/upload/salvar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processedData),
      });

      if (!response.ok) throw new Error("Erro ao salvar no banco de dados");

      const savedData: ProcessedData[] = await response.json();
      localStorage.setItem("patientData", JSON.stringify(savedData));
      localStorage.removeItem("tempPatientData");

      toast.success("Dados validados e salvos com sucesso!");
      navigate("/historico");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar no banco.", {
        description: "Verifique sua conexão e tente novamente.",
      });
    }
  };

  const handleBackToUpload = () => {
    localStorage.removeItem("tempPatientData");
    navigate("/importar");
  };

  // não há registros
  if (processedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-6">
        <p className="text-gray-600 text-lg mb-4">Nenhum registro carregado.</p>
        <a
          href="/importar"
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
        >
          Voltar para Upload
        </a>
      </div>
    );
  }

  // Paginação
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = processedData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-10 bg-white min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-6">
        Validação dos Dados
      </h1>

      <div className="flex justify-center items-center text-sm sm:text-base text-gray-600 mb-6">
        <span>1. Realizando o Upload</span>
        <span className="mx-4">|</span>
        <span className="font-semibold text-gray-800">2. Validando</span>
        <span className="mx-4">|</span>
        <span>3. Finalização</span>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {paginatedData.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition bg-gray-50"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-gray-700">
                Registro {startIndex + rowIndex + 1}
              </h2>
              <button
                onClick={() => handleDeleteRow(startIndex + rowIndex)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                🗑️
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {headers.map((key) => {
                const errorKey = `${startIndex + rowIndex}-${key}`;
                const isInvalid = !!errors[errorKey];
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {formatHeader(key)}
                    </label>
                    <input
                      type="text"
                      value={row[key] !== undefined ? String(row[key]) : ""}
                      onChange={(e) =>
                        handleCellChange(startIndex + rowIndex, key, e.target.value)
                      }
                      className={`w-full border rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 text-sm sm:text-base ${
                        isInvalid
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/*  Paginação */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 bg-blue-100 rounded-lg disabled:opacity-50 hover:bg-blue-200 transition"
        >
          ← Anterior
        </button>
        <span className="text-gray-700 font-medium">
          Página {currentPage} de {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 bg-blue-100 rounded-lg disabled:opacity-50 hover:bg-blue-200 transition"
        >
          Próxima →
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-center sm:justify-end w-full gap-4 mt-8">
        <button
          onClick={handleBackToUpload}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gray-600 text-white font-medium rounded-lg shadow hover:bg-gray-700 transition"
        >
          Voltar para Upload
        </button>

        <button
          onClick={handleFinishValidation}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
        >
          Terminar Validação
        </button>
      </div>
    </div>
  );
}
