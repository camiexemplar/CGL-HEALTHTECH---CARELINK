export interface PacienteCardProps {
  nome: string;
  telefone: string;
  bairro: string;
  dataNascimento: string;
}

export function PacienteCard({ nome: nome, telefone: telefone, bairro: bairro, dataNascimento: dataNascimento }: PacienteCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800">PACIENTE:</h2>

      <p className="font-bold text-xl text-blue-800">{nome}</p>
      <p className="text-sm text-gray-500">Celular: {telefone}</p>
      <p className="text-sm text-gray-500">Data de Nascimento: {dataNascimento}</p>
      <p className="text-sm text-gray-500">Bairro: {bairro}</p>
    </div>
  );
}
