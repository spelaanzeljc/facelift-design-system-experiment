import { useState, useEffect } from 'react'
import { X, Pencil, Calendar, Info, Plus } from 'lucide-react'
import type { Campaign } from '@/types'

interface CampaignEditModalProps {
  open: boolean
  campaign: Campaign | null
  onClose: () => void
  onSave: (updated: Campaign) => void
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

function AddChipButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded-full"
      style={{
        width: 30,
        height: 30,
        border: '1.5px solid #d3d7de',
        color: '#5f6a82',
        flexShrink: 0,
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <Plus size={14} />
    </button>
  )
}

export default function CampaignEditModal({ open, campaign, onClose, onSave }: CampaignEditModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('6/1/2026')
  const [endDate, setEndDate] = useState('6/30/2026')
  const [selectedType, setSelectedType] = useState<typeof CAMPAIGN_TYPES[0] | null>(null)
  const [commonTags, setCommonTags] = useState<string[]>(['Campaign Typo 2'])
  const [deptTags, setDeptTags] = useState<string[]>(['Packaging Test'])
  const [channelTags, setChannelTags] = useState<string[]>(['some thing here'])
  const [editingName, setEditingName] = useState(false)

  useEffect(() => {
    if (campaign) {
      setName(campaign.name)
      setDescription(campaign.description ?? '')
      setStartDate(`6/${campaign.s}/2026`)
      setEndDate(`6/${campaign.e}/2026`)
      const t = CAMPAIGN_TYPES.find(t => t.label === campaign.type)
      setSelectedType(t ?? CAMPAIGN_TYPES[0])
    }
  }, [campaign])

  if (!open || !campaign) return null

  const handleSave = () => {
    onSave({
      ...campaign,
      name,
      description,
      type: selectedType?.label ?? campaign.type,
      typeColor: selectedType?.color ?? campaign.typeColor,
    })
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 48,
        paddingBottom: 48,
        zIndex: 800,
        overflowY: 'auto',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          width: 540,
          backgroundColor: '#fff',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Modal header */}
        <div
          className="flex items-start gap-3 px-6 pt-6 pb-4"
          style={{ borderBottom: '1px solid #f3f5f7' }}
        >
          <div style={{ flex: 1 }}>
            {editingName ? (
              <input
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={() => setEditingName(false)}
                onKeyDown={e => { if (e.key === 'Enter') setEditingName(false) }}
                className="w-full outline-none"
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#111317',
                  borderBottom: '2px solid #1339ec',
                  paddingBottom: 2,
                }}
              />
            ) : (
              <div className="flex items-center gap-2 group">
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111317', lineHeight: 1.3 }}>
                  {name}
                </h2>
                <button
                  onClick={() => setEditingName(true)}
                  className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded transition-opacity"
                  style={{ color: '#848ea4' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Pencil size={13} />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Save button */}
            <button
              onClick={handleSave}
              className="px-4 h-9 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: '#1339ec', color: '#fff' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0f2ebd')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1339ec')}
            >
              Save
            </button>
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
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>

          {/* Duration */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#111317', display: 'block', marginBottom: 8 }}>
              Duration <span style={{ color: '#cc0000' }}>*</span>
            </label>
            <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #d3d7de' }}>
              <div className="flex items-center gap-2 px-3 flex-1" style={{ height: 40, borderRight: '1px solid #d3d7de' }}>
                <Calendar size={15} style={{ color: '#848ea4', flexShrink: 0 }} />
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
              <label style={{ fontSize: 13, fontWeight: 600, color: '#111317' }}>
                Campaign Type <span style={{ color: '#cc0000' }}>*</span>
              </label>
              <Info size={13} style={{ color: '#848ea4' }} />
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
              <div className="flex flex-wrap gap-2">
                {CAMPAIGN_TYPES.map(t => (
                  <button
                    key={t.label}
                    onClick={() => setSelectedType(t)}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1"
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      backgroundColor: `${t.color}18`,
                      color: t.color,
                      border: `1px solid ${t.color}33`,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    <span className="rounded-full" style={{ width: 8, height: 8, backgroundColor: t.color, flexShrink: 0 }} />
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

          {/* Responsible Person */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#111317', display: 'block', marginBottom: 8 }}>
              Responsible Person / Owner
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 rounded-full px-3 py-1" style={{ border: '1px solid #e7eaee', backgroundColor: '#fde9e9' }}>
                <div
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{ width: 20, height: 20, backgroundColor: '#fcd6e8' }}
                >
                  <span style={{ fontSize: 9 }}>👤</span>
                </div>
                <span style={{ fontSize: 13, color: '#111317' }}>Sarah A.</span>
                <button style={{ color: '#848ea4' }}>
                  <X size={12} />
                </button>
              </div>
              <AddChipButton onClick={() => {}} />
            </div>
          </div>

          {/* Common */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#111317', display: 'block', marginBottom: 8 }}>
              Common
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <AddChipButton onClick={() => {}} />
              {commonTags.map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1"
                  style={{ fontSize: 13, fontWeight: 500, backgroundColor: '#e9ffcf', color: '#2e881b', border: '1px solid #2e881b22' }}
                >
                  {tag}
                  <button onClick={() => setCommonTags(t => t.filter((_, j) => j !== i))} style={{ color: '#2e881b' }}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Department */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#111317', display: 'block', marginBottom: 8 }}>
              Department
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <AddChipButton onClick={() => {}} />
              {deptTags.map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1"
                  style={{ fontSize: 13, fontWeight: 500, backgroundColor: '#fde9b0', color: '#8c631c', border: '1px solid #8c631c22' }}
                >
                  {tag}
                  <button onClick={() => setDeptTags(t => t.filter((_, j) => j !== i))} style={{ color: '#8c631c' }}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Distribution Channel */}
          <div style={{ paddingBottom: 4 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#111317', display: 'block', marginBottom: 8 }}>
              Distribution Channel
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <AddChipButton onClick={() => {}} />
              {channelTags.map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1"
                  style={{ fontSize: 13, fontWeight: 500, backgroundColor: '#f3f5f7', color: '#5f6a82', border: '1px solid #e7eaee' }}
                >
                  {tag}
                  <button onClick={() => setChannelTags(t => t.filter((_, j) => j !== i))} style={{ color: '#848ea4' }}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
