import { useState } from 'react'
import { X, Search } from 'lucide-react'
import { DRAFTS_DATA } from '@/data/mock'
import { NET_ICONS } from '@/components/icons'

interface DraftsPanelProps {
  open: boolean
  onClose: () => void
}

const PANEL_WIDTH = 380

export default function DraftsPanel({ open, onClose }: DraftsPanelProps) {
  const [query, setQuery] = useState('')

  const filtered = DRAFTS_DATA.filter(d =>
    d.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div
      style={{
        position: 'fixed',
        top: 56,
        right: 0,
        bottom: 0,
        width: PANEL_WIDTH,
        backgroundColor: '#fff',
        borderLeft: '1px solid #e7eaee',
        transform: `translateX(${open ? '0' : '100%'})`,
        transition: 'transform 200ms cubic-bezier(.4,0,.2,1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 500,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3"
        style={{ height: 48, borderBottom: '1px solid #e7eaee', flexShrink: 0 }}
      >
        <span style={{ fontSize: 14, fontWeight: 700, color: '#111317' }}>Drafts</span>
        <span
          className="rounded-full px-2"
          style={{ fontSize: 11, fontWeight: 700, backgroundColor: '#e7eaee', color: '#5f6a82', lineHeight: '20px' }}
        >
          {DRAFTS_DATA.length}
        </span>
        <div className="flex-1" />
        <button
          onClick={onClose}
          className="flex items-center justify-center w-7 h-7 rounded"
          style={{ color: '#5f6a82' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <X size={16} />
        </button>
      </div>

      {/* Search input */}
      <div className="px-3 py-2" style={{ flexShrink: 0, borderBottom: '1px solid #f3f5f7' }}>
        <div className="flex items-center gap-2 rounded-md px-3 h-8" style={{ border: '1px solid #e7eaee' }}>
          <Search size={14} style={{ color: '#848ea4', flexShrink: 0 }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search drafts..."
            className="flex-1 outline-none"
            style={{ fontSize: 13, color: '#111317', backgroundColor: 'transparent' }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ color: '#848ea4' }}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Draft list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <span style={{ fontSize: 14, color: '#848ea4' }}>No drafts found</span>
          </div>
        ) : (
          filtered.map((draft, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-3 cursor-pointer"
              style={{ borderBottom: '1px solid #f3f5f7' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafc')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {/* Icon placeholder */}
              <div
                className="rounded flex items-center justify-center flex-shrink-0"
                style={{ width: 36, height: 36, backgroundColor: '#f3f5f7' }}
              >
                <span className="material-icons" style={{ fontSize: 18, color: '#a7aebe' }}>article</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div
                  style={{ fontSize: 13, fontWeight: 500, color: '#111317', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {draft.name}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span style={{ fontSize: 11, color: '#848ea4' }}>{draft.date}</span>
                  <div className="flex gap-1">
                    {draft.nets.map(net => {
                      const Icon = NET_ICONS[net]
                      return Icon ? <Icon key={net} /> : null
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
