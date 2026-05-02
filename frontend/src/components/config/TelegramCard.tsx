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
      background: '#0f0f2a',
      border: '1px solid #1a1a3e',
      borderRadius: '10px',
      padding: '24px',
      marginBottom: '16px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
      }}>
        <div>
          <div style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#e2e8f0',
            marginBottom: '4px',
          }}>
            Telegram
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            Connect your Telegram bot to enable coaching conversations
          </div>
        </div>
        {connected && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '999px',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>Connected</span>
          </div>
        )}
      </div>

      {!connected ? (
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Paste your bot token from @BotFather"
            style={{
              flex: 1,
              background: '#0a0a1a',
              border: '1px solid #1a1a3e',
              borderRadius: '6px',
              padding: '10px 14px',
              color: '#e2e8f0',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'monospace',
            }}
            onFocus={e => { e.target.style.borderColor = '#6366f1' }}
            onBlur={e => { e.target.style.borderColor = '#1a1a3e' }}
          />
          <button
            onClick={handleConnect}
            disabled={!token.trim() || connectTelegram.isPending}
            style={{
              padding: '10px 20px',
              background: token.trim() ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : '#1a1a3e',
              border: 'none',
              borderRadius: '6px',
              color: token.trim() ? '#fff' : '#475569',
              fontSize: '13px',
              fontWeight: 600,
              cursor: token.trim() ? 'pointer' : 'not-allowed',
              whiteSpace: 'nowrap',
            }}
          >
            {connectTelegram.isPending ? 'Connecting...' : 'Connect'}
          </button>
        </div>
      ) : (
        <div style={{ fontSize: '13px', color: '#64748b' }}>
          Bot is active and polling for messages.
        </div>
      )}
    </div>
  )
}
