import { DAY_ABBR } from '@/data/mock'
import type { WeekData, ViewMode } from '@/types'

interface ColHeadersProps {
  wd: WeekData
  viewMode: ViewMode
}

// Base week (offset=0) is ISO week 25 of 2026 (Jun 16–22)
const BASE_WEEK = 25

export default function ColHeaders({ wd, viewMode: _viewMode }: ColHeadersProps) {
  const weekNum = BASE_WEEK + wd.offset
  return (
    <div
      className="flex flex-shrink-0"
      style={{
        borderBottom: '1px solid #e7eaee',
        backgroundColor: '#fff',
      }}
    >
      {/* Week number cell */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{ width: 50, borderRight: '1px solid #e7eaee' }}
      >
        <div
          className="rounded flex items-center justify-center"
          style={{
            width: 28,
            height: 20,
            backgroundColor: '#f3f5f7',
            fontSize: 11,
            fontWeight: 600,
            color: '#5f6a82',
          }}
        >
          {weekNum}
        </div>
      </div>

      {/* Day columns */}
      {wd.dates.map((date, i) => {
        const isToday = wd.isToday[i]
        const isWknd = wd.isWknd[i]
        return (
          <div
            key={i}
            className="flex-1 flex flex-col items-center justify-center py-2"
            style={{ backgroundColor: isWknd ? '#f3f5f7' : '#fff', borderRight: '1px solid #e7eaee' }}
          >
            <span style={{ fontSize: 11, color: '#848ea4', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {DAY_ABBR[i]}
            </span>
            <div
              className="flex items-center justify-center rounded-full mt-0.5"
              style={{
                width: 26,
                height: 26,
                backgroundColor: isToday ? '#1339ec' : 'transparent',
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: isToday ? 700 : 400,
                  color: isToday ? '#fff' : '#111317',
                }}
              >
                {date}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
