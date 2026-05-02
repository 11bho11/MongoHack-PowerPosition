import TelegramCard from '../components/config/TelegramCard'
import IntegrationCard from '../components/config/IntegrationCard'

export default function Config() {
  return (
    <div style={{ padding: '40px', maxWidth: '700px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#e2e8f0',
          letterSpacing: '0.05em',
          marginBottom: '4px',
        }}>
          Config
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '13px' }}>
          Connect your accounts and configure integrations.
        </p>
      </div>

      <div style={{
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#475569',
        marginBottom: '12px',
      }}>
        Active Integrations
      </div>

      <TelegramCard />

      <div style={{
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#475569',
        marginBottom: '12px',
        marginTop: '28px',
      }}>
        Coming Soon
      </div>

      <IntegrationCard
        name="Google Calendar"
        description="Sync your training schedule and game events"
        icon="📆"
      />
      <IntegrationCard
        name="Strava"
        description="Import workout data automatically"
        icon="🏃"
      />
    </div>
  )
}
