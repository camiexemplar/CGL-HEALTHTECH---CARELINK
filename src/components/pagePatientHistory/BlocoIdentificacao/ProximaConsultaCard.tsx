export interface ProximaConsultaCardProps {
  proximaConsulta: {
    dataConsulta: string;
    horaConsulta: string;
    nomeMedico: string;
    especialidadeConsulta: string;
  } | null;
}

export function ProximaConsultaCard({ proximaConsulta: proximaConsulta }: ProximaConsultaCardProps) {
    return (
        <div className="relative">
            {proximaConsulta == null ? (
            <p className="text-center text-gray-500 p-8 bg-white rounded-lg">
                Não há consultas futuras agendadas para este paciente.
            </p>
            ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm">
                {" "}
                <h3 className="font-semibold text-gray-800 mb-2">PRÓXIMA CONSULTA</h3>
                <p className="text-sm text-gray-600">
                Data:{" "}
                <span className="font-medium">{proximaConsulta.dataConsulta}</span>
                </p>
                <p className="text-sm text-gray-600">
                Hora:{" "}
                <span className="font-medium">{proximaConsulta.horaConsulta}</span>
                </p>
                <p className="text-sm text-gray-600">
                Profissional:{" "}
                <span className="font-medium">
                    {proximaConsulta.nomeMedico}
                </span>
                </p>
                <p className="text-sm text-gray-600">
                Especialidade:{" "}
                <span className="font-medium">
                    {proximaConsulta.especialidadeConsulta}
                </span>
                </p>
            </div>
            )}
        </div>
        
    );
}