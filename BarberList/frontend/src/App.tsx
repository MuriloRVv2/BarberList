import { AppProvider, useApp } from './store';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ClienteDashboard from './pages/ClienteDashboard';
import FuncionarioDashboard from './pages/FuncionarioDashboard';

function Router() {
  const { page, user } = useApp();

  // If user is logged in and on landing, redirect to dashboard
  if (user && (page === 'landing' || page === 'login' || page === 'register')) {
    if (user.tipo === 'CLIENTE') return <ClienteDashboard />;
    return <FuncionarioDashboard />;
  }

  switch (page) {
    case 'landing':
      return <LandingPage />;
    case 'login':
    case 'register':
      return <LoginPage />;
    case 'cliente-dashboard':
    case 'cliente-agendar':
    case 'cliente-agendamentos':
    case 'cliente-historico':
    case 'cliente-fidelidade':
    case 'cliente-perfil':
      return user?.tipo === 'CLIENTE' ? <ClienteDashboard /> : <LoginPage />;
    case 'funcionario-dashboard':
    case 'funcionario-agenda':
    case 'funcionario-config':
    case 'funcionario-avaliacoes':
    case 'funcionario-perfil':
      return user?.tipo === 'FUNCIONARIO' ? <FuncionarioDashboard /> : <LoginPage />;
    default:
      return <LandingPage />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}

