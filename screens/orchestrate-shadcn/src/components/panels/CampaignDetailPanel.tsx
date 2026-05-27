import { X, MoreHorizontal, Calendar, FileText, Tag, Clock, ChevronDown, ChevronRight, Pencil, Kanban, Users, Trash2 } from 'lucide-react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import type { Campaign } from '@/types'

interface CampaignDetailPanelProps {
  open: boolean
  campaign: Campaign | null
  onClose: () => void
  onEdit: () => void
  onAction: (action: string) => void
}

const PANEL_WIDTH = 380

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderBottom: '1px solid #f3f5f7' }}>
      <button
        className="flex items-center justify-between w-full px-4 py-3"
        onClick={() => setOpen(o => !o)}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafc')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: '#111317' }}>{title}</span>
        {open
          ? <ChevronDown size={15} style={{ color: '#848ea4' }} />
          : <ChevronRight size={15} style={{ color: '#848ea4' }} />
        }
      </button>
      {open && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  )
}

export default function CampaignDetailPanel({ open, campaign, onClose, onEdit, onAction }: CampaignDetailPanelProps) {
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
        <FileText size={16} style={{ color: '#848ea4', flexShrink: 0 }} />
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#111317',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {campaign?.name ?? 'Campaign'}
        </span>

        {/* ⋯ dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center justify-center w-7 h-7 rounded"
            style={{ color: '#5f6a82' }}
            title="More options"
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#eef3fd')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <MoreHorizontal size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" style={{ minWidth: 180 }}>
            <DropdownMenuItem
              onClick={onEdit}
              className="flex items-center gap-2.5"
              style={{ fontSize: 13, color: '#111317' }}
            >
              <Pencil size={14} style={{ color: '#5f6a82' }} />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onAction('Open Taskboard')}
              className="flex items-center gap-2.5"
              style={{ fontSize: 13, color: '#111317' }}
            >
              <Kanban size={14} style={{ color: '#5f6a82' }} />
              Open Taskboard
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onAction('Team Assignment')}
              className="flex items-center gap-2.5"
              style={{ fontSize: 13, color: '#111317' }}
            >
              <Users size={14} style={{ color: '#5f6a82' }} />
              Team Assignment
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onAction('Delete')}
              className="flex items-center gap-2.5"
              style={{ fontSize: 13, color: '#cc0000' }}
            >
              <Trash2 size={14} style={{ color: '#cc0000' }} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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

      {campaign && (
        <div className="flex-1 overflow-y-auto">
          {/* Status / date row */}
          <div
            className="flex items-center gap-3 px-4 py-3 flex-wrap"
            style={{ borderBottom: '1px solid #f3f5f7' }}
          >
            <span
              className="rounded-full px-2.5 py-0.5"
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                backgroundColor: campaign.status === 'active' ? '#e9ffcf' : '#f3f5f7',
                color: campaign.status === 'active' ? '#2e881b' : '#848ea4',
              }}
            >
              {campaign.status?.toUpperCase() ?? 'ACTIVE'}
            </span>

            <div className="flex items-center gap-1.5" style={{ color: '#5f6a82' }}>
              <Calendar size={13} />
              <span style={{ fontSize: 12 }}>Jun {campaign.s} – Jun {campaign.e}, 2026</span>
            </div>
          </div>

          {/* Description */}
          <Section title="Description">
            <p style={{ fontSize: 13, color: '#5f6a82', lineHeight: 1.6 }}>
              {campaign.description ?? 'No description provided.'}
            </p>
          </Section>

          {/* Settings */}
          <Section title="Settings">
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div
                  className="flex items-center justify-center flex-shrink-0 rounded"
                  style={{ width: 28, height: 28, backgroundColor: '#f3f5f7', marginTop: 1 }}
                >
                  <Tag size={13} style={{ color: '#848ea4' }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#848ea4', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
                    Campaign type
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="rounded-full flex-shrink-0"
                      style={{ width: 10, height: 10, backgroundColor: campaign.typeColor ?? '#a7aebe' }}
                    />
                    <span style={{ fontSize: 13, color: '#111317', fontWeight: 500 }}>
                      {campaign.type ?? 'General'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className="flex items-center justify-center flex-shrink-0 rounded"
                  style={{ width: 28, height: 28, backgroundColor: '#f3f5f7', marginTop: 1 }}
                >
                  <Clock size={13} style={{ color: '#848ea4' }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#848ea4', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
                    Timing
                  </div>
                  <span style={{ fontSize: 13, color: '#111317' }}>
                    {campaign.timing ?? 'Not all-day Campaign'}
                  </span>
                </div>
              </div>
            </div>
          </Section>

          {/* Activity */}
          <Section title="Activity">
            <div className="flex items-start gap-3">
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{ width: 28, height: 28, backgroundColor: '#0c228d', color: '#fff', fontSize: 10, fontWeight: 700 }}
              >
                SA
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: '#111317', fontWeight: 500 }}>
                  Created by {campaign.createdBy ?? 'Sarah A.'}
                </div>
                <div style={{ fontSize: 11, color: '#848ea4', marginTop: 2 }}>
                  {campaign.createdAt ?? 'May 2026'}
                </div>
              </div>
            </div>
          </Section>
        </div>
      )}
    </div>
  )
}
