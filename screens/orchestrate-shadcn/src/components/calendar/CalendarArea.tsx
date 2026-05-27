import ColHeaders from './ColHeaders'
import DayGrid from './DayGrid'
import DayView from './DayView'
import MonthView from './MonthView'
import MonthTimeline from './MonthTimeline'
import ListView from './ListView'
import type { WeekData, ViewMode, CalView, ViewOpts, Post, Campaign, ActiveFilters } from '@/types'

interface CalendarAreaProps {
  wd: WeekData
  viewMode: ViewMode
  calView: CalView
  onCardClick: (card: Post) => void
  viewOpts: ViewOpts
  onCampaignClick?: (camp: Campaign) => void
  activeFilters?: ActiveFilters
  selectedDay?: number
  onDayChange?: (day: number) => void
  campaigns: Campaign[]
  userPosts?: { date: number; post: Post }[]
  onAddPost?: (date: number) => void
}

const EMPTY_FILTERS: ActiveFilters = { statuses: [], networks: [], tags: [] }

export default function CalendarArea({ wd, viewMode, calView, onCardClick, viewOpts, onCampaignClick, activeFilters = EMPTY_FILTERS, selectedDay = 18, onDayChange: _onDayChange, campaigns, userPosts, onAddPost }: CalendarAreaProps) {
  if (viewMode === 'day') {
    return (
      <div className="flex-1 overflow-hidden flex flex-col p-3" style={{ minHeight: 0 }}>
        <DayView selectedDay={selectedDay} onCardClick={onCardClick} viewOpts={viewOpts} onCampaignClick={onCampaignClick} activeFilters={activeFilters} campaigns={campaigns} userPosts={userPosts} onAddPost={onAddPost} />
      </div>
    )
  }

  if (calView === 'list') {
    return (
      <div className="flex-1 overflow-hidden flex flex-col p-3" style={{ minHeight: 0 }}>
        <ListView wd={wd} onCardClick={onCardClick} activeFilters={activeFilters} />
      </div>
    )
  }

  if (viewMode === 'month') {
    return (
      <div className="flex-1 overflow-hidden flex flex-col p-3" style={{ minHeight: 0 }}>
        <MonthView onCardClick={onCardClick} onCampaignClick={onCampaignClick} campaigns={campaigns} />
      </div>
    )
  }

  if (viewMode === 'month-timeline') {
    return (
      <div className="flex-1 overflow-hidden flex flex-col p-3" style={{ minHeight: 0 }}>
        <MonthTimeline onCardClick={onCardClick} campaigns={campaigns} />
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
        <DayGrid wd={wd} viewMode={viewMode} onCardClick={onCardClick} viewOpts={viewOpts} onCampaignClick={onCampaignClick} activeFilters={activeFilters} campaigns={campaigns} userPosts={userPosts} onAddPost={onAddPost} />
      </div>
    </div>
  )
}
