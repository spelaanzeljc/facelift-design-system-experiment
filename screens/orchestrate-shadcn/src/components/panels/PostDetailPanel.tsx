import { useState } from 'react'
import { X, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { STATUS_CFG, DETAIL_MENU_ITEMS } from '@/data/mock'
import { NET_ICONS } from '@/components/icons'
import type { Post } from '@/types'

interface PostDetailPanelProps {
  open: boolean
  post: Post | null
  onClose: () => void
  onViewDetails: () => void
  onAction: (action: string) => void
}

const PANEL_WIDTH = 300

export default function PostDetailPanel({ open, post, onClose, onViewDetails, onAction }: PostDetailPanelProps) {
  const cfg = post ? STATUS_CFG[post.s] : null
  const [device, setDevice] = useState<'phone' | 'desktop'>('phone')

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
        {post && (
          <>
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              {post.nets.map(net => {
                const Icon = NET_ICONS[net]
                return Icon ? <Icon key={net} /> : null
              })}
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#111317',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}
              >
                {post.title}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center justify-center w-7 h-7 rounded hover:bg-[#f3f5f7] flex-shrink-0"
                style={{ color: '#5f6a82' }}
              >
                <MoreHorizontal size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {DETAIL_MENU_ITEMS.map(item => (
                  <DropdownMenuItem
                    key={item}
                    style={{ fontSize: 13 }}
                    onClick={() => onAction(item)}
                  >
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
        <button
          onClick={onClose}
          className="flex items-center justify-center w-7 h-7 rounded flex-shrink-0"
          style={{ color: '#5f6a82' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <X size={16} />
        </button>
      </div>

      {/* Status + date row */}
      {post && cfg && (
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{ borderBottom: '1px solid #f3f5f7', flexShrink: 0 }}
        >
          <span
            className="rounded-full px-2 py-0.5"
            style={{ fontSize: 11, fontWeight: 500, backgroundColor: cfg.chipBg, color: cfg.chipText }}
          >
            {cfg.label}
          </span>
          <span style={{ fontSize: 12, color: '#5f6a82' }}>{post.t} · Jun 18, 2025</span>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {post ? (
          <div className="p-3">
            {/* Preview label + device toggle */}
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: 12, fontWeight: 600, color: '#111317' }}>Preview</span>
              <div className="flex rounded overflow-hidden border" style={{ borderColor: '#e7eaee' }}>
                {(['phone_iphone', 'desktop_mac'] as const).map((icon, i) => {
                  const isActive = (i === 0 && device === 'phone') || (i === 1 && device === 'desktop')
                  return (
                    <button
                      key={icon}
                      onClick={() => setDevice(i === 0 ? 'phone' : 'desktop')}
                      className="flex items-center justify-center w-7 h-6"
                      style={{ backgroundColor: isActive ? '#e7eaee' : 'transparent' }}
                      title={i === 0 ? 'Mobile preview' : 'Desktop preview'}
                    >
                      <span className="material-icons" style={{ fontSize: 15, color: isActive ? '#1339ec' : '#5f6a82' }}>{icon}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Preview mockup */}
            {device === 'phone' ? (
              /* Phone mockup */
              <div
                className="mx-auto rounded-2xl overflow-hidden flex flex-col"
                style={{
                  width: 200,
                  height: 320,
                  border: '6px solid #111317',
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                }}
              >
                <div
                  className="flex items-center gap-1.5 px-3"
                  style={{ height: 32, backgroundColor: '#f3f5f7', borderBottom: '1px solid #e7eaee', flexShrink: 0 }}
                >
                  <div
                    className="rounded-full"
                    style={{ width: 28, height: 28, background: post.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <span style={{ fontSize: 14 }}>{post.emoji}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#111317', lineHeight: 1 }}>Username</div>
                    <div style={{ fontSize: 8, color: '#848ea4' }}>Sponsored</div>
                  </div>
                </div>
                <div style={{ flex: 1, background: post.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 40 }}>{post.emoji}</span>
                </div>
                <div style={{ padding: '6px 8px', flexShrink: 0 }}>
                  <span style={{ fontSize: 9, color: '#111317', lineHeight: 1.4 }}>{post.title}</span>
                </div>
              </div>
            ) : (
              /* Desktop mockup */
              <div
                className="mx-auto rounded overflow-hidden flex flex-col"
                style={{
                  width: 252,
                  height: 160,
                  border: '3px solid #111317',
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                }}
              >
                <div
                  className="flex items-center gap-1 px-2"
                  style={{ height: 20, backgroundColor: '#f3f5f7', borderBottom: '1px solid #e7eaee', flexShrink: 0 }}
                >
                  {['#cc0000', '#e5a800', '#2e881b'].map(c => (
                    <div key={c} className="rounded-full" style={{ width: 7, height: 7, backgroundColor: c }} />
                  ))}
                  <div className="flex-1 mx-2 h-3 rounded" style={{ backgroundColor: '#e7eaee' }} />
                </div>
                <div style={{ flex: 1, background: post.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 32 }}>{post.emoji}</span>
                </div>
                <div style={{ padding: '4px 6px', flexShrink: 0, backgroundColor: '#f9fafc' }}>
                  <span style={{ fontSize: 9, color: '#111317', lineHeight: 1.3 }}>{post.title}</span>
                </div>
              </div>
            )}

            {/* View details button */}
            <button
              onClick={onViewDetails}
              className="w-full mt-3 h-8 rounded-md border text-xs font-semibold"
              style={{ borderColor: '#1339ec', color: '#1339ec' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#eef3fd')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              View Details
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span style={{ fontSize: 13, color: '#848ea4' }}>No post selected</span>
          </div>
        )}
      </div>
    </div>
  )
}
