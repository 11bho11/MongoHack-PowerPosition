import type { CalendarEntry } from '../../lib/api'

interface Props {
  entries: CalendarEntry[]
  onSelectDate: (date: string) => void
  selectedDate: string | null
  viewYear: number
  viewMonth: number
  onPrevMonth: () => void
  onNextMonth: () => void
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const EVENT_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  game:     { label: 'GAME',     color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  training: { label: 'TRAIN',    color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  rest:     { label: 'REST',     color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
}

export default function CalendarGrid({ entries, onSelectDate, selectedDate, viewYear, viewMonth, onPrevMonth, onNextMonth }: Props) {
  const today = new Date()
  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)

  const entryMap = new Map(entries.map(e => [e.date, e]))

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth()

  return (
    <div>
      {/* Month header with nav */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
        <button
          onClick={onPrevMonth}
          style={{
            background: 'none',
            border: '1px solid #0f1e3a',
            borderRadius: '4px',
            color: '#3d5070',
            width: '30px',
            height: '30px',
            cursor: 'pointer',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.12s ease',
            flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#2a5090'; e.currentTarget.style.color = '#60a5fa' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#0f1e3a'; e.currentTarget.style.color = '#3d5070' }}
        >
          ‹
        </button>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flex: 1 }}>
          <span style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '18px',
            fontWeight: 700,
            color: '#e2e8f0',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            {MONTH_NAMES[viewMonth]}
          </span>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '14px',
            color: '#3d5070',
          }}>
            {viewYear}
          </span>
          {!isCurrentMonth && (
            <button
              onClick={() => { /* parent handles reset */ }}
              style={{
                marginLeft: '8px',
                background: 'none',
                border: '1px solid #0f1e3a',
                borderRadius: '4px',
                color: '#3d5070',
                fontSize: '8px',
                fontFamily: 'Orbitron, sans-serif',
                letterSpacing: '0.15em',
                padding: '3px 8px',
                cursor: 'pointer',
              }}
            >
              TODAY
            </button>
          )}
          <div style={{
            marginLeft: 'auto',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '9px',
            color: '#3d5070',
            letterSpacing: '0.15em',
          }}>
            {entries.filter(e => e.date.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`)).length} ENTRIES
          </div>
        </div>

        <button
          onClick={onNextMonth}
          style={{
            background: 'none',
            border: '1px solid #0f1e3a',
            borderRadius: '4px',
            color: '#3d5070',
            width: '30px',
            height: '30px',
            cursor: 'pointer',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.12s ease',
            flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#2a5090'; e.currentTarget.style.color = '#60a5fa' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#0f1e3a'; e.currentTarget.style.color = '#3d5070' }}
        >
          ›
        </button>
      </div>

      {/* Day headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '3px',
        marginBottom: '3px',
      }}>
        {DAY_NAMES.map(d => (
          <div key={d} style={{
            textAlign: 'center',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '8px',
            fontWeight: 600,
            color: '#3d5070',
            letterSpacing: '0.15em',
            padding: '8px 0',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '3px',
      }}>
        {cells.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />

          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const entry = entryMap.get(dateStr)
          const hasEntry = !!entry
          const eventStyle = entry?.event_type ? EVENT_STYLES[entry.event_type] : null
          const isToday = isCurrentMonth && day === today.getDate()
          const isSelected = dateStr === selectedDate

          return (
            <div
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              style={{
                minHeight: '72px',
                padding: '8px',
                background: isSelected ? 'rgba(59,130,246,0.15)' : '#080f20',
                border: isSelected
                  ? '1px solid #3b82f6'
                  : isToday
                  ? '1px solid rgba(59,130,246,0.35)'
                  : '1px solid #0f1e3a',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.12s ease',
                position: 'relative',
                boxShadow: isSelected
                  ? '0 0 16px rgba(59,130,246,0.2)'
                  : isToday
                  ? '0 0 8px rgba(59,130,246,0.1)'
                  : 'none',
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  e.currentTarget.style.background = '#0d1830'
                  e.currentTarget.style.borderColor = '#162a4e'
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  e.currentTarget.style.background = '#080f20'
                  e.currentTarget.style.borderColor = isToday ? 'rgba(59,130,246,0.35)' : '#0f1e3a'
                }
              }}
            >
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px',
                fontWeight: isToday ? 500 : 300,
                color: isToday ? '#60a5fa' : isSelected ? '#93c5fd' : '#64748b',
              }}>
                {day}
              </div>

              {/* Event type badge */}
              {eventStyle && (
                <div style={{
                  marginTop: '5px',
                  display: 'inline-block',
                  background: eventStyle.bg,
                  border: `1px solid ${eventStyle.color}44`,
                  borderRadius: '3px',
                  padding: '1px 5px',
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '7px',
                  fontWeight: 700,
                  color: eventStyle.color,
                  letterSpacing: '0.1em',
                }}>
                  {eventStyle.label}
                </div>
              )}

              {/* Diary dot (when entry exists but no event type) */}
              {hasEntry && !eventStyle && (
                <div style={{
                  position: 'absolute',
                  bottom: '7px',
                  right: '7px',
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: '#8b5cf6',
                  boxShadow: '0 0 8px rgba(139,92,246,0.8)',
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
