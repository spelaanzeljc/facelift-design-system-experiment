import { useState, useRef, useEffect } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import AppHeader from '@/components/layout/AppHeader'
import SubNav from '@/components/layout/SubNav'
import MainNavDrawer from '@/components/layout/MainNavDrawer'
import PageTitleBar from '@/components/toolbar/PageTitleBar'
import ToolbarRow from '@/components/toolbar/ToolbarRow'
import CalendarArea from '@/components/calendar/CalendarArea'
import PostDetailPanel from '@/components/panels/PostDetailPanel'
import SearchPanel from '@/components/panels/SearchPanel'
import DraftsPanel from '@/components/panels/DraftsPanel'
import FiltersPanel from '@/components/panels/FiltersPanel'
import PostFullScreen from '@/components/post/PostFullScreen'
import DateRangePicker from '@/components/toolbar/DateRangePicker'
import ViewOptionsPopover from '@/components/toolbar/ViewOptionsPopover'
import { WEEKS } from '@/data/weeks'
import type { Post, PanelId, ScreenMode, ViewMode, CalView, ViewOpts } from '@/types'

export default function App() {
  const [subNavOpen, setSubNavOpen] = useState(true)
  const [mainNavOpen, setMainNavOpen] = useState(false)
  const [weekOffset, setWeekOffset] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [calView, setCalView] = useState<CalView>('calendar')
  const [openPanel, setOpenPanel] = useState<PanelId>(null)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [viewOptsOpen, setViewOptsOpen] = useState(false)
  const [viewOpts, setViewOpts] = useState<ViewOpts>({ images: true, tags: true, slim: false, colored: false })
  const [screenMode, setScreenMode] = useState<ScreenMode>(null)
  const [screenPost, setScreenPost] = useState<Post | null>(null)
  const datePickerBtnRef = useRef<HTMLButtonElement>(null)
  const datePickerPanelRef = useRef<HTMLDivElement>(null)
  const viewOptsBtnRef = useRef<HTMLButtonElement>(null)
  const viewOptsPanelRef = useRef<HTMLDivElement>(null)

  const wd = WEEKS.find(w => w.offset === weekOffset)!
  const handleCardClick = (card: Post) => { setSelectedPost(card); setOpenPanel('postDetail') }
  const togglePanel = (id: PanelId) => setOpenPanel(p => p === id ? null : id)
  const openCreateScreen = () => { setScreenMode('create'); setScreenPost(null); setOpenPanel(null) }
  const openViewScreen = (post: Post) => { setScreenMode('view'); setScreenPost(post); setOpenPanel(null) }
  const closeScreen = () => { setScreenMode(null); setScreenPost(null) }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const inDateBtn = datePickerBtnRef.current?.contains(e.target as Node)
      const inDatePanel = datePickerPanelRef.current?.contains(e.target as Node)
      if (!inDateBtn && !inDatePanel) setDatePickerOpen(false)
      const inOptsBtn = viewOptsBtnRef.current?.contains(e.target as Node)
      const inOptsPanel = viewOptsPanelRef.current?.contains(e.target as Node)
      if (!inOptsBtn && !inOptsPanel) setViewOptsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen overflow-hidden" style={{ minWidth: 1280 }}>
        <AppHeader onOpenMainNav={() => setMainNavOpen(true)} />
        <div className="flex flex-1 overflow-hidden">
          <SubNav open={subNavOpen} onToggle={() => setSubNavOpen(o => !o)} />
          <main className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#f3f5f7' }}>
            {screenMode !== null ? (
              <PostFullScreen mode={screenMode} post={screenPost} onBack={closeScreen} />
            ) : (
              <>
                <PageTitleBar onOpenDrafts={() => togglePanel('drafts')} onNewPost={openCreateScreen} />
                <ToolbarRow
                  wd={wd} weekOffset={weekOffset} viewMode={viewMode} calView={calView}
                  onPrev={() => setWeekOffset(o => Math.max(-1, o - 1))}
                  onNext={() => setWeekOffset(o => Math.min(1, o + 1))}
                  onToday={() => setWeekOffset(0)}
                  onViewMode={setViewMode} onCalView={setCalView}
                  onOpenSearch={() => togglePanel('search')}
                  onOpenDrafts={() => togglePanel('drafts')}
                  onOpenFilters={() => togglePanel('filters')}
                  onToggleDatePicker={() => { setDatePickerOpen(o => !o); setViewOptsOpen(false) }}
                  onToggleViewOptions={() => { setViewOptsOpen(o => !o); setDatePickerOpen(false) }}
                  datePickerBtnRef={datePickerBtnRef}
                  viewOptsBtnRef={viewOptsBtnRef}
                />
                <CalendarArea wd={wd} viewMode={viewMode} calView={calView} onCardClick={handleCardClick} viewOpts={viewOpts} />
              </>
            )}
          </main>
        </div>
      </div>
      {screenMode === null && (
        <>
          <DateRangePicker anchorEl={datePickerBtnRef.current} open={datePickerOpen} onClose={() => setDatePickerOpen(false)} panelRef={datePickerPanelRef} />
          <ViewOptionsPopover anchorEl={viewOptsBtnRef.current} open={viewOptsOpen} onClose={() => setViewOptsOpen(false)} opts={viewOpts} onChange={setViewOpts} panelRef={viewOptsPanelRef} />
        </>
      )}
      <MainNavDrawer open={mainNavOpen} onClose={() => setMainNavOpen(false)} />
      {screenMode === null && (
        <>
          <PostDetailPanel open={openPanel === 'postDetail'} post={selectedPost} onClose={() => setOpenPanel(null)} onViewDetails={() => selectedPost && openViewScreen(selectedPost)} />
          <SearchPanel open={openPanel === 'search'} onClose={() => setOpenPanel(null)} />
          <DraftsPanel open={openPanel === 'drafts'} onClose={() => setOpenPanel(null)} />
          <FiltersPanel open={openPanel === 'filters'} onClose={() => setOpenPanel(null)} />
        </>
      )}
    </TooltipProvider>
  )
}
