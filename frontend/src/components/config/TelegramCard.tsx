import { useState } from 'react'
import { useConfig, useConnectTelegram } from '../../lib/hooks'

export default function TelegramCard() {
  const { data: config } = useConfig()
  const connectTelegram = useConnectTelegram()
  const [token, setToken] = useState('')

  const connected = config?.telegram_connected ?? false

  const handleConnect = () => {
    if (!token.trim()) return
    connectTelegram.mutate(token.trim())
  }

  return (
    <div style={{
      background: '#080f20',
      border: '1px solid #162a4e',
      borderRadius: '6px',
      overflow: 'hidden',
      marginBottom: '10px',
    }}>
      {/* Top accent line */}
      {connected && (
        <div style={{
          height: '2px',
          background: 'linear-gradient(90deg, #10b981, transparent)',
        }} />
      )}

      <div style={{ padding: '20px 22px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: connected ? '0' : '16px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '16px',
                color: '#3b82f6',
              }}>⊕</span>
              <div style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                color: '#e2e8f0',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                Telegram
              </div>
            </div>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '12px',
              color: '#475569',
              fontWeight: 300,
              marginLeft: '26px',
            }}>
              Bot interface for coaching conversations
            </div>
          </div>

          {connected && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '5px 12px',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: '4px',
            }}>
              <div style={{
                width: '5px', height: '5px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 6px #10b981',
                animation: 'pulse-dot 2.5s ease infinite',
              }} />
              <span style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '8px',
                fontWeight: 700,
                color: '#10b981',
                letterSpacing: '0.2em',
              }}>ONLINE</span>
            </div>
          )}
        </div>

        {!connected ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="// Paste bot token from @BotFather"
              style={{
                flex: 1,
                background: '#050c1a',
                border: '1px solid #162a4e',
                borderRadius: '4px',
                padding: '9px 12px',
                color: '#94a3b8',
                fontSize: '12px',
                outline: 'none',
                fontFamily: 'JetBrains Mono, monospace',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={e => { e.target.style.borderColor = '#2a5090' }}
              onBlur={e => { e.target.style.borderColor = '#162a4e' }}
              onKeyDown={e => { if (e.key === 'Enter') handleConnect() }}
            />
            <button
              onClick={handleConnect}
              disabled={!token.trim() || connectTelegram.isPending}
              style={{
                padding: '9px 20px',
                background: token.trim() ? 'rgba(59,130,246,0.12)' : 'transparent',
                border: `1px solid ${token.trim() ? '#2a5090' : '#162a4e'}`,
                borderRadius: '4px',
                color: token.trim() ? '#60a5fa' : '#3d5070',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: token.trim() ? 'pointer' : 'not-allowed',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: token.trim() ? '0 0 14px rgba(59,130,246,0.15)' : 'none',
              }}
            >
              {connectTelegram.isPending ? 'Linking...' : 'Connect'}
            </button>
          </div>
        ) : (
          <div style={{
            marginTop: '10px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            color: '#3d5070',
            letterSpacing: '0.08em',
          }}>
            // Bot is active and polling for incoming messages.
          </div>
        )}
      </div>
    </div>
  )
}
