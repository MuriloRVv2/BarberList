import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Cliente, Funcionario, Agendamento, Servico, Avaliacao, Page } from './types';

// ===== MOCK DATA =====
const SERVICOS: Servico[] = [
  { id: '1', nome: 'Corte Clássico', preco: 25, duracao: 30, descricao: 'Corte tradicional com tesoura e máquina' },
  { id: '2', nome: 'Corte + Barba', preco: 45, duracao: 45, descricao: 'Corte completo com barba na navalha' },
  { id: '3', nome: 'Degradê', preco: 30, duracao: 40, descricao: 'Degradê perfeito com acabamento premium' },
  { id: '4', nome: 'Barba', preco: 25, duracao: 20, descricao: 'Barba feita na navalha com toalha quente' },
  { id: '5', nome: 'Sobrancelha', preco: 15, duracao: 10, descricao: 'Design de sobrancelha masculina' },
  { id: '6', nome: 'Corte Infantil', preco: 20, duracao: 25, descricao: 'Corte para crianças até 12 anos' },
  { id: '7', nome: 'Pigmentação', preco: 80, duracao: 60, descricao: 'Pigmentação capilar profissional' },
  { id: '8', nome: 'Platinado', preco: 120, duracao: 90, descricao: 'Descoloração e platinado completo' },
];

const FUNCIONARIOS: Funcionario[] = [
  {
    id: 'f1', nome: 'Carlos Silva', email: 'carlos@barbercall.com', telefone: '(11) 99999-1111',
    tipo: 'FUNCIONARIO', especialidade: 'Cortes Clássicos e Degradê', avaliacao: 4.8, totalAvaliacoes: 127,
    diasTrabalho: [1, 2, 3, 4, 5, 6], horarioInicio: '09:00', horarioFim: '19:00',
    horarioAlmocoInicio: '12:00', horarioAlmocoFim: '13:00', bloqueios: []
  },
  {
    id: 'f2', nome: 'Ricardo Santos', email: 'ricardo@barbercall.com', telefone: '(11) 99999-2222',
    tipo: 'FUNCIONARIO', especialidade: 'Barbas e Cuidados Faciais', avaliacao: 4.6, totalAvaliacoes: 98,
    diasTrabalho: [1, 2, 3, 4, 5], horarioInicio: '08:00', horarioFim: '18:00',
    horarioAlmocoInicio: '12:00', horarioAlmocoFim: '13:00', bloqueios: []
  },
  {
    id: 'f3', nome: 'André Oliveira', email: 'andre@barbercall.com', telefone: '(11) 99999-3333',
    tipo: 'FUNCIONARIO', especialidade: 'Cortes Modernos e Coloração', avaliacao: 4.9, totalAvaliacoes: 156,
    diasTrabalho: [2, 3, 4, 5, 6], horarioInicio: '10:00', horarioFim: '20:00',
    horarioAlmocoInicio: '13:00', horarioAlmocoFim: '14:00', bloqueios: []
  },
];

const AVALIACOES: Avaliacao[] = [
  { id: 'a1', clienteNome: 'Marcos P.', nota: 5, comentario: 'Melhor barbearia da região! Atendimento impecável.', data: '2024-12-20', funcionarioNome: 'Carlos Silva' },
  { id: 'a2', clienteNome: 'Lucas M.', nota: 5, comentario: 'Degradê perfeito, sempre saio satisfeito.', data: '2024-12-18', funcionarioNome: 'André Oliveira' },
  { id: 'a3', clienteNome: 'Pedro H.', nota: 4, comentario: 'Ótimo atendimento, ambiente muito agradável.', data: '2024-12-15', funcionarioNome: 'Ricardo Santos' },
  { id: 'a4', clienteNome: 'João V.', nota: 5, comentario: 'Barba na navalha incrível! Recomendo demais.', data: '2024-12-12', funcionarioNome: 'Ricardo Santos' },
  { id: 'a5', clienteNome: 'Gabriel R.', nota: 4, comentario: 'Bom corte, bom preço. Voltarei com certeza.', data: '2024-12-10', funcionarioNome: 'Carlos Silva' },
];

