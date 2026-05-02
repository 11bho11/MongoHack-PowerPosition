const BASE_URL = 'http://localhost:8000'

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export interface CalendarEntry {
  date: string
  content: string
  source: string
  updated_at: string
}

export interface Plan {
  short_term: string | null
  medium_term: string | null
  long_term: string | null
}

export interface AgentLog {
  _id: { $oid: string }
  timestamp: { $date: string } | string
  action: string
  reasoning: string
  vector_sources: string[]
  event_type: string
}

export interface CycleStatus {
  cycle_status: 'awaiting' | 'logged' | 'analyzing' | 'updated'
}

export interface Config {
  telegram_connected: boolean
  telegram_bot_token?: string
}

export const api = {
  getCalendar: () => apiFetch<CalendarEntry[]>('/api/calendar'),
  saveCalendarEntry: (date: string, content: string) =>
    apiFetch<{ status: string }>(`/api/calendar/${date}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    }),
  getPlan: () => apiFetch<Plan>('/api/plan'),
  getAgentLogs: () => apiFetch<AgentLog[]>('/api/agent-logs'),
  getCycleStatus: () => apiFetch<CycleStatus>('/api/cycle-status'),
  getConfig: () => apiFetch<Config>('/api/config'),
  connectTelegram: (token: string) =>
    apiFetch<{ status: string; telegram_connected: boolean }>('/api/config/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }),
  simulatePregame: () =>
    apiFetch<{ status: string; response: string }>('/api/simulate/pregame', { method: 'POST' }),
  simulatePostgame: () =>
    apiFetch<{ status: string; response: string }>('/api/simulate/postgame', { method: 'POST' }),
  simulateInactivity: () =>
    apiFetch<{ status: string }>('/api/simulate/inactivity', { method: 'POST' }),
}
