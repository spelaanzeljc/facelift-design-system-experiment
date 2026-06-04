import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  variant: 'standard' | 'amplify'
  defaultName?: string
  onClose: () => void
  onSave: (name: string) => void
}

export default function SaveTemplateDialog({ open, variant, defaultName, onClose, onSave }: Props) {
  const [name, setName] = useState(defaultName ?? '')

  useEffect(() => {
    setName(defaultName ?? '')
  }, [defaultName])

  if (!open) return null

  const title = variant === 'amplify' ? 'Save as Amplify Template' : 'Save as Template'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          width: 360,
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center px-5 py-4"
          style={{ borderBottom: '1px solid #f3f5f7' }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111317', flex: 1 }}>
            {title}
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

        {/* Body */}
        <div className="px-5 py-4">
          <label style={{ fontSize: 13, fontWeight: 600, color: '#111317', display: 'block', marginBottom: 8 }}>
            Template name
          </label>
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && name.trim()) onSave(name.trim()) }}
            className="w-full rounded-lg px-3 outline-none"
            style={{
              height: 40,
              fontSize: 13,
              color: '#111317',
              border: '1px solid #d3d7de',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#1339ec')}
            onBlur={e => (e.currentTarget.style.borderColor = '#d3d7de')}
          />
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 px-5 py-4"
          style={{ borderTop: '1px solid #f3f5f7' }}
        >
          <button
            onClick={onClose}
            className="px-4 h-9 rounded-lg text-sm font-medium"
            style={{ color: '#5f6a82', border: '1px solid #d3d7de' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Cancel
          </button>
          <button
            onClick={() => name.trim() && onSave(name.trim())}
            className="px-4 h-9 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: '#1339ec', color: '#fff' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0f2ebd')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1339ec')}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