// ===== CONTEXT =====
interface AppState {
  page: Page;
  setPage: (p: Page) => void;
  user: (Cliente | Funcionario) | null;
  login: (email: string, senha: string, tipo: 'CLIENTE' | 'FUNCIONARIO') => Promise<boolean>;
  register: (nome: string, email: string, telefone: string, senha: string) => Promise<boolean>;
  logout: () => void;
  servicos: Servico[];
  funcionarios: Funcionario[];
  agendamentos: Agendamento[];
  avaliacoes: Avaliacao[];
  criarAgendamento: (ag: Omit<Agendamento, 'id' | 'status'>) => Promise<boolean>;
  cancelarAgendamento: (id: string) => Promise<boolean>;
  concluirAgendamento: (id: string) => Promise<boolean>;
  avaliarAgendamento: (id: string, nota: number, comentario: string) => Promise<boolean>;
  remarcarAgendamento: (id: string, novaData: string, novoHorario: string) => Promise<boolean>;
  getHorariosDisponiveis: (funcionarioId: string, data: string) => string[];
  updateFuncionario: (f: Funcionario) => void;
  adicionarBloqueio: (funcId: string, data: string, horario: string, motivo: string) => void;
  removerBloqueio: (funcId: string, bloqueioId: string) => void;
  adicionarAvaliacao: (av: Omit<Avaliacao, 'id'>) => void;
}

const AppContext = createContext<AppState | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

