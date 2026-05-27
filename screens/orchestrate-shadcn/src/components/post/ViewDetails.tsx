import CollapsibleSection from './CollapsibleSection'
import { NET_ICONS_SCREEN } from '@/components/icons'
import { STATUS_CFG } from '@/data/mock'
import type { Post } from '@/types'

interface ViewDetailsProps {
  post: Post | null
  activeTabName: string
  openSecs: Record<string, boolean>
  togSec: (k: string) => void
  secOpen: (k: string, dflt?: boolean) => boolean
}

const METRICS = [
  { label: 'Reach', value: '12,847', icon: 'visibility' },
  { label: 'Impressions', value: '31,203', icon: 'bar_chart' },
  { label: 'Engagements', value: '1,429', icon: 'thumb_up' },
  { label: 'Likes', value: '1,201', icon: 'favorite' },
  { label: 'Comments', value: '148', icon: 'comment' },
  { label: 'Shares', value: '80', icon: 'share' },
]

const ACTIVITY = [
  { type: 'created', user: 'Elly Tan', time: 'Jun 16, 2025, 09:00 AM', desc: 'Post created' },
  { type: 'edited', user: 'Max Krauss', time: 'Jun 17, 2025, 02:30 PM', desc: 'Caption edited' },
  { type: 'approved', user: 'Elly Tan', time: 'Jun 17, 2025, 04:00 PM', desc: 'Post approved' },
  { type: 'scheduled', user: 'System', time: 'Jun 17, 2025, 04:01 PM', desc: 'Post scheduled' },
  { type: 'published', user: 'System', time: 'Jun 18, 2025, 09:30 AM', desc: 'Post published successfully' },
]

const ACTIVITY_COLORS: Record<string, string> = {
  created: '#848ea4',
  edited: '#848ea4',
  approved: '#2e881b',
  scheduled: '#1339ec',
  published: '#2e881b',
}

export default function ViewDetails({ post, activeTabName, togSec, secOpen }: ViewDetailsProps) {
  const Icon = NET_ICONS_SCREEN[activeTabName]
  const statusCfg = post ? STATUS_CFG[post.s] : null

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3" style={{ minHeight: 0 }}>

      {/* Network Information */}
      <CollapsibleSection
        label="Network Information"
        open={secOpen('Network Information_view', true)}
        onToggle={() => togSec('Network Information_view')}
      >
        <div className="p-4">
          {/* Sub-header */}
          <div
            className="flex items-center gap-2 mb-3 pb-3"
            style={{ borderBottom: '1px solid #f3f5f7' }}
          >
            {Icon && <Icon />}
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111317' }}>
              {activeTabName}
            </span>
            <a
              href="#"
              style={{ fontSize: 12, color: '#1339ec', marginLeft: 'auto' }}
              onClick={e => e.preventDefault()}
            >
              View in Facelift BBT ↗
            </a>
          </div>

          {/* Info toggle section */}
          <CollapsibleSection
            label="Info"
            open={secOpen('Info', true)}
            onToggle={() => togSec('Info')}
          >
            <div className="p-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Post Type', value: 'Photo Post' },
                  { label: 'Publishing Type', value: 'Direct' },
                  { label: 'Network', value: activeTabName },
                  { label: 'Channel', value: 'Main Page' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#848ea4', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 13, color: '#111317' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>
        </div>
      </CollapsibleSection>

      {/* Publication Details */}
      <CollapsibleSection
        label="Publication Details"
        open={secOpen('Publication Details', true)}
        onToggle={() => togSec('Publication Details')}
      >
        <div className="p-4 flex flex-col gap-3">
          {/* Owner */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#848ea4', marginBottom: 4 }}>Post Set Owner</div>
            <div className="flex items-center gap-2">
              <div
                className="rounded-full flex items-center justify-center"
                style={{ width: 28, height: 28, backgroundColor: '#0c228d', fontSize: 11, fontWeight: 700, color: '#fff' }}
              >
                ET
              </div>
              <span style={{ fontSize: 13, color: '#111317' }}>Elly Tan</span>
            </div>
          </div>

          {/* Template */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#848ea4', marginBottom: 2 }}>Template</div>
            <a href="#" style={{ fontSize: 13, color: '#1339ec' }} onClick={e => e.preventDefault()}>
              Standard Social Post Template
            </a>
          </div>

          {/* Creation date */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#848ea4', marginBottom: 2 }}>Creation Date</div>
            <span style={{ fontSize: 13, color: '#111317' }}>Jun 16, 2025, 09:00 AM</span>
          </div>

          {/* Status */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#848ea4', marginBottom: 4 }}>Status</div>
            {statusCfg && (
              <span
                className="rounded-full px-2 py-0.5"
                style={{ fontSize: 11, fontWeight: 500, backgroundColor: statusCfg.chipBg, color: statusCfg.chipText }}
              >
                {statusCfg.label}
              </span>
            )}
          </div>

          {/* Tags */}
          {post && post.tags.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#848ea4', marginBottom: 4 }}>Tags</div>
              <div className="flex flex-wrap gap-1">
                {post.tags.map(([_color, label], i) => (
                  <span
                    key={i}
                    className="rounded-full px-2"
                    style={{ fontSize: 11, fontWeight: 500, backgroundColor: '#e7eaee', color: '#5f6a82', lineHeight: '22px' }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Engagement & Performance */}
      <CollapsibleSection
        label="Engagement & Performance"
        open={secOpen('Engagement', false)}
        onToggle={() => togSec('Engagement')}
      >
        <div className="p-4">
          {/* Metric cards */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {METRICS.map(m => (
              <div
                key={m.label}
                className="rounded-lg p-3 text-center"
                style={{ border: '1px solid #e7eaee', backgroundColor: '#fafafa' }}
              >
                <span className="material-icons" style={{ fontSize: 18, color: '#848ea4', display: 'block', marginBottom: 2 }}>
                  {m.icon}
                </span>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111317' }}>{m.value}</div>
                <div style={{ fontSize: 11, color: '#848ea4' }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Engagement rate */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span style={{ fontSize: 12, fontWeight: 600, color: '#5f6a82' }}>Engagement rate</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#111317' }}>11.1%</span>
            </div>
            <div className="rounded-full overflow-hidden" style={{ height: 6, backgroundColor: '#e7eaee' }}>
              <div className="h-full rounded-full" style={{ width: '11.1%', backgroundColor: '#1339ec' }} />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Activity */}
      <CollapsibleSection
        label="Activity"
        open={secOpen('Activity', false)}
        onToggle={() => togSec('Activity')}
      >
        <div className="p-4">
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-3"
              style={{ top: 10, bottom: 10, width: 1, backgroundColor: '#e7eaee' }}
            />

            {ACTIVITY.map((evt, i) => (
              <div key={i} className="flex gap-3 mb-4 relative">
                {/* Dot */}
                <div
                  className="rounded-full flex-shrink-0 z-10"
                  style={{ width: 7, height: 7, marginTop: 4, backgroundColor: ACTIVITY_COLORS[evt.type] ?? '#848ea4', border: '2px solid #fff' }}
                />

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#111317' }}>{evt.desc}</div>
                  <div style={{ fontSize: 11, color: '#848ea4' }}>
                    {evt.user} · {evt.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleSection>
    </div>
  )
}
