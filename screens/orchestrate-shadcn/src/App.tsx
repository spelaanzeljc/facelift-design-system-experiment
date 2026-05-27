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
import CampaignDetailPanel from '@/components/panels/CampaignDetailPanel'
import CampaignEditModal from '@/components/panels/CampaignEditModal'
import NewCampaignModal from '@/components/panels/NewCampaignModal'
import TeamAssignmentModal from '@/components/panels/TeamAssignmentModal'
import TaskboardPanel from '@/components/panels/TaskboardPanel'
import KeyboardShortcutsModal from '@/components/panels/KeyboardShortcutsModal'
import SaveTemplateDialog from '@/components/panels/SaveTemplateDialog'
import ImportPostsModal from '@/components/panels/ImportPostsModal'
import PostFullScreen from '@/components/post/PostFullScreen'
import DateRangePicker from '@/components/toolbar/DateRangePicker'
import ViewOptionsPopover from '@/components/toolbar/ViewOptionsPopover'
import { WEEKS } from '@/data/weeks'
import { CAMPS } from '@/data/campaigns'
import { DRAFTS_DATA, BG_MAP } from '@/data/mock'
import { hasActiveFilters } from '@/lib/filterPosts'
import type { Post, PostStatus, Campaign, PanelId, ScreenMode, ViewMode, CalView, ViewOpts, ActiveFilters } from '@/types'

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

// ── Helpers to build a Post from draft data ──────────────────────────────────

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
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [campaignPanelOpen, setCampaignPanelOpen] = useState(false)
  const [campaignEditOpen, setCampaignEditOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({ statuses: [], networks: [], tags: [] })
  const [selectedDay, setSelectedDay] = useState(18) // default: today (Jun 18)
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPS)

  // Task B — New campaign / event modal
  const [newCampaignOpen, setNewCampaignOpen] = useState(false)
  const [newCampaignPreset, setNewCampaignPreset] = useState<'campaign' | 'event'>('campaign')

  // Task C — user posts + createInitialStatus
  const [userPosts, setUserPosts] = useState<{ date: number; post: Post }[]>([])
  const [createInitialStatus, setCreateInitialStatus] = useState<string>('draft')

  // Task D — team assignment modal
  const [teamModalOpen, setTeamModalOpen] = useState(false)
  const [teamModalContext, setTeamModalContext] = useState<'post' | 'campaign'>('post')

  // Task F — taskboard panel
  const [taskboardOpen, setTaskboardOpen] = useState(false)
  const [taskboardContext, setTaskboardContext] = useState<'post' | 'campaign'>('post')

  // Task G1 — keyboard shortcuts modal
  const [keyboardShortcutsOpen, setKeyboardShortcutsOpen] = useState(false)

  // Task G2 — save template dialog
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false)
  const [saveTemplateVariant, setSaveTemplateVariant] = useState<'standard' | 'amplify'>('standard')

  // Task G3 — import posts modal
  const [importPostsOpen, setImportPostsOpen] = useState(false)

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
  const handleCardClick = (card: Post) => { setSelectedPost(card); setOpenPanel('postDetail'); setCampaignPanelOpen(false) }
  const handleCampaignClick = (camp: Campaign) => { setSelectedCampaign(camp); setCampaignPanelOpen(true); setOpenPanel(null) }

  const handleCampaignAction = (action: string) => {
    if (action === 'Team Assignment') { setTeamModalContext('campaign'); setTeamModalOpen(true); return }
    if (action === 'Open Taskboard') { setTaskboardContext('campaign'); setTaskboardOpen(true); return }
    const msgs: Record<string, string> = {
      'Delete': '🗑 Campaign deleted',
    }
    showToast(msgs[action] ?? action)
    if (action === 'Delete') setCampaignPanelOpen(false)
  }

  const handleCampaignSave = (updated: Campaign) => {
    setSelectedCampaign(updated)
    setCampaigns(prev => prev.map(c => c.id === updated.id ? updated : c))
    setCampaignEditOpen(false)
    showToast('✓ Campaign saved')
  }

  const handleNewCampaignSave = (camp: Campaign) => {
    setCampaigns(prev => [...prev, camp])
    setNewCampaignOpen(false)
    showToast(`✓ ${camp.type === 'Event' ? 'Event' : 'Campaign'} "${camp.name}" created`)
  }

  const togglePanel = (id: PanelId) => setOpenPanel(p => p === id ? null : id)

  const openCreateScreen = (date?: number) => {
    if (date !== undefined) setSelectedDay(date)
    setScreenMode('create'); setScreenPost(null); setOpenPanel(null)
  }
  const openViewScreen = (post: Post) => { setScreenMode('view'); setScreenPost(post); setOpenPanel(null) }
  const closeScreen = () => { setScreenMode(null); setScreenPost(null) }
  const editScreen = () => setScreenMode('create')

  const handleAddPost = (date: number) => { setCreateInitialStatus('draft'); openCreateScreen(date) }

  const handleSave = (status: string, meta?: { title?: string; nets?: string[] }) => {
    const labels: Record<string, string> = {
      draft: '✓ Saved as draft',
      scheduled: '✓ Post scheduled',
      published: '✓ Post published',
      approval: '✓ Submitted for approval',
    }
    showToast(labels[status] ?? '✓ Saved')
    if (meta?.title) {
      setUserPosts(prev => [...prev, {
        date: selectedDay,
        post: {
          s: (status === 'published' ? 'scheduled' : status) as PostStatus,
          t: '12:00 PM',
          title: meta.title!,
          bg: BG_MAP[status === 'published' ? 'scheduled' : status] ?? BG_MAP['draft'],
          emoji: '📝',
          tags: [],
          nets: meta.nets ?? ['li'],
        }
      }])
    }
    closeScreen()
    setCreateInitialStatus('draft')
  }

  const handleDetailAction = (action: string) => {
    if (action === 'Details') { selectedPost && openViewScreen(selectedPost); return }
    if (action === 'Promote Post') { selectedPost && openViewScreen(selectedPost); return }
    if (action === 'Team Assignment') { setTeamModalContext('post'); setTeamModalOpen(true); return }
    if (action === 'Open Taskboard') { setTaskboardContext('post'); setTaskboardOpen(true); return }
    if (action === 'Save as Template') { setSaveTemplateVariant('standard'); setSaveTemplateOpen(true); return }
    if (action === 'Save as Amplify Template') { setSaveTemplateVariant('amplify'); setSaveTemplateOpen(true); return }
    showToast(`${action}`)
    setOpenPanel(null)
  }

  const handleTitleBarAction = (action: string) => {
    if (action === 'New Campaign') { setNewCampaignPreset('campaign'); setNewCampaignOpen(true); return }
    if (action === 'New Event') { setNewCampaignPreset('event'); setNewCampaignOpen(true); return }
    if (action === 'Schedule Post') { setCreateInitialStatus('scheduled'); openCreateScreen(); return }
    if (action === 'Keyboard shortcuts') { setKeyboardShortcutsOpen(true); return }
    if (action === 'Import Posts') { setImportPostsOpen(true); return }
    if (action === 'Schedule Export') { showToast("⏰ Export scheduled — you'll receive an email when it's ready"); return }
    if (action === 'Export as CSV' || action === 'Export as PDF' || action === 'Export as Excel' || action === 'Export') {
      const format = action.replace('Export as ', '').replace('Export', 'file')
      showToast(`⬇ Exporting ${format}…`)
      setTimeout(() => showToast(`✓ ${format} ready — check your downloads`), 2000)
      return
    }
    const msgs: Record<string, string> = {
      'Edit columns': '⚙ Column editor coming soon',
      'Manage tags': '🏷 Tag manager coming soon',
      'Settings': '⚙ Settings coming soon',
      'Help': '❓ Opening help center…',
    }
    showToast(msgs[action] ?? action)
  }

  const handleNavSelect = (label: string) => {
    setActiveNavItem(label)
    if (label !== 'Calendar') {
      showToast(`📍 ${label} coming soon`)
    }
  }

  // Task G1 — keyboard shortcut for '?'
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) setKeyboardShortcutsOpen(true)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

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
                initialStatus={createInitialStatus}
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
                  hasActiveFilters={hasActiveFilters(activeFilters)}
                  selectedDay={selectedDay}
                  onDayChange={setSelectedDay}
                  onToggleDatePicker={() => { setDatePickerOpen(o => !o); setViewOptsOpen(false) }}
                  onToggleViewOptions={() => { setViewOptsOpen(o => !o); setDatePickerOpen(false) }}
                  datePickerBtnRef={datePickerBtnRef}
                  viewOptsBtnRef={viewOptsBtnRef}
                />
                <CalendarArea wd={wd} viewMode={viewMode} calView={calView} onCardClick={handleCardClick} viewOpts={viewOpts} onCampaignClick={handleCampaignClick} activeFilters={activeFilters} selectedDay={selectedDay} onDayChange={setSelectedDay} campaigns={campaigns} userPosts={userPosts} onAddPost={handleAddPost} />
              </>
            )}
          </main>
        </div>
      </div>

      {/* Modals always mounted (outside screenMode guard) */}
      <NewCampaignModal
        open={newCampaignOpen}
        preset={newCampaignPreset}
        onClose={() => setNewCampaignOpen(false)}
        onSave={handleNewCampaignSave}
      />
      <TeamAssignmentModal
        open={teamModalOpen}
        context={teamModalContext}
        target={teamModalContext === 'post' ? selectedPost?.title : selectedCampaign?.name}
        onClose={() => setTeamModalOpen(false)}
        onConfirm={(users) => { setTeamModalOpen(false); showToast(`✓ ${users.length} team member${users.length !== 1 ? 's' : ''} assigned`) }}
      />
      <TaskboardPanel
        open={taskboardOpen}
        context={taskboardContext}
        target={taskboardContext === 'post' ? selectedPost?.title : selectedCampaign?.name}
        onClose={() => setTaskboardOpen(false)}
      />
      <KeyboardShortcutsModal
        open={keyboardShortcutsOpen}
        onClose={() => setKeyboardShortcutsOpen(false)}
      />
      <SaveTemplateDialog
        open={saveTemplateOpen}
        variant={saveTemplateVariant}
        defaultName={selectedPost?.title}
        onClose={() => setSaveTemplateOpen(false)}
        onSave={(name) => { setSaveTemplateOpen(false); showToast(`✓ Saved as ${saveTemplateVariant === 'amplify' ? 'Amplify ' : ''}template: "${name}"`) }}
      />
      <ImportPostsModal
        open={importPostsOpen}
        onClose={() => setImportPostsOpen(false)}
        onImport={(count) => { setImportPostsOpen(false); showToast(`✓ ${count} posts imported successfully`) }}
      />

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
            onSelect={post => {
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
          <FiltersPanel
            open={openPanel === 'filters'}
            activeFilters={activeFilters}
            onClose={() => setOpenPanel(null)}
            onApply={setActiveFilters}
          />
          <CampaignDetailPanel
            open={campaignPanelOpen}
            campaign={selectedCampaign}
            onClose={() => setCampaignPanelOpen(false)}
            onEdit={() => setCampaignEditOpen(true)}
            onAction={handleCampaignAction}
          />
          <CampaignEditModal
            open={campaignEditOpen}
            campaign={selectedCampaign}
            onClose={() => setCampaignEditOpen(false)}
            onSave={handleCampaignSave}
          />
        </>
      )}
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} onDone={() => dismissToast(t.id)} />
      ))}
    </TooltipProvider>
  )
}
