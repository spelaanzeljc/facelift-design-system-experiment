import { useState } from 'react'
import { X, Search } from 'lucide-react'
import { STATUS_CFG } from '@/data/mock'
import { SEARCH_INDEX } from '@/data/searchIndex'
import { NET_ICONS } from '@/components/icons'
import type { Post } from '@/types'

interface SearchPanelProps {
  open: boolean
  onClose: () => void
  onSelect: (post: Post) => void
}

const PANEL_WIDTH = 380

export default function SearchPanel({ open, onClose, onSelect }: SearchPanelProps) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? SEARCH_INDEX.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const isEmpty = query.trim() === ''

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
        <span style={{ fontSize: 14, fontWeight: 700, color: '#111317', flex: 1 }}>Search</span>
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
            placeholder="Search post sets..."
            className="flex-1 outline-none text-sm"
            style={{ fontSize: 13, color: '#111317', backgroundColor: 'transparent' }}
            autoFocus={open}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ color: '#848ea4' }}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Search size={36} style={{ color: '#d3d7de' }} />
            <span style={{ fontSize: 14, color: '#848ea4', fontWeight: 500 }}>Search post sets</span>
            <span style={{ fontSize: 12, color: '#a7aebe' }}>Type to search across all weeks</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Search size={36} style={{ color: '#d3d7de' }} />
            <span style={{ fontSize: 14, color: '#848ea4', fontWeight: 500 }}>No results found</span>
            <span style={{ fontSize: 12, color: '#a7aebe' }}>Try a different search term</span>
          </div>
        ) : (
          <div>
            {/* Table header */}
            <div
              className="flex items-center px-3 py-2"
              style={{ borderBottom: '1px solid #f3f5f7', backgroundColor: '#f9fafc' }}
            >
              <span style={{ flex: 3, fontSize: 11, fontWeight: 600, color: '#5f6a82', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Name
              </span>
              <span style={{ flex: 1.5, fontSize: 11, fontWeight: 600, color: '#5f6a82', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Status
              </span>
              <span style={{ flex: 1.5, fontSize: 11, fontWeight: 600, color: '#5f6a82', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Date
              </span>
            </div>

            {filtered.map((item, i) => {
              const cfg = STATUS_CFG[item.status as keyof typeof STATUS_CFG]
              return (
                <div
                  key={i}
                  className="flex items-start px-3 py-2.5 cursor-pointer"
                  style={{ borderBottom: '1px solid #f3f5f7' }}
                  onClick={() => onSelect(item.post)}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafc')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ flex: 3 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#111317' }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: '#848ea4', marginBottom: 4 }}>{item.sub}</div>
                    {/* Network icons */}
                    <div className="flex items-center gap-1">
                      {item.nets.map(net => {
                        const Icon = NET_ICONS[net]
                        return Icon ? (
                          <span key={net} style={{ width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon />
                          </span>
                        ) : null
                      })}
                    </div>
                  </div>
                  <div style={{ flex: 1.5, paddingTop: 2 }}>
                    {cfg && (
                      <span
                        className="rounded-full px-2 py-0.5"
                        style={{ fontSize: 11, fontWeight: 500, backgroundColor: cfg.chipBg, color: cfg.chipText }}
                      >
                        {cfg.label}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1.5, fontSize: 12, color: '#5f6a82', paddingTop: 2 }}>{item.date}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
