import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png'; 

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    login(); 
    navigate('/dashboard'); 
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      
      <header className="w-full bg-white shadow-sm py-3 px-4 sm:py-4 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="CGL HealthTech Logo" className="w-20 sm:w-24" />
        </Link>
        <Link to="/" className="font-semibold text-sm sm:text-lg text-blue-600 hover:text-blue-700 transition-colors">
          Voltar a Home
        </Link>
      </header>

      {/* main com padding adaptavel e scroll suave */}
      <main className="flex flex-grow items-center justify-center py-4 px-4 sm:py-8 sm:px-8 lg:py-12">
        
        <div className="flex flex-col md:flex-row w-full max-w-4xl lg:max-w-7xl bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl overflow-hidden">
          
          <div className="flex-1 p-6 sm:p-8 md:p-12 lg:p-24 flex flex-col items-center justify-center">
            
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold text-blue-500 text-center mb-2 lg:mb-4 leading-snug">
              Conectando Saúde e Tecnologia
            </h1>
            
            <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-medium text-gray-800 text-center mb-4 sm:mb-6 lg:mb-8">
              Login
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col space-y-3 sm:space-y-4 lg:space-y-6 w-full max-w-xs sm:max-w-sm">
              <input
                type="email"
                placeholder="E-mail institucional"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-4 py-2 sm:px-5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-colors"
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-4 py-2 sm:px-5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-colors"
                required
              />
              <button
                type="submit"
                className="w-full px-6 py-3 sm:py-3 lg:py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition-colors text-sm sm:text-base lg:text-lg"
              >
                Entrar
              </button>
            </form>
          
            <a href="#" className="mt-4 sm:mt-6 lg:mt-8 text-center text-xs sm:text-sm text-gray-600 hover:text-gray-800 hover:underline transition-colors">
              Esqueceu a senha?
            </a>
          </div>

          {/* coluna informativa - escondida no mobile para melhorar vizualização */}
          <div className="hidden md:flex flex-1 p-8 lg:p-12 xl:p-24 bg-blue-500 text-white items-center justify-center">
            <p className="text-base lg:text-lg xl:text-xl leading-relaxed text-center">
              Plataforma digital do Hospital das Clínicas, desenvolvida para facilitar o acesso seguro e eficiente às informações de pacientes e dashboards de gestão.
            </p>
          </div>
          
        </div>
      </main>
    </div>
  );
};