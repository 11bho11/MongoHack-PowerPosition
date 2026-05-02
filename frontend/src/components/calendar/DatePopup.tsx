import { useState, useEffect } from 'react'
import { CalendarEntry } from '../../lib/api'

interface Props {
  date: string
  entries: CalendarEntry[]
  onSave: (date: string, content: string) => void
  onClose: () => void
  isSaving: boolean
}

export default function DatePopup({ date, entries, onSave, onClose, isSaving }: Props) {
  const existing = entries.find(e => e.date === date)
  const [content, setContent] = useState(existing?.content || '')

  useEffect(() => {
    const existing = entries.find(e => e.date === date)
    setContent(existing?.content || '')
  }, [date, entries])

  const formatDate = (d: string) => {
    const [y, m, day] = d.split('-')
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return `${months[parseInt(m) - 1]} ${parseInt(day)}, ${y}`
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0f0f2a',
          border: '1px solid #1a1a3e',
          borderRadius: '12px',
          padding: '28px',
          width: '480px',
          maxWidth: '90vw',
          boxShadow: '0 0 60px rgba(99,102,241,0.15)',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
              Training Log
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#e2e8f0' }}>
              {formatDate(date)}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="What did you work on today? How did it feel?"
          rows={8}
          style={{
            width: '100%',
            background: '#0a0a1a',
            border: '1px solid #1a1a3e',
            borderRadius: '8px',
            padding: '12px',
            color: '#e2e8f0',
            fontSize: '14px',
            lineHeight: 1.6,
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
          onFocus={e => { e.target.style.borderColor = '#6366f1' }}
          onBlur={e => { e.target.style.borderColor = '#1a1a3e' }}
          autoFocus
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: '1px solid #1a1a3e',
              borderRadius: '6px',
              color: '#94a3b8',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(date, content)}
            disabled={isSaving}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
