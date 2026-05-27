import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { WeekData, ViewMode, CalView } from '@/types'
import React from 'react'

interface ToolbarRowProps {
  wd: WeekData
  weekOffset: number
  viewMode: ViewMode
  calView: CalView
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  onViewMode: (v: ViewMode) => void
  onCalView: (v: CalView) => void
  onOpenSearch: () => void
  onOpenDrafts: () => void
  onOpenFilters: () => void
  onToggleDatePicker: () => void
  onToggleViewOptions: () => void
  datePickerBtnRef: React.RefObject<HTMLButtonElement | null>
  viewOptsBtnRef: React.RefObject<HTMLButtonElement | null>
  hasActiveFilters?: boolean
}

const VIEW_MODE_LABELS: Record<ViewMode, string> = {
  week: 'Week',
  month: 'Month',
  'month-timeline': 'Month Timeline',
}

export default function ToolbarRow({
  wd, weekOffset, viewMode, calView,
  onPrev, onNext, onToday,
  onViewMode, onCalView,
  onOpenSearch, onOpenDrafts: _onOpenDrafts, onOpenFilters,
  onToggleDatePicker, onToggleViewOptions,
  datePickerBtnRef, viewOptsBtnRef,
  hasActiveFilters = false,
}: ToolbarRowProps) {
  const totalCards = wd.cards.reduce((sum, day) => sum + day.length, 0)

  return (
    <div
      className="flex items-center gap-2 px-3 flex-shrink-0"
      style={{
        height: 48,
        backgroundColor: '#fff',
        borderBottom: '1px solid #e7eaee',
      }}
    >
      {/* Entry count */}
      <span style={{ fontSize: 12, color: '#5f6a82', whiteSpace: 'nowrap' }}>
        {totalCards} entries
      </span>

      <div className="w-px h-4 mx-1" style={{ backgroundColor: '#e7eaee' }} />

      {/* Today button */}
      <button
        onClick={onToday}
        className="px-3 h-7 rounded-md border text-xs font-medium"
        style={{
          borderColor: weekOffset === 0 ? '#1339ec' : '#e7eaee',
          color: weekOffset === 0 ? '#1339ec' : '#5f6a82',
          backgroundColor: weekOffset === 0 ? '#eef3fd' : 'transparent',
        }}
      >
        Today
      </button>

      {/* Prev / Next */}
      <button
        onClick={onPrev}
        className="flex items-center justify-center w-7 h-7 rounded"
        style={{ color: '#5f6a82' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={onNext}
        className="flex items-center justify-center w-7 h-7 rounded"
        style={{ color: '#5f6a82' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <ChevronRight size={16} />
      </button>

      {/* Date range */}
      <button
        ref={datePickerBtnRef}
        onClick={onToggleDatePicker}
        className="px-3 h-7 rounded-md border text-xs font-medium"
        style={{ borderColor: '#e7eaee', color: '#111317' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        {viewMode === 'month' || viewMode === 'month-timeline' ? 'June 2025' : wd.label}
      </button>

      {/* View mode dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center gap-1 px-3 h-7 rounded-md border text-xs font-medium hover:bg-[#f3f5f7]"
          style={{ borderColor: '#e7eaee', color: '#111317' }}
        >
          {VIEW_MODE_LABELS[viewMode]}
          <ChevronRight size={12} style={{ transform: 'rotate(90deg)' }} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {(['week', 'month', 'month-timeline'] as ViewMode[]).map(vm => (
            <DropdownMenuItem
              key={vm}
              onClick={() => onViewMode(vm)}
              style={{ fontSize: 13, fontWeight: viewMode === vm ? 600 : 400, color: viewMode === vm ? '#1339ec' : '#111317' }}
            >
              {VIEW_MODE_LABELS[vm]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Grid / List toggle */}
      <div className="flex rounded-md overflow-hidden border" style={{ borderColor: '#e7eaee' }}>
        {(['calendar', 'list'] as CalView[]).map(cv => (
          <button
            key={cv}
            onClick={() => onCalView(cv)}
            className="flex items-center justify-center w-7 h-7"
            style={{
              backgroundColor: calView === cv ? '#1339ec' : 'transparent',
              color: calView === cv ? '#fff' : '#5f6a82',
            }}
            title={cv === 'calendar' ? 'Calendar view' : 'List view'}
          >
            <span className="material-icons" style={{ fontSize: 16 }}>
              {cv === 'calendar' ? 'grid_view' : 'list'}
            </span>
          </button>
        ))}
      </div>

      {/* View options (tune) */}
      <button
        ref={viewOptsBtnRef}
        onClick={onToggleViewOptions}
        className="flex items-center justify-center w-7 h-7 rounded"
        style={{ color: '#5f6a82' }}
        title="View options"
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <span className="material-icons" style={{ fontSize: 18 }}>tune</span>
      </button>

      <div className="flex-1" />

      {/* Search */}
      <button
        onClick={onOpenSearch}
        className="flex items-center justify-center w-7 h-7 rounded"
        style={{ color: '#5f6a82' }}
        title="Search"
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <Search size={16} />
      </button>

      {/* Filters */}
      <button
        onClick={onOpenFilters}
        className="flex items-center justify-center w-7 h-7 rounded relative"
        style={{ color: hasActiveFilters ? '#1339ec' : '#5f6a82', backgroundColor: hasActiveFilters ? '#eef3fd' : 'transparent' }}
        title="Filters"
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = hasActiveFilters ? '#dfe7fd' : '#f3f5f7')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = hasActiveFilters ? '#eef3fd' : 'transparent')}
      >
        <SlidersHorizontal size={16} />
        {hasActiveFilters && (
          <span
            className="absolute rounded-full"
            style={{ width: 6, height: 6, backgroundColor: '#1339ec', top: 2, right: 2 }}
          />
        )}
      </button>
    </div>
  )
}
