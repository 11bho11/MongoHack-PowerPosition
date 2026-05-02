import PlanSection from '../components/plan/PlanSection'
import CycleStatus from '../components/plan/CycleStatus'
import AgentLogsTable from '../components/plan/AgentLogsTable'
import { usePlan, useLogs, useCycleStatus } from '../lib/hooks'

export default function CoachingPlan() {
  const { data: plan } = usePlan()
  const { data: logs } = useLogs()
  const { data: cycleData } = useCycleStatus()

  const status = cycleData?.cycle_status ?? 'awaiting'

  return (
    <div style={{ padding: '40px', maxWidth: '960px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '32px',
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#e2e8f0',
            letterSpacing: '0.05em',
            marginBottom: '4px',
          }}>
            Coaching Plan
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '13px' }}>
            AI-generated training plan based on your session history.
          </p>
        </div>
        <CycleStatus status={status} />
      </div>

      {/* Plan sections */}
      <div style={{ marginBottom: '40px' }}>
        <PlanSection label="Short-Term Focus" content={plan?.short_term} />
        <PlanSection label="Medium-Term Goals" content={plan?.medium_term} />
        <PlanSection label="Long-Term Development" content={plan?.long_term} />
      </div>

      {/* Agent Logs */}
      <div>
        <div style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#475569',
          marginBottom: '12px',
        }}>
          Agent Activity Log
        </div>
        <AgentLogsTable logs={logs ?? []} />
      </div>
    </div>
  )
}
