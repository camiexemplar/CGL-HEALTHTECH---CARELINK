import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { CATEGORIAS_CONSULTA } from './dataCalendar';
import { type EventInput } from '@fullcalendar/core';

// FormData 
export interface FormData {
  title: string;
  color: string;
  start: Date;
  end: Date;
  patientName: string;
  profissionalName: string;
  category: string;
  status: 'Agendada' | 'Realizada' | 'Paciente Faltou' | 'Cancelada' | '';
  modalidadeReal?: 'Presencial' | 'Teleconsulta' | '';
  anotacoes: string;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  slotInfo?: { start: Date; end: Date; resourceId?: string };
  eventoParaEditar?: EventInput; 
  onCreateEvent: (data: FormData) => void;
  onUpdateEvent: (data: FormData) => void;
  onDeleteEvent: (eventId: string) => void;
}

const CATEGORIAS = CATEGORIAS_CONSULTA.map(c => c.title);

const STATUS_CONSULTA: FormData['status'][] = ['Agendada', 'Realizada', 'Paciente Faltou', 'Cancelada'];
const MODALIDADES: NonNullable<FormData['modalidadeReal']>[] = ['Presencial', 'Teleconsulta'];

// Estado inicial
const estadoInicialVazio: FormData = {
  title: '',
  color: '', 
  start: new Date(),
  end: moment().add(1, 'hour').toDate(),
  patientName: '',
  profissionalName: '',
  category: '', 
  status: '',   
  modalidadeReal: '',
  anotacoes: '',
};

export default function EventModal({ 
  isOpen, 
  onClose, 
  slotInfo, 
  eventoParaEditar,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent
}: EventModalProps) {
  
  const [formData, setFormData] = useState<FormData>(estadoInicialVazio);
  const isEditing = !!eventoParaEditar;

  useEffect(() => {
    if (eventoParaEditar) {
      setFormData({
        title: eventoParaEditar.title || '',
        color: eventoParaEditar.color || '',
        start: eventoParaEditar.start ? new Date(eventoParaEditar.start as Date) : new Date(),
        end: eventoParaEditar.end ? new Date(eventoParaEditar.end as Date) : moment().add(1, 'hour').toDate(),
        patientName: eventoParaEditar.extendedProps?.patientName || '',
        profissionalName: eventoParaEditar.extendedProps?.profissionalName || '',
        category: eventoParaEditar.extendedProps?.category || '',
        status: eventoParaEditar.extendedProps?.status || '',
        modalidadeReal: eventoParaEditar.extendedProps?.modalidadeReal || '',
        anotacoes: eventoParaEditar.extendedProps?.anotacoes || '',
      });
    } else if (slotInfo) {
      setFormData({
        ...estadoInicialVazio,
        start: slotInfo.start,
        end: slotInfo.end,
      });
    } else {
      setFormData(estadoInicialVazio);
    }
  }, [slotInfo, eventoParaEditar, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newState = { ...prev, [name]: value };
      if (name === 'category' && value) {
        const categoria = CATEGORIAS_CONSULTA.find(c => c.title === value);
        newState.color = categoria ? categoria.color : '';
      }
      if (name === 'status' && value !== 'Realizada') {
        newState.modalidadeReal = '';
      }
      return newState;
    });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedDate = new Date(prev[name as 'start' | 'end']);
      const [hours, minutes] = value.split(':').map(Number);
      updatedDate.setHours(hours, minutes);
      return {
        ...prev,
        [name]: updatedDate,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) onUpdateEvent(formData);
    else onCreateEvent(formData);
    onClose();
  };

  const handleDelete = () => {
    if (eventoParaEditar?.id) {
      onDeleteEvent(eventoParaEditar.id);
      onClose();
    }
  };

  const formatTime = (date: Date) => moment(date).format('HH:mm');

  const maskName = (name: string): string => {
    if (!name) return '';
    const parts = name.split(' ');
    return parts
      .map((part, index) =>
        index === 0 || index === parts.length - 1 ? part.charAt(0) + '***' : '***'
      )
      .join(' ');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-blue-50 p-6 rounded-lg shadow-2xl w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditing ? 'Detalhes do Agendamento' : 'Novo Agendamento'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isEditing && eventoParaEditar && (
            <div className="mb-6 p-4 bg-blue-100 rounded border border-blue-200 space-y-2">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Detalhes</h3>
              <p><span className="font-medium">Paciente:</span> {maskName(eventoParaEditar.extendedProps?.patientName || '')}</p>
              <p><span className="font-medium">Especialidade:</span> {eventoParaEditar.extendedProps?.category || 'N/A'}</p>
              <p><span className="font-medium">Profissional:</span> {eventoParaEditar.extendedProps?.profissionalName || 'N/A'}</p>
            </div>
          )}

          {(
            <div>
              <label className="block text-sm font-medium text-gray-700">Título do agendamento</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Paciente</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Médico</label>
            <input
              type="text"
              name="profissionalName"
              value={formData.profissionalName}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Horário do começo da consulta</label>
              <input
                type="time"
                name="start"
                value={formatTime(formData.start)}
                onChange={handleTimeChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Horário de fim da consulta</label>
              <input
                type="time"
                name="end"
                value={formatTime(formData.end)}
                onChange={handleTimeChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Categoria</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
            >
              <option value="" disabled>Selecione uma categoria...</option>
              {CATEGORIAS.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
            >
              <option value="" disabled>Selecione o status...</option>
              {STATUS_CONSULTA.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {formData.status === 'Realizada' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Modalidade Realizada</label>
              <select
                name="modalidadeReal"
                value={formData.modalidadeReal}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
              >
                <option value="" disabled>Selecione a modalidade...</option>
                {MODALIDADES.map(mod => (
                  <option key={mod} value={mod}>{mod}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Anotações</label>
            <textarea
              name="anotacoes"
              rows={4}
              value={formData.anotacoes}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
            />
          </div>

          <div className="flex justify-between border-t border-gray-200 pt-4 mt-6">
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Excluir
              </button>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                {isEditing ? 'Salvar Alterações' : 'Criar Agendamento'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
