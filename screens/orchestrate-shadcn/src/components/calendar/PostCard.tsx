import { STATUS_CFG, TAG_CFG } from '@/data/mock'
import { NET_ICONS } from '@/components/icons'
import type { Post, ViewOpts } from '@/types'

interface PostCardProps {
  card: Post
  onClick?: (card: Post) => void
  viewOpts?: ViewOpts
}

export default function PostCard({ card, onClick, viewOpts }: PostCardProps) {
  const cfg = STATUS_CFG[card.s]
  const isFailed = card.s === 'failed'
  const bg = viewOpts?.colored ? cfg.chipBg : '#fff'

  return (
    <div
      onClick={() => onClick?.(card)}
      className="rounded-lg flex flex-col cursor-pointer overflow-hidden flex-shrink-0"
      style={{
        border: `1px solid ${isFailed ? '#cc0000' : '#e7eaee'}`,
        backgroundColor: bg,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Top colored bar */}
      <div style={{ height: 3, backgroundColor: cfg.border, flexShrink: 0 }} />

      {/* Status + time row */}
      <div className="flex items-center gap-1.5 px-2 pt-1.5 pb-1">
        <div
          className="rounded-full flex-shrink-0"
          style={{ width: 7, height: 7, backgroundColor: cfg.border }}
        />
        <span style={{ fontSize: 11, color: cfg.chipText, fontWeight: 500 }}>{cfg.label}</span>
        <span style={{ fontSize: 11, color: '#848ea4', marginLeft: 'auto' }}>{card.t}</span>
      </div>

      {/* Thumbnail */}
      {viewOpts?.images && (
        <div
          className="mx-2 rounded overflow-hidden flex-shrink-0"
          style={{ height: 72, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span style={{ fontSize: 28 }}>{card.emoji}</span>
        </div>
      )}

      {/* Title */}
      <div
        className="px-2 pt-1.5 pb-1"
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: '#111317',
          lineHeight: '16px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {card.title}
      </div>

      {/* Tags */}
      {viewOpts?.tags && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 px-2 pb-1">
          {card.tags.map(([color, label], i) => {
            const tc = TAG_CFG[color] ?? TAG_CFG.grey
            if (viewOpts.slim) {
              return (
                <div
                  key={i}
                  style={{
                    width: 36,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: tc.bg,
                    flexShrink: 0,
                  }}
                />
              )
            }
            return (
              <span
                key={i}
                className="rounded-full px-1.5"
                style={{ fontSize: 10, fontWeight: 500, backgroundColor: tc.bg, color: tc.color, lineHeight: '16px' }}
              >
                {label}
              </span>
            )
          })}
        </div>
      )}

      {/* Networks row */}
      <div className="flex items-center gap-1 px-2 pb-2 pt-0.5">
        {card.nets.map(net => {
          const Icon = NET_ICONS[net]
          return Icon ? <Icon key={net} /> : null
        })}
      </div>
    </div>
  )
}
