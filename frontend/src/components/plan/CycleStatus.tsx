import { CycleStatus as CycleStatusType } from '../../lib/api'

interface Props {
  status: CycleStatusType['cycle_status']
}

const STATUS_CONFIG = {
  awaiting:  { label: 'Awaiting next session', color: '#64748b', bg: 'rgba(100,116,139,0.12)', dot: '#64748b' },
  logged:    { label: 'Session logged',        color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  dot: '#3b82f6' },
  analyzing: { label: 'Analyzing',             color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  dot: '#f59e0b' },
  updated:   { label: 'Plan updated',          color: '#10b981', bg: 'rgba(16,185,129,0.12)',  dot: '#10b981' },
}

export default function CycleStatus({ status }: Props) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.awaiting

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 14px',
      borderRadius: '999px',
      background: cfg.bg,
      border: `1px solid ${cfg.color}33`,
    }}>
      <div style={{
        width: '7px',
        height: '7px',
        borderRadius: '50%',
        background: cfg.dot,
        boxShadow: `0 0 6px ${cfg.dot}`,
      }} />
      <span style={{
        fontSize: '12px',
        fontWeight: 600,
        color: cfg.color,
        letterSpacing: '0.05em',
      }}>
        {cfg.label}
      </span>
    </div>
  )
}
