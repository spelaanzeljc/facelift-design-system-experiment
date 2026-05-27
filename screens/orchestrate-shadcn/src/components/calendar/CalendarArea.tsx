import ColHeaders from './ColHeaders'
import DayGrid from './DayGrid'
import MonthTimeline from './MonthTimeline'
import ListView from './ListView'
import type { WeekData, ViewMode, CalView, ViewOpts, Post } from '@/types'

interface CalendarAreaProps {
  wd: WeekData
  viewMode: ViewMode
  calView: CalView
  onCardClick: (card: Post) => void
  viewOpts: ViewOpts
}

export default function CalendarArea({ wd, viewMode, calView, onCardClick, viewOpts }: CalendarAreaProps) {
  if (calView === 'list') {
    return (
      <div className="flex-1 overflow-hidden flex flex-col p-3" style={{ minHeight: 0 }}>
        <ListView wd={wd} onCardClick={onCardClick} />
      </div>
    )
  }

  if (viewMode === 'month-timeline') {
    return (
      <div className="flex-1 overflow-hidden flex flex-col p-3" style={{ minHeight: 0 }}>
        <MonthTimeline onCardClick={onCardClick} />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-3" style={{ minHeight: 0 }}>
      <div
        className="flex flex-col flex-1 rounded-xl overflow-hidden"
        style={{ border: '1px solid #e7eaee', backgroundColor: '#fff', minHeight: 0 }}
      >
        <ColHeaders wd={wd} viewMode={viewMode} />
        <DayGrid wd={wd} viewMode={viewMode} onCardClick={onCardClick} viewOpts={viewOpts} />
      </div>
    </div>
  )
}
