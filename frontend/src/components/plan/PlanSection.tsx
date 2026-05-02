interface Props {
  label: string
  content: string | null | undefined
}

export default function PlanSection({ label, content }: Props) {
  return (
    <div style={{
      background: '#0f0f2a',
      border: '1px solid #1a1a3e',
      borderRadius: '10px',
      padding: '20px 24px',
      marginBottom: '16px',
    }}>
      <div style={{
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#6366f1',
        marginBottom: '10px',
      }}>
        {label}
      </div>
      {content ? (
        <p style={{
          color: '#e2e8f0',
          fontSize: '14px',
          lineHeight: 1.7,
          margin: 0,
        }}>
          {content}
        </p>
      ) : (
        <p style={{
          color: '#475569',
          fontSize: '13px',
          fontStyle: 'italic',
          margin: 0,
        }}>
          Add more session logs to reveal insights
        </p>
      )}
    </div>
  )
}
