import { useState, useEffect } from 'react'
import { X, Calendar, Info } from 'lucide-react'
import type { Campaign } from '@/types'

interface Props {
  open: boolean
  preset: 'campaign' | 'event'
  onClose: () => void
  onSave: (camp: Campaign) => void
}

const CAMPAIGN_TYPES = [
  { label: 'Always-on',       color: '#a7aebe' },
  { label: 'Event',           color: '#f97316' },
  { label: 'Launch',          color: '#ec4899' },
  { label: 'Product Release', color: '#2e881b' },
  { label: 'Awareness',       color: '#8b5cf6' },
  { label: 'Nurture',         color: '#0891b2' },
]

function Chip({ label, color, onRemove }: { label: string; color?: string; onRemove: () => void }) {
  return (
    <span
      className="flex items-center gap-1.5 rounded-full px-3 py-1"
      style={{
        fontSize: 13,
        fontWeight: 500,
        backgroundColor: color ? `${color}22` : '#f3f5f7',
        color: color ?? '#5f6a82',
        border: `1px solid ${color ? `${color}44` : '#e7eaee'}`,
      }}
    >
      {color && (
        <span className="rounded-full flex-shrink-0" style={{ width: 8, height: 8, backgroundColor: color }} />
      )}
      {label}
      <button onClick={onRemove} style={{ color: color ?? '#848ea4', lineHeight: 1, marginLeft: 2 }}>
        <X size={12} />
      </button>
    </span>
  )
}

export default function NewCampaignModal({ open, preset, onClose, onSave }: Props) {
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('6/16/2026')
  const [endDate, setEndDate] = useState('6/30/2026')
  const [selectedType, setSelectedType] = useState<typeof CAMPAIGN_TYPES[0] | null>(null)
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (open) {
      setName('')
      setStartDate('6/16/2026')
      setEndDate('6/30/2026')
      setDescription('')
      if (preset === 'event') {
        setSelectedType(CAMPAIGN_TYPES.find(t => t.label === 'Event') ?? null)
      } else {
        setSelectedType(null)
      }
    }
  }, [open, preset])

  if (!open) return null

  const parseDay = (s: string) => {
    const parts = s.split('/')
    return parseInt(parts[1] ?? '1', 10) || 1
  }

  const handleSave = () => {
    const newCamp: Campaign = {
      id: Date.now().toString(),
      name: name.trim() || (preset === 'event' ? 'New Event' : 'New Campaign'),
      color: selectedType ? selectedType.color + '33' : '#e9eaec',
      text: selectedType?.color ?? '#414858',
      emoji: preset === 'event' ? '📅' : '📣',
      s: parseDay(startDate),
      e: parseDay(endDate),
      description,
      status: 'active',
      type: selectedType?.label,
      typeColor: selectedType?.color,
      timing: 'Not all-day Campaign',
      createdBy: 'Sarah A.',
      createdAt: 'May 27, 2026',
    }
    onSave(newCamp)
  }

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
          width: 540,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center px-6 pt-5 pb-4"
          style={{ borderBottom: '1px solid #f3f5f7' }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111317', flex: 1 }}>
            {preset === 'event' ? 'New Event' : 'New Campaign'}
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
        <div className="px-6 py-5 flex flex-col gap-5">

          {/* Name */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#111317', display: 'block', marginBottom: 8 }}>
              Name
            </label>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={preset === 'event' ? 'Event name' : 'Campaign name'}
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

          {/* Duration */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Calendar size={14} style={{ color: '#848ea4' }} />
              <label style={{ fontSize: 13, fontWeight: 600, color: '#111317' }}>
                Duration <span style={{ color: '#cc0000' }}>*</span>
              </label>
            </div>
            <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #d3d7de' }}>
              <div className="flex items-center gap-2 px-3 flex-1" style={{ height: 40, borderRight: '1px solid #d3d7de' }}>
                <input
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="flex-1 outline-none"
                  style={{ fontSize: 13, color: '#111317' }}
                />
              </div>
              <div className="flex items-center px-3 flex-1" style={{ height: 40 }}>
                <input
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="flex-1 outline-none"
                  style={{ fontSize: 13, color: '#111317' }}
                />
              </div>
            </div>
          </div>

          {/* Campaign Type */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Info size={14} style={{ color: '#848ea4' }} />
              <label style={{ fontSize: 13, fontWeight: 600, color: '#111317' }}>
                Campaign Type <span style={{ color: '#cc0000' }}>*</span>
              </label>
            </div>
            {selectedType ? (
              <div className="flex flex-wrap gap-2">
                <Chip
                  label={selectedType.label}
                  color={selectedType.color}
                  onRemove={() => setSelectedType(null)}
                />
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 8,
                }}
              >
                {CAMPAIGN_TYPES.map(t => (
                  <button
                    key={t.label}
                    onClick={() => setSelectedType(t)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2"
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      backgroundColor: `${t.color}18`,
                      color: t.color,
                      border: `1px solid ${t.color}33`,
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    <span className="rounded-full flex-shrink-0" style={{ width: 8, height: 8, backgroundColor: t.color }} />
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#111317', display: 'block', marginBottom: 8 }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-lg px-3 py-2.5 outline-none resize-none"
              style={{
                fontSize: 13,
                color: '#111317',
                border: '1px solid #d3d7de',
                lineHeight: 1.6,
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#1339ec')}
              onBlur={e => (e.currentTarget.style.borderColor = '#d3d7de')}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-1">
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
              onClick={handleSave}
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
    </div>
  )
}
