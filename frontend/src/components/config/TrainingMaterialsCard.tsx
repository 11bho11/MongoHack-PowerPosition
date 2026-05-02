import { useRef, useState } from 'react'
import { useUploadDocument } from '../../lib/hooks'

export default function TrainingMaterialsCard() {
  const inputRef = useRef<HTMLInputElement>(null)
  const upload = useUploadDocument()
  const [lastResult, setLastResult] = useState<string | null>(null)

  const handleFile = (file: File) => {
    setLastResult(null)
    upload.mutate(file, {
      onSuccess: (data) => setLastResult(`${data.chunks} chunks ingested`),
      onError: () => setLastResult('Upload failed'),
    })
  }

  return (
    <div style={{
      background: '#080f20',
      border: '1px solid #162a4e',
      borderRadius: '6px',
      overflow: 'hidden',
      marginBottom: '10px',
    }}>
      <div style={{ height: '2px', background: 'linear-gradient(90deg, #6366f1, transparent)' }} />

      <div style={{ padding: '20px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '16px', color: '#6366f1' }}>⊞</span>
              <div style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                color: '#e2e8f0',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                Training Materials
              </div>
            </div>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '12px',
              color: '#475569',
              fontWeight: 300,
              marginLeft: '26px',
            }}>
              Ingest local files into Vector Search
            </div>
          </div>
        </div>

        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault()
            const file = e.dataTransfer.files[0]
            if (file) handleFile(file)
          }}
          style={{
            border: '1px dashed #1e3a5f',
            borderRadius: '4px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'border-color 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#2a5090')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e3a5f')}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".txt,.pdf,.md"
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
              e.target.value = ''
            }}
          />
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            color: upload.isPending ? '#6366f1' : '#3d5070',
            letterSpacing: '0.05em',
          }}>
            {upload.isPending
              ? '// Ingesting...'
              : lastResult
              ? `// ${lastResult}`
              : '// Drop file or click to browse (.txt .pdf .md)'}
          </div>
        </div>
      </div>
    </div>
  )
}
