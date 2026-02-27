import { useState } from 'react';
import { useApp } from '../store';
import { 
  CalendarPlus, Star, MapPin, Clock, Phone, Mail, Scissors, Users, Award,
  ChevronRight, Instagram, MessageCircle
} from 'lucide-react';

export default function LandingPage() {
  const { setPage, funcionarios, avaliacoes, servicos, adicionarAvaliacao } = useApp();
  const [reviewNome, setReviewNome] = useState('');
  const [reviewNota, setReviewNota] = useState(5);
  const [reviewComentario, setReviewComentario] = useState('');

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewNome || !reviewComentario) return;
    adicionarAvaliacao({
      clienteNome: reviewNome,
      nota: reviewNota,
      comentario: reviewComentario,
      data: new Date().toISOString().split('T')[0],
    });
    setReviewNome(''); setReviewComentario(''); setReviewNota(5);
  };

  const mediaGeral = avaliacoes.length > 0 
    ? (avaliacoes.reduce((s, a) => s + a.nota, 0) / avaliacoes.length).toFixed(1) 
    : '5.0';

  return (
    <div>
      {/* Header */}
      <header className="flex items-center justify-between p-8 bg-white/1 backdrop-blur-md" style={{ alignItems: 'center' }}>
        <div className="flex items-center gap-2">
          <img src="/logo.webp" alt="Logo" className="h-10 w-auto" /> 
          <div>
            <h1 className="text-xl font-bold">BARBER CALL</h1>
            <p className="text-sm text-gray-500">Better Call Barber</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline" onClick={() => setPage('login')}>
            Login
          </button>
          <button className="btn-primary" onClick={() => setPage('register')}>
            Cadastrar
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="stripe-bg" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="animate-fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1, marginBottom: 16 }}>
            <span style={{ color: 'var(--secondary)', display: 'block' }}>BARBER</span>
            <span style={{ color: 'var(--text)' }}>CALL</span>
          </h1>
          <p style={{ color: 'var(--text)', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontWeight: 200, marginBottom: 40, opacity: 0.9 }}>
            Estilo, precisão e atitude. Agende seu horário e transforme seu visual.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary animate-pulse-gold" style={{ fontSize: 16, padding: '16px 36px' }}
              onClick={() => setPage('login')}>
              <CalendarPlus size={20} /> Agendar Horário
            </button>
            <a href="#sobre" className="btn-outline" style={{ fontSize: 16 }}>
              Conhecer Mais <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" style={{ padding: '5rem 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ color: 'var(--secondary)', fontWeight: 600, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 8 }}>
          SOBRE NÓS
        </p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 48 }}>
          A Arte do <span style={{ color: 'var(--secondary)' }}>Corte Perfeito</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {[
            { icon: <Scissors size={22} />, title: 'Precisão', desc: 'Atenção aos detalhes e qualidade no corte.' },
            { icon: <Users size={22} />, title: 'Experiência', desc: 'Profissionais qualificados e experientes para garantir o melhor resultado.' },
            { icon: <Award size={22} />, title: 'Fidelidade', desc: 'Programa de recompensa: a cada 10 cortes, você ganha um corte grátis!' },
          ].map((item, i) => (
            <div key={i} className="card-gold animate-fade-in" style={{ animationDelay: `${i * 0.15}s`, textAlign: 'center', padding: '40px 30px' }}>
              <div style={{ width: 48, height: 48, background: 'var(--secondary)', borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)', marginBottom: 16 }}>
                {item.icon}
              </div>
              <h3 style={{ marginBottom: 8, fontSize: 20 }}>{item.title}</h3>
              <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVIÇOS */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ color: 'var(--secondary)', fontWeight: 600, fontSize: 13, letterSpacing: 2, textAlign: 'center', marginBottom: 8 }}>
            SERVIÇOS
          </p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: 48 }}>
            Nossos <span style={{ color: 'var(--secondary)' }}>Serviços</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {servicos.map(s => (
              <div key={s.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: 15, marginBottom: 4 }}>{s.nome}</h4>
                  <p style={{ color: '#888', fontSize: 12 }}>{s.duracao} min</p>
                </div>
                <span style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: 18 }}>
                  R$ {s.preco}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPE */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ color: 'var(--secondary)', fontWeight: 600, fontSize: 13, letterSpacing: 2, textAlign: 'center', marginBottom: 8 }}>
          NOSSA EQUIPE
        </p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: 48 }}>
          Barbeiros <span style={{ color: 'var(--secondary)' }}>Profissionais</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {funcionarios.map((f, i) => (
            <div key={f.id} className="card animate-fade-in" style={{ animationDelay: `${i * 0.15}s`, textAlign: 'center', padding: '40px 24px' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, border: '2px solid var(--secondary)', fontSize: 28, fontFamily: 'League Spartan', fontWeight: 700, color: 'var(--secondary)' }}>
                {f.nome.charAt(0)}
              </div>
              <h3 style={{ fontSize: 20, marginBottom: 4 }}>{f.nome}</h3>
              <p style={{ color: 'var(--accent)', fontSize: 13, marginBottom: 12 }}>{f.especialidade}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} fill={s <= Math.round(f.avaliacao) ? 'var(--secondary)' : 'transparent'} color={s <= Math.round(f.avaliacao) ? 'var(--secondary)' : '#555'} />
                ))}
                <span style={{ color: 'var(--secondary)', fontWeight: 600, fontSize: 14, marginLeft: 4 }}>{f.avaliacao}</span>
              </div>
              <p style={{ color: '#666', fontSize: 12 }}>{f.totalAvaliacoes} avaliações</p>
            </div>
          ))}
        </div>
      </section>

      {/* FIDELIDADE */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <Award size={48} color="var(--secondary)" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginBottom: 16 }}>
            Programa de <span style={{ color: 'var(--secondary)' }}>Fidelidade</span>
          </h2>
          <p style={{ color: '#aaa', fontSize: 15, marginBottom: 32, lineHeight: 1.7 }}>
            A cada <strong style={{ color: 'var(--secondary)' }}>10 cortes</strong> realizados, 
            o <strong style={{ color: 'var(--secondary)' }}>11º é por nossa conta!</strong> Acompanhe seu progresso pelo app.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            {Array.from({ length: 11 }, (_, i) => (
              <div key={i} style={{
                width: 40, height: 40, borderRadius: 8,
                background: i < 7 ? 'var(--secondary)' : i === 10 ? 'var(--primary)' : 'var(--bg3)',
                border: i === 10 ? '2px solid var(--secondary)' : '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
                color: i < 7 ? 'var(--text2)' : i === 10 ? 'var(--secondary)' : '#666',
              }}>
                {i === 10 ? '🎉' : i + 1}
              </div>
            ))}
          </div>
          <p style={{ color: '#666', fontSize: 12, marginTop: 12 }}>Exemplo: 7/10 cortes realizados</p>
        </div>
      </section>

      {/* AVALIAÇÕES */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ color: 'var(--secondary)', fontWeight: 600, fontSize: 13, letterSpacing: 2, textAlign: 'center', marginBottom: 8 }}>
          AVALIAÇÕES
        </p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: 8 }}>
          O que dizem <span style={{ color: 'var(--secondary)' }}>nossos clientes</span>
        </h2>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {[1,2,3,4,5].map(s => <Star key={s} size={20} fill="var(--secondary)" color="var(--secondary)" />)}
            <span style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: 22, marginLeft: 8 }}>{mediaGeral}</span>
          </div>
          <p style={{ color: '#888', fontSize: 13 }}>{avaliacoes.length} avaliações</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 40 }}>
          {avaliacoes.slice(0, 6).map(a => (
            <div key={a.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', fontWeight: 700, fontSize: 16 }}>
                  {a.clienteNome.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontSize: 14 }}>{a.clienteNome}</h4>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= a.nota ? 'var(--secondary)' : 'transparent'} color={s <= a.nota ? 'var(--secondary)' : '#555'} />)}
                  </div>
                </div>
              </div>
              <p style={{ color: '#ccc', fontSize: 13, lineHeight: 1.6 }}>"{a.comentario}"</p>
              {a.funcionarioNome && <p style={{ color: '#666', fontSize: 11, marginTop: 8 }}>Barbeiro: {a.funcionarioNome}</p>}
            </div>
          ))}
        </div>

        {/* Form de avaliação */}
        <div className="card" style={{ maxWidth: 500, margin: '0 auto' }}>
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Deixe sua avaliação</h3>
          <form onSubmit={handleReview} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input className="input-field" placeholder="Seu nome" value={reviewNome} onChange={e => setReviewNome(e.target.value)} required />
            <div style={{ display: 'flex', gap: 4 }}>
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={24} style={{ cursor: 'pointer' }} fill={s <= reviewNota ? 'var(--secondary)' : 'transparent'} color={s <= reviewNota ? 'var(--secondary)' : '#555'}
                  onClick={() => setReviewNota(s)} />
              ))}
            </div>
            <textarea className="input-field" placeholder="Seu comentário..." rows={3} value={reviewComentario}
              onChange={e => setReviewComentario(e.target.value)} required 
              style={{ resize: 'vertical' }} />
            <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>Enviar Avaliação</button>
          </form>
        </div>
      </section>

      {/* LOCALIZAÇÃO + HORÁRIOS */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
          {/* Mapa */}
          <div>
            <p style={{ color: 'var(--secondary)', fontWeight: 600, fontSize: 13, letterSpacing: 2, marginBottom: 8 }}>
              LOCALIZAÇÃO
            </p>
            <h2 style={{ fontSize: 24, marginBottom: 20 }}>
              <MapPin size={20} style={{ display: 'inline', color: 'var(--secondary)' }} /> Onde Estamos
            </h2>
            <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 16 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1976!2d-46.6544!3d-23.5505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzAxLjgiUyA0NsKwMzknMTUuOCJX!5e0!3m2!1spt-BR!2sbr!4v1"
                width="100%" height="250" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                loading="lazy" title="Mapa"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ccc', fontSize: 14 }}>
                <MapPin size={16} color="var(--secondary)" /> Av. Paulista, 1000 - São Paulo, SP
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ccc', fontSize: 14 }}>
                <Phone size={16} color="var(--secondary)" /> (11) 3000-0000
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ccc', fontSize: 14 }}>
                <Mail size={16} color="var(--secondary)" /> contato@barbercall.com
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <a href="#" style={{ color: 'var(--secondary)' }}><Instagram size={20} /></a>
                <a href="#" style={{ color: 'var(--secondary)' }}><MessageCircle size={20} /></a>
              </div>
            </div>
          </div>

          {/* Horários */}
          <div>
            <p style={{ color: 'var(--secondary)', fontWeight: 600, fontSize: 13, letterSpacing: 2, marginBottom: 8 }}>
              HORÁRIOS
            </p>
            <h2 style={{ fontSize: 24, marginBottom: 20 }}>
              <Clock size={20} style={{ display: 'inline', color: 'var(--secondary)' }} /> Atendimento
            </h2>
            <div className="card" style={{ padding: 0 }}>
              {[
                { dia: 'Segunda', h: '09:00 - 19:00' },
                { dia: 'Terça', h: '09:00 - 19:00' },
                { dia: 'Quarta', h: '09:00 - 19:00' },
                { dia: 'Quinta', h: '09:00 - 19:00' },
                { dia: 'Sexta', h: '09:00 - 19:00' },
                { dia: 'Sábado', h: '09:00 - 17:00' },
                { dia: 'Domingo', h: 'Fechado' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '14px 20px',
                  borderBottom: i < 6 ? '1px solid var(--border)' : 'none',
                  background: item.h === 'Fechado' ? 'rgba(239,68,68,0.05)' : 'transparent'
                }}>
                  <span style={{ fontWeight: 500, fontSize: 14 }}>{item.dia}</span>
                  <span style={{ color: item.h === 'Fechado' ? '#ef4444' : 'var(--secondary)', fontSize: 14, fontWeight: 600 }}>{item.h}</span>
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 20, fontSize: 16, padding: '16px 24px' }}
              onClick={() => setPage('login')}>
              <CalendarPlus size={20} /> Agendar Agora
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 1.5rem', background: 'var(--primary)', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--secondary)', fontSize: 22, marginBottom: 4, fontFamily: 'League Spartan' }}>BARBER CALL</h3>
        <p style={{ color: 'var(--accent)', fontSize: 13, marginBottom: 16 }}>Better Call Barber</p>
        <p style={{ color: '#667', fontSize: 12 }}>© 2026 Barber Call. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
