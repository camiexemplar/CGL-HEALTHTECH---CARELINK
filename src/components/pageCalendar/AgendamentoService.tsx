// Serviço responsável por fazer requisições HTTP para o backend Quarkus.
// Centraliza as operações CRUD dos agendamentos.

import { type FormData as ModalFormData } from "../pageCalendar/EventModal"; 
import { API_BASE_URL } from "../ApiService";
import { type EventInput } from "@fullcalendar/core";
import { type AgendamentoApiDto } from "../../types/Calendario";

const ENDPOINT = `${API_BASE_URL}/agendamentos`;

// Conversões auxiliares entre backend (API) e frontend (FullCalendar) \/

const formatToApi = (data: ModalFormData, id?: string): AgendamentoApiDto => ({
    id: id,
    title: data.title,
    patientName: data.patientName,
    profissionalName: data.profissionalName,
    category: data.category,
    status: data.status,
    modalidadeReal: data.modalidadeReal,
    anotacoes: data.anotacoes,
    color: data.color,
    start: data.start.toISOString(), // ✅ String
    end: data.end.toISOString(),     // ✅ String
});

// Conversões auxiliares entre backend (API) e frontend (FullCalendar) \/

const formatToFrontend = (apiData: AgendamentoApiDto): EventInput => ({
    id: String(apiData.id), 
    title: apiData.title,
    start: apiData.start, 
    end: apiData.end,
    color: apiData.color,
    extendedProps: apiData
});

//agendamentos

export const AgendamentoService = {
    
    // GET
    async fetchAll(): Promise<EventInput[]> {
        const response = await fetch(ENDPOINT);
        
        if (!response.ok) {
            throw new Error(`Falha ao buscar agendamentos. Status: ${response.status}`);
        }
                const data: AgendamentoApiDto[] = await response.json(); 
        
        return data.map(formatToFrontend); 
    },

    // POST
    async create(data: ModalFormData): Promise<EventInput> {
        const dadosApi = formatToApi(data);
        
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosApi),
        });

        if (!response.ok) {
            throw new Error(`Falha ao criar agendamento. Status: ${response.status}`);
        }

        const eventoCriado: AgendamentoApiDto = await response.json();
        return formatToFrontend(eventoCriado);
    },

    // PUT
    async update(id: string, data: ModalFormData): Promise<EventInput> {
        const dadosApi = formatToApi(data, id);
        
        const response = await fetch(`${ENDPOINT}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosApi),
        });

        if (!response.ok) {
            throw new Error(`Falha ao atualizar agendamento. Status: ${response.status}`);
        }
        
        const eventoAtualizado: AgendamentoApiDto = await response.json();
        return formatToFrontend(eventoAtualizado);
    },

    // DELETE
    async delete(id: string): Promise<void> {
        const response = await fetch(`${ENDPOINT}/${id}`, { method: 'DELETE' });
        if (response.status !== 204 && response.status >= 400) {
             throw new Error(`Falha ao deletar agendamento. Status: ${response.status}`);
        }
    }
};