import { useState, type ChangeEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./ApiService";
export type ProcessedData = Record<string, string | number | boolean>;
type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const cancelFlag = useRef(false);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) setFile(e.target.files[0]);
  }
  
  function handleCancelUpload() {
    cancelFlag.current = true;
    setStatus("idle");
    setUploadProgress(0);
    setFile(null);
  }

  async function handleFileUpload() {
    if (!file) return;

    setStatus("uploading");
    setUploadProgress(0);
    cancelFlag.current = false;
    
    try {
      const totalSteps = 10;
      for (let i = 1; i <= totalSteps; i++) {
        if (cancelFlag.current) {
          console.log("Upload cancelado.");
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 150));
        setUploadProgress(i * (100 / totalSteps));
        
      }

      // Envia para o backend
      const formData = new FormData();
      formData.append("planilha", file);

      const response = await fetch(`${API_BASE_URL}/api/upload/receber`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao processar arquivo");
      }

      // Salva local
      const newJsonData: ProcessedData[] = await response.json();
      localStorage.setItem("tempPatientData", JSON.stringify(newJsonData));

      setStatus("success");
      navigate("/validate");
    } catch (err) {
      console.error("Erro no upload:", err);
      setStatus("error");
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-6">
        Upload de Arquivo
      </h1>
      <div className="flex justify-center items-center text-sm sm:text-base text-gray-600 mb-6">
        <span className="font-semibold text-gray-800">1. Realizando o UPLOAD</span>
        <span className="mx-4">|</span>
        <span>2. Validando</span>
        <span className="mx-4">|</span>
        <span>3. Finalização</span>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4 w-full max-w-xl">
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                     file:text-sm file:font-medium file:bg-blue-600 file:text-white 
                     hover:file:bg-blue-700 cursor-pointer w-full"
        />

        {file && status !== "uploading" && (
          <button
            onClick={handleFileUpload}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition w-full sm:w-auto"
          >
            Enviar Arquivos
          </button>
        )}

        {status === "uploading" && (
          <div className="w-full flex flex-col items-center">
            <p className="text-center text-sm text-blue-500 font-medium">
              ⏳ Enviando arquivo, aguarde...
            </p>
            <progress
              value={uploadProgress}
              max="100"
              className="w-full mt-2 appearance-none h-2 rounded-full"
            />
            <p className="text-center text-xs text-gray-500 mt-1">
              {Math.round(uploadProgress)}% completo
            </p>
            <button
              onClick={handleCancelUpload}
              className="mt-4 px-6 py-2 bg-red-600 text-white font-medium rounded-lg shadow hover:bg-red-700 transition w-full sm:w-auto"
            >
              Cancelar Upload
            </button>
          </div>
        )}

        {status === "error" && (
          <p className="text-red-600 text-center font-semibold">
            ❌ Erro ao enviar ou processar o arquivo.
          </p>
        )}
      </div>
      <div></div>
        <div className="mt-4 text-sm text-gray-600 text-center">
    <span>Prefere inserir os dados manualmente?</span>{" "}
    <a
      href="/importar/manual"
      className="text-blue-600 font-medium hover:underline"
    >
      Clique aqui
    </a>
  </div>
    </div>
  );
}

