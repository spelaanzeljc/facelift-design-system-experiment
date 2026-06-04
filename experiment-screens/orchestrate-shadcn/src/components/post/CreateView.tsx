import CollapsibleSection from './CollapsibleSection'
import InstagramForm from './forms/InstagramForm'
import FacebookForm from './forms/FacebookForm'
import YouTubeForm from './forms/YouTubeForm'
import TikTokForm from './forms/TikTokForm'
import LinkedInForm from './forms/LinkedInForm'
import XForm from './forms/XForm'
import XINGForm from './forms/XINGForm'
import QuickfillForm from './forms/QuickfillForm'
import { FieldLabel, NativeSelect, SwitchField, RemovableChips, AddTagRow } from './helpers'
import { NET_ICONS_SCREEN } from '@/components/icons'
import { ALL_USERS } from '@/data/mock'
import type { MediaItem, User } from '@/types'

interface CreateViewProps {
  activeTabName: string
  netContent: Record<string, Record<string, unknown>>
  updateNet: (tab: string, k: string, v: unknown) => void
  mediaItems: MediaItem[]
  addMedia: () => void
  removeMedia: (id: number) => void
  pubStatus: string
  setPubStatus: (s: string) => void
  pubDate: string
  setPubDate: (s: string) => void
  pubTime: string
  setPubTime: (s: string) => void
  timeZone: string
  setTimeZone: (s: string) => void
  allowComments: boolean
  setAllowComments: (v: boolean) => void
  firstComment: string
  setFirstComment: (s: string) => void
  shortLink: boolean
  setShortLink: (v: boolean) => void
  boostPost: boolean
  setBoostPost: (v: boolean) => void
  targetAge: string
  setTargetAge: (s: string) => void
  targetLocs: string[]
  setTargetLocs: (fn: (t: string[]) => string[]) => void
  targetInts: string[]
  setTargetInts: (fn: (t: string[]) => string[]) => void
  restrictAge: boolean
  setRestrictAge: (v: boolean) => void
  minAge: string
  setMinAge: (s: string) => void
  restrictCountry: boolean
  setRestrictCountry: (v: boolean) => void
  countryTags: string[]
  setCountryTags: (fn: (t: string[]) => string[]) => void
  assignedUsers: User[]
  setAssignedUsers: (fn: (u: User[]) => User[]) => void
  postTags: string[]
  setPostTags: (fn: (t: string[]) => string[]) => void
  priority: string
  setPriority: (s: string) => void
  openSecs: Record<string, boolean>
  togSec: (k: string) => void
  secOpen: (k: string, dflt?: boolean) => boolean
}

const STATUS_BTNS = ['Draft', 'Scheduled', 'Publish Now']
const PRIORITY_BTNS = ['Low', 'Normal', 'High']
const TIMEZONES = ['Europe/Berlin (UTC+2)', 'UTC', 'America/New_York (UTC-4)', 'America/Los_Angeles (UTC-7)']
const AGE_RANGES = ['All ages', '18+', '21+', '25+', '35+', '45+']

function renderNetForm(
  tabName: string,
  nc: Record<string, unknown>,
  upd: (k: string, v: unknown) => void,
  mediaItems: MediaItem[],
  onAdd: () => void,
  onRemove: (id: number) => void,
  netContent: Record<string, Record<string, unknown>>,
  updateNet: (tab: string, k: string, v: unknown) => void,
) {
  switch (tabName) {
    case 'Instagram': return <InstagramForm nc={nc} upd={upd} mediaItems={mediaItems} onAdd={onAdd} onRemove={onRemove} />
    case 'Facebook': return <FacebookForm nc={nc} upd={upd} mediaItems={mediaItems} onAdd={onAdd} onRemove={onRemove} />
    case 'YouTube': return <YouTubeForm nc={nc} upd={upd} />
    case 'TikTok': return <TikTokForm nc={nc} upd={upd} />
    case 'LinkedIn': return <LinkedInForm nc={nc} upd={upd} mediaItems={mediaItems} onAdd={onAdd} onRemove={onRemove} />
    case 'X': return <XForm nc={nc} upd={upd} />
    case 'XING': return <XINGForm nc={nc} upd={upd} mediaItems={mediaItems} onAdd={onAdd} onRemove={onRemove} />
    case 'Quickfill': return (
      <QuickfillForm
        netContent={netContent}
        updateNet={updateNet}
        onApplyAll={() => {}}
        mediaItems={mediaItems}
        onAdd={onAdd}
        onRemove={onRemove}
      />
    )
    default: return null
  }
}

const showTargeting = (tab: string) => tab === 'Facebook' || tab === 'LinkedIn'
const showAudienceRestriction = (tab: string) => tab === 'Facebook'

