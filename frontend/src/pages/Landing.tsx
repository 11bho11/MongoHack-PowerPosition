import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Deep space radial glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Secondary atmospheric glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '15%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        textAlign: 'center',
        zIndex: 1,
        padding: '40px',
        maxWidth: '600px',
      }}>
        <div style={{
          fontSize: '11px',
          letterSpacing: '0.4em',
          color: '#6366f1',
          textTransform: 'uppercase',
          marginBottom: '24px',
          fontWeight: 500,
        }}>
          AI Coaching Platform
        </div>

        <h1 style={{
          fontSize: 'clamp(48px, 8vw, 80px)',
          fontWeight: 800,
          letterSpacing: '0.08em',
          color: '#e2e8f0',
          lineHeight: 1.05,
          marginBottom: '24px',
          textTransform: 'uppercase',
        }}>
          Power<br />
          <span style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Position</span>
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#94a3b8',
          lineHeight: 1.7,
          marginBottom: '40px',
          maxWidth: '420px',
          margin: '0 auto 40px',
        }}>
          Your personal ultimate frisbee coach. Log sessions, prep for games, and watch your plan evolve — powered by AI and your own training data.
        </p>

        <button
          onClick={() => navigate('/calendar')}
          style={{
            padding: '14px 40px',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#fff',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 0 30px rgba(99,102,241,0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            (e.target as HTMLButtonElement).style.boxShadow = '0 0 50px rgba(99,102,241,0.5)'
            ;(e.target as HTMLButtonElement).style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            (e.target as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(99,102,241,0.3)'
            ;(e.target as HTMLButtonElement).style.transform = 'translateY(0)'
          }}
        >
          Explore
        </button>
      </div>
    </div>
  )
}
