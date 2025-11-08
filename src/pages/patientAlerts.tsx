import React, { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from '../components/ApiService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function SendAlerts() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // rolagem automática para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // mensagem de boas-vindas
  useEffect(() => {
    setMessages([{
      id: '1',
      text: 'Olá! Sou o CareLink Assistant. Como posso ajudar você com os dados do hospital hoje?',
      isUser: false,
      timestamp: new Date()
    }]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
  
      const response = await fetch(`${API_BASE_URL}/api/staff-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          user_id: "funcionario_001", // id do funcionário logado
        }),
      });

      const data = await response.json();

      // adiciona resposta do bot
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'Desculpe, não consegui processar sua pergunta.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erro:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Erro de conexão. Tente novamente.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Exemplos de perguntas rápidas
  const quickQuestions = [
    "Quantos pacientes temos no sistema?",
    "Quantas faltas na semana passada?",
    "Qual médico tem mais consultas?",
    "Quantos agendamentos para hoje?"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Relatórios Inteligentes
          </h1>
          <p className="text-gray-600">
            Consulta inteligente aos dados do hospital em tempo real
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chat Principal */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Área de Mensagens */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
                        message.isUser
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isUser ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg rounded-bl-none p-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua pergunta sobre os dados do hospital..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={2}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar com Perguntas Rápidas */}
          <div className="w-full lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                Perguntas Rápidas
              </h3>
              <div className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full text-left text-sm text-gray-600 hover:text-blue-500 hover:bg-blue-50 p-2 rounded transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Estatísticas Rápidas */}
            <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                Dados em Tempo Real
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pacientes Hoje:</span>
                  <span className="font-semibold text-blue-500">--</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Consultas:</span>
                  <span className="font-semibold text-green-500">--</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Faltas:</span>
                  <span className="font-semibold text-red-500">--</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}