import { CAMPS } from '@/data/campaigns'
import { WEEKS } from '@/data/weeks'
import { filterPosts } from '@/lib/filterPosts'
import PostCard from './PostCard'
import type { Post, ViewOpts, ActiveFilters } from '@/types'

interface DayViewProps {
  selectedDay: number
  onCardClick: (card: Post) => void
  viewOpts: ViewOpts
  onCampaignClick?: (camp: typeof CAMPS[0]) => void
  activeFilters?: ActiveFilters
}

const EMPTY_FILTERS: ActiveFilters = { statuses: [], networks: [], tags: [] }

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function DayView({ selectedDay, onCardClick, viewOpts, onCampaignClick, activeFilters = EMPTY_FILTERS }: DayViewProps) {
  // Find posts for this day across all weeks
  let dayPosts: Post[] = []
  for (const week of WEEKS) {
    const idx = week.dates.indexOf(selectedDay)
    if (idx !== -1) {
      dayPosts = filterPosts(week.cards[idx] ?? [], activeFilters)
      break
    }
  }

  // Sort posts by time
  const sorted = [...dayPosts].sort((a, b) => {
    const toMin = (t: string) => {
      const [time, ampm] = t.split(' ')
      const [h, m] = time.split(':').map(Number)
      return ((h % 12) + (ampm === 'PM' ? 12 : 0)) * 60 + m
    }
    return toMin(a.t) - toMin(b.t)
  })

  // Campaigns that span this day
  const visibleCamps = CAMPS.filter(c => c.s <= selectedDay && c.e >= selectedDay)

  // Day of week for June 2026: Jun 1 = Monday (weekday index 1)
  const DOW_JUNE_2026_START = 1 // Monday = index 1
  const dowIdx = (DOW_JUNE_2026_START + selectedDay - 1) % 7
  const dayName = DAY_NAMES[dowIdx]

  return (
    <div
      className="flex-1 flex flex-col rounded-xl overflow-hidden"
      style={{ border: '1px solid #e7eaee', backgroundColor: '#fff', minHeight: 0 }}
    >
      {/* Day header */}
      <div
        className="flex-shrink-0 px-4 py-3"
        style={{ borderBottom: '1px solid #e7eaee' }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, color: '#111317' }}>
          {dayName}, {MONTH_NAMES[5]} {selectedDay}, 2026
        </div>
        <div style={{ fontSize: 12, color: '#848ea4', marginTop: 2 }}>
          {sorted.length === 0 ? 'No post sets scheduled' : `${sorted.length} post set${sorted.length !== 1 ? 's' : ''} scheduled`}
        </div>
      </div>

      {/* Campaign bars */}
      {visibleCamps.length > 0 && (
        <div
          className="flex-shrink-0 px-4 py-2 flex flex-col gap-1"
          style={{ borderBottom: '1px solid #e7eaee' }}
        >
          {visibleCamps.map((camp, i) => (
            <button
              key={i}
              className="flex items-center gap-2 rounded px-2 w-full text-left"
              style={{
                height: 24,
                backgroundColor: camp.color,
                border: `1px solid ${camp.color === '#e9eaec' ? '#d3d7de' : 'transparent'}`,
                cursor: 'pointer',
              }}
              onClick={() => onCampaignClick?.(camp)}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <span style={{ fontSize: 12 }}>{camp.emoji}</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: camp.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {camp.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Posts list */}
      <div className="flex-1 overflow-y-auto px-4 py-3" style={{ minHeight: 0 }}>
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3" style={{ minHeight: 200 }}>
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: 52, height: 52, backgroundColor: '#f3f5f7' }}
            >
              <span className="material-icons" style={{ fontSize: 26, color: '#a7aebe' }}>calendar_today</span>
            </div>
            <div style={{ fontSize: 14, color: '#848ea4', fontWeight: 500 }}>No post sets for this day</div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sorted.map((post, i) => (
              <div key={i} className="flex gap-3 items-start">
                {/* Time label */}
                <div
                  className="flex-shrink-0 text-right"
                  style={{ width: 70, fontSize: 12, color: '#848ea4', paddingTop: 10, fontVariantNumeric: 'tabular-nums' }}
                >
                  {post.t}
                </div>
                {/* Card */}
                <div className="flex-1" style={{ maxWidth: 320 }}>
                  <PostCard card={post} onClick={onCardClick} viewOpts={viewOpts} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
