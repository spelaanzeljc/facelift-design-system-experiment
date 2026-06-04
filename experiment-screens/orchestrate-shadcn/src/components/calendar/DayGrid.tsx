import PostCard from './PostCard'
import { filterPosts } from '@/lib/filterPosts'
import { Plus } from 'lucide-react'
import type { WeekData, ViewMode, ViewOpts, Post, Campaign, ActiveFilters } from '@/types'

interface DayGridProps {
  wd: WeekData
  viewMode: ViewMode
  onCardClick: (card: Post) => void
  viewOpts: ViewOpts
  onCampaignClick?: (camp: Campaign) => void
  activeFilters?: ActiveFilters
  campaigns: Campaign[]
  userPosts?: { date: number; post: Post }[]
  onAddPost?: (date: number) => void
}

const EMPTY_FILTERS: ActiveFilters = { statuses: [], networks: [], tags: [] }

export default function DayGrid({ wd, viewMode: _viewMode, onCardClick, viewOpts, onCampaignClick, activeFilters = EMPTY_FILTERS, campaigns, userPosts, onAddPost }: DayGridProps) {
  const weekStart = wd.dates[0]
  const weekEnd = wd.dates[6]

  const visibleCamps = campaigns.filter(c => c.e >= weekStart && c.s <= weekEnd)

  const campColSpan = (camp: Campaign) => {
    const clampedStart = Math.max(camp.s, weekStart)
    const clampedEnd = Math.min(camp.e, weekEnd)
    const startIdx = clampedStart - weekStart
    const span = clampedEnd - clampedStart + 1
    return { startIdx, span }
  }

  return (
    <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
      {/* Campaign bars */}
      {visibleCamps.length > 0 && (
        <div
          className="flex-shrink-0"
          style={{ borderBottom: '1px solid #e7eaee', paddingBottom: 4, paddingTop: 4 }}
        >
          {visibleCamps.map((camp, ci) => {
            const { startIdx, span } = campColSpan(camp)
            return (
              <div key={ci} className="flex" style={{ marginBottom: 2 }}>
                {/* Left spacer (week number column) */}
                <div style={{ width: 50, flexShrink: 0 }} />
                {/* Grid cells */}
                {wd.dates.map((_, di) => {
                  if (di === startIdx) {
                    return (
                      <button
                        key={di}
                        className="flex items-center gap-1.5 rounded overflow-hidden px-2 text-left"
                        style={{
                          flex: span,
                          height: 24,
                          backgroundColor: camp.color,
                          border: `1px solid ${camp.color === '#e9eaec' ? '#d3d7de' : camp.color}`,
                          marginRight: 2,
                          cursor: 'pointer',
                        }}
                        onClick={() => onCampaignClick?.(camp)}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                      >
                        <span style={{ fontSize: 12 }}>{camp.emoji}</span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 500,
                            color: camp.text,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {camp.name}
                        </span>
                      </button>
                    )
                  } else if (di > startIdx && di < startIdx + span) {
                    return null
                  } else {
                    return <div key={di} style={{ flex: 1, marginRight: 2 }} />
                  }
                })}
              </div>
            )
          })}
        </div>
      )}

      {/* Post card grid */}
      <div className="flex" style={{ alignItems: 'flex-start' }}>
        {/* Week number column */}
        <div style={{ width: 50, flexShrink: 0, borderRight: '1px solid #e7eaee', minHeight: '100%' }} />

        {/* Day columns */}
        {wd.dates.map((_, di) => {
          const isWknd = wd.isWknd[di]
          const isToday = wd.isToday[di]
          const extra = (userPosts ?? []).filter(up => up.date === wd.dates[di]).map(up => up.post)
          const cards = filterPosts([...(wd.cards[di] ?? []), ...extra], activeFilters)

          return (
            <div
              key={di}
              className="group flex-1 flex flex-col gap-2 p-2"
              style={{
                borderRight: '1px solid #e7eaee',
                backgroundColor: isWknd
                  ? '#f3f5f7'
                  : isToday
                    ? 'rgba(19,57,236,0.025)'
                    : 'transparent',
                minHeight: 200,
              }}
            >
              {cards.map((card, ci) => (
                <PostCard key={ci} card={card} onClick={onCardClick} viewOpts={viewOpts} />
              ))}
              <button
                className="opacity-0 group-hover:opacity-100 w-full flex items-center justify-center gap-1 h-6 rounded mt-1 transition-opacity"
                style={{ color: '#1339ec', fontSize: 12, fontWeight: 500 }}
                onClick={e => { e.stopPropagation(); onAddPost?.(wd.dates[di]) }}
                title={`Add post on Jun ${wd.dates[di]}`}
              >
                <Plus size={12} /> Add post
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
