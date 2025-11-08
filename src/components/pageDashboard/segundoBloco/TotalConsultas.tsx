export interface TotalConsultasProps {
    consultasAgendadas: number;
}

export function TotalConsultas({ consultasAgendadas }: TotalConsultasProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-600"> 
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Consultas Agendadas</h3>
            <h1 className="text-3xl font-extrabold text-gray-800 mt-1">{consultasAgendadas}</h1>
        </div>
    )
}