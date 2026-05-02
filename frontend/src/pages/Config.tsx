import TelegramCard from '../components/config/TelegramCard'
import IntegrationCard from '../components/config/IntegrationCard'
import TrainingMaterialsCard from '../components/config/TrainingMaterialsCard'

const logos: Record<string, React.ReactNode> = {
  googlecalendar: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="17" rx="2" stroke="#4285F4" strokeWidth="1.5" fill="none"/>
      <path d="M3 9h18" stroke="#4285F4" strokeWidth="1.5"/>
      <path d="M8 4V6M16 4V6" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round"/>
      <text x="12" y="18" textAnchor="middle" fontFamily="Arial" fontSize="7" fontWeight="bold" fill="#4285F4">CAL</text>
    </svg>
  ),
  strava: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M10 17.5L14 9l2.5 5H19L14 2l-5 9H6l4 6.5z" fill="#FC4C02"/>
    </svg>
  ),
  whoop: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#000"/>
      <path d="M5 8l3.5 8L12 9l3.5 7L19 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  garmin: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#007CC3" strokeWidth="1.5" fill="none"/>
      <text x="12" y="16" textAnchor="middle" fontFamily="Arial" fontSize="9" fontWeight="bold" fill="#007CC3">G</text>
    </svg>
  ),
  applehealth: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 21C12 21 3 15 3 9a4.5 4.5 0 018.5-2.1A4.5 4.5 0 0121 9c0 6-9 12-9 12z" fill="#FF375F"/>
    </svg>
  ),
  notion: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="2" width="18" height="20" rx="2" fill="#fff" stroke="#ccc" strokeWidth="0.5"/>
      <path d="M7 7h5M7 11h8M7 15h6" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  youtube: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="4" fill="#FF0000"/>
      <path d="M10 9.5l5 2.5-5 2.5V9.5z" fill="#fff"/>
    </svg>
  ),
}

export default function Config() {
  return (
    <div style={{ padding: '40px 48px', maxWidth: '720px' }}>
      {/* Page header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '9px',
          fontWeight: 600,
          letterSpacing: '0.35em',
          color: '#22d3ee',
          textTransform: 'uppercase',
          marginBottom: '10px',
        }}>
          System Configuration
        </div>
        <h1 style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '22px',
          fontWeight: 700,
          color: '#e2e8f0',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}>
          Integrations
        </h1>
        <p style={{
          fontFamily: 'Space Grotesk, sans-serif',
          color: '#475569',
          fontSize: '13px',
          fontWeight: 300,
        }}>
          Configure external service connections and system parameters.
        </p>
      </div>

      {/* Active integrations */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px',
      }}>
        <div style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '8px',
          fontWeight: 600,
          letterSpacing: '0.3em',
          color: '#3d5070',
          textTransform: 'uppercase',
        }}>
          Active
        </div>
        <div style={{ flex: 1, height: '1px', background: '#0f1e3a' }} />
      </div>
      <TelegramCard />
      <TrainingMaterialsCard />

      {/* MCP Integrations */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px',
        marginTop: '28px',
      }}>
        <div style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '8px',
          fontWeight: 600,
          letterSpacing: '0.3em',
          color: '#3d5070',
          textTransform: 'uppercase',
        }}>
          MCP Integrations
        </div>
        <div style={{ flex: 1, height: '1px', background: '#0f1e3a' }} />
      </div>
      <IntegrationCard name="Google Calendar" description="Sync training schedule and game events" logo={logos.googlecalendar} accentColor="#4285F4" />
      <IntegrationCard name="Strava" description="Pull workout data — pace, heart rate, distance — into coaching context" detail="OAuth 2.0 · strava.com/oauth/authorize" logo={logos.strava} accentColor="#FC4C02" />
      <IntegrationCard name="Whoop" description="Stream recovery scores, HRV, and sleep data into training load decisions" detail="REST API · api.prod.whoop.com/developer" logo={logos.whoop} accentColor="#ffffff" />
      <IntegrationCard name="Garmin Connect" description="Import GPS activity files, VO2 max estimates, and race predictions" detail="OAuth 1.0a · connectapi.garmin.com" logo={logos.garmin} accentColor="#007CC3" />
      <IntegrationCard name="Apple Health" description="Aggregate step count, active calories, and workout summaries from HealthKit" detail="HealthKit · requires iOS companion app" logo={logos.applehealth} accentColor="#FF375F" />
      <IntegrationCard name="Notion" description="Push session summaries and coaching plans to a Notion database" detail="REST API · api.notion.com/v1" logo={logos.notion} accentColor="#ffffff" />
      <IntegrationCard name="YouTube" description="Index game film and training videos for the agent to reference by timestamp" detail="Data API v3 · youtube.googleapis.com" logo={logos.youtube} accentColor="#FF0000" />
    </div>
  )
}
