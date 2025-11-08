import { useEffect, useState } from "react";
import type { AlertaItem } from "../../../types/Alerta";
import { API_BASE_URL } from "../../ApiService";

export function useAlertaData() {
    const [alertas, setAlertas] = useState<AlertaItem[] | null>(null);
    const [carregando, setCarregando] = useState(false);
    
    const buscarConsultasDeHoje = async (isInitialLoad: boolean = false) => {
        if (isInitialLoad) {
            setCarregando(true); 
            setAlertas(null);
        }

        try {
            const url = 'http://localhost:8080/api/alertas/hoje';
            const resposta = await fetch(url);
            try{
                const resposta = await fetch(`${API_BASE_URL}/api/alertas/hoje`);

            if (resposta.ok) {
                const dados = await resposta.json();
                setAlertas(dados);
            } else {
                console.error("Falha ao buscar alertas:", resposta.status);
            }
        } catch(erro) {
            console.error("Erro de conexão com a API:", erro);
            if (isInitialLoad) setAlertas(null); 
        } finally {
            if (isInitialLoad) setCarregando(false); 
        }
    };

    useEffect(() => {
        buscarConsultasDeHoje(true);
        const intervalo = setInterval(() => buscarConsultasDeHoje(false), 10000); 

        return () => {
            clearInterval(intervalo);
        };
    }, []);

    return {
        alertas: alertas,
        carregando: carregando,
    };
}