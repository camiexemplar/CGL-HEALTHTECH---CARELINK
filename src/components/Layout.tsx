import { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import logo from "../assets/logoextendida.png";
import nopicture from "../assets/nopicture.png";
import logout from "../assets/logout.png";


const NavItem = ({ to, icon, label, onClick, isActive }: {
  to: string;
  icon: string;
  label: string;
  onClick: () => void;
  isActive: boolean;
}) => (
  <Link
    to={to}
    className={`
      flex items-center gap-4 p-3 rounded-xl transition-all duration-200
      ${isActive
        ? "font-bold text-white bg-blue-600 shadow-md"
        : "text-gray-400 hover:bg-gray-700 hover:text-white"
      }`}
    onClick={onClick}
  >
    <div className="w-6 h-6 flex items-center justify-center text-xl">{icon}</div>
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

export default function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { logout: authLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    authLogout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: "Dashboard Geral", icon: "", path: "/dashboard" },
    { name: "Histórico de pacientes", icon: "", path: "/historico" },
    { name: "Importar Dados", icon: "", path: "/importar" },
    { name: "Relatório de Abseteismo", icon: "", path: "/alertas" },
    { name: "Calendário", icon: "", path: "/calendario" }
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 shadow-lg
        transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <img src={logo} alt="CGL Healthtech Logo" className="h-10 w-auto" />
            <button className="lg:hidden text-gray-300" onClick={() => setSidebarOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="p-4 space-y-2 flex-1">
            {navItems.map((item) => (
              <NavItem
                key={item.name}
                to={item.path}
                icon={item.icon}
                label={item.name}
                isActive={location.pathname === item.path}
                onClick={() => setSidebarOpen(false)}
              />
            ))}
          </nav>

          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full gap-4 p-3 rounded-xl text-gray-400 hover:bg-gray-700 hover:text-white transition-all duration-200"
            >
              <div className="w-6 h-6 flex items-center justify-center text-xl"> <img src={logout} alt="deslogar" /></div>
              <span className="text-sm font-medium">Sair</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-x-hidden">
        <header className="bg-white flex items-center justify-between p-4 shadow-sm sticky top-0 z-40">
          <button className="text-2xl font-bold lg:hidden" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          
          <div className="w-full flex justify-end">
            <div ref={menuRef} className="relative">
              <button
                className="bg-gray-300 w-10 h-10 rounded-full overflow-hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <img src={nopicture} alt="Usuário" className="w-full h-full object-cover" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-50 py-1">
                  <Link
                    to="/perfil"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Meu Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}