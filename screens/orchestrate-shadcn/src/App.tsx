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
import { SEARCH_DATA, DRAFTS_DATA, BG_MAP } from '@/data/mock'
import type { Post, PanelId, ScreenMode, ViewMode, CalView, ViewOpts } from '@/types'

// ── Toast ────────────────────────────────────────────────────────────────────

interface ToastMsg { id: number; message: string }

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#111317',
        color: '#fff',
        fontSize: 13,
        fontWeight: 500,
        padding: '10px 20px',
        borderRadius: 8,
        boxShadow: '0 4px 16px rgba(0,0,0,0.24)',
        zIndex: 9999,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  )
}

// ── Helpers to build a Post from search/draft data ───────────────────────────

function postFromSearchItem(item: typeof SEARCH_DATA[0]): Post {
  return {
    s: item.status as Post['s'],
    t: '10:00 AM',
    title: item.name,
    bg: BG_MAP[item.status] ?? BG_MAP['draft'],
    emoji: '📝',
    tags: [],
    nets: ['li'],
  }
}

function postFromDraft(draft: typeof DRAFTS_DATA[0]): Post {
  return {
    s: 'draft',
    t: '11:00 AM',
    title: draft.name,
    bg: BG_MAP['draft'],
    emoji: '📄',
    tags: [],
    nets: draft.nets,
  }
}

// ── App ──────────────────────────────────────────────────────────────────────

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
  const [activeNavItem, setActiveNavItem] = useState('Calendar')
  const [toasts, setToasts] = useState<ToastMsg[]>([])

  const datePickerBtnRef = useRef<HTMLButtonElement>(null)
  const datePickerPanelRef = useRef<HTMLDivElement>(null)
  const viewOptsBtnRef = useRef<HTMLButtonElement>(null)
  const viewOptsPanelRef = useRef<HTMLDivElement>(null)

  const showToast = (message: string) => {
    const id = Date.now()
    setToasts(t => [...t, { id, message }])
  }
  const dismissToast = (id: number) => setToasts(t => t.filter(x => x.id !== id))

  const wd = WEEKS.find(w => w.offset === weekOffset)!
  const handleCardClick = (card: Post) => { setSelectedPost(card); setOpenPanel('postDetail') }
  const togglePanel = (id: PanelId) => setOpenPanel(p => p === id ? null : id)
  const openCreateScreen = () => { setScreenMode('create'); setScreenPost(null); setOpenPanel(null) }
  const openViewScreen = (post: Post) => { setScreenMode('view'); setScreenPost(post); setOpenPanel(null) }
  const closeScreen = () => { setScreenMode(null); setScreenPost(null) }
  const editScreen = () => setScreenMode('create')

  const handleSave = (status: string) => {
    const labels: Record<string, string> = {
      draft: '✓ Saved as draft',
      scheduled: '✓ Post scheduled',
      published: '✓ Post published',
      approval: '✓ Submitted for approval',
    }
    showToast(labels[status] ?? '✓ Saved')
    closeScreen()
  }

  const handleDetailAction = (action: string) => {
    if (action === 'Details') { selectedPost && openViewScreen(selectedPost); return }
    if (action === 'Promote Post') { selectedPost && openViewScreen(selectedPost); return }
    if (action === 'Team Assignment') { selectedPost && openViewScreen(selectedPost); return }
    const toasts: Record<string, string> = {
      'Open Taskboard': '📋 Opening Taskboard…',
      'Save as Template': '✓ Saved as template',
      'Save as Amplify Template': '✓ Saved as Amplify template',
    }
    showToast(toasts[action] ?? `${action}`)
    setOpenPanel(null)
  }

  const handleTitleBarAction = (action: string) => {
    const msgs: Record<string, string> = {
      'Export as CSV': '⬇ Exporting as CSV…',
      'Export as PDF': '⬇ Exporting as PDF…',
      'Export as Excel': '⬇ Exporting as Excel…',
      'Schedule Export': '⏰ Export scheduled',
      'Export': '⬇ Exporting…',
      'New Campaign': '📣 Campaign creation coming soon',
      'New Event': '📅 Event creation coming soon',
      'Schedule Post': '⏰ Opening scheduler…',
      'Import Posts': '⬆ Import feature coming soon',
      'Edit columns': '⚙ Column editor coming soon',
      'Manage tags': '🏷 Tag manager coming soon',
      'Settings': '⚙ Settings coming soon',
      'Help': '❓ Opening help center…',
      'Keyboard shortcuts': '⌨ Keyboard shortcuts coming soon',
    }
    showToast(msgs[action] ?? action)
  }

  const handleNavSelect = (label: string) => {
    setActiveNavItem(label)
    if (label !== 'Calendar') {
      showToast(`📍 ${label} coming soon`)
    }
  }

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
        <AppHeader onOpenMainNav={() => setMainNavOpen(true)} onAction={handleTitleBarAction} />
        <div className="flex flex-1 overflow-hidden">
          <SubNav
            open={subNavOpen}
            onToggle={() => setSubNavOpen(o => !o)}
            activeItem={activeNavItem}
            onSelect={handleNavSelect}
          />
          <main className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#f3f5f7' }}>
            {screenMode !== null ? (
              <PostFullScreen
                mode={screenMode}
                post={screenPost}
                onBack={closeScreen}
                onEdit={editScreen}
                onSave={handleSave}
              />
            ) : (
              <>
                <PageTitleBar
                  onOpenDrafts={() => togglePanel('drafts')}
                  onNewPost={openCreateScreen}
                  onAction={handleTitleBarAction}
                />
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
          <PostDetailPanel
            open={openPanel === 'postDetail'}
            post={selectedPost}
            onClose={() => setOpenPanel(null)}
            onViewDetails={() => selectedPost && openViewScreen(selectedPost)}
            onAction={handleDetailAction}
          />
          <SearchPanel
            open={openPanel === 'search'}
            onClose={() => setOpenPanel(null)}
            onSelect={item => {
              const post = postFromSearchItem(item)
              setSelectedPost(post)
              setOpenPanel('postDetail')
            }}
          />
          <DraftsPanel
            open={openPanel === 'drafts'}
            onClose={() => setOpenPanel(null)}
            onSelect={draft => {
              const post = postFromDraft(draft)
              setScreenPost(post)
              setScreenMode('create')
              setOpenPanel(null)
            }}
          />
          <FiltersPanel open={openPanel === 'filters'} onClose={() => setOpenPanel(null)} />
        </>
      )}
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} onDone={() => dismissToast(t.id)} />
      ))}
    </TooltipProvider>
  )
}
