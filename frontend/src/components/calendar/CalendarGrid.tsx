import { CalendarEntry } from '../../lib/api'

interface Props {
  entries: CalendarEntry[]
  onSelectDate: (date: string) => void
  selectedDate: string | null
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export default function CalendarGrid({ entries, onSelectDate, selectedDate }: Props) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const entryDates = new Set(entries.map(e => e.date))

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div>
      {/* Month header */}
      <div style={{
        fontSize: '20px',
        fontWeight: 700,
        color: '#e2e8f0',
        marginBottom: '20px',
        letterSpacing: '0.05em',
      }}>
        {MONTH_NAMES[month]} {year}
      </div>

      {/* Day headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '4px',
        marginBottom: '4px',
      }}>
        {DAY_NAMES.map(d => (
          <div key={d} style={{
            textAlign: 'center',
            fontSize: '11px',
            fontWeight: 600,
            color: '#94a3b8',
            letterSpacing: '0.08em',
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
        gap: '4px',
      }}>
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} />
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const hasEntry = entryDates.has(dateStr)
          const isToday = day === today.getDate()
          const isSelected = dateStr === selectedDate

          return (
            <div
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              style={{
                minHeight: '72px',
                padding: '8px',
                background: isSelected ? 'rgba(99,102,241,0.2)' : '#0f0f2a',
                border: isSelected
                  ? '1px solid #6366f1'
                  : isToday
                  ? '1px solid rgba(99,102,241,0.4)'
                  : '1px solid #1a1a3e',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'rgba(99,102,241,0.08)'
              }}
              onMouseLeave={e => {
                if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = '#0f0f2a'
              }}
            >
              <div style={{
                fontSize: '13px',
                fontWeight: isToday ? 700 : 400,
                color: isToday ? '#6366f1' : '#e2e8f0',
              }}>
                {day}
              </div>
              {hasEntry && (
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#8b5cf6',
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  boxShadow: '0 0 6px rgba(139,92,246,0.6)',
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
