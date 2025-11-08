import { BrowserRouter, Route, Routes } from "react-router-dom";
import FileUploader from "./components/FileUploader";
import { SendAlerts } from "./pages/patientAlerts";
import Layout from "./components/Layout";
import ValidateForm from "./components/ValidateForm";
import { NotFound } from "./pages/NotFound";
import { Suspense } from "react";
import { Loading } from "./components/Loading";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./pages/FallbackScreen";
import { Dashboard } from "./pages/Dashboard";
import { LoginPage } from "./pages/loginPage";

// --- MUDANÇAS AQUI ---
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from "./components/ProtectedRoute"; 
import { HomePage } from "./pages/Home";
import { FaqPage } from "./pages/Faq";
import { ContactPage } from "./pages/ContactUs";
import { TeamPage } from "./pages/TeamPage";
import { PublicLayout } from "./components/Home/PublicLayout";
import { HistoricoPaciente } from "./pages/historicoPaciente";
import CalendarPage from "./pages/Calendar";
import ManualUploading from "./components/ManualUploading";
import UploadFiles from "./pages/UploadFiles";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<Loading />}>
            <Routes>

              <Route path="/" element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/contato" element={<ContactPage />} />
              <Route path="/integrantes" element={<TeamPage />} /> 
              </Route>


              <Route path="/login" element={<LoginPage />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/importar" element={<UploadFiles />} />
                  <Route path="/importar/planilha" element={<FileUploader />} />
                  <Route path="/importar/manual" element={<ManualUploading />} />
                  <Route path="/validate" element={<ValidateForm />} />
                  <Route path="/historico/:idPaciente" element={<HistoricoPaciente />} />
                  <Route path="/calendario" element={<CalendarPage />} />
                  <Route path="/historico" element={<HistoricoPaciente />} />
                  <Route path="/alertas" element={<SendAlerts />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;