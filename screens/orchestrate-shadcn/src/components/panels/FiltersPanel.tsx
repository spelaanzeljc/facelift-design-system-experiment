import { useState } from 'react'
import { X } from 'lucide-react'
import { FILTER_CHIPS } from '@/data/mock'

interface FiltersPanelProps {
  open: boolean
  onClose: () => void
}

const PANEL_WIDTH = 340

export default function FiltersPanel({ open, onClose }: FiltersPanelProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showSelector, setShowSelector] = useState(false)

  const toggleFilter = (chip: string) => {
    setActiveFilters(f =>
      f.includes(chip) ? f.filter(c => c !== chip) : [...f, chip]
    )
  }

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
        <span style={{ fontSize: 14, fontWeight: 700, color: '#111317', flex: 1 }}>Filters</span>
        {activeFilters.length > 0 && (
          <span
            className="rounded-full px-2"
            style={{ fontSize: 11, fontWeight: 700, backgroundColor: '#1339ec', color: '#fff', lineHeight: '20px' }}
          >
            {activeFilters.length}
          </span>
        )}
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

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {!showSelector && activeFilters.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div
              className="rounded-full flex items-center justify-center"
              style={{ width: 56, height: 56, backgroundColor: '#f3f5f7' }}
            >
              <span className="material-icons" style={{ fontSize: 28, color: '#a7aebe' }}>filter_list</span>
            </div>
            <div className="text-center">
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111317' }}>No active filters</div>
              <div style={{ fontSize: 12, color: '#848ea4', marginTop: 4 }}>Add a filter to narrow down results</div>
            </div>
            <button
              onClick={() => setShowSelector(true)}
              className="flex items-center gap-2 px-4 h-8 rounded-md border text-sm font-semibold"
              style={{ borderColor: '#1339ec', color: '#1339ec' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#eef3fd')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              + Add filter
            </button>
          </div>
        ) : (
          <div className="p-3">
            {/* Filter chips grid */}
            <div style={{ fontSize: 12, fontWeight: 600, color: '#5f6a82', marginBottom: 8 }}>
              Select filters
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTER_CHIPS.map(chip => {
                const isActive = activeFilters.includes(chip)
                return (
                  <button
                    key={chip}
                    onClick={() => toggleFilter(chip)}
                    className="rounded-full px-3 h-7 text-xs font-medium border"
                    style={{
                      backgroundColor: isActive ? '#eef3fd' : '#fff',
                      color: isActive ? '#1339ec' : '#5f6a82',
                      borderColor: isActive ? '#1339ec' : '#e7eaee',
                    }}
                  >
                    {chip}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setShowSelector(true)}
              className="mt-3 text-xs font-medium"
              style={{ color: '#1339ec' }}
            >
              + Add filter
            </button>
          </div>
        )}
      </div>

      {/* Footer (when filters active) */}
      {(activeFilters.length > 0 || showSelector) && (
        <div
          className="flex items-center gap-2 px-3 py-3"
          style={{ borderTop: '1px solid #e7eaee', flexShrink: 0 }}
        >
          <button
            onClick={() => { setActiveFilters([]); setShowSelector(false) }}
            className="flex-1 h-8 rounded-md border text-xs font-semibold"
            style={{ borderColor: '#e7eaee', color: '#5f6a82' }}
          >
            Discard
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-8 rounded-md text-xs font-semibold"
            style={{ backgroundColor: '#1339ec', color: '#fff' }}
          >
            Apply ({activeFilters.length})
          </button>
        </div>
      )}
    </div>
  )
}
