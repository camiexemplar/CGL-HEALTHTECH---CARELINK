export interface CuidadorCardProps {
    nomeCuidador: string | null;
    telefoneCuidador?: string | null;
}

export function CuidadorCard({ nomeCuidador, telefoneCuidador }: CuidadorCardProps) {
    return (
        <div className="relative">
            {nomeCuidador == null && telefoneCuidador == null ? (
            <p className="text-center text-gray-500 p-8 bg-white rounded-lg">
                O paciente não possui cuidadores cadastrados.
            </p>
            ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800">CUIDADOR:</h2>
                <p className="text-sm text-orange-400 mt-1">{nomeCuidador}</p>
                <p className="text-sm text-gray-500">Telefone cuidador: {telefoneCuidador}</p>
            </div>
            )}
        </div>
    );
}