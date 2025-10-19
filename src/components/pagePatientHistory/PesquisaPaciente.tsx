import { useState, type FormEvent } from "react";

interface PesquisaPacienteProps {
  setIdPaciente: (id: string) => void; 
}

export function PesquisaPaciente({ setIdPaciente }: PesquisaPacienteProps) {
  const [input, setInput] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setIdPaciente(input.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-12 ">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Buscar Histórico do Paciente</h2>
      <p className="text-gray-600 mb-8">
        Insira o ID, Nome, ou Celular do paciente para visualizar o histórico.
      </p>
      
      <form 
        onSubmit={handleSearch} 
        className="w-full max-w-sm flex space-x-3"
      >
        <input
          type="text"
          placeholder="Ex: PACIENTE-7890"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-3 border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
        >
          Buscar
        </button>
      </form>
    </div>
  );
}