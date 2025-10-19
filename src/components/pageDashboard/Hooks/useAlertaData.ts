import { useEffect, useState } from "react";
import type { AlertaItem } from "../../../types/Alerta";

export function useAlertaData() {
    const [alertas, setAlertas] = useState<AlertaItem[] | null>(null);
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        // Lógica para buscar e gerenciar dados de alerta

        const buscarConsultasDeHoje = async () => {
            setCarregando(true);
            setAlertas(null);

            try{
                const url = 'http://localhost:8080/api/alertas/hoje';
                const resposta = await fetch(url);

                if(resposta.ok){
                    const dados = await resposta.json();
                    setAlertas(dados);
                } else {
                    console.error("Falha ao buscar alertas:", resposta.status);
                    setAlertas(null);
                }
            } catch(erro){
                console.error("Erro de conexão com a API:", erro);
                setAlertas(null);   
            }
            finally{
                setCarregando(false);
            }
        };

        buscarConsultasDeHoje();
    }, []);

    return {
        alertas: alertas,
        carregando: carregando,
    };
}