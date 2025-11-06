import { useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./ApiService";
import { CATEGORIAS_CONSULTA } from "./pageCalendar/dataCalendar"; // importa as especialidades do calendário

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface ProcessedData {
  "Data agenda": string;
  "Hora Agenda": string;
  "Nome paciente": string;
  "Número celular": string;
  "Data nascimento": string;
  "Nome acompanhante": string;
  "Número acompanhante": string;
  "Nome medico": string;
  "Especialidade": string;
  "Código": number;
  "Link": string;
  "OBS": string;
}

export default function ManualUploading() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProcessedData>({
    "Data agenda": "",
    "Hora Agenda": "",
    "Nome paciente": "",
    "Número celular": "",
    "Data nascimento": "",
    "Nome acompanhante": "",
    "Número acompanhante": "",
    "Nome medico": "",
    "Especialidade": "",
    "Código": 0,
    "Link": "",
    "OBS": "",
  });

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "Código" ? Number(value) : String(value),
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("uploading");
    setErrorMsg(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([formData]),
      });

      if (!response.ok) throw new Error("Falha ao enviar dados");

      const newJsonData: ProcessedData[] = await response.json();
      localStorage.setItem("tempPatientData", JSON.stringify(newJsonData));

      const existing = JSON.parse(localStorage.getItem("calendarEvents") || "[]");
      const newEvent = {
        title: `${formData["Nome paciente"]} - ${formData["Especialidade"]}`,
        start: `${formData["Data agenda"]}T${formData["Hora Agenda"]}`,
        extendedProps: { ...formData },
      };
      localStorage.setItem("calendarEvents", JSON.stringify([...existing, newEvent]));

      setStatus("success");
      navigate("/importar");
    } catch (err) {
      console.error("Erro ao enviar dados manuais:", err);
      setStatus("error");
      setErrorMsg("Não foi possível enviar os dados. Tente novamente.");
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-6">
        Inserção Manual de Dados
      </h1>

      <div className="flex justify-center items-center text-sm sm:text-base text-gray-600 mb-6">
        <span className="font-semibold text-gray-800">1. Realizando o UPLOAD</span>
        <span className="mx-4">|</span>
        <span>2. Validando</span>
        <span className="mx-4">|</span>
        <span>3. Finalização</span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 w-full max-w-2xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Data agenda" name="Data agenda" type="date" value={formData["Data agenda"]} onChange={handleChange} required />
          <InputField label="Hora Agenda" name="Hora Agenda" type="time" value={formData["Hora Agenda"]} onChange={handleChange} required />
          <InputField label="Nome paciente" name="Nome paciente" value={formData["Nome paciente"]} onChange={handleChange} required />
          <InputField label="Número celular" name="Número celular" value={formData["Número celular"]} onChange={handleChange} required />
          <InputField label="Data nascimento" name="Data nascimento" type="date" value={formData["Data nascimento"]} onChange={handleChange} />
          <InputField label="Nome acompanhante" name="Nome acompanhante" value={formData["Nome acompanhante"]} onChange={handleChange} />
          <InputField label="Número acompanhante" name="Número acompanhante" value={formData["Número acompanhante"]} onChange={handleChange} />
          <InputField label="Nome médico" name="Nome medico" value={formData["Nome medico"]} onChange={handleChange} required />

          {/* 🔽 Select de especialidade (agora dropdown) */}
          <SelectField
            label="Especialidade"
            name="Especialidade"
            value={formData["Especialidade"]}
            options={CATEGORIAS_CONSULTA.map((cat) => cat.title)}
            onChange={handleChange}
            required
          />

          <InputField label="Código" name="Código" type="number" value={formData["Código"]} onChange={handleChange} />
          <InputField label="Link" name="Link" value={formData["Link"]} onChange={handleChange} />
        </div>

        {/* Observações */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
          <textarea
            name="OBS"
            value={formData["OBS"] || ""}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
          <button
            type="submit"
            disabled={status === "uploading"}
            className={`px-6 py-2 font-medium rounded-lg shadow transition w-full sm:w-auto ${
              status === "uploading"
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {status === "uploading" ? "Enviando..." : "Enviar Dados"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/importar")}
            className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg shadow hover:bg-gray-300 transition w-full sm:w-auto"
          >
            Voltar
          </button>
        </div>

        {status === "error" && (
          <p className="text-red-600 text-center font-semibold mt-2">❌ {errorMsg}</p>
        )}
        {status === "success" && (
          <p className="text-green-600 text-center font-semibold mt-2">
            ✅ Dados enviados com sucesso!
          </p>
        )}
      </form>

      {/* Link para upload de planilha */}
      <p className="mt-6 text-sm text-gray-600 text-center">
        Prefere enviar os dados via planilha?{" "}
        <a href="/importar/planilha" className="text-blue-600 hover:underline font-medium">
          Clique aqui
        </a>
      </p>
    </div>
  );
}

/* 🔹 Campo de texto genérico */
interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  type?: string;
  required?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
function InputField({ label, name, value, onChange, type = "text", required = false }: InputFieldProps) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

/* 🔹 Campo select para especialidade */
interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  options: string[];
  required?: boolean;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}
function SelectField({ label, name, value, options, onChange, required = false }: SelectFieldProps) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Selecione...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
