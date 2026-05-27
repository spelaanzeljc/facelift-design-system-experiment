import { useState, useEffect } from 'react'
import React from 'react'

interface DateRangePickerProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  panelRef: React.RefObject<HTMLDivElement | null>
}


const DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function buildCalendar(year: number, month: number) {
  // month is 1-indexed
  const firstDay = new Date(year, month - 1, 1).getDay()
  // convert Sunday=0 to Mon-based: Mon=0..Sun=6
  const startOffset = (firstDay + 6) % 7
  const daysInMonth = new Date(year, month, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

export default function DateRangePicker({ anchorEl, open, panelRef }: DateRangePickerProps) {
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const [rangeStart, setRangeStart] = useState<{ m: number; d: number } | null>({ m: 0, d: 16 })
  const [rangeEnd, setRangeEnd] = useState<{ m: number; d: number } | null>({ m: 0, d: 22 })
  const [selecting, setSelecting] = useState(false)

  useEffect(() => {
    if (anchorEl) {
      const rect = anchorEl.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, left: rect.left })
    }
  }, [anchorEl, open])

  const toIdx = (m: number, d: number) => m * 100 + d
  const inRange = (m: number, d: number) => {
    if (!rangeStart || !rangeEnd) return false
    const idx = toIdx(m, d)
    return idx >= toIdx(rangeStart.m, rangeStart.d) && idx <= toIdx(rangeEnd.m, rangeEnd.d)
  }
  const isStart = (m: number, d: number) => rangeStart?.m === m && rangeStart?.d === d
  const isEnd = (m: number, d: number) => rangeEnd?.m === m && rangeEnd?.d === d

  const handleDayClick = (m: number, d: number) => {
    if (!selecting || !rangeStart) {
      setRangeStart({ m, d })
      setRangeEnd(null)
      setSelecting(true)
    } else {
      const idx = toIdx(m, d)
      const startIdx = toIdx(rangeStart.m, rangeStart.d)
      if (idx >= startIdx) {
        setRangeEnd({ m, d })
      } else {
        setRangeEnd(rangeStart)
        setRangeStart({ m, d })
      }
      setSelecting(false)
    }
  }

  const months = [
    { name: 'June 2025', cells: buildCalendar(2025, 6), mi: 0 },
    { name: 'July 2025', cells: buildCalendar(2025, 7), mi: 1 },
  ]

  return (
    <div
      ref={panelRef}
      style={{
        display: open ? 'block' : 'none',
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        zIndex: 1000,
        width: 560,
        backgroundColor: '#fff',
        borderRadius: 10,
        border: '1px solid #e7eaee',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        padding: 20,
      }}
    >
      <div className="flex gap-6">
        {months.map(({ name, cells, mi }) => (
          <div key={mi} style={{ flex: 1 }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: 13, fontWeight: 600, color: '#111317' }}>{name}</span>
            </div>
            {/* Day of week headers */}
            <div className="grid grid-cols-7 mb-1">
              {DOW.map(d => (
                <div key={d} className="flex items-center justify-center" style={{ height: 28, fontSize: 11, fontWeight: 600, color: '#848ea4' }}>
                  {d}
                </div>
              ))}
            </div>
            {/* Day cells */}
            <div className="grid grid-cols-7">
              {cells.map((day, ci) => {
                if (!day) return <div key={ci} />
                const selected = isStart(mi, day) || isEnd(mi, day)
                const inR = inRange(mi, day)
                return (
                  <button
                    key={ci}
                    onClick={() => handleDayClick(mi, day)}
                    className="flex items-center justify-center"
                    style={{
                      height: 30,
                      fontSize: 12,
                      borderRadius: selected ? 15 : 0,
                      backgroundColor: selected ? '#1339ec' : inR ? '#eef3fd' : 'transparent',
                      color: selected ? '#fff' : inR ? '#1339ec' : '#111317',
                      fontWeight: selected ? 700 : 400,
                    }}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid #f3f5f7' }}>
        <span style={{ fontSize: 12, color: '#5f6a82' }}>
          {rangeStart && rangeEnd
            ? `Jun ${rangeStart.d} – ${rangeEnd.m === 0 ? 'Jun' : 'Jul'} ${rangeEnd.d}, 2025`
            : rangeStart
              ? `Jun ${rangeStart.d}, 2025 – …`
              : 'Select a date range'}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => { setRangeStart(null); setRangeEnd(null); setSelecting(false) }}
            className="px-3 h-7 rounded-md border text-xs font-medium"
            style={{ borderColor: '#e7eaee', color: '#5f6a82' }}
          >
            Clear
          </button>
          <button
            className="px-3 h-7 rounded-md text-xs font-semibold"
            style={{ backgroundColor: '#1339ec', color: '#fff' }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
