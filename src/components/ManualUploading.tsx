import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner"; // <-- 1. IMPORTAR O TOAST
import { API_BASE_URL } from "./ApiService";
import { CATEGORIAS_CONSULTA } from "./pageCalendar/dataCalendar";


interface ProcessedData {
  "Data agenda": string;
  "Hora Agenda": string;
  "Nome paciente": string;
  "Número celular": string;
  "Data nascimento": string;
  "Afinidade Digital": number;
  "Nome acompanhante": string;
  "Número acompanhante": string;
  "Nome medico": string;
  "Especialidade": string;
  "Código": number;
  "OBS": string;
  "CEP": string; 
}

export default function ManualUploading() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false); 

  const [formData, setFormData] = useState<ProcessedData>({
    "Data agenda": "",
    "Hora Agenda": "",
    "Nome paciente": "",
    "Número celular": "",
    "Data nascimento": "",
    "Afinidade Digital": 0,
    "Nome acompanhante": "",
    "Número acompanhante": "",
    "Nome medico": "",
    "Especialidade": "",
    "Código": 0,
    "OBS": "",
    "CEP": "", 
  });

  // datas
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const minAgenda = `${yyyy}-${mm}-${dd}`;
  const birthMin = "2000-01-01";
  const birthMax = minAgenda;

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    if (name === "Número celular" || name === "Número acompanhante") {
      const onlyNumbers = value.replace(/\D/g, "").slice(0, 11);
      let masked = onlyNumbers;
      if (onlyNumbers.length > 0)
        masked = `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2, 7)}${
          onlyNumbers.length > 7 ? `-${onlyNumbers.slice(7, 11)}` : ""
        }`;
      setFormData((prev) => ({ ...prev, [name]: masked }));
      return;
    }

    if (name === "CEP") {
      const onlyNumbers = value.replace(/\D/g, "").slice(0, 8);
      let masked = onlyNumbers;
      if (onlyNumbers.length > 5) {
        masked = `${onlyNumbers.slice(0, 5)}-${onlyNumbers.slice(5, 8)}`;
      }
      setFormData((prev) => ({ ...prev, [name]: masked }));
      return;
    }

    if (name === "Código" || name === "Afinidade Digital") {
      const onlyNumbers = value.replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: onlyNumbers === "" ? 0 : Number(onlyNumbers),
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const formatDateForBackend = (date: string) => {
      if (!date) return "";
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    };

    const formatPhone = (phone: string) => phone.replace(/\D/g, "");

    const payload = [
      {
        nomeMedico: formData["Nome medico"],
        dataAgendamento: formatDateForBackend(formData["Data agenda"]),
        horaAgendamento: formData["Hora Agenda"],
        nomePaciente: formData["Nome paciente"],
        numeroPaciente: formatPhone(formData["Número celular"]),
        dataNascimentoPaciente: formatDateForBackend(formData["Data nascimento"]),
        afinidadeDigital: formData["Afinidade Digital"],
        nomeAcompanhante: formData["Nome acompanhante"],
        numeroAcompanhante: formatPhone(formData["Número acompanhante"]),
        especialidade: formData["Especialidade"],
        codigoConsulta: formData["Código"],
        obsAgendamento: formData["OBS"],
        cep: formatPhone(formData["CEP"]),
      },
    ];

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload/salvar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Falha ao enviar dados");

      // setStatus("success"); // <-- Removido
      toast.success("Dados enviados com sucesso!"); // <-- 4. CHAMAR O TOAST DE SUCESSO
      navigate("/importar");

    } catch (err) {
      console.error("Erro ao enviar dados manuais:", err);

      toast.error("Não foi possível enviar os dados. Tente novamente."); 
    
    } finally {
      setIsSubmitting(false); 
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
          <InputField
            label="Data agenda"
            name="Data agenda"
            type="date"
            value={formData["Data agenda"]}
            onChange={handleChange}
            required
            min={minAgenda}
          />
          <InputField
            label="Hora Agenda"
            name="Hora Agenda"
            type="time"
            value={formData["Hora Agenda"]}
            onChange={handleChange}
            required
          />
          <InputField
            label="Nome paciente"
            name="Nome paciente"
            value={formData["Nome paciente"]}
            onChange={handleChange}
            required
          />
          <InputField
            label="Número celular"
            name="Número celular"
            value={formData["Número celular"]}
            onChange={handleChange}
            required
          />
          <InputField
            label="Data nascimento"
            name="Data nascimento"
            type="date"
            value={formData["Data nascimento"]}
            onChange={handleChange}
            min={birthMin}
            max={birthMax}
          />
          <InputField
            label="CEP"
            name="CEP"
            value={formData["CEP"]}
            onChange={handleChange}
          />
          <InputField
            label="Nome acompanhante"
            name="Nome acompanhante"
            value={formData["Nome acompanhante"]}
            onChange={handleChange}
          />
          <InputField
            label="Número acompanhante"
            name="Número acompanhante"
            value={formData["Número acompanhante"]}
            onChange={handleChange}
          />
          <InputField
            label="Nome médico"
            name="Nome medico"
            value={formData["Nome medico"]}
            onChange={handleChange}
            required
          />

          <SelectField
            label="Especialidade"
            name="Especialidade"
            value={formData["Especialidade"]}
            options={CATEGORIAS_CONSULTA.map((cat) => cat.title)}
            onChange={handleChange}
            required
          />

          <InputField
            label="Código"
            name="Código"
            type="number"
            value={formData["Código"]}
            onChange={handleChange}
          />
          <InputField
            label="Afinidade Digital"
            name="Afinidade Digital"
            type="number"
            value={formData["Afinidade Digital"]}
            onChange={handleChange}
          />
        </div>

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

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
          <button
            type="submit"
            disabled={isSubmitting} 
            className={`px-6 py-2 font-medium rounded-lg shadow transition w-full sm:w-auto ${
              isSubmitting 
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isSubmitting ? "Enviando..." : "Enviar Dados"} 
          </button>

          <button
            type="button"
            onClick={() => navigate("/importar")}
            className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg shadow hover:bg-gray-300 transition w-full sm:w-auto"
          >
            Voltar
          </button>
        </div>


        
      </form>

      <p className="mt-6 text-sm text-gray-600 text-center">
        Prefere enviar os dados via planilha?{" "}
        <Link
          to="/importar/"
          className="text-blue-600 hover:underline font-medium"
        >
          Clique aqui
        </Link>
      </p>
    </div>
  );
}


interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  type?: string;
  required?: boolean;
  min?: string;
  max?: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}
function InputField({ label, name, value, onChange, type = "text", required = false, min, max }: InputFieldProps) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        max={max}
        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  options: string[];
  required?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
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