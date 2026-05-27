import { useState } from 'react'
import { ChevronLeft, HelpCircle, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import CreateView from './CreateView'
import ViewDetails from './ViewDetails'
import PreviewPanel from './PreviewPanel'
import { NET_ICONS_SCREEN } from '@/components/icons'
import { SCREEN_NETWORK_TABS, NET_TAB_DOTS, FAKE_MEDIA, STATUS_CFG } from '@/data/mock'
import type { Post, ScreenMode, MediaItem, User } from '@/types'

interface PostFullScreenProps {
  mode: ScreenMode
  post: Post | null
  onBack: () => void
  onEdit: () => void
  onSave: (status: string) => void
}

const PUB_OPTIONS = [
  { label: 'Save Draft',            status: 'draft' },
  { label: 'Schedule',              status: 'scheduled' },
  { label: 'Publish Now',           status: 'published' },
  { label: 'Submit for Approval',   status: 'approval' },
]

export default function PostFullScreen({ mode, post, onBack, onEdit, onSave }: PostFullScreenProps) {
  const isCreate = mode === 'create'
  const [activeTab, setActiveTab] = useState(0)
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile')
  const [openSecs, setOpenSecs] = useState<Record<string, boolean>>({
    'Network Information': true,
    'Assignments': true,
    'Network Information_view': true,
    'Publication Details': true,
    'Info': true,
    'Engagement': false,
    'Activity': false,
  })

  const [netContent, setNetContent] = useState<Record<string, Record<string, unknown>>>({
    Instagram: { postType: 'Feed', text: '', hashtags: '' },
    Facebook: { postType: 'Photo Post', text: '', cta: 'None' },
    YouTube: { title: '', description: '', tags: '', visibility: 'Public' },
    TikTok: { caption: '', privacy: 'Public', allowComments: true, allowDuet: true, allowStitch: false },
    LinkedIn: { postType: 'Image Post', text: '' },
    X: { text: '', thread: false, sensitive: false },
    XING: { postType: 'News', text: '' },
    Quickfill: { text: '' },
  })

  const updateNet = (tab: string, key: string, val: unknown) =>
    setNetContent(p => ({ ...p, [tab]: { ...p[tab], [key]: val } }))

  const [pubStatus, setPubStatus] = useState('draft')
  const [pubDate, setPubDate] = useState('')
  const [pubTime, setPubTime] = useState('')
  const [timeZone, setTimeZone] = useState('Europe/Berlin (UTC+2)')
  const [allowComments, setAllowComments] = useState(true)
  const [firstComment, setFirstComment] = useState('')
  const [shortLink, setShortLink] = useState(false)
  const [boostPost, setBoostPost] = useState(false)
  const [targetAge, setTargetAge] = useState('All ages')
  const [targetLocs, setTargetLocs] = useState(['Germany', 'Switzerland'])
  const [targetInts, setTargetInts] = useState(['Technology', 'Marketing'])
  const [restrictAge, setRestrictAge] = useState(false)
  const [minAge, setMinAge] = useState('18')
  const [restrictCountry, setRestrictCountry] = useState(false)
  const [countryTags, setCountryTags] = useState(['Germany'])
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(FAKE_MEDIA.map((m, i) => ({ ...m, id: i })))
  const [priority, setPriority] = useState('Normal')
  const [postTags, setPostTags] = useState(['social-media', 'marketing'])
  const [assignedUsers, setAssignedUsers] = useState<User[]>([
    { i: 'ET', n: 'Elly Tan', c: '#0c228d' },
    { i: 'MK', n: 'Max Krauss', c: '#2e881b' },
  ])

  const addMedia = () => {
    const id = Date.now()
    const colors = ['135deg,#d9c8b8,#c4a882', '135deg,#cce5ff,#99caff', '135deg,#d4f0c0,#a8df8b']
    const ci = mediaItems.length % colors.length
    setMediaItems(p => [...p, { id, label: `image_0${p.length + 1}.jpeg`, bg: `linear-gradient(${colors[ci]})` }])
  }
  const removeMedia = (id: number) => setMediaItems(p => p.filter(m => m.id !== id))

  const secOpen = (k: string, dflt = false) => openSecs[k] !== undefined ? openSecs[k] : dflt
  const togSec = (k: string) => setOpenSecs(s => ({ ...s, [k]: !secOpen(k) }))

  const activeTabName = SCREEN_NETWORK_TABS[activeTab] as string
  const statusCfg = post?.s ? STATUS_CFG[post.s] : null

  return (
    <div className="flex flex-col flex-1 overflow-hidden" style={{ backgroundColor: '#f3f5f7' }}>

      {/* Top bar */}
      <div
        className="flex items-center gap-2 px-3 flex-shrink-0"
        style={{ height: 52, backgroundColor: '#fff', borderBottom: '1px solid #e7eaee' }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 h-8 px-2 rounded-md text-sm font-medium"
          style={{ color: '#5f6a82' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <div className="w-px h-5 mx-1" style={{ backgroundColor: '#e7eaee' }} />

        <span style={{ fontSize: 14, fontWeight: 700, color: '#111317' }}>
          {isCreate ? 'Create Post' : (post?.title ?? 'View Post')}
        </span>

        <div className="flex-1" />

        <button
          className="flex items-center justify-center w-8 h-8 rounded"
          style={{ color: '#5f6a82' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          title="Help"
        >
          <HelpCircle size={18} />
        </button>

        {isCreate && (
          <button
            className="flex items-center gap-1.5 px-3 h-8 rounded-md border text-sm font-medium"
            style={{ borderColor: '#e7eaee', color: '#5f6a82' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Promote
          </button>
        )}

        {/* Publish split button */}
        <div className="flex">
          <button
            onClick={isCreate ? () => onSave('draft') : onEdit}
            className="flex items-center gap-1.5 px-3 h-8 rounded-l-md"
            style={{
              fontSize: 13,
              fontWeight: 600,
              backgroundColor: '#1339ec',
              color: '#fff',
              borderRight: '1px solid rgba(255,255,255,0.2)',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0f2ebd')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1339ec')}
          >
            {isCreate ? 'Save Draft' : 'Edit Post'}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center justify-center w-7 h-8 rounded-r-md"
              style={{ backgroundColor: '#1339ec', color: '#fff' }}
            >
              <ChevronDown size={13} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {PUB_OPTIONS.map(opt => (
                <DropdownMenuItem key={opt.label} style={{ fontSize: 13 }} onClick={() => onSave(opt.status)}>
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Status row */}
      <div
        className="flex items-center gap-3 px-3 flex-shrink-0"
        style={{ height: 44, backgroundColor: '#fff', borderBottom: '1px solid #e7eaee' }}
      >
        {isCreate ? (
          /* Status dropdown */
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-1.5 rounded-full px-3 h-7 text-xs font-semibold"
              style={{
                backgroundColor: pubStatus === 'draft' ? '#e7eaee' : pubStatus === 'scheduled' ? '#eef3fd' : '#e9ffcf',
                color: pubStatus === 'draft' ? '#5f6a82' : pubStatus === 'scheduled' ? '#1339ec' : '#2e881b',
              }}
            >
              {pubStatus.charAt(0).toUpperCase() + pubStatus.slice(1)}
              <ChevronDown size={12} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {['draft', 'scheduled', 'published'].map(s => (
                <DropdownMenuItem key={s} style={{ fontSize: 13 }} onClick={() => setPubStatus(s)}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          statusCfg && (
            <span
              className="rounded-full px-3 h-7 flex items-center"
              style={{ fontSize: 12, fontWeight: 600, backgroundColor: statusCfg.chipBg, color: statusCfg.chipText }}
            >
              {statusCfg.label}
            </span>
          )
        )}

        {isCreate ? (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={pubDate}
              onChange={e => setPubDate(e.target.value)}
              className="h-7 px-2 rounded border outline-none text-xs"
              style={{ borderColor: '#e7eaee', color: '#111317' }}
            />
            <input
              type="time"
              value={pubTime}
              onChange={e => setPubTime(e.target.value)}
              className="h-7 px-2 rounded border outline-none text-xs"
              style={{ borderColor: '#e7eaee', color: '#111317' }}
            />
          </div>
        ) : (
          post && (
            <span style={{ fontSize: 12, color: '#5f6a82' }}>
              {post.t} · Jun 18, 2025
            </span>
          )
        )}

        <div className="flex-1" />

        {/* User avatar */}
        <div
          className="rounded-full flex items-center justify-center"
          style={{ width: 28, height: 28, backgroundColor: '#0c228d', fontSize: 11, fontWeight: 700, color: '#fff' }}
        >
          SA
        </div>
      </div>

      {/* Network tabs */}
      <div
        className="flex items-end flex-shrink-0 overflow-x-auto"
        style={{ backgroundColor: '#fff', borderBottom: '1px solid #e7eaee' }}
      >
        {SCREEN_NETWORK_TABS.map((tabName, ti) => {
          const Icon = NET_ICONS_SCREEN[tabName]
          const isActive = activeTab === ti
          const hasDot = tabName in NET_TAB_DOTS

          return (
            <button
              key={tabName}
              onClick={() => setActiveTab(ti)}
              className="flex items-center gap-1.5 px-3 relative flex-shrink-0"
              style={{
                height: 40,
                borderBottom: isActive ? '2px solid #1339ec' : '2px solid transparent',
                color: isActive ? '#1339ec' : '#5f6a82',
                fontWeight: isActive ? 600 : 400,
                fontSize: 13,
                marginBottom: -1,
              }}
            >
              {Icon && (
                <span className="relative">
                  <Icon />
                  {hasDot && (
                    <span
                      className="absolute -top-0.5 -right-0.5 rounded-full"
                      style={{ width: 5, height: 5, backgroundColor: NET_TAB_DOTS[tabName] }}
                    />
                  )}
                </span>
              )}
              {tabName}
            </button>
          )
        })}
      </div>

      {/* Two-column body */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {/* Left: form / details */}
        <div className="flex-1 overflow-hidden flex flex-col" style={{ minWidth: 0 }}>
          {isCreate ? (
            <CreateView
              activeTabName={activeTabName}
              netContent={netContent}
              updateNet={updateNet}
              mediaItems={mediaItems}
              addMedia={addMedia}
              removeMedia={removeMedia}
              pubStatus={pubStatus}
              setPubStatus={setPubStatus}
              pubDate={pubDate}
              setPubDate={setPubDate}
              pubTime={pubTime}
              setPubTime={setPubTime}
              timeZone={timeZone}
              setTimeZone={setTimeZone}
              allowComments={allowComments}
              setAllowComments={setAllowComments}
              firstComment={firstComment}
              setFirstComment={setFirstComment}
              shortLink={shortLink}
              setShortLink={setShortLink}
              boostPost={boostPost}
              setBoostPost={setBoostPost}
              targetAge={targetAge}
              setTargetAge={setTargetAge}
              targetLocs={targetLocs}
              setTargetLocs={setTargetLocs}
              targetInts={targetInts}
              setTargetInts={setTargetInts}
              restrictAge={restrictAge}
              setRestrictAge={setRestrictAge}
              minAge={minAge}
              setMinAge={setMinAge}
              restrictCountry={restrictCountry}
              setRestrictCountry={setRestrictCountry}
              countryTags={countryTags}
              setCountryTags={setCountryTags}
              assignedUsers={assignedUsers}
              setAssignedUsers={setAssignedUsers}
              postTags={postTags}
              setPostTags={setPostTags}
              priority={priority}
              setPriority={setPriority}
              openSecs={openSecs}
              togSec={togSec}
              secOpen={secOpen}
            />
          ) : (
            <ViewDetails
              post={post}
              activeTabName={activeTabName}
              openSecs={openSecs}
              togSec={togSec}
              secOpen={secOpen}
            />
          )}
        </div>

        {/* Right: preview */}
        <PreviewPanel
          activeTabName={activeTabName}
          netContent={netContent}
          isCreate={isCreate}
          post={post}
          previewDevice={previewDevice}
          onDeviceChange={setPreviewDevice}
        />
      </div>
    </div>
  )
}
