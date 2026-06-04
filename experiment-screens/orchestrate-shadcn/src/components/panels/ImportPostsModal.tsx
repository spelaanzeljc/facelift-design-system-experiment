import { useState, useEffect, useRef } from 'react'
import { X, Upload } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  onImport: (count: number) => void
}

export default function ImportPostsModal({ open, onClose, onImport }: Props) {
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!open) {
      setImporting(false)
      setProgress(0)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [open])

  const handleImport = () => {
    setImporting(true)
    // Trigger progress bar animation on next frame
    requestAnimationFrame(() => setProgress(100))
    timerRef.current = setTimeout(() => {
      onImport(12)
    }, 1800)
  }

  if (!open) return null

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
      onClick={e => { if (e.target === e.currentTarget && !importing) onClose() }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          width: 480,
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
            Import Posts
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ color: '#5f6a82' }}
            disabled={importing}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 flex flex-col gap-4">
          {/* Drop zone */}
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 120,
              border: '2px dashed #d3d7de',
              borderRadius: 10,
              cursor: importing ? 'default' : 'pointer',
              gap: 8,
              backgroundColor: '#fafbfc',
            }}
          >
            <Upload size={32} style={{ color: '#a7aebe' }} />
            <span style={{ fontSize: 13, color: '#848ea4' }}>
              Drop files here or click to browse
            </span>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}
              disabled={importing}
            />
          </label>

          <p style={{ fontSize: 11, color: '#a7aebe', textAlign: 'center' }}>
            Supports CSV, Excel (.xlsx) · Max 500 posts per import
          </p>

          {/* Progress bar */}
          {importing && (
            <div style={{ backgroundColor: '#f3f5f7', borderRadius: 4, height: 6, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  backgroundColor: '#1339ec',
                  borderRadius: 4,
                  width: `${progress}%`,
                  transition: 'width 1.8s linear',
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 px-5 py-4"
          style={{ borderTop: '1px solid #f3f5f7' }}
        >
          <button
            onClick={onClose}
            disabled={importing}
            className="px-4 h-9 rounded-lg text-sm font-medium"
            style={{ color: '#5f6a82', border: '1px solid #d3d7de', opacity: importing ? 0.5 : 1 }}
            onMouseEnter={e => { if (!importing) e.currentTarget.style.backgroundColor = '#f3f5f7' }}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={importing}
            className="px-4 h-9 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: '#1339ec', color: '#fff', opacity: importing ? 0.7 : 1 }}
            onMouseEnter={e => { if (!importing) e.currentTarget.style.backgroundColor = '#0f2ebd' }}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = importing ? '#1339ec' : '#1339ec')}
          >
            {importing ? 'Importing…' : 'Import'}
          </button>
        </div>
      </div>
    </div>
  )
}
