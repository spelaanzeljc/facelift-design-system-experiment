import { STATUS_CFG, TAG_CFG } from '@/data/mock'
import { NET_ICONS } from '@/components/icons'
import { filterPosts } from '@/lib/filterPosts'
import type { WeekData, Post, ActiveFilters } from '@/types'

interface ListViewProps {
  wd: WeekData
  onCardClick: (card: Post) => void
  activeFilters?: ActiveFilters
}

const EMPTY_FILTERS: ActiveFilters = { statuses: [], networks: [], tags: [] }

export default function ListView({ wd, onCardClick, activeFilters = EMPTY_FILTERS }: ListViewProps) {
  const allCards = filterPosts(
    wd.cards.flatMap((daycards, di) => daycards.map(card => ({ ...card, dateIdx: di }))),
    activeFilters
  )

  return (
    <div className="flex-1 overflow-auto">
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#e7eaee', backgroundColor: '#fff' }}>
        {/* Table header */}
        <div
          className="flex items-center px-4 py-2"
          style={{ borderBottom: '1px solid #e7eaee', backgroundColor: '#f3f5f7' }}
        >
          <div style={{ flex: 3, fontSize: 11, fontWeight: 600, color: '#5f6a82', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Post
          </div>
          <div style={{ flex: 1.5, fontSize: 11, fontWeight: 600, color: '#5f6a82', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Status
          </div>
          <div style={{ flex: 1.5, fontSize: 11, fontWeight: 600, color: '#5f6a82', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Time
          </div>
          <div style={{ flex: 1, fontSize: 11, fontWeight: 600, color: '#5f6a82', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Networks
          </div>
          <div style={{ flex: 2, fontSize: 11, fontWeight: 600, color: '#5f6a82', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Tags
          </div>
        </div>

        {/* Table rows */}
        {allCards.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <span style={{ fontSize: 14, color: '#848ea4' }}>No posts this week</span>
          </div>
        ) : (
          allCards.map((card, i) => {
            const cfg = STATUS_CFG[card.s]
            return (
              <div
                key={i}
                className="flex items-center px-4 py-3 cursor-pointer"
                style={{ borderBottom: '1px solid #f3f5f7' }}
                onClick={() => onCardClick(card)}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafc')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {/* Post */}
                <div className="flex items-center gap-2" style={{ flex: 3 }}>
                  <div
                    className="rounded flex items-center justify-center flex-shrink-0"
                    style={{ width: 36, height: 36, background: card.bg }}
                  >
                    <span style={{ fontSize: 18 }}>{card.emoji}</span>
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#111317',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {card.title}
                  </span>
                </div>

                {/* Status */}
                <div style={{ flex: 1.5 }}>
                  <span
                    className="rounded-full px-2 py-0.5"
                    style={{ fontSize: 11, fontWeight: 500, backgroundColor: cfg.chipBg, color: cfg.chipText }}
                  >
                    {cfg.label}
                  </span>
                </div>

                {/* Time */}
                <div style={{ flex: 1.5, fontSize: 12, color: '#5f6a82' }}>
                  {card.t}
                </div>

                {/* Networks */}
                <div className="flex items-center gap-1" style={{ flex: 1 }}>
                  {card.nets.map(net => {
                    const Icon = NET_ICONS[net]
                    return Icon ? <Icon key={net} /> : null
                  })}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1" style={{ flex: 2 }}>
                  {card.tags.map(([color, label], ti) => {
                    const tc = TAG_CFG[color] ?? TAG_CFG.grey
                    return (
                      <span
                        key={ti}
                        className="rounded-full px-1.5"
                        style={{ fontSize: 10, fontWeight: 500, backgroundColor: tc.bg, color: tc.color, lineHeight: '16px' }}
                      >
                        {label}
                      </span>
                    )
                  })}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
