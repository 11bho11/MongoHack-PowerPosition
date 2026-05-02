interface Props {
  name: string
  description: string
  icon: string
}

export default function IntegrationCard({ name, description, icon }: Props) {
  return (
    <div style={{
      background: '#0f0f2a',
      border: '1px solid #1a1a3e',
      borderRadius: '10px',
      padding: '24px',
      marginBottom: '16px',
      opacity: 0.5,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '22px' }}>{icon}</span>
          <div>
            <div style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#e2e8f0',
              marginBottom: '2px',
            }}>
              {name}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{description}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Greyed-out toggle */}
          <div style={{
            width: '40px',
            height: '22px',
            borderRadius: '11px',
            background: '#1a1a3e',
            border: '1px solid #334155',
            cursor: 'not-allowed',
            position: 'relative',
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: '#475569',
              position: 'absolute',
              top: '2px',
              left: '2px',
            }} />
          </div>
          {/* Greyed-out connect button */}
          <button
            disabled
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid #1a1a3e',
              borderRadius: '6px',
              color: '#475569',
              fontSize: '12px',
              cursor: 'not-allowed',
            }}
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  )
}
