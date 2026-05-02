import { useState } from 'react'
import CalendarGrid from '../components/calendar/CalendarGrid'
import DatePopup from '../components/calendar/DatePopup'
import { useCalendar, useSaveCalendarEntry } from '../lib/hooks'

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const { data: entries = [], isLoading } = useCalendar()
  const saveEntry = useSaveCalendarEntry()

  const handleSave = (date: string, content: string) => {
    saveEntry.mutate({ date, content }, {
      onSuccess: () => setSelectedDate(null),
    })
  }

  return (
    <div style={{ padding: '40px', maxWidth: '900px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#e2e8f0',
          letterSpacing: '0.05em',
          marginBottom: '4px',
        }}>
          Training Calendar
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '13px' }}>
          Click any date to log a session or view notes.
        </p>
      </div>

      {isLoading ? (
        <div style={{ color: '#94a3b8' }}>Loading...</div>
      ) : (
        <CalendarGrid
          entries={entries}
          onSelectDate={setSelectedDate}
          selectedDate={selectedDate}
        />
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
