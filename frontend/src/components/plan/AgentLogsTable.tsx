import { AgentLog } from '../../lib/api'

interface Props {
  logs: AgentLog[]
}

function formatTimestamp(ts: { $date: string } | string): string {
  const raw = typeof ts === 'object' && '$date' in ts ? ts.$date : ts
  try {
    return new Date(raw).toLocaleString()
  } catch {
    return String(raw)
  }
}

const EVENT_COLORS: Record<string, string> = {
  action: '#6366f1',
  checkpoint: '#8b5cf6',
  plan_update: '#10b981',
  inactivity_check: '#f59e0b',
}

export default function AgentLogsTable({ logs }: Props) {
  if (!logs || logs.length === 0) {
    return (
      <div style={{
        background: '#0f0f2a',
        border: '1px solid #1a1a3e',
        borderRadius: '10px',
        padding: '32px',
        textAlign: 'center',
        color: '#475569',
        fontSize: '13px',
        fontStyle: 'italic',
      }}>
        No agent activity yet. Trigger a simulation to see logs here.
      </div>
    )
  }

  return (
    <div style={{
      background: '#0f0f2a',
      border: '1px solid #1a1a3e',
      borderRadius: '10px',
      overflow: 'hidden',
    }}>
      {/* Table header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '160px 1fr 1fr 180px',
        gap: '0',
        borderBottom: '1px solid #1a1a3e',
        padding: '10px 20px',
      }}>
        {['Timestamp', 'Action', 'Reasoning', 'Vector Sources'].map(h => (
          <div key={h} style={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#475569',
          }}>
            {h}
          </div>
        ))}
      </div>

      {/* Rows */}
      {logs.map((log, i) => {
        const eventColor = EVENT_COLORS[log.event_type] ?? '#94a3b8'
        return (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr 1fr 180px',
              gap: '0',
              padding: '14px 20px',
              borderBottom: i < logs.length - 1 ? '1px solid #0f0f2a' : 'none',
              background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
              alignItems: 'start',
            }}
          >
            <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>
              {formatTimestamp(log.timestamp)}
            </div>
            <div style={{ fontSize: '12px', color: eventColor, fontWeight: 500, paddingRight: '16px' }}>
              {log.action}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, paddingRight: '16px' }}>
              {log.reasoning}
            </div>
            <div style={{ fontSize: '11px', color: '#475569' }}>
              {log.vector_sources && log.vector_sources.length > 0
                ? log.vector_sources.map((s, j) => (
                    <div key={j} style={{
                      background: 'rgba(139,92,246,0.1)',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      marginBottom: '4px',
                      wordBreak: 'break-all',
                      fontSize: '10px',
                      color: '#8b5cf6',
                    }}>
                      {s.length > 40 ? s.slice(0, 40) + '…' : s}
                    </div>
                  ))
                : <span style={{ color: '#1e293b' }}>&mdash;</span>
              }
            </div>
          </div>
        )
      })}
    </div>
  )
}
