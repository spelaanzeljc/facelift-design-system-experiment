import type { Post } from '@/types'

interface PreviewPanelProps {
  activeTabName: string
  netContent: Record<string, Record<string, unknown>>
  isCreate: boolean
  post: Post | null
  previewDevice: 'mobile' | 'desktop'
  onDeviceChange: (d: 'mobile' | 'desktop') => void
}

export default function PreviewPanel({ activeTabName, netContent, isCreate, post, previewDevice, onDeviceChange }: PreviewPanelProps) {
  const nc = netContent[activeTabName] ?? {}
  const caption = (nc.text as string) || (nc.caption as string) || ''
  const bg = post?.bg ?? 'linear-gradient(135deg,#d4f0c0,#a8df8b)'
  const emoji = post?.emoji ?? '✨'

  const showIGHeader = activeTabName === 'Instagram' || activeTabName === 'Quickfill'

  return (
    <div
      className="flex flex-col flex-shrink-0"
      style={{
        width: 320,
        borderLeft: '1px solid #e7eaee',
        backgroundColor: '#fff',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid #f3f5f7', flexShrink: 0 }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#111317' }}>Preview</div>
          <div style={{ fontSize: 11, color: '#848ea4' }}>{activeTabName}</div>
        </div>

        {/* Device toggle */}
        <div className="flex rounded overflow-hidden border" style={{ borderColor: '#e7eaee' }}>
          {(['mobile', 'desktop'] as const).map(device => (
            <button
              key={device}
              onClick={() => onDeviceChange(device)}
              className="flex items-center justify-center w-8 h-7"
              style={{ backgroundColor: previewDevice === device ? '#f3f5f7' : 'transparent' }}
              title={device}
            >
              <span className="material-icons" style={{ fontSize: 16, color: previewDevice === device ? '#111317' : '#848ea4' }}>
                {device === 'mobile' ? 'phone_iphone' : 'desktop_mac'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-y-auto flex items-start justify-center pt-6 pb-4 px-4">
        {previewDevice === 'mobile' ? (
          /* Phone mockup */
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              width: 220,
              border: '8px solid #111317',
              backgroundColor: '#fff',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}
          >
            {/* Status bar */}
            <div style={{ height: 20, backgroundColor: '#111317', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 60, height: 10, backgroundColor: '#333', borderRadius: 5 }} />
            </div>

            {/* App bar */}
            {showIGHeader && (
              <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: '1px solid #f3f5f7' }}>
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{ width: 30, height: 30, background: bg }}
                >
                  <span style={{ fontSize: 16 }}>{emoji}</span>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#111317' }}>username</div>
                  <div style={{ fontSize: 9, color: '#848ea4' }}>Sponsored · {activeTabName}</div>
                </div>
              </div>
            )}

            {/* Post image */}
            <div style={{ width: '100%', aspectRatio: '1', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 48 }}>{emoji}</span>
            </div>

            {/* Caption */}
            <div style={{ padding: '8px 10px' }}>
              <div style={{ fontSize: 10, color: '#111317', lineHeight: 1.5 }}>
                {caption || (isCreate ? 'Your caption will appear here...' : post?.title)}
              </div>
            </div>
          </div>
        ) : (
          /* Desktop/browser mockup */
          <div
            className="rounded-lg overflow-hidden w-full"
            style={{
              border: '2px solid #d3d7de',
              backgroundColor: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            {/* Browser chrome */}
            <div
              className="flex items-center gap-1.5 px-3"
              style={{ height: 28, backgroundColor: '#f3f5f7', borderBottom: '1px solid #e7eaee' }}
            >
              {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                <div key={c} className="rounded-full" style={{ width: 8, height: 8, backgroundColor: c }} />
              ))}
              <div
                className="flex-1 rounded"
                style={{ height: 14, backgroundColor: '#e7eaee', marginLeft: 8 }}
              />
            </div>

            {/* Post image */}
            <div style={{ width: '100%', height: 140, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 48 }}>{emoji}</span>
            </div>

            {/* Caption */}
            <div style={{ padding: '8px 10px' }}>
              <div style={{ fontSize: 11, color: '#111317', lineHeight: 1.5 }}>
                {caption || (isCreate ? 'Your caption will appear here...' : post?.title)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
