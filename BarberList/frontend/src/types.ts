export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: 'CLIENTE' | 'FUNCIONARIO';
}

export interface Cliente extends Usuario {
  tipo: 'CLIENTE';
  cortesRealizados: number;
  fidelidadeAtual: number; // 0..10
}

export interface Funcionario extends Usuario {
  tipo: 'FUNCIONARIO';
  especialidade: string;
  avaliacao: number;
  totalAvaliacoes: number;
  diasTrabalho: number[]; // 0=dom..6=sab
  horarioInicio: string;
  horarioFim: string;
  horarioAlmocoInicio: string;
  horarioAlmocoFim: string;
  bloqueios: Bloqueio[];
}

export interface Bloqueio {
  id: string;
  data: string;
  horario: string;
  motivo: string;
}

export interface Servico {
  id: string;
  nome: string;
  preco: number;
  duracao: number; // minutos
  descricao: string;
}

export interface Agendamento {
  id: string;
  clienteId: string;
  clienteNome: string;
  clienteTelefone: string;
  funcionarioId: string;
  funcionarioNome: string;
  servicoId: string;
  servicoNome: string;
  data: string;
  horario: string;
  status: 'AGENDADO' | 'CONCLUIDO' | 'CANCELADO';
  preco: number;
  gratuito: boolean;
  avaliacao?: number;
  comentario?: string;
}

export interface Avaliacao {
  id: string;
  clienteNome: string;
  nota: number;
  comentario: string;
  data: string;
  funcionarioNome?: string;
}

export type Page = 
  | 'landing'
  | 'login'
  | 'register'
  | 'cliente-dashboard'
  | 'cliente-agendar'
  | 'cliente-agendamentos'
  | 'cliente-historico'
  | 'cliente-fidelidade'
  | 'cliente-perfil'
  | 'funcionario-dashboard'
  | 'funcionario-agenda'
  | 'funcionario-config'
  | 'funcionario-avaliacoes'
  | 'funcionario-perfil'
  | 'java-code';
