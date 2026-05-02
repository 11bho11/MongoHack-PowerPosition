import { useState } from 'react'

interface Props {
  name: string
  description: string
  detail?: string
  logo: React.ReactNode
  accentColor: string
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        background: on ? '#3b82f6' : '#1e3a5f',
        border: `1px solid ${on ? '#3b82f6' : '#2a4a6e'}`,
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        flexShrink: 0,
        boxShadow: on ? '0 0 12px rgba(59,130,246,0.4)' : 'none',
      }}
    >
      <div style={{
        position: 'absolute',
        top: '3px',
        left: on ? '22px' : '3px',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: on ? '#fff' : '#4a6080',
        transition: 'all 0.2s ease',
        boxShadow: on ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
      }} />
    </div>
  )
}

export default function IntegrationCard({ name, description, detail, logo, accentColor }: Props) {
  const [enabled, setEnabled] = useState(false)

  return (
    <div style={{
      background: enabled ? 'rgba(15,25,50,1)' : '#0b1628',
      border: `1px solid ${enabled ? accentColor + '55' : '#1e3554'}`,
      borderRadius: '8px',
      padding: '16px 20px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      transition: 'all 0.2s ease',
      boxShadow: enabled ? `0 0 20px ${accentColor}18` : 'none',
    }}>
      {/* Logo */}
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: enabled ? accentColor + '22' : '#0f1e3a',
        border: `1px solid ${enabled ? accentColor + '44' : '#1e3554'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.2s ease',
      }}>
        {logo}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          color: enabled ? '#e2e8f0' : '#94a3b8',
          marginBottom: '3px',
          transition: 'color 0.2s ease',
        }}>
          {name}
        </div>
        <div style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '12px',
          color: enabled ? '#64748b' : '#3d5070',
          fontWeight: 300,
          transition: 'color 0.2s ease',
        }}>
          {description}
        </div>
        {detail && (
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '9px',
            color: enabled ? accentColor + 'aa' : '#2a3f5f',
            marginTop: '4px',
            transition: 'color 0.2s ease',
          }}>
            // {detail}
          </div>
        )}
      </div>

      {/* Toggle + status */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
        <Toggle on={enabled} onToggle={() => setEnabled(e => !e)} />
        <div style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '7px',
          fontWeight: 600,
          letterSpacing: '0.15em',
          color: enabled ? '#3b82f6' : '#2a3f5f',
          transition: 'color 0.2s ease',
        }}>
          {enabled ? 'ON' : 'OFF'}
        </div>
      </div>
    </div>
  )
}
