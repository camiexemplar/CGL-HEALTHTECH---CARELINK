//aqui escolhemos se iremos fazer o upload manual ou o upload por planilha

import { useNavigate } from "react-router-dom";

export default function UploadFiles() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-6">
        Envio de Dados de Pacientes
      </h1>


      <div className="flex justify-center items-center text-sm sm:text-base text-gray-600 mb-6">
        <span className="font-semibold text-gray-800">1. Realizando o UPLOAD</span>
        <span className="mx-4">|</span>
        <span>2. Validando</span>
        <span className="mx-4">|</span>
        <span>3. Finalização</span>
      </div>


      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6 w-full max-w-xl">
        <p className="text-center text-gray-700 text-sm sm:text-base">
          Escolha abaixo como deseja enviar as informações dos pacientes
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button
            onClick={() => navigate("/importar/planilha")}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition w-full sm:w-auto"
          >
            Upload por Planilha (.xlsx)
          </button>

          <button
            onClick={() => navigate("/importar/manual")}
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition w-full sm:w-auto"
          >
            Inserir manualmente
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Após o envio no upload por planilha, você poderá revisar e validar os dados antes da finalização.
        </p>
      </div>
    </div>
  );
}
