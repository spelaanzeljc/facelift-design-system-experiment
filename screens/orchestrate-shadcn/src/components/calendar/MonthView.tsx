import { useState } from 'react'
import { POSTS, STATUS_CFG, DAY_ABBR } from '@/data/mock'
import { CAMPS } from '@/data/campaigns'
import { WEEKS } from '@/data/weeks'
import type { Post, Campaign } from '@/types'

interface MonthViewProps {
  onCardClick: (card: Post) => void
  onCampaignClick?: (camp: Campaign) => void
}

// June 2025: June 1 = Sunday.
// Mon-Sun layout → first row starts Mon May 26.
// null = prev/next month overflow day
const MONTH_ROWS: (number | null)[][] = [
  [null, null, null, null, null, null, 1],
  [2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20, 21, 22],
  [23, 24, 25, 26, 27, 28, 29],
  [30, null, null, null, null, null, null],
]

// Derive today's date from the WEEKS data instead of hardcoding
const _todayWeek = WEEKS.find(w => w.isToday.some(Boolean))
const _todayIdx = _todayWeek?.isToday.findIndex(Boolean) ?? -1
const TODAY = _todayIdx >= 0 ? (_todayWeek!.dates[_todayIdx]) : -1

const WEEKEND_COLS = new Set([5, 6]) // Sat, Sun (0-indexed)

const STATUS_DOT: Record<string, string> = {
  successful:     '#2e881b',
  scheduled:      '#1339ec',
  draft:          '#a7aebe',
  failed:         '#cc0000',
  to_be_approved: '#e05a00',
}

// Gather all posts across all weeks keyed by June day number
function buildDayPosts(): Record<number, Post[]> {
  const map: Record<number, Post[]> = {}
  // Week offsets: -1 = Jun 9-15, 0 = Jun 16-22, 1 = Jun 23-29
  for (const wd of WEEKS) {
    wd.dates.forEach((date, di) => {
      if (date >= 1 && date <= 30) {
        if (!map[date]) map[date] = []
        map[date].push(...(wd.cards[di] ?? []))
      }
    })
  }
  return map
}

const DAY_POSTS = buildDayPosts()

// Which campaigns are visible this month?
const MONTH_CAMPS = CAMPS // all campaigns span June

export default function MonthView({ onCardClick, onCampaignClick }: MonthViewProps) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)

  return (
    <div
      className="flex-1 flex flex-col rounded-xl overflow-hidden"
      style={{ border: '1px solid #e7eaee', backgroundColor: '#fff', minHeight: 0 }}
    >
      {/* Campaign bars */}
      <div
        className="flex-shrink-0 px-2 pt-2 pb-1 flex flex-col gap-1"
        style={{ borderBottom: '1px solid #e7eaee' }}
      >
        {MONTH_CAMPS.map((camp, i) => (
          <button
            key={i}
            className="flex items-center gap-1.5 rounded px-2 w-full text-left"
            style={{ height: 22, backgroundColor: camp.color, border: `1px solid ${camp.color === '#e9eaec' ? '#d3d7de' : camp.color}`, cursor: 'pointer' }}
            onClick={() => onCampaignClick?.(camp)}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <span style={{ fontSize: 11 }}>{camp.emoji}</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: camp.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
              {camp.name}
            </span>
            <span style={{ fontSize: 10, color: camp.text, opacity: 0.7, marginLeft: 'auto', whiteSpace: 'nowrap' }}>
              Jun {camp.s}–{camp.e}
            </span>
          </button>
        ))}
      </div>

      {/* Day-of-week header */}
      <div className="flex flex-shrink-0" style={{ borderBottom: '1px solid #e7eaee' }}>
        {DAY_ABBR.map((abbr, i) => (
          <div
            key={i}
            className="flex-1 flex items-center justify-center py-1.5"
            style={{ backgroundColor: WEEKEND_COLS.has(i) ? '#f9fafc' : '#fff' }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, color: '#848ea4', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {abbr}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
        {MONTH_ROWS.map((row, ri) => (
          <div
            key={ri}
            className="flex"
            style={{ borderBottom: ri < MONTH_ROWS.length - 1 ? '1px solid #f3f5f7' : 'none', minHeight: 88 }}
          >
            {row.map((day, ci) => {
              const isToday = day === TODAY
              const isWknd = WEEKEND_COLS.has(ci)
              const posts = day !== null ? (DAY_POSTS[day] ?? []) : []
              const dots = day !== null ? (POSTS[day] ?? []) : []
              const isHovered = hoveredDay === day && day !== null
              const hasContent = dots.length > 0 || posts.length > 0

              return (
                <div
                  key={ci}
                  className="flex-1 flex flex-col p-1.5"
                  style={{
                    borderRight: ci < 6 ? '1px solid #f3f5f7' : 'none',
                    backgroundColor: day === null
                      ? '#f9fafc'
                      : isWknd
                        ? '#f9fafc'
                        : isHovered && hasContent
                          ? '#f3f5f7'
                          : 'transparent',
                    cursor: hasContent && day !== null ? 'pointer' : 'default',
                    minHeight: 88,
                  }}
                  onMouseEnter={() => day !== null && setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  onClick={() => {
                    if (day === null) return
                    // Click first available post for this day
                    if (posts.length > 0) {
                      onCardClick(posts[0])
                    }
                  }}
                >
                  {/* Day number */}
                  {day !== null ? (
                    <div
                      className="flex items-center justify-center w-6 h-6 rounded-full mb-1 self-end"
                      style={{
                        backgroundColor: isToday ? '#1339ec' : 'transparent',
                        fontSize: 12,
                        fontWeight: isToday ? 700 : 400,
                        color: isToday ? '#fff' : '#111317',
                      }}
                    >
                      {day}
                    </div>
                  ) : (
                    <div className="w-6 h-6 mb-1 self-end" />
                  )}

                  {/* Post cards (compact) — show for days with week data */}
                  {posts.length > 0 && (
                    <div className="flex flex-col gap-0.5 mb-1">
                      {posts.slice(0, 2).map((post, pi) => {
                        const cfg = STATUS_CFG[post.s]
                        return (
                          <div
                            key={pi}
                            className="rounded px-1.5 flex items-center gap-1 overflow-hidden"
                            style={{
                              height: 20,
                              backgroundColor: cfg.chipBg,
                              border: `1px solid ${cfg.border}22`,
                            }}
                          >
                            <div
                              className="rounded-full flex-shrink-0"
                              style={{ width: 5, height: 5, backgroundColor: cfg.border }}
                            />
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 500,
                                color: cfg.chipText,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1,
                              }}
                            >
                              {post.title}
                            </span>
                          </div>
                        )
                      })}
                      {posts.length > 2 && (
                        <span style={{ fontSize: 10, color: '#848ea4', paddingLeft: 4 }}>
                          +{posts.length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Dot indicators for days without full card data */}
                  {posts.length === 0 && dots.length > 0 && (
                    <div className="flex flex-wrap gap-0.5 mt-auto">
                      {dots.slice(0, 4).map((dot, di) => (
                        <div
                          key={di}
                          className="rounded-full"
                          style={{
                            width: 7,
                            height: 7,
                            backgroundColor: STATUS_DOT[dot.s] ?? '#a7aebe',
                          }}
                        />
                      ))}
                      {dots.length > 4 && (
                        <span style={{ fontSize: 9, color: '#848ea4' }}>+{dots.length - 4}</span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
