import { useState } from 'react';
import { useApp } from '../store';
import { Mail, Lock, User, Phone, ArrowLeft, Briefcase } from 'lucide-react';

export default function LoginPage() {
  const { setPage, login, register } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [tipoLogin, setTipoLogin] = useState<'CLIENTE' | 'FUNCIONARIO'>('CLIENTE');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = await login(email, senha, tipoLogin);
    if (ok) {
      setPage(tipoLogin === 'CLIENTE' ? 'cliente-dashboard' : 'funcionario-dashboard');
    } else {
      setError(tipoLogin === 'FUNCIONARIO' 
        ? 'Credenciais inválidas. Verifique email e senha.' 
        : 'Credenciais inválidas. Verifique email e senha.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!nome || !email || !telefone || !senha) {
      setError('Preencha todos os campos.');
      return;
    }
    
    try {
      const ok = await register(nome, email, telefone, senha);
      if (ok) {
        setPage('cliente-dashboard');
      } else {
        setError('Erro ao criar conta. Email pode estar já cadastrado ou houver erro na requisição.');
      }
    } catch (err) {
      console.error('Register handler error:', err);
      setError('Erro ao criar conta. Tente novamente.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'var(--bg)' }}>
      <div className="animate-fade-in" style={{ maxWidth: 440, width: '100%' }}>
        {/* Back button */}
        <button onClick={() => setPage('landing')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 14, marginBottom: 24 }}>
          <ArrowLeft size={16} /> Voltar
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, color: 'var(--secondary)', fontFamily: 'League Spartan' }}>BARBER CALL</h1>
          <p style={{ color: 'var(--accent)', fontSize: 14 }}>Acesse sua conta</p>
        </div>

        {/* Card */}
        <div className="card-gold" style={{ padding: 32 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
            <button className={`tab ${tab === 'login' ? 'tab-active' : ''}`} style={{ flex: 1 }} onClick={() => { setTab('login'); setError(''); }}>
              Entrar
            </button>
            <button className={`tab ${tab === 'register' ? 'tab-active' : ''}`} style={{ flex: 1 }} onClick={() => { setTab('register'); setError(''); }}>
              Cadastrar
            </button>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#ef4444', fontSize: 13 }}>
              {error}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Tipo toggle */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => setTipoLogin('CLIENTE')}
                  style={{
                    flex: 1, padding: '10px 16px', borderRadius: 10, border: '1px solid',
                    borderColor: tipoLogin === 'CLIENTE' ? 'var(--secondary)' : 'var(--border)',
                    background: tipoLogin === 'CLIENTE' ? 'rgba(217,174,95,0.1)' : 'transparent',
                    color: tipoLogin === 'CLIENTE' ? 'var(--secondary)' : '#888',
                    cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    fontFamily: 'Montserrat'
                  }}>
                  <User size={14} /> Cliente
                </button>
                <button type="button" onClick={() => setTipoLogin('FUNCIONARIO')}
                  style={{
                    flex: 1, padding: '10px 16px', borderRadius: 10, border: '1px solid',
                    borderColor: tipoLogin === 'FUNCIONARIO' ? 'var(--secondary)' : 'var(--border)',
                    background: tipoLogin === 'FUNCIONARIO' ? 'rgba(217,174,95,0.1)' : 'transparent',
                    color: tipoLogin === 'FUNCIONARIO' ? 'var(--secondary)' : '#888',
                    cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    fontFamily: 'Montserrat'
                  }}>
                  <Briefcase size={14} /> Funcionário
                </button>
              </div>

              <div className="input-with-icon">
                <Mail />
                <input className="input-field" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="input-with-icon">
                <Lock />
                <input className="input-field" type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 15 }}>
                Entrar &gt;
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-with-icon">
                <User />
                <input className="input-field" type="text" placeholder="Nome Completo" value={nome} onChange={e => setNome(e.target.value)} required />
              </div>
              <div className="input-with-icon">
                <Phone />
                <input className="input-field" type="tel" placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} required />
              </div>
              <div className="input-with-icon">
                <Mail />
                <input className="input-field" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="input-with-icon">
                <Lock />
                <input className="input-field" type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 15 }}>
                Criar Conta &gt;
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
