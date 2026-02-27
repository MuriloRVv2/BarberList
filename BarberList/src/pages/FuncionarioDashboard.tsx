import { useState } from 'react';
import { useApp } from '../store';
import type { Funcionario } from '../types';
import {
  Home, Calendar, Settings, Star, User, LogOut, Clock, CheckCircle, Ban,
  Plus, Trash2, Save, X
} from 'lucide-react';

type Tab = 'dashboard' | 'agenda' | 'config' | 'avaliacoes' | 'perfil';

export default function FuncionarioDashboard() {
  const app = useApp();
  const func = app.user as Funcionario;
  const [tab, setTab] = useState<Tab>('dashboard');

  const menuItems: { key: Tab; icon: React.ReactNode; label: string }[] = [
    { key: 'dashboard', icon: <Home size={18} />, label: 'Início' },
    { key: 'agenda', icon: <Calendar size={18} />, label: 'Agenda' },
    { key: 'config', icon: <Settings size={18} />, label: 'Horários' },
    { key: 'avaliacoes', icon: <Star size={18} />, label: 'Avaliações' },
    { key: 'perfil', icon: <User size={18} />, label: 'Perfil' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header style={{ background: 'var(--primary)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 style={{ color: 'var(--secondary)', fontFamily: 'League Spartan', fontSize: 20 }}>BARBER CALL</h3>
          <span className="badge badge-blue">Funcionário</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#ccc', fontSize: 13 }}>{func.nome}</span>
          <button onClick={app.logout} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

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

      <main style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
        {tab === 'dashboard' && <FuncHome func={func} />}
        {tab === 'agenda' && <AgendaPage func={func} />}
        {tab === 'config' && <ConfigPage func={func} />}
        {tab === 'avaliacoes' && <AvaliacoesPage func={func} />}
        {tab === 'perfil' && <FuncPerfilPage func={func} />}
      </main>
    </div>
  );
}

// ===== DASHBOARD =====
function FuncHome({ func }: { func: Funcionario }) {
  const { agendamentos } = useApp();
  const hoje = new Date().toISOString().split('T')[0];
  const agHoje = agendamentos.filter(a => a.funcionarioId === func.id && a.data === hoje);
  const agendados = agHoje.filter(a => a.status === 'AGENDADO');
  const concluidos = agHoje.filter(a => a.status === 'CONCLUIDO');

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="card-gold" style={{ textAlign: 'center', padding: 32 }}>
        <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, border: '3px solid var(--secondary)', fontSize: 28, fontFamily: 'League Spartan', fontWeight: 700, color: 'var(--secondary)' }}>
          {func.nome.charAt(0)}
        </div>
        <h2 style={{ fontSize: 22, marginBottom: 4 }}>Olá, {func.nome.split(' ')[0]}!</h2>
        <p style={{ color: 'var(--accent)', fontSize: 13 }}>{func.especialidade}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <Calendar size={24} color="var(--secondary)" style={{ marginBottom: 8 }} />
          <h3 style={{ fontSize: 28, color: 'var(--secondary)' }}>{agendados.length}</h3>
          <p style={{ color: '#888', fontSize: 12 }}>Agendados Hoje</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <CheckCircle size={24} color="var(--success)" style={{ marginBottom: 8 }} />
          <h3 style={{ fontSize: 28, color: 'var(--success)' }}>{concluidos.length}</h3>
          <p style={{ color: '#888', fontSize: 12 }}>Concluídos</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <Star size={24} color="var(--secondary)" style={{ marginBottom: 8 }} />
          <h3 style={{ fontSize: 28, color: 'var(--secondary)' }}>{func.avaliacao}</h3>
          <p style={{ color: '#888', fontSize: 12 }}>{func.totalAvaliacoes} avaliações</p>
        </div>
      </div>

      {agendados.length > 0 && (
        <div>
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Próximos Atendimentos</h3>
          {agendados.map(a => (
            <div key={a.id} className="card" style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: 14 }}>{a.clienteNome}</h4>
                <p style={{ color: '#888', fontSize: 12 }}>{a.servicoNome} • {a.horario}</p>
              </div>
              <span className="badge badge-gold">{a.horario}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== AGENDA =====
function AgendaPage({ func }: { func: Funcionario }) {
  const { agendamentos, concluirAgendamento } = useApp();
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);

  const agDia = agendamentos.filter(a => a.funcionarioId === func.id && a.data === data)
    .sort((a, b) => a.horario.localeCompare(b.horario));

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 18 }}>Agenda Diária</h3>
        <input type="date" className="input-field" value={data} onChange={e => setData(e.target.value)}
          style={{ width: 'auto', padding: '8px 14px', fontSize: 14 }} />
      </div>

      {agDia.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <Calendar size={32} color="#666" style={{ marginBottom: 8 }} />
          <p style={{ color: '#888' }}>Nenhum agendamento para este dia.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {agDia.map(a => (
            <div key={a.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ textAlign: 'center', minWidth: 50 }}>
                  <Clock size={14} color="var(--secondary)" />
                  <p style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: 15 }}>{a.horario}</p>
                </div>
                <div>
                  <h4 style={{ fontSize: 14 }}>{a.clienteNome}</h4>
                  <p style={{ color: '#888', fontSize: 12 }}>{a.servicoNome} • {a.clienteTelefone}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`badge ${a.status === 'AGENDADO' ? 'badge-gold' : a.status === 'CONCLUIDO' ? 'badge-green' : 'badge-red'}`}>
                  {a.status === 'AGENDADO' ? 'Agendado' : a.status === 'CONCLUIDO' ? 'Concluído' : 'Cancelado'}
                </span>
                {a.status === 'AGENDADO' && (
                  <button onClick={async () => { const ok = await concluirAgendamento(a.id); if (!ok) alert('Erro ao concluir'); }} className="btn-primary btn-sm">
                    <CheckCircle size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ marginTop: 20 }}>
        <h4 style={{ fontSize: 14, marginBottom: 8 }}>Resumo do Dia</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, textAlign: 'center' }}>
          <div>
            <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--secondary)' }}>{agDia.filter(a => a.status === 'AGENDADO').length}</p>
            <p style={{ color: '#888', fontSize: 11 }}>Agendados</p>
          </div>
          <div>
            <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--success)' }}>{agDia.filter(a => a.status === 'CONCLUIDO').length}</p>
            <p style={{ color: '#888', fontSize: 11 }}>Concluídos</p>
          </div>
          <div>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#ef4444' }}>{agDia.filter(a => a.status === 'CANCELADO').length}</p>
            <p style={{ color: '#888', fontSize: 11 }}>Cancelados</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== CONFIG HORÁRIOS =====
