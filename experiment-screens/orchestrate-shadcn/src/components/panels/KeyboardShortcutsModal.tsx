import { useEffect } from 'react'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
}

const SHORTCUTS = [
  { key: 'N',   desc: 'New post' },
  { key: 'C',   desc: 'New campaign' },
  { key: 'F',   desc: 'Open filters' },
  { key: 'S',   desc: 'Open search' },
  { key: 'U',   desc: 'Unscheduled drafts' },
  { key: '1',   desc: 'Day view' },
  { key: '2',   desc: 'Week view' },
  { key: '3',   desc: 'Month view' },
  { key: '4',   desc: 'Timeline view' },
  { key: '←',   desc: 'Previous week' },
  { key: '→',   desc: 'Next week' },
  { key: 'Esc', desc: 'Close panel' },
  { key: '?',   desc: 'Keyboard shortcuts' },
]

export default function KeyboardShortcutsModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 24,
          width: 560,
          boxShadow: '0 20px 60px rgba(0,0,0,0.24)',
        }}
      >
        {/* Header */}
        <div className="flex items-center mb-5">
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111317', flex: 1 }}>
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ color: '#5f6a82' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Shortcuts grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 8,
          }}
        >
          {SHORTCUTS.map(s => (
            <div key={s.key} className="flex items-center gap-3">
              <kbd
                style={{
                  fontFamily: 'monospace',
                  fontSize: 12,
                  backgroundColor: '#f3f5f7',
                  border: '1px solid #e7eaee',
                  borderRadius: 4,
                  padding: '2px 8px',
                  minWidth: 32,
                  textAlign: 'center',
                  color: '#414858',
                  flexShrink: 0,
                }}
              >
                {s.key}
              </kbd>
              <span style={{ fontSize: 13, color: '#5f6a82' }}>{s.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
