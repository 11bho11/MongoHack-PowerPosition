import { useState } from 'react'
import CalendarGrid from '../components/calendar/CalendarGrid'
import DatePopup from '../components/calendar/DatePopup'
import { useCalendar, useSaveCalendarEntry } from '../lib/hooks'

function getISOWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const day = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

function ObjectivesCard({
  title,
  dateKey,
  entries,
  onSave,
  isSaving,
}: {
  title: string
  dateKey: string
  entries: ReturnType<typeof useCalendar>['data']
  onSave: (date: string, content: string, event_type: string | null) => void
  isSaving: boolean
}) {
  const existing = (entries ?? []).find(e => e.date === dateKey)
  const [value, setValue] = useState(existing?.content || '')
  const [editing, setEditing] = useState(false)

  const handleSave = () => {
    onSave(dateKey, value, null)
    setEditing(false)
  }

  return (
    <div style={{
      background: '#080f20',
      border: '1px solid #0f1e3a',
      borderRadius: '6px',
      overflow: 'hidden',
      flex: 1,
    }}>
      <div style={{ padding: '16px 18px' }}>
        <div style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '8px',
          fontWeight: 600,
          letterSpacing: '0.25em',
          color: '#3d5070',
          textTransform: 'uppercase',
          marginBottom: '10px',
        }}>
          {title}
        </div>
        {editing ? (
          <>
            <textarea
              value={value}
              onChange={e => setValue(e.target.value)}
              autoFocus
              rows={4}
              style={{
                width: '100%',
                background: '#050c1a',
                border: '1px solid #162a4e',
                borderRadius: '4px',
                padding: '10px 12px',
                color: '#94a3b8',
                fontSize: '12px',
                lineHeight: 1.7,
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'JetBrains Mono, monospace',
                boxSizing: 'border-box',
              }}
              onFocus={e => { e.target.style.borderColor = '#2a5090' }}
              onBlur={e => { e.target.style.borderColor = '#162a4e' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setEditing(false)}
                style={{
                  padding: '5px 14px',
                  background: 'transparent',
                  border: '1px solid #162a4e',
                  borderRadius: '4px',
                  color: '#475569',
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '8px',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  padding: '5px 14px',
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid #2a5090',
                  borderRadius: '4px',
                  color: '#60a5fa',
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '8px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <div
            onClick={() => setEditing(true)}
            style={{
              minHeight: '60px',
              cursor: 'text',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              color: value ? '#64748b' : '#1e3a5f',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
            }}
          >
            {value || '// Click to set objectives...'}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const { data: entries = [], isLoading } = useCalendar()
  const saveEntry = useSaveCalendarEntry()

  const handlePrevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }

  const handleNextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const handleSave = (date: string, content: string, event_type: string | null) => {
    saveEntry.mutate({ date, content, event_type }, {
      onSuccess: () => setSelectedDate(null),
    })
  }

  // Objective date keys scoped to the viewed month/week
  const viewDate = new Date(viewYear, viewMonth, 1)
  const weekNum = getISOWeek(today)
  const weekKey = `_obj:week:${today.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
  const monthKey = `_obj:month:${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`
  const monthName = ['January','February','March','April','May','June','July','August','September','October','November','December'][viewMonth]

  return (
    <div style={{ padding: '40px 48px', maxWidth: '960px' }}>
      {/* Page header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '9px',
          fontWeight: 600,
          letterSpacing: '0.35em',
          color: '#3b82f6',
          textTransform: 'uppercase',
          marginBottom: '10px',
        }}>
          Training Operations
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
          Session Log
        </h1>
        <p style={{
          fontFamily: 'Space Grotesk, sans-serif',
          color: '#475569',
          fontSize: '13px',
          fontWeight: 300,
          letterSpacing: '0.02em',
        }}>
          Select a date to record or review a training session.
        </p>
      </div>

      {isLoading ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#3d5070',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          letterSpacing: '0.1em',
        }}>
          <div style={{
            width: '6px', height: '6px',
            borderRadius: '50%',
            background: '#3b82f6',
            animation: 'pulse-dot 1s ease infinite',
          }} />
          LOADING ENTRIES...
        </div>
      ) : (
        <>
          <CalendarGrid
            entries={entries.filter(e => !e.date.startsWith('_obj:'))}
            onSelectDate={setSelectedDate}
            selectedDate={selectedDate}
            viewYear={viewYear}
            viewMonth={viewMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />

          {/* Objectives section */}
          <div style={{ marginTop: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '14px',
            }}>
              <div style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '8px',
                fontWeight: 600,
                letterSpacing: '0.3em',
                color: '#3d5070',
                textTransform: 'uppercase',
              }}>
                Objectives
              </div>
              <div style={{ flex: 1, height: '1px', background: '#0f1e3a' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <ObjectivesCard
                title={`Week ${weekNum} — This Week`}
                dateKey={weekKey}
                entries={entries}
                onSave={(date, content, et) => saveEntry.mutate({ date, content, event_type: et })}
                isSaving={saveEntry.isPending}
              />
              <ObjectivesCard
                title={`${monthName} ${viewYear} — Month`}
                dateKey={monthKey}
                entries={entries}
                onSave={(date, content, et) => saveEntry.mutate({ date, content, event_type: et })}
                isSaving={saveEntry.isPending}
              />
            </div>
          </div>
        </>
      )}

      {selectedDate && (
        <DatePopup
          date={selectedDate}
          entries={entries}
          onSave={handleSave}
          onClose={() => setSelectedDate(null)}
          isSaving={saveEntry.isPending}
        />
      )}
    </div>
  )
}