function ConfigPage({ func }: { func: Funcionario }) {
  const { updateFuncionario, adicionarBloqueio, removerBloqueio } = useApp();
  const [editMode, setEditMode] = useState(false);
  const [dias, setDias] = useState(func.diasTrabalho);
  const [hInicio, setHInicio] = useState(func.horarioInicio);
  const [hFim, setHFim] = useState(func.horarioFim);
  const [almInicio, setAlmInicio] = useState(func.horarioAlmocoInicio);
  const [almFim, setAlmFim] = useState(func.horarioAlmocoFim);
  const [bloqData, setBloqData] = useState('');
  const [bloqHorario, setBloqHorario] = useState('');
  const [bloqMotivo, setBloqMotivo] = useState('');

  const salvar = () => {
    updateFuncionario({ ...func, diasTrabalho: dias, horarioInicio: hInicio, horarioFim: hFim, horarioAlmocoInicio: almInicio, horarioAlmocoFim: almFim });
    setEditMode(false);
  };

  const addBloqueio = () => {
    if (bloqData && bloqHorario) {
      adicionarBloqueio(func.id, bloqData, bloqHorario, bloqMotivo || 'Indisponível');
      setBloqData(''); setBloqHorario(''); setBloqMotivo('');
    }
  };

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: 18 }}>Configurar Horários</h3>
        {editMode ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-primary btn-sm" onClick={salvar}><Save size={14} /> Salvar</button>
            <button className="btn-ghost btn-sm" onClick={() => setEditMode(false)}><X size={14} /></button>
          </div>
        ) : (
          <button className="btn-outline btn-sm" onClick={() => setEditMode(true)}>Editar</button>
        )}
      </div>

      {/* Dias de trabalho */}
      <div className="card">
        <h4 style={{ fontSize: 14, marginBottom: 12 }}>Dias de Trabalho</h4>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {diasSemana.map((d, i) => (
            <button key={i} onClick={() => {
              if (!editMode) return;
              setDias(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
            }} style={{
              padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: editMode ? 'pointer' : 'default',
              background: dias.includes(i) ? 'var(--secondary)' : 'var(--bg3)',
              color: dias.includes(i) ? 'var(--text2)' : '#888',
              border: 'none', fontFamily: 'Montserrat', transition: 'all 0.2s'
            }}>{d}</button>
          ))}
        </div>
      </div>

      {/* Horários */}
      <div className="card">
        <h4 style={{ fontSize: 14, marginBottom: 12 }}>Horário de Trabalho</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: '#888', marginBottom: 4, display: 'block' }}>Início</label>
            <input type="time" className="input-field" value={hInicio} onChange={e => setHInicio(e.target.value)} disabled={!editMode} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#888', marginBottom: 4, display: 'block' }}>Fim</label>
            <input type="time" className="input-field" value={hFim} onChange={e => setHFim(e.target.value)} disabled={!editMode} />
          </div>
        </div>
      </div>

      <div className="card">
        <h4 style={{ fontSize: 14, marginBottom: 12 }}>Horário de Almoço</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: '#888', marginBottom: 4, display: 'block' }}>Início</label>
            <input type="time" className="input-field" value={almInicio} onChange={e => setAlmInicio(e.target.value)} disabled={!editMode} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#888', marginBottom: 4, display: 'block' }}>Fim</label>
            <input type="time" className="input-field" value={almFim} onChange={e => setAlmFim(e.target.value)} disabled={!editMode} />
          </div>
        </div>
      </div>

      {/* Bloqueios */}
      <div className="card">
        <h4 style={{ fontSize: 14, marginBottom: 12 }}>
          <Ban size={14} style={{ display: 'inline', verticalAlign: 'middle', color: 'var(--danger)' }} /> Bloquear Horários
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <input type="date" className="input-field" value={bloqData} onChange={e => setBloqData(e.target.value)} placeholder="Data" />
          <input type="time" className="input-field" value={bloqHorario} onChange={e => setBloqHorario(e.target.value)} placeholder="Horário" />
        </div>
        <input className="input-field" value={bloqMotivo} onChange={e => setBloqMotivo(e.target.value)} placeholder="Motivo (opcional)" style={{ marginBottom: 12 }} />
        <button className="btn-outline btn-sm" onClick={addBloqueio} style={{ width: '100%', justifyContent: 'center' }}>
          <Plus size={14} /> Adicionar Bloqueio
        </button>

        {func.bloqueios.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Bloqueios ativos:</p>
            {func.bloqueios.map(b => (
              <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <span style={{ fontSize: 13 }}>{b.data} - {b.horario}</span>
                  <span style={{ color: '#888', fontSize: 12, marginLeft: 8 }}>{b.motivo}</span>
                </div>
                <button onClick={() => removerBloqueio(func.id, b.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== AVALIAÇÕES =====
function AvaliacoesPage({ func }: { func: Funcionario }) {
  const { avaliacoes } = useApp();
  const minhas = avaliacoes.filter(a => a.funcionarioNome === func.nome);
  
  const distNotas = [5,4,3,2,1].map(n => ({
    nota: n,
    count: minhas.filter(a => a.nota === n).length,
    pct: minhas.length > 0 ? (minhas.filter(a => a.nota === n).length / minhas.length) * 100 : 0
  }));

  return (
    <div className="animate-fade-in">
      <h3 style={{ fontSize: 18, marginBottom: 24 }}>Avaliações Recebidas</h3>

      <div className="card-gold" style={{ textAlign: 'center', padding: 32, marginBottom: 24 }}>
        <h2 style={{ fontSize: 48, color: 'var(--secondary)', marginBottom: 4 }}>{func.avaliacao}</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
          {[1,2,3,4,5].map(s => <Star key={s} size={18} fill={s <= Math.round(func.avaliacao) ? 'var(--secondary)' : 'transparent'} color={s <= Math.round(func.avaliacao) ? 'var(--secondary)' : '#555'} />)}
        </div>
        <p style={{ color: '#888', fontSize: 13 }}>{func.totalAvaliacoes} avaliações</p>
      </div>

      {/* Distribuição */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 14, marginBottom: 16 }}>Distribuição</h4>
        {distNotas.map(d => (
          <div key={d.nota} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 13, width: 20, color: '#888' }}>{d.nota}</span>
            <Star size={12} fill="var(--secondary)" color="var(--secondary)" />
            <div style={{ flex: 1, height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${d.pct}%`, background: 'var(--secondary)', borderRadius: 4, transition: 'width 0.5s' }} />
            </div>
            <span style={{ fontSize: 12, color: '#888', width: 30, textAlign: 'right' }}>{d.count}</span>
          </div>
        ))}
      </div>

      {/* Lista */}
      <div style={{ display: 'grid', gap: 12 }}>
        {minhas.map(a => (
          <div key={a.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h4 style={{ fontSize: 14 }}>{a.clienteNome}</h4>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= a.nota ? 'var(--secondary)' : 'transparent'} color={s <= a.nota ? 'var(--secondary)' : '#555'} />)}
              </div>
            </div>
            <p style={{ color: '#ccc', fontSize: 13 }}>"{a.comentario}"</p>
            <p style={{ color: '#666', fontSize: 11, marginTop: 8 }}>{a.data}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== PERFIL FUNC =====
function FuncPerfilPage({ func }: { func: Funcionario }) {
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return (
    <div className="animate-fade-in">
      <h3 style={{ fontSize: 18, marginBottom: 24 }}>Meu Perfil</h3>
      <div className="card-gold" style={{ textAlign: 'center', padding: 32, marginBottom: 20 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, border: '3px solid var(--secondary)', fontSize: 32, fontFamily: 'League Spartan', fontWeight: 700, color: 'var(--secondary)' }}>
          {func.nome.charAt(0)}
        </div>
        <h2 style={{ fontSize: 22, marginBottom: 4 }}>{func.nome}</h2>
        <p style={{ color: 'var(--accent)', fontSize: 13, marginBottom: 8 }}>{func.especialidade}</p>
        <span className="badge badge-blue">Funcionário</span>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gap: 16 }}>
          <div><label style={{ fontSize: 12, color: '#888' }}>Email</label><p style={{ fontSize: 14 }}>{func.email}</p></div>
          <div><label style={{ fontSize: 12, color: '#888' }}>Telefone</label><p style={{ fontSize: 14 }}>{func.telefone}</p></div>
          <div><label style={{ fontSize: 12, color: '#888' }}>Avaliação</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= Math.round(func.avaliacao) ? 'var(--secondary)' : 'transparent'} color={s <= Math.round(func.avaliacao) ? 'var(--secondary)' : '#555'} />)}
              <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>{func.avaliacao}</span>
            </div>
          </div>
          <div><label style={{ fontSize: 12, color: '#888' }}>Horário</label><p style={{ fontSize: 14 }}>{func.horarioInicio} - {func.horarioFim}</p></div>
          <div><label style={{ fontSize: 12, color: '#888' }}>Almoço</label><p style={{ fontSize: 14 }}>{func.horarioAlmocoInicio} - {func.horarioAlmocoFim}</p></div>
          <div><label style={{ fontSize: 12, color: '#888' }}>Dias de Trabalho</label>
            <p style={{ fontSize: 14 }}>{func.diasTrabalho.map(d => diasSemana[d]).join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