export default function CreateView({
  activeTabName, netContent, updateNet,
  mediaItems, addMedia, removeMedia,
  pubStatus, setPubStatus, pubDate, setPubDate, pubTime, setPubTime,
  timeZone, setTimeZone,
  allowComments, setAllowComments, firstComment, setFirstComment,
  shortLink, setShortLink, boostPost, setBoostPost,
  targetAge, setTargetAge, targetLocs, setTargetLocs, targetInts, setTargetInts,
  restrictAge, setRestrictAge, minAge, setMinAge,
  restrictCountry, setRestrictCountry, countryTags, setCountryTags,
  assignedUsers, setAssignedUsers, postTags, setPostTags,
  priority, setPriority,
  togSec, secOpen,
}: CreateViewProps) {
  const nc = netContent[activeTabName] ?? {}
  const upd = (k: string, v: unknown) => updateNet(activeTabName, k, v)
  const Icon = NET_ICONS_SCREEN[activeTabName]

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3" style={{ minHeight: 0 }}>

      {/* Network Information */}
      <CollapsibleSection label="Network Information" open={secOpen('Network Information', true)} onToggle={() => togSec('Network Information')}>
        <div>
          {/* Sub-header */}
          <div
            className="flex items-center gap-2 px-4 py-2"
            style={{ borderBottom: '1px solid #f3f5f7', backgroundColor: '#f9fafc' }}
          >
            {Icon && <Icon />}
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111317' }}>
              {activeTabName} Post Content
            </span>
          </div>
          {renderNetForm(activeTabName, nc, upd, mediaItems, addMedia, removeMedia, netContent, updateNet)}
        </div>
      </CollapsibleSection>

      {/* Publication */}
      <CollapsibleSection label="Publication" open={secOpen('Publication', false)} onToggle={() => togSec('Publication')}>
        <div className="p-4 flex flex-col gap-3">
          {/* Status buttons */}
          <div>
            <FieldLabel>Status</FieldLabel>
            <div className="flex gap-2">
              {STATUS_BTNS.map(s => (
                <button
                  key={s}
                  onClick={() => setPubStatus(s.toLowerCase().replace(' ', '-'))}
                  className="flex-1 h-8 rounded-md border text-xs font-semibold"
                  style={{
                    borderColor: pubStatus === s.toLowerCase().replace(' ', '-') ? '#1339ec' : '#e7eaee',
                    backgroundColor: pubStatus === s.toLowerCase().replace(' ', '-') ? '#eef3fd' : '#fff',
                    color: pubStatus === s.toLowerCase().replace(' ', '-') ? '#1339ec' : '#5f6a82',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Date + time */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <FieldLabel>Date</FieldLabel>
              <input
                type="date"
                value={pubDate}
                onChange={e => setPubDate(e.target.value)}
                className="w-full h-8 px-3 rounded-md outline-none"
                style={{ fontSize: 13, border: '1px solid #e7eaee', color: '#111317' }}
              />
            </div>
            <div>
              <FieldLabel>Time</FieldLabel>
              <input
                type="time"
                value={pubTime}
                onChange={e => setPubTime(e.target.value)}
                className="w-full h-8 px-3 rounded-md outline-none"
                style={{ fontSize: 13, border: '1px solid #e7eaee', color: '#111317' }}
              />
            </div>
          </div>

          {/* Timezone */}
          <div>
            <FieldLabel>Timezone</FieldLabel>
            <NativeSelect value={timeZone} onChange={setTimeZone} options={TIMEZONES} />
          </div>
        </div>
      </CollapsibleSection>

      {/* Settings */}
      <CollapsibleSection label="Settings" open={secOpen('Settings', false)} onToggle={() => togSec('Settings')}>
        <div className="px-4">
          <SwitchField
            label="Allow comments"
            checked={allowComments}
            onChange={setAllowComments}
          />
          {allowComments && (
            <div className="py-2.5" style={{ borderBottom: '1px solid #f3f5f7' }}>
              <FieldLabel>First comment</FieldLabel>
              <input
                value={firstComment}
                onChange={e => setFirstComment(e.target.value)}
                placeholder="Add a first comment..."
                className="w-full h-8 px-3 rounded-md outline-none"
                style={{ fontSize: 13, border: '1px solid #e7eaee', color: '#111317' }}
              />
            </div>
          )}
          <SwitchField
            label="Shorten links"
            checked={shortLink}
            onChange={setShortLink}
          />
          <SwitchField
            label="Boost post"
            checked={boostPost}
            onChange={setBoostPost}
          />
          {/* Approval */}
          <div className="flex items-center justify-between py-2.5">
            <span style={{ fontSize: 13, color: '#111317' }}>Approval</span>
            <span
              className="rounded-full px-2"
              style={{ fontSize: 11, fontWeight: 600, backgroundColor: '#e7eaee', color: '#5f6a82', lineHeight: '20px' }}
            >
              OFF
            </span>
          </div>
        </div>
      </CollapsibleSection>

      {/* Newsfeed Targeting — FB / LinkedIn only */}
      {showTargeting(activeTabName) && (
        <CollapsibleSection label="Newsfeed Targeting" open={secOpen('Targeting', false)} onToggle={() => togSec('Targeting')}>
          <div className="p-4 flex flex-col gap-3">
            <div>
              <FieldLabel>Age range</FieldLabel>
              <NativeSelect value={targetAge} onChange={setTargetAge} options={AGE_RANGES} />
            </div>
            <div>
              <FieldLabel>Locations</FieldLabel>
              <RemovableChips
                items={targetLocs}
                onRemove={item => setTargetLocs(t => t.filter(x => x !== item))}
                color="#eef3fd"
                textColor="#1339ec"
              />
              <AddTagRow placeholder="Add location..." onAdd={loc => setTargetLocs(t => [...t, loc])} />
            </div>
            <div>
              <FieldLabel>Interests</FieldLabel>
              <RemovableChips
                items={targetInts}
                onRemove={item => setTargetInts(t => t.filter(x => x !== item))}
                color="#eef3fd"
                textColor="#1339ec"
              />
              <AddTagRow placeholder="Add interest..." onAdd={int => setTargetInts(t => [...t, int])} />
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* Audience Restriction — FB only */}
      {showAudienceRestriction(activeTabName) && (
        <CollapsibleSection label="Audience Restriction" open={secOpen('Audience', false)} onToggle={() => togSec('Audience')}>
          <div className="px-4">
            <SwitchField
              label="Restrict by minimum age"
              checked={restrictAge}
              onChange={setRestrictAge}
            />
            {restrictAge && (
              <div className="pb-2.5" style={{ borderBottom: '1px solid #f3f5f7' }}>
                <FieldLabel>Minimum age</FieldLabel>
                <input
                  type="number"
                  value={minAge}
                  onChange={e => setMinAge(e.target.value)}
                  className="w-full h-8 px-3 rounded-md outline-none"
                  style={{ fontSize: 13, border: '1px solid #e7eaee', color: '#111317' }}
                />
              </div>
            )}
            <SwitchField
              label="Restrict by country"
              checked={restrictCountry}
              onChange={setRestrictCountry}
            />
            {restrictCountry && (
              <div className="pb-2.5">
                <RemovableChips
                  items={countryTags}
                  onRemove={item => setCountryTags(t => t.filter(x => x !== item))}
                />
                <AddTagRow placeholder="Add country..." onAdd={c => setCountryTags(t => [...t, c])} />
              </div>
            )}
          </div>
        </CollapsibleSection>
      )}

      {/* Assignments */}
      <CollapsibleSection label="Assignments" open={secOpen('Assignments', true)} onToggle={() => togSec('Assignments')}>
        <div className="p-4 flex flex-col gap-3">
          {/* Users */}
          <div>
            <FieldLabel>Assigned users</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {assignedUsers.map(user => (
                <div
                  key={user.i}
                  className="flex items-center gap-1.5 rounded-full px-2"
                  style={{ height: 28, backgroundColor: user.c + '22', border: `1px solid ${user.c}44` }}
                >
                  <div
                    className="rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ width: 18, height: 18, backgroundColor: user.c, fontSize: 9, fontWeight: 700, color: '#fff' }}
                  >
                    {user.i}
                  </div>
                  <span style={{ fontSize: 12, color: '#111317' }}>{user.n}</span>
                  <button
                    onClick={() => setAssignedUsers(u => u.filter(x => x.i !== user.i))}
                    style={{ color: '#5f6a82', marginLeft: 2 }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {/* Add user picker */}
              <div className="relative">
                <select
                  onChange={e => {
                    const found = ALL_USERS.find(u => u.i === e.target.value)
                    if (found && !assignedUsers.find(u => u.i === found.i)) {
                      setAssignedUsers(u => [...u, found])
                    }
                    e.target.value = ''
                  }}
                  className="h-7 rounded-full border px-2 text-xs"
                  style={{ borderColor: '#e7eaee', color: '#5f6a82', backgroundColor: '#fff' }}
                  defaultValue=""
                >
                  <option value="" disabled>+ Add user</option>
                  {ALL_USERS.map(u => (
                    <option key={u.i} value={u.i}>{u.n}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <FieldLabel>Tags</FieldLabel>
            <RemovableChips
              items={postTags}
              onRemove={item => setPostTags(t => t.filter(x => x !== item))}
            />
            <AddTagRow placeholder="Add tag..." onAdd={tag => setPostTags(t => [...t, tag])} />
          </div>

          {/* Priority */}
          <div>
            <FieldLabel>Priority</FieldLabel>
            <div className="flex gap-2">
              {PRIORITY_BTNS.map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className="flex-1 h-7 rounded-md border text-xs font-semibold"
                  style={{
                    borderColor: priority === p ? '#1339ec' : '#e7eaee',
                    backgroundColor: priority === p ? '#eef3fd' : '#fff',
                    color: priority === p ? '#1339ec' : '#5f6a82',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  )
}
