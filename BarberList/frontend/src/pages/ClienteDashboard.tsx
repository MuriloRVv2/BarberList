import { useState } from 'react';
import { useApp } from '../store';
import type { Cliente } from '../types';
import {
  CalendarPlus, Calendar, History, Award, User, LogOut, Home,
  Star, Clock, CheckCircle, XCircle, ChevronLeft, Edit, X, Scissors
} from 'lucide-react';

type Tab = 'dashboard' | 'agendar' | 'agendamentos' | 'historico' | 'fidelidade' | 'perfil';

export default function ClienteDashboard() {
  const app = useApp();
  const cliente = app.user as Cliente;
  const [tab, setTab] = useState<Tab>('dashboard');

  const meusAgendamentos = app.agendamentos.filter(a => a.clienteId === cliente.id);
  const futuros = meusAgendamentos.filter(a => a.status === 'AGENDADO');
  const historico = meusAgendamentos.filter(a => a.status !== 'AGENDADO');

  const menuItems: { key: Tab; icon: React.ReactNode; label: string }[] = [
    { key: 'dashboard', icon: <Home size={18} />, label: 'Início' },
    { key: 'agendar', icon: <CalendarPlus size={18} />, label: 'Agendar' },
    { key: 'agendamentos', icon: <Calendar size={18} />, label: 'Meus Horários' },
    { key: 'historico', icon: <History size={18} />, label: 'Histórico' },
    { key: 'fidelidade', icon: <Award size={18} />, label: 'Fidelidade' },
    { key: 'perfil', icon: <User size={18} />, label: 'Perfil' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{ background: 'var(--primary)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 style={{ color: 'var(--secondary)', fontFamily: 'League Spartan', fontSize: 20 }}>BARBER CALL</h3>
          <span style={{ color: 'var(--accent)', fontSize: 12 }}>Cliente</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#ccc', fontSize: 13 }}>Olá, {cliente.nome.split(' ')[0]}</span>
          <button onClick={app.logout} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Nav tabs */}
      <nav style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', overflowX: 'auto', display: 'flex' }}>
        {menuItems.map(m => (
          <button key={m.key} onClick={() => setTab(m.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '12px 16px', border: 'none',
              background: tab === m.key ? 'rgba(217,174,95,0.1)' : 'transparent',
              color: tab === m.key ? 'var(--secondary)' : '#888',
              borderBottom: tab === m.key ? '2px solid var(--secondary)' : '2px solid transparent',
              cursor: 'pointer', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', fontFamily: 'Montserrat'
            }}>
            {m.icon} {m.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
        {tab === 'dashboard' && <DashHome cliente={cliente} futuros={futuros} setTab={setTab} />}
        {tab === 'agendar' && <AgendarPage setTab={setTab} />}
        {tab === 'agendamentos' && <AgendamentosPage futuros={futuros} />}
        {tab === 'historico' && <HistoricoPage historico={historico} />}
        {tab === 'fidelidade' && <FidelidadePage cliente={cliente} />}
        {tab === 'perfil' && <PerfilPage cliente={cliente} />}
      </main>
    </div>
  );
}

// ===== DASHBOARD HOME =====
function DashHome({ cliente, futuros, setTab }: { cliente: Cliente; futuros: any[]; setTab: (t: any) => void }) {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div className="card-gold" style={{ textAlign: 'center' }}>
          <Calendar size={28} color="var(--secondary)" style={{ marginBottom: 8 }} />
          <h3 style={{ fontSize: 28, color: 'var(--secondary)' }}>{futuros.length}</h3>
          <p style={{ color: '#888', fontSize: 13 }}>Agendamentos</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <Scissors size={28} color="var(--accent)" style={{ marginBottom: 8 }} />
          <h3 style={{ fontSize: 28 }}>{cliente.cortesRealizados}</h3>
          <p style={{ color: '#888', fontSize: 13 }}>Cortes Realizados</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <Award size={28} color="var(--secondary)" style={{ marginBottom: 8 }} />
          <h3 style={{ fontSize: 28, color: 'var(--secondary)' }}>{cliente.fidelidadeAtual}/10</h3>
          <p style={{ color: '#888', fontSize: 13 }}>Fidelidade</p>
        </div>
      </div>

      <div className="progress-bar" style={{ height: 10 }}>
        <div className="progress-fill" style={{ width: `${(cliente.fidelidadeAtual / 10) * 100}%` }} />
      </div>
      <p style={{ color: '#888', fontSize: 12, textAlign: 'center' }}>
        {cliente.fidelidadeAtual >= 10 ? '🎉 Você tem um corte GRÁTIS!' : `Faltam ${10 - cliente.fidelidadeAtual} cortes para o grátis`}
      </p>

      <button className="btn-primary animate-pulse-gold" style={{ width: '100%', justifyContent: 'center', fontSize: 16, padding: '16px' }} onClick={() => setTab('agendar')}>
        <CalendarPlus size={20} /> Agendar Novo Horário
      </button>

      {futuros.length > 0 && (
        <div>
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Próximos Agendamentos</h3>
          {futuros.slice(0, 3).map(a => (
            <div key={a.id} className="card" style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: 14 }}>{a.servicoNome}</h4>
                <p style={{ color: '#888', fontSize: 12 }}>{a.data} às {a.horario} • {a.funcionarioNome}</p>
              </div>
              <span className="badge badge-gold">Agendado</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== AGENDAR PAGE =====
function AgendarPage({ setTab }: { setTab: (t: any) => void }) {
  const { servicos, funcionarios, getHorariosDisponiveis, criarAgendamento, user, setPage } = useApp();
  const cliente = user as Cliente;
  const [step, setStep] = useState(1);
  const [servicoId, setServicoId] = useState('');
  const [funcId, setFuncId] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');

  const servicoSelecionado = servicos.find(s => s.id === servicoId);
  const funcSelecionado = funcionarios.find(f => f.id === funcId);
  const horarios = funcId && data ? getHorariosDisponiveis(funcId, data) : [];

  const hoje = new Date().toISOString().split('T')[0];

  const confirmar = async () => {
    if (!servicoSelecionado || !funcSelecionado) return;
    const isGratuito = cliente.fidelidadeAtual >= 10;
    const ok = await criarAgendamento({
      clienteId: cliente.id,
      clienteNome: cliente.nome,
      clienteTelefone: cliente.telefone,
      funcionarioId: funcSelecionado.id,
      funcionarioNome: funcSelecionado.nome,
      servicoId: servicoSelecionado.id,
      servicoNome: servicoSelecionado.nome,
      data,
      horario,
      preco: isGratuito ? 0 : servicoSelecionado.preco,
      gratuito: isGratuito,
    });
    if (ok) setStep(6); // Success
    else alert('Erro ao agendar. Tente novamente.');
  };

  if (step === 6) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <CheckCircle size={64} color="var(--secondary)" style={{ marginBottom: 16 }} />
        <h2 style={{ marginBottom: 8, fontSize: 24 }}>Agendamento Confirmado!</h2>
        <p style={{ color: '#aaa', fontSize: 15, marginBottom: 32 }}>
          {servicoSelecionado?.nome} com {funcSelecionado?.nome}<br />
          {data} às {horario}
        </p>
        <button className="btn-primary" onClick={() => { setTab('dashboard'); setPage('cliente-dashboard'); }}>
          Voltar ao Início
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Progress */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        {['Serviço', 'Barbeiro', 'Data', 'Horário', 'Confirmar'].map((label, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ height: 4, background: i + 1 <= step ? 'var(--secondary)' : 'var(--bg3)', borderRadius: 2, marginBottom: 4 }} />
            <span style={{ fontSize: 10, color: i + 1 <= step ? 'var(--secondary)' : '#666' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Serviço */}
      {step === 1 && (
        <div>
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Escolha o Serviço</h3>
          <div style={{ display: 'grid', gap: 10 }}>
            {servicos.map(s => (
              <button key={s.id} onClick={() => { setServicoId(s.id); setStep(2); }}
                className="card" style={{
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  border: servicoId === s.id ? '1px solid var(--secondary)' : undefined,
                  fontFamily: 'Montserrat'
                }}>
                <div>
                  <h4 style={{ fontSize: 15, color: 'var(--text)' }}>{s.nome}</h4>
                  <p style={{ color: '#888', fontSize: 12 }}>{s.descricao} • {s.duracao} min</p>
                </div>
                <span style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: 18 }}>R$ {s.preco}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Barbeiro */}
      {step === 2 && (
        <div>
          <button onClick={() => setStep(1)} className="btn-ghost btn-sm" style={{ marginBottom: 16, padding: '8px 0' }}>
            <ChevronLeft size={14} style={{ display: 'inline' }} /> Voltar
          </button>
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Escolha o Barbeiro</h3>
          <div style={{ display: 'grid', gap: 10 }}>
            {funcionarios.map(f => (
              <button key={f.id} onClick={() => { setFuncId(f.id); setStep(3); }}
                className="card" style={{ cursor: 'pointer', textAlign: 'left', width: '100%', display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'Montserrat' }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', fontWeight: 700, fontSize: 20, border: '2px solid var(--secondary)', flexShrink: 0 }}>
                  {f.nome.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 15, color: 'var(--text)' }}>{f.nome}</h4>
                  <p style={{ color: 'var(--accent)', fontSize: 12 }}>{f.especialidade}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Star size={12} fill="var(--secondary)" color="var(--secondary)" />
                  <span style={{ color: 'var(--secondary)', fontWeight: 600, fontSize: 14 }}>{f.avaliacao}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Data */}
      {step === 3 && (
        <div>
          <button onClick={() => setStep(2)} className="btn-ghost btn-sm" style={{ marginBottom: 16, padding: '8px 0' }}>
            <ChevronLeft size={14} style={{ display: 'inline' }} /> Voltar
          </button>
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Escolha a Data</h3>
          {/* Date picker: next 30 days, show barber working days only */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 8 }}>
            {Array.from({ length: 30 }).map((_, idx) => {
              const d = new Date();
              d.setDate(d.getDate() + idx);
              const iso = d.toISOString().split('T')[0];
              const weekday = d.getDay(); // 0-6
              const isPast = iso < hoje;
              const enabled = !isPast && funcSelecionado ? funcSelecionado.diasTrabalho.includes(weekday) : !isPast;
              return (
                <button key={iso} onClick={() => { if (!enabled) return; setData(iso); setHorario(''); setStep(4); }}
                  style={{
                    padding: 12, borderRadius: 10, cursor: enabled ? 'pointer' : 'not-allowed', textAlign: 'center',
                    background: data === iso ? 'var(--secondary)' : enabled ? 'var(--bg2)' : 'var(--bg3)',
                    color: data === iso ? 'var(--text2)' : enabled ? 'var(--text)' : '#999', border: '1px solid var(--border)',
                    fontFamily: 'Montserrat'
                  }} disabled={!enabled}>
                  <div style={{ fontSize: 12, color: enabled ? '#666' : '#aaa' }}>{['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][weekday]}</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{d.getDate()}</div>
                </button>
              );
            })}
          </div>
          {funcSelecionado && (
            <div style={{ marginTop: 16, color: '#888', fontSize: 13 }}>
              <p>Dias de trabalho de {funcSelecionado.nome}:</p>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d, i) => (
                  <span key={i} style={{
                    padding: '6px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                    background: funcSelecionado.diasTrabalho.includes(i) ? 'rgba(217,174,95,0.15)' : 'var(--bg3)',
                    color: funcSelecionado.diasTrabalho.includes(i) ? 'var(--secondary)' : '#555'
                  }}>{d}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Horário */}
      {step === 4 && (
        <div>
          <button onClick={() => setStep(3)} className="btn-ghost btn-sm" style={{ marginBottom: 16, padding: '8px 0' }}>
            <ChevronLeft size={14} style={{ display: 'inline' }} /> Voltar
          </button>
          <h3 style={{ fontSize: 18, marginBottom: 8 }}>Escolha o Horário</h3>
          <p style={{ color: '#888', fontSize: 13, marginBottom: 16 }}>{data} • {funcSelecionado?.nome}</p>
          {horarios.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <Clock size={32} color="#666" style={{ marginBottom: 8 }} />
              <p style={{ color: '#888' }}>Nenhum horário disponível nesta data.</p>
              <button onClick={() => setStep(3)} className="btn-outline btn-sm" style={{ marginTop: 16 }}>
                Escolher outra data
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 8 }}>
              {horarios.map(h => (
                <button key={h} onClick={() => { setHorario(h); setStep(5); }}
                  style={{
                    padding: '12px 8px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600,
                    background: horario === h ? 'var(--secondary)' : 'var(--bg3)',
                    color: horario === h ? 'var(--text2)' : 'var(--text)',
                    border: horario === h ? 'none' : '1px solid var(--border)',
                    transition: 'all 0.2s', fontFamily: 'Montserrat'
                  }}>
                  {h}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 5: Confirmar */}
      {step === 5 && (
        <div>
          <button onClick={() => setStep(4)} className="btn-ghost btn-sm" style={{ marginBottom: 16, padding: '8px 0' }}>
            <ChevronLeft size={14} style={{ display: 'inline' }} /> Voltar
          </button>
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Confirmar Agendamento</h3>
          <div className="card-gold" style={{ marginBottom: 20 }}>
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: 14 }}>Serviço</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{servicoSelecionado?.nome}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: 14 }}>Barbeiro</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{funcSelecionado?.nome}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: 14 }}>Data</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{data}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: 14 }}>Horário</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{horario}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: 14 }}>Valor</span>
                <span style={{ fontWeight: 700, fontSize: 20, color: cliente.fidelidadeAtual >= 10 ? 'var(--success)' : 'var(--secondary)' }}>
                  {cliente.fidelidadeAtual >= 10 ? 'GRÁTIS 🎉' : `R$ ${servicoSelecionado?.preco}`}
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888' }}>
              <span>Cliente</span><span style={{ color: 'var(--text)' }}>{cliente.nome}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888' }}>
              <span>Telefone</span><span style={{ color: 'var(--text)' }}>{cliente.telefone}</span>
            </div>
          </div>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 16, padding: 16, marginTop: 24 }} onClick={confirmar}>
            <CheckCircle size={20} /> Confirmar Agendamento
          </button>
        </div>
      )}
    </div>
  );
}

// ===== AGENDAMENTOS (FUTUROS) =====
function AgendamentosPage({ futuros }: { futuros: any[] }) {
  const { cancelarAgendamento, remarcarAgendamento, funcionarios, getHorariosDisponiveis } = useApp();
  const [remarcar, setRemarcar] = useState<string | null>(null);
  const [novaData, setNovaData] = useState('');
  const [novoHorario, setNovoHorario] = useState('');

  const handleRemarcar = async (id: string) => {
    if (novaData && novoHorario) {
      const ok = await remarcarAgendamento(id, novaData, novoHorario);
      if (ok) { setRemarcar(null); setNovaData(''); setNovoHorario(''); }
      else alert('Erro ao remarcar agendamento');
    }
  };

  const agRemarcar = futuros.find(a => a.id === remarcar);
  const func = agRemarcar ? funcionarios.find(f => f.id === agRemarcar.funcionarioId) : null;
  const horariosDisp = func && novaData ? getHorariosDisponiveis(func.id, novaData) : [];
  const hoje = new Date().toISOString().split('T')[0];

  return (
    <div className="animate-fade-in">
      <h3 style={{ fontSize: 18, marginBottom: 16 }}>Meus Agendamentos</h3>
      {futuros.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <Calendar size={32} color="#666" style={{ marginBottom: 8 }} />
          <p style={{ color: '#888' }}>Nenhum agendamento futuro.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {futuros.map(a => (
            <div key={a.id} className="card-gold">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h4 style={{ fontSize: 16 }}>{a.servicoNome}</h4>
                  <p style={{ color: 'var(--accent)', fontSize: 13 }}>{a.funcionarioNome}</p>
                </div>
                <span className="badge badge-gold">Agendado</span>
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 14, color: '#ccc' }}>
                <span><Calendar size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {a.data}</span>
                <span><Clock size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {a.horario}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-outline btn-sm" onClick={() => { setRemarcar(a.id); setNovaData(''); setNovoHorario(''); }}>
                  <Edit size={14} style={{ display: 'inline' }} /> Remarcar
                </button>
                <button className="btn-danger" onClick={async () => { const ok = await cancelarAgendamento(a.id); if (!ok) alert('Erro ao cancelar'); }}>
                  <XCircle size={14} style={{ display: 'inline' }} /> Cancelar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de remarcação */}
      {remarcar && (
        <div className="modal-overlay" onClick={() => setRemarcar(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18 }}>Remarcar Agendamento</h3>
              <button onClick={() => setRemarcar(null)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: '#888', marginBottom: 6, display: 'block' }}>Nova Data</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 8 }}>
                  {Array.from({ length: 30 }).map((_, idx) => {
                    const d = new Date(); d.setDate(d.getDate() + idx);
                    const iso = d.toISOString().split('T')[0];
                    const weekday = d.getDay();
                    const isPast = iso < hoje;
                    const enabled = !isPast && func ? func.diasTrabalho.includes(weekday) : !isPast;
                    return (
                      <button key={iso} onClick={() => { if (!enabled) return; setNovaData(iso); setNovoHorario(''); }}
                        style={{
                          padding: 10, borderRadius: 8, cursor: enabled ? 'pointer' : 'not-allowed', textAlign: 'center',
                          background: novaData === iso ? 'var(--secondary)' : enabled ? 'var(--bg2)' : 'var(--bg3)',
                          color: novaData === iso ? 'var(--text2)' : enabled ? 'var(--text)' : '#999', border: '1px solid var(--border)'
                        }} disabled={!enabled}>
                        <div style={{ fontSize: 12 }}>{['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][weekday]}</div>
                        <div style={{ fontWeight: 700 }}>{d.getDate()}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
              {novaData && (
                <div>
                  <label style={{ fontSize: 13, color: '#888', marginBottom: 6, display: 'block' }}>Horários Disponíveis</label>
                  {horariosDisp.length === 0 ? (
                    <p style={{ color: '#888', fontSize: 13 }}>Nenhum horário disponível nesta data.</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                      {horariosDisp.map(h => (
                        <button key={h} onClick={() => setNovoHorario(h)}
                          style={{
                            padding: '10px 8px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                            background: novoHorario === h ? 'var(--secondary)' : 'var(--bg3)',
                            color: novoHorario === h ? 'var(--text2)' : 'var(--text)',
                            border: novoHorario === h ? 'none' : '1px solid var(--border)',
                            fontFamily: 'Montserrat'
                          }}>{h}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <button className="btn-primary" style={{ justifyContent: 'center' }} disabled={!novoHorario}
                onClick={() => handleRemarcar(remarcar)}>
                Confirmar Remarcação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== HISTÓRICO =====
function HistoricoPage({ historico }: { historico: any[] }) {
  const { avaliarAgendamento } = useApp();
  const [avaliar, setAvaliar] = useState<string | null>(null);
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');

  const handleAvaliar = async () => {
    if (avaliar && comentario) {
      const ok = await avaliarAgendamento(avaliar, nota, comentario);
      if (ok) { setAvaliar(null); setComentario(''); setNota(5); }
      else alert('Erro ao enviar avaliação');
    }
  };

  return (
    <div className="animate-fade-in">
      <h3 style={{ fontSize: 18, marginBottom: 16 }}>Histórico de Agendamentos</h3>
      {historico.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <History size={32} color="#666" style={{ marginBottom: 8 }} />
          <p style={{ color: '#888' }}>Nenhum histórico ainda.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {historico.map(a => (
            <div key={a.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <h4 style={{ fontSize: 15 }}>{a.servicoNome}</h4>
                  <p style={{ color: '#888', fontSize: 12 }}>{a.data} às {a.horario} • {a.funcionarioNome}</p>
                </div>
                <span className={`badge ${a.status === 'CONCLUIDO' ? 'badge-green' : 'badge-red'}`}>
                  {a.status === 'CONCLUIDO' ? 'Concluído' : 'Cancelado'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: a.gratuito ? 'var(--success)' : 'var(--secondary)', fontWeight: 600, fontSize: 14 }}>
                  {a.gratuito ? 'GRÁTIS' : `R$ ${a.preco}`}
                </span>
                {a.status === 'CONCLUIDO' && !a.avaliacao && (
                  <button className="btn-outline btn-sm" onClick={() => setAvaliar(a.id)}>
                    <Star size={12} style={{ display: 'inline' }} /> Avaliar
                  </button>
                )}
                {a.avaliacao && (
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= a.avaliacao ? 'var(--secondary)' : 'transparent'} color={s <= a.avaliacao ? 'var(--secondary)' : '#555'} />)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {avaliar && (
        <div className="modal-overlay" onClick={() => setAvaliar(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>Avaliar Atendimento</h3>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, justifyContent: 'center' }}>
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={28} style={{ cursor: 'pointer' }} fill={s <= nota ? 'var(--secondary)' : 'transparent'}
                  color={s <= nota ? 'var(--secondary)' : '#555'} onClick={() => setNota(s)} />
              ))}
            </div>
            <textarea className="input-field" placeholder="Seu comentário..." rows={3} value={comentario}
              onChange={e => setComentario(e.target.value)} style={{ marginBottom: 16, resize: 'vertical' }} />
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleAvaliar}>
              Enviar Avaliação
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== FIDELIDADE =====
function FidelidadePage({ cliente }: { cliente: Cliente }) {
  return (
    <div className="animate-fade-in">
      <h3 style={{ fontSize: 18, marginBottom: 24 }}>Programa de Fidelidade</h3>
      <div className="card-gold" style={{ textAlign: 'center', padding: 40, marginBottom: 24 }}>
        <Award size={48} color="var(--secondary)" style={{ marginBottom: 16 }} />
        <h2 style={{ fontSize: 48, color: 'var(--secondary)', marginBottom: 4 }}>{cliente.fidelidadeAtual}/10</h2>
        <p style={{ color: '#aaa', fontSize: 15 }}>
          {cliente.fidelidadeAtual >= 10 ? '🎉 Você tem um corte GRÁTIS! Agende agora!' : `Faltam ${10 - cliente.fidelidadeAtual} cortes para o grátis`}
        </p>
      </div>

      <div className="progress-bar" style={{ height: 12, marginBottom: 24 }}>
        <div className="progress-fill" style={{ width: `${(cliente.fidelidadeAtual / 10) * 100}%` }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
        {Array.from({ length: 11 }, (_, i) => (
          <div key={i} style={{
            width: 48, height: 48, borderRadius: 10,
            background: i < cliente.fidelidadeAtual ? 'var(--secondary)' : i === 10 ? 'var(--primary)' : 'var(--bg3)',
            border: i === 10 ? '2px solid var(--secondary)' : '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700,
            color: i < cliente.fidelidadeAtual ? 'var(--text2)' : i === 10 ? 'var(--secondary)' : '#666',
          }}>
            {i === 10 ? '🎉' : i < cliente.fidelidadeAtual ? <CheckCircle size={16} /> : i + 1}
          </div>
        ))}
      </div>

      <div className="card">
        <h4 style={{ fontSize: 15, marginBottom: 12 }}>Como funciona?</h4>
        <div style={{ display: 'grid', gap: 12 }}>
          <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6 }}>
            ✂️ A cada corte realizado, você acumula <strong style={{ color: 'var(--secondary)' }}>1 ponto</strong>.
          </p>
          <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6 }}>
            🎯 Ao completar <strong style={{ color: 'var(--secondary)' }}>10 pontos</strong>, seu próximo corte é totalmente grátis!
          </p>
          <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6 }}>
            🔄 Após usar o corte grátis, o contador reinicia.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h4 style={{ fontSize: 15, marginBottom: 8 }}>Estatísticas</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
          <span style={{ color: '#888' }}>Total de cortes</span>
          <span style={{ fontWeight: 600 }}>{cliente.cortesRealizados}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginTop: 8 }}>
          <span style={{ color: '#888' }}>Cortes grátis resgatados</span>
          <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>{Math.floor(cliente.cortesRealizados / 11)}</span>
        </div>
      </div>
    </div>
  );
}

// ===== PERFIL =====
function PerfilPage({ cliente }: { cliente: Cliente }) {
  return (
    <div className="animate-fade-in">
      <h3 style={{ fontSize: 18, marginBottom: 24 }}>Meu Perfil</h3>
      <div className="card-gold" style={{ textAlign: 'center', padding: 32, marginBottom: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, border: '3px solid var(--secondary)', fontSize: 32, fontFamily: 'League Spartan', fontWeight: 700, color: 'var(--secondary)' }}>
          {cliente.nome.charAt(0)}
        </div>
        <h2 style={{ fontSize: 22, marginBottom: 4 }}>{cliente.nome}</h2>
        <span className="badge badge-gold">Cliente</span>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, color: '#888', marginBottom: 4, display: 'block' }}>Email</label>
            <p style={{ fontSize: 14 }}>{cliente.email}</p>
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#888', marginBottom: 4, display: 'block' }}>Telefone</label>
            <p style={{ fontSize: 14 }}>{cliente.telefone}</p>
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#888', marginBottom: 4, display: 'block' }}>Cortes Realizados</label>
            <p style={{ fontSize: 14 }}>{cliente.cortesRealizados}</p>
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#888', marginBottom: 4, display: 'block' }}>Fidelidade</label>
            <div className="progress-bar" style={{ marginTop: 4 }}>
              <div className="progress-fill" style={{ width: `${(cliente.fidelidadeAtual / 10) * 100}%` }} />
            </div>
            <p style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 4 }}>{cliente.fidelidadeAtual}/10</p>
          </div>
        </div>
      </div>
    </div>
  );
}