function loadState<T>(key: string, fallback: T): T {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch { return fallback; }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>('landing');
  const [user, setUser] = useState<(Cliente | Funcionario) | null>(loadState('bc_user', null));
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(loadState('bc_funcs', FUNCIONARIOS));
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(loadState('bc_ags', []));
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>(loadState('bc_avs', AVALIACOES));
  const [clientes, setClientes] = useState<Cliente[]>(loadState('bc_clientes', []));

  useEffect(() => { localStorage.setItem('bc_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('bc_funcs', JSON.stringify(funcionarios)); }, [funcionarios]);
  useEffect(() => { localStorage.setItem('bc_ags', JSON.stringify(agendamentos)); }, [agendamentos]);
  useEffect(() => { localStorage.setItem('bc_avs', JSON.stringify(avaliacoes)); }, [avaliacoes]);
  useEffect(() => { localStorage.setItem('bc_clientes', JSON.stringify(clientes)); }, [clientes]);

  // Load funcionarios from backend when app starts
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/funcionarios');
        if (!res.ok) return;
        const list = await res.json();
        const mapped = (list || []).map((f: any) => ({
          id: String(f.id), nome: f.nome || '', email: f.email || '', telefone: f.telefone || '',
          tipo: 'FUNCIONARIO' as const, especialidade: f.especialidade || '', avaliacao: f.avaliacao || 0,
          totalAvaliacoes: f.totalAvaliacoes || 0, diasTrabalho: f.diasTrabalho || [],
          horarioInicio: f.horarioInicio || '09:00', horarioFim: f.horarioFim || '18:00',
          horarioAlmocoInicio: f.horarioAlmocoInicio || '12:00', horarioAlmocoFim: f.horarioAlmocoFim || '13:00',
          bloqueios: (f.bloqueios || []).map((b: any) => ({ id: String(b.id), data: b.data, horario: b.horario, motivo: b.motivo }))
        }));
        if (mapped.length) setFuncionarios(mapped);
      } catch (err) { console.warn('Could not load funcionarios', err); }
    })();
  }, []);

  const login = async (email: string, senha: string, tipo: 'CLIENTE' | 'FUNCIONARIO'): Promise<boolean> => {
    try {
      const endpoint = tipo === 'FUNCIONARIO' ? '/api/auth/login/funcionario' : '/api/auth/login/cliente';
      const res = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      if (!res.ok) {
        console.error('Login failed:', res.status);
        return false;
      }
      const data = await res.json();
      console.log('Login success:', data);
      
      if (tipo === 'FUNCIONARIO') {
        const f = data as any;
        const usuario: Funcionario = {
          id: String(f.id || ''), nome: f.nome || '', email: f.email || '', telefone: f.telefone || '',
          tipo: 'FUNCIONARIO', especialidade: f.especialidade || '', avaliacao: f.avaliacao || 0,
          totalAvaliacoes: f.totalAvaliacoes || 0, diasTrabalho: f.diasTrabalho || [], 
          horarioInicio: f.horarioInicio || '09:00', horarioFim: f.horarioFim || '18:00', 
          horarioAlmocoInicio: f.horarioAlmocoInicio || '12:00', horarioAlmocoFim: f.horarioAlmocoFim || '13:00', 
          bloqueios: f.bloqueios || []
        };
        setUser(usuario);
        return true;
      } else {
        const c = data as any;
        const usuario: Cliente = {
          id: String(c.id || ''), nome: c.nome || '', email: c.email || '', telefone: c.telefone || '',
          tipo: 'CLIENTE', cortesRealizados: c.cortesRealizados || 0, fidelidadeAtual: c.fidelidadeAtual || 0
        };
        setUser(usuario);
        setClientes(prev => {
          if (prev.some(x => x.email.toLowerCase() === usuario.email.toLowerCase())) return prev;
          return [...prev, usuario];
        });
        // fetch cliente agendamentos from backend
        (async () => {
          try {
            const res2 = await fetch(`/api/agendamentos/cliente/${usuario.id}`);
            if (!res2.ok) return;
            const ags = await res2.json();
            const mapped = (ags || []).map((a: any) => ({
              id: String(a.id), clienteId: String(a.cliente?.id || usuario.id), clienteNome: a.cliente?.nome || a.clienteNome || usuario.nome,
              clienteTelefone: a.cliente?.telefone || a.clienteTelefone || '',
              funcionarioId: String(a.funcionario?.id || a.funcionarioId), funcionarioNome: a.funcionario?.nome || a.funcionarioNome || '',
              servicoId: String(a.servico?.id || a.servicoId), servicoNome: a.servico?.nome || a.servicoNome || '',
              data: a.data, horario: a.horario, status: a.status || 'AGENDADO', preco: a.preco || 0, gratuito: !!a.gratuito,
              avaliacao: a.avaliacao ?? undefined, comentario: a.comentario ?? undefined
            }));
            setAgendamentos(mapped);
          } catch (err) { console.warn('Could not load agendamentos for cliente', err); }
        })();
        return true;
      }
    } catch (err) {
      console.error('Login fetch error:', err);
      return false;
    }
  };

  const register = async (nome: string, email: string, telefone: string, senha: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, telefone, senha })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('Register error:', errData);
        return false;
      }
      const data = await res.json();
      console.log('Register success:', data);
      const usuario: Cliente = {
        id: data.id ? String(data.id) : 'c_' + Date.now(),
        nome: data.nome || nome,
        email: data.email || email,
        telefone: telefone || data.telefone || '',
        tipo: 'CLIENTE',
        cortesRealizados: data.cortesRealizados || 0,
        fidelidadeAtual: data.fidelidadeAtual || 0
      };
      setClientes(prev => [...prev, usuario]);
      setUser(usuario);
      return true;
    } catch (err) {
      console.error('Register fetch error:', err);
      return false;
    }
  };

  const logout = () => { setUser(null); setPage('landing'); };

  const criarAgendamento = async (ag: Omit<Agendamento, 'id' | 'status'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/agendamentos', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ag)
      });
      if (!res.ok) {
        console.error('Failed to create agendamento', res.status);
        return false;
      }
      const data = await res.json();
      const mapped: Agendamento = {
        id: data.id ? String(data.id) : 'ag_' + Date.now(),
        clienteId: data.cliente?.id ? String(data.cliente.id) : String(ag.clienteId),
        clienteNome: data.cliente?.nome || ag.clienteNome,
        clienteTelefone: data.cliente?.telefone || ag.clienteTelefone || '',
        funcionarioId: data.funcionario?.id ? String(data.funcionario.id) : String(ag.funcionarioId),
        funcionarioNome: data.funcionario?.nome || ag.funcionarioNome,
        servicoId: data.servico?.id ? String(data.servico.id) : String(ag.servicoId),
        servicoNome: data.servico?.nome || ag.servicoNome,
        data: data.data || ag.data,
        horario: data.horario || ag.horario,
        status: data.status || 'AGENDADO',
        preco: typeof data.preco === 'number' ? data.preco : (ag.preco || 0),
        gratuito: !!data.gratuito || !!ag.gratuito,
        avaliacao: data.avaliacao ?? undefined,
        comentario: data.comentario ?? undefined,
      };
      setAgendamentos(prev => [...prev, mapped]);
      return true;
    } catch (err) {
      console.error('criarAgendamento error', err);
      return false;
    }
  };

  const cancelarAgendamento = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/agendamentos/${id}/cancelar`, { method: 'PUT', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) { console.error('cancelarAgendamento failed', res.status); return false; }
      setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELADO' as const } : a));
      return true;
    } catch (err) { console.error('cancelarAgendamento error', err); return false; }
  };

  const concluirAgendamento = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/agendamentos/${id}/concluir`, { method: 'PUT', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) { console.error('concluirAgendamento failed', res.status); return false; }
      setAgendamentos(prev => prev.map(a => {
        if (a.id !== id) return a;
        const updated = { ...a, status: 'CONCLUIDO' as const };
        // Update client loyalty if current user is the client
        if (user && user.tipo === 'CLIENTE' && user.id === a.clienteId) {
          const c = user as Cliente;
          const newFid = c.fidelidadeAtual >= 10 ? 0 : c.fidelidadeAtual + 1;
          const updatedClient: Cliente = { ...c, cortesRealizados: c.cortesRealizados + 1, fidelidadeAtual: newFid };
          setUser(updatedClient);
          setClientes(prev2 => prev2.map(cl => cl.id === c.id ? updatedClient : cl));
        }
        return updated;
      }));
      return true;
    } catch (err) { console.error('concluirAgendamento error', err); return false; }
  };

  const avaliarAgendamento = async (id: string, nota: number, comentario: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/agendamentos/${id}/avaliar`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nota, comentario })
      });
      if (!res.ok) { console.error('avaliarAgendamento failed', res.status); return false; }
      setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, avaliacao: nota, comentario } : a));
      const ag = agendamentos.find(a => a.id === id);
      if (ag) {
        adicionarAvaliacao({
          clienteNome: ag.clienteNome,
          nota,
          comentario,
          data: new Date().toISOString().split('T')[0],
          funcionarioNome: ag.funcionarioNome,
        });
      }
      return true;
    } catch (err) { console.error('avaliarAgendamento error', err); return false; }
  };

  const remarcarAgendamento = async (id: string, novaData: string, novoHorario: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/agendamentos/${id}/remarcar`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: novaData, horario: novoHorario })
      });
      if (!res.ok) { console.error('remarcarAgendamento failed', res.status); return false; }
      setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, data: novaData, horario: novoHorario } : a));
      return true;
    } catch (err) { console.error('remarcarAgendamento error', err); return false; }
  };

  const getHorariosDisponiveis = (funcionarioId: string, data: string): string[] => {
    const func = funcionarios.find(f => f.id === funcionarioId);
    if (!func) return [];

    const dayOfWeek = new Date(data + 'T12:00:00').getDay();
    if (!func.diasTrabalho.includes(dayOfWeek)) return [];

    const slots: string[] = [];
    const [startH, startM] = func.horarioInicio.split(':').map(Number);
    const [endH, endM] = func.horarioFim.split(':').map(Number);
    const [almH1] = func.horarioAlmocoInicio.split(':').map(Number);
    const [almH2] = func.horarioAlmocoFim.split(':').map(Number);

    let h = startH, m = startM;
    while (h < endH || (h === endH && m < endM)) {
      if (h < almH1 || h >= almH2) {
        const slot = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        const isBooked = agendamentos.some(a => a.funcionarioId === funcionarioId && a.data === data && a.horario === slot && a.status === 'AGENDADO');
        const isBlocked = func.bloqueios.some(b => b.data === data && b.horario === slot);
        if (!isBooked && !isBlocked) slots.push(slot);
      }
      m += 30;
      if (m >= 60) { h++; m = 0; }
    }
    return slots;
  };

  const updateFuncionario = (f: Funcionario) => {
    setFuncionarios(prev => prev.map(x => x.id === f.id ? f : x));
    if (user && user.id === f.id) setUser(f);
  };

  const adicionarBloqueio = (funcId: string, data: string, horario: string, motivo: string) => {
    setFuncionarios(prev => prev.map(f => f.id === funcId ? {
      ...f, bloqueios: [...f.bloqueios, { id: 'b_' + Date.now(), data, horario, motivo }]
    } : f));
  };

  const removerBloqueio = (funcId: string, bloqueioId: string) => {
    setFuncionarios(prev => prev.map(f => f.id === funcId ? {
      ...f, bloqueios: f.bloqueios.filter(b => b.id !== bloqueioId)
    } : f));
  };

  const adicionarAvaliacao = (av: Omit<Avaliacao, 'id'>) => {
    setAvaliacoes(prev => [...prev, { ...av, id: 'av_' + Date.now() }]);
  };

  return (
    <AppContext.Provider value={{
      page, setPage, user, login, register, logout,
      servicos: SERVICOS, funcionarios, agendamentos, avaliacoes,
      criarAgendamento, cancelarAgendamento, concluirAgendamento,
      avaliarAgendamento, remarcarAgendamento, getHorariosDisponiveis,
      updateFuncionario, adicionarBloqueio, removerBloqueio, adicionarAvaliacao,
    }}>
      {children}
    </AppContext.Provider>
  );
}
