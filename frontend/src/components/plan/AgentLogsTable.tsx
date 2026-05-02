import type { AgentLog } from '../../lib/api'

interface Props {
  logs: AgentLog[]
}

function formatTimestamp(ts: { $date: string } | string): string {
  const raw = typeof ts === 'object' && '$date' in ts ? ts.$date : ts
  try {
    return new Date(raw).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
      hour12: false,
    })
  } catch {
    return String(raw)
  }
}

const EVENT_META: Record<string, { label: string; color: string; bg: string }> = {
  action:           { label: 'ACTION',           color: '#3b82f6', bg: 'rgba(59,130,246,0.08)'  },
  checkpoint:       { label: 'CHECKPOINT',       color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
  plan_update:      { label: 'PLAN UPDATE',      color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
  inactivity_check: { label: 'INACTIVITY CHECK', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
}

export default function AgentLogsTable({ logs }: Props) {
  if (!logs || logs.length === 0) {
    return (
      <div style={{
        background: '#080f20',
        border: '1px solid #0f1e3a',
        borderRadius: '6px',
        padding: '36px',
        textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#3d5070', letterSpacing: '0.1em' }}>
          // No agent activity recorded.
        </div>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#3d5070', marginTop: '6px' }}>
          Log a session via Telegram to populate this feed.
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {logs.map((log, i) => {
        const meta = EVENT_META[log.event_type] ?? { label: log.event_type?.toUpperCase() ?? 'EVENT', color: '#475569', bg: 'rgba(71,85,105,0.08)' }
        const hasSources = log.vector_sources && log.vector_sources.length > 0

        return (
          <div
            key={i}
            style={{
              background: '#080f20',
              border: '1px solid #0f1e3a',
              borderRadius: '6px',
              overflow: 'hidden',
              transition: 'border-color 0.12s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#162a4e' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#0f1e3a' }}
          >
            {/* Top accent line */}
            <div style={{ height: '1px', background: `linear-gradient(90deg, ${meta.color}60, transparent)` }} />

            <div style={{ padding: '16px 20px' }}>
              {/* Header: timestamp + event badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '3px 8px',
                  background: meta.bg,
                  border: `1px solid ${meta.color}40`,
                  borderRadius: '3px',
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '7px',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  color: meta.color,
                }}>
                  {meta.label}
                </div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  color: '#3d5070',
                  letterSpacing: '0.03em',
                }}>
                  {formatTimestamp(log.timestamp)}
                </div>
              </div>

              {/* Session Log title */}
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#cbd5e1',
                marginBottom: '8px',
                letterSpacing: '0.01em',
              }}>
                {log.action}
              </div>

              {/* Summary / Reasoning */}
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '12px',
                fontWeight: 300,
                color: '#64748b',
                lineHeight: 1.75,
                paddingLeft: '12px',
                borderLeft: `2px solid ${meta.color}30`,
              }}>
                {log.reasoning}
              </div>

              {/* Vector Search sources */}
              {hasSources && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '7px',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    color: '#3d5070',
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                  }}>
                    Vector Search Sources
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {log.vector_sources.map((s, j) => (
                      <div key={j} style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '9px',
                        color: '#8b5cf6',
                        background: 'rgba(139,92,246,0.08)',
                        border: '1px solid rgba(139,92,246,0.18)',
                        borderRadius: '3px',
                        padding: '3px 8px',
                        wordBreak: 'break-all',
                      }}>
                        {s.length > 60 ? s.slice(0, 60) + '…' : s}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
