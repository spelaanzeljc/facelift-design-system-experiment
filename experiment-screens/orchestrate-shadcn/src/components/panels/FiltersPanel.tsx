import { useState } from 'react'
import { X } from 'lucide-react'
import { STATUS_CFG, TAG_CFG, FILTER_STATUS_OPTIONS, FILTER_NETWORK_OPTIONS, FILTER_TAG_OPTIONS } from '@/data/mock'
import { NET_ICONS } from '@/components/icons'
import type { ActiveFilters, PostStatus } from '@/types'

interface FiltersPanelProps {
  open: boolean
  activeFilters: ActiveFilters
  onClose: () => void
  onApply: (filters: ActiveFilters) => void
}

const PANEL_WIDTH = 340

// map tag label → color key (rough heuristic; falls back to grey)
const TAG_LABEL_COLOR: Record<string, string> = {
  Community: 'teal', Support: 'teal', Guidelines: 'teal', Updates: 'teal',
  Product: 'blue', Webinar: 'blue', Agency: 'blue',
  Analytics: 'green', Engagement: 'green', Launch: 'green', Weekly: 'green', Orchestrate: 'green',
  Culture: 'orange', Migration: 'orange',
  Design: 'purple', Content: 'purple',
  Partner: 'amber',
  Trends: 'pink',
  Strategy: 'grey', Planning: 'grey',
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, color: '#848ea4', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10, marginTop: 4 }}>
      {children}
    </div>
  )
}

export default function FiltersPanel({ open, activeFilters, onClose, onApply }: FiltersPanelProps) {
  // local draft state — only committed when "Apply" is pressed
  const [draft, setDraft] = useState<ActiveFilters>(activeFilters)

  // Reset draft when panel opens
  const handleOpen = () => setDraft(activeFilters)
  void handleOpen // called via key on the div

  const toggleStatus = (s: PostStatus) =>
    setDraft(f => ({
      ...f,
      statuses: f.statuses.includes(s) ? f.statuses.filter(x => x !== s) : [...f.statuses, s],
    }))

  const toggleNetwork = (id: string) =>
    setDraft(f => ({
      ...f,
      networks: f.networks.includes(id) ? f.networks.filter(x => x !== id) : [...f.networks, id],
    }))

  const toggleTag = (tag: string) =>
    setDraft(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(x => x !== tag) : [...f.tags, tag],
    }))

  const clearAll = () => setDraft({ statuses: [], networks: [], tags: [] })

  const totalActive = draft.statuses.length + draft.networks.length + draft.tags.length

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
        {totalActive > 0 && (
          <button
            onClick={clearAll}
            style={{ fontSize: 12, color: '#1339ec', fontWeight: 500 }}
          >
            Clear all
          </button>
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

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 py-3">

        {/* Status */}
        <SectionLabel>Status</SectionLabel>
        <div className="flex flex-wrap gap-2 mb-5">
          {FILTER_STATUS_OPTIONS.map(s => {
            const cfg = STATUS_CFG[s]
            const active = draft.statuses.includes(s)
            return (
              <button
                key={s}
                onClick={() => toggleStatus(s)}
                className="flex items-center gap-1.5 rounded-full px-3 h-7 text-xs font-medium border"
                style={{
                  backgroundColor: active ? cfg.chipBg : '#fff',
                  color: active ? cfg.chipText : '#5f6a82',
                  borderColor: active ? cfg.border : '#e7eaee',
                }}
              >
                <span
                  className="rounded-full flex-shrink-0"
                  style={{ width: 7, height: 7, backgroundColor: cfg.border }}
                />
                {cfg.label}
              </button>
            )
          })}
        </div>

        {/* Networks */}
        <SectionLabel>Networks</SectionLabel>
        <div className="flex gap-2 mb-5">
          {FILTER_NETWORK_OPTIONS.map(({ id, label }) => {
            const Icon = NET_ICONS[id]
            const active = draft.networks.includes(id)
            return (
              <button
                key={id}
                onClick={() => toggleNetwork(id)}
                className="flex items-center gap-1.5 rounded-lg px-3 h-8 text-xs font-medium border"
                style={{
                  backgroundColor: active ? '#eef3fd' : '#fff',
                  color: active ? '#1339ec' : '#5f6a82',
                  borderColor: active ? '#1339ec' : '#e7eaee',
                }}
              >
                {Icon && <Icon />}
                {label}
              </button>
            )
          })}
        </div>

        {/* Tags */}
        <SectionLabel>Tags</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {FILTER_TAG_OPTIONS.map(tag => {
            const colorKey = TAG_LABEL_COLOR[tag] ?? 'grey'
            const tc = TAG_CFG[colorKey]
            const active = draft.tags.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className="rounded-full px-2.5 h-6 text-xs font-medium"
                style={{
                  backgroundColor: active ? tc.bg : '#f3f5f7',
                  color: active ? tc.color : '#5f6a82',
                  border: active ? `1px solid ${tc.color}44` : '1px solid transparent',
                }}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center gap-2 px-3 py-3"
        style={{ borderTop: '1px solid #e7eaee', flexShrink: 0 }}
      >
        <button
          onClick={() => { clearAll(); onApply({ statuses: [], networks: [], tags: [] }); onClose() }}
          className="flex-1 h-8 rounded-md border text-xs font-semibold"
          style={{ borderColor: '#e7eaee', color: '#5f6a82' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Discard
        </button>
        <button
          onClick={() => { onApply(draft); onClose() }}
          className="flex-1 h-8 rounded-md text-xs font-semibold"
          style={{ backgroundColor: '#1339ec', color: '#fff' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0f2ebd')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1339ec')}
        >
          {totalActive > 0 ? `Apply (${totalActive})` : 'Apply'}
        </button>
      </div>
    </div>
  )
}
