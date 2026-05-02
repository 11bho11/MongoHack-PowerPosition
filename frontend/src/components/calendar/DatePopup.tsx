import { useState, useEffect } from 'react'
import type { CalendarEntry } from '../../lib/api'

interface Props {
  date: string
  entries: CalendarEntry[]
  onSave: (date: string, content: string, event_type: string | null) => void
  onClose: () => void
  isSaving: boolean
}

type EventType = 'game' | 'training' | 'rest' | null

const EVENT_BUTTONS: { value: EventType; label: string; color: string; activeColor: string }[] = [
  { value: null,       label: 'NONE',     color: '#3d5070', activeColor: '#8b5cf6' },
  { value: 'training', label: 'TRAINING', color: '#3d5070', activeColor: '#3b82f6' },
  { value: 'game',     label: 'GAME',     color: '#3d5070', activeColor: '#f97316' },
  { value: 'rest',     label: 'REST',     color: '#3d5070', activeColor: '#64748b' },
]

export default function DatePopup({ date, entries, onSave, onClose, isSaving }: Props) {
  const existing = entries.find(e => e.date === date)
  const [content, setContent] = useState(existing?.content || '')
  const [eventType, setEventType] = useState<EventType>(existing?.event_type ?? null)

  useEffect(() => {
    const found = entries.find(e => e.date === date)
    setContent(found?.content || '')
    setEventType(found?.event_type ?? null)
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
        background: 'rgba(2,6,15,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#080f20',
          border: '1px solid #1e3a6a',
          borderRadius: '6px',
          width: '500px',
          maxWidth: '90vw',
          boxShadow: '0 0 60px rgba(59,130,246,0.15), 0 0 120px rgba(99,102,241,0.08)',
          overflow: 'hidden',
        }}
      >
        <div style={{ height: '2px', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, transparent)' }} />

        <div style={{ padding: '24px 28px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <div style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '0.3em',
                color: '#3b82f6',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}>
                Training Log Entry
              </div>
              <div style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                color: '#e2e8f0',
                letterSpacing: '0.05em',
              }}>
                {formatDate(date)}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: '1px solid #162a4e',
                borderRadius: '4px',
                color: '#3d5070',
                fontSize: '16px',
                cursor: 'pointer',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'JetBrains Mono, monospace',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#162a4e'; e.currentTarget.style.color = '#3d5070' }}
            >
              ×
            </button>
          </div>

          {/* Event type selector */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '8px',
              fontWeight: 600,
              letterSpacing: '0.25em',
              color: '#3d5070',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              Event Type
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {EVENT_BUTTONS.map(btn => {
                const active = eventType === btn.value
                return (
                  <button
                    key={String(btn.value)}
                    onClick={() => setEventType(btn.value)}
                    style={{
                      padding: '5px 12px',
                      background: active ? `${btn.activeColor}18` : 'transparent',
                      border: `1px solid ${active ? btn.activeColor : '#162a4e'}`,
                      borderRadius: '4px',
                      color: active ? btn.activeColor : '#3d5070',
                      fontFamily: 'Orbitron, sans-serif',
                      fontSize: '8px',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      cursor: 'pointer',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    {btn.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="// What did you work on? How did it feel? Observations..."
            rows={6}
            style={{
              width: '100%',
              background: '#050c1a',
              border: '1px solid #162a4e',
              borderRadius: '4px',
              padding: '12px 14px',
              color: '#94a3b8',
              fontSize: '13px',
              lineHeight: 1.7,
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'JetBrains Mono, monospace',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={e => { e.target.style.borderColor = '#2a5090' }}
            onBlur={e => { e.target.style.borderColor = '#162a4e' }}
            autoFocus
          />

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '9px 20px',
                background: 'transparent',
                border: '1px solid #162a4e',
                borderRadius: '4px',
                color: '#475569',
                fontSize: '10px',
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#3d5070' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#162a4e' }}
            >
              Abort
            </button>
            <button
              onClick={() => onSave(date, content, eventType)}
              disabled={isSaving}
              style={{
                padding: '9px 24px',
                background: isSaving ? '#0d1830' : 'rgba(59,130,246,0.12)',
                border: `1px solid ${isSaving ? '#162a4e' : '#2a5090'}`,
                borderRadius: '4px',
                color: isSaving ? '#3d5070' : '#60a5fa',
                fontSize: '10px',
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isSaving ? 'none' : '0 0 16px rgba(59,130,246,0.15)',
              }}
            >
              {isSaving ? 'Transmitting...' : 'Commit Log'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
