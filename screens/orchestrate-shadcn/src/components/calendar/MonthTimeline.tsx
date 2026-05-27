import { CAMPS } from '@/data/campaigns'
import { POSTS, STATUS_CFG } from '@/data/mock'
import type { Post } from '@/types'

interface MonthTimelineProps {
  onCardClick: (card: Post) => void
}

const DAYS = Array.from({ length: 30 }, (_, i) => i + 1)

const DOT_COLORS: Record<string, string> = {
  successful: '#2e881b',
  scheduled: '#1339ec',
  draft: '#a7aebe',
  failed: '#cc0000',
}

export default function MonthTimeline({ onCardClick: _onCardClick }: MonthTimelineProps) {
  return (
    <div className="flex-1 overflow-auto rounded-xl border" style={{ borderColor: '#e7eaee', backgroundColor: '#fff' }}>
      {/* Header row with day numbers */}
      <div
        className="flex sticky top-0 z-10"
        style={{ backgroundColor: '#fff', borderBottom: '1px solid #e7eaee' }}
      >
        <div style={{ width: 200, flexShrink: 0, padding: '8px 12px', fontSize: 12, fontWeight: 600, color: '#5f6a82' }}>
          June 2025
        </div>
        {DAYS.map(day => (
          <div
            key={day}
            className="flex items-center justify-center"
            style={{
              flex: 1,
              minWidth: 28,
              height: 36,
              fontSize: 11,
              color: '#5f6a82',
              borderRight: '1px solid #f3f5f7',
              fontWeight: 500,
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Campaign rows */}
      {CAMPS.map((camp, ci) => (
        <div
          key={ci}
          className="flex items-center"
          style={{ height: 32, borderBottom: '1px solid #f3f5f7' }}
        >
          <div
            style={{
              width: 200,
              flexShrink: 0,
              padding: '0 12px',
              fontSize: 12,
              fontWeight: 500,
              color: camp.text,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ marginRight: 4 }}>{camp.emoji}</span>
            {camp.name}
          </div>
          <div className="flex-1 relative" style={{ height: '100%' }}>
            {/* Campaign bar spanning s to e days */}
            <div
              style={{
                position: 'absolute',
                left: `${((camp.s - 1) / 30) * 100}%`,
                width: `${((camp.e - camp.s + 1) / 30) * 100}%`,
                top: '50%',
                transform: 'translateY(-50%)',
                height: 20,
                backgroundColor: camp.color,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 8,
                fontSize: 11,
                fontWeight: 500,
                color: camp.text,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              {camp.name}
            </div>
          </div>
        </div>
      ))}

      {/* Posts row */}
      <div className="flex items-center" style={{ height: 40, borderBottom: '1px solid #f3f5f7' }}>
        <div
          style={{
            width: 200,
            flexShrink: 0,
            padding: '0 12px',
            fontSize: 12,
            fontWeight: 600,
            color: '#111317',
          }}
        >
          Posts
        </div>
        <div className="flex-1 relative flex" style={{ height: '100%' }}>
          {DAYS.map(day => {
            const dayPosts = POSTS[day] ?? []
            return (
              <div
                key={day}
                className="flex flex-col items-center justify-center gap-0.5"
                style={{ flex: 1, minWidth: 28, borderRight: '1px solid #f3f5f7' }}
              >
                {dayPosts.slice(0, 3).map((p, pi) => (
                  <div
                    key={pi}
                    className="rounded-full"
                    style={{
                      width: 6,
                      height: 6,
                      backgroundColor: DOT_COLORS[p.s] ?? '#a7aebe',
                    }}
                  />
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-3">
        {Object.entries(STATUS_CFG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="rounded-full" style={{ width: 8, height: 8, backgroundColor: cfg.border }} />
            <span style={{ fontSize: 11, color: '#5f6a82' }}>{cfg.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
