import { type FormData as ModalFormData } from "../components/pageCalendar/EventModal";

export interface AgendamentoApiDto extends Omit<ModalFormData, 'start' | 'end'> {
    id?: string; 
    start: string; 
    end: string;
}