import { useNavigate } from "react-router-dom";
import type { AlertaItem } from "../../../types/Alerta";

export interface ConsultaDeHojeCardProps{
    consultaDeHoje: AlertaItem;
}

export function ConsultaDeHojeCard({ consultaDeHoje: consultaDeHoje }: ConsultaDeHojeCardProps) {
    
    const riskLevel = consultaDeHoje.scoreDeRisco > 80 ? 'ALTO' : consultaDeHoje.scoreDeRisco > 60 ? 'MEDIO' : 'BAIXO';
    const borderClass = riskLevel === 'ALTO' ? 'border-red-500' : riskLevel === 'MEDIO' ? 'border-yellow-500' : 'border-blue-500';
    const scoreColor = riskLevel === 'ALTO' ? 'text-red-600' : riskLevel === 'MEDIO' ? 'text-yellow-600' : 'text-blue-600';

    const navegacao = useNavigate();
    const handleClick = () => {
        navegacao(`/historico/${consultaDeHoje.idPaciente}`); 
    };

    return (
        <div className={`p-4 border-l-4 ${borderClass} bg-white rounded-lg shadow-md flex justify-between items-center transition duration-200 hover:shadow-lg`}>

            <div className="flex space-x-6 items-center">
                
                <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 border-current ${scoreColor} bg-gray-50`}>
                    <span className="text-xs font-bold uppercase">Risco</span>
                    <span className="text-xl font-extrabold">{consultaDeHoje.scoreDeRisco}</span>
                </div>

                <div>
                    <h5 className="font-bold text-lg text-gray-800">{consultaDeHoje.nomePaciente}</h5>
                    <p className="text-xs text-gray-500">Tel: {consultaDeHoje.telefonePaciente}</p>
                    
                    <p className="text-sm text-gray-700 mt-1">
                        Consulta: {consultaDeHoje.horaConsulta} com Dr(a). {consultaDeHoje.nomeMedico} | {consultaDeHoje.especialidadeConsulta}
                    </p>
                    
                    <p className="text-xs text-red-500 mt-1 flex items-center">
                        <span className="mr-1">⚠️</span> Fatores críticos: histórico de falta de consultas, não aderência ao tratamento.
                    </p>
                </div>
            </div>
            
            <button
                type="button"
                onClick={handleClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-200 shadow-md flex items-center"
            >
                VER HISTÓRICO
            </button>
        </div>
    );
}