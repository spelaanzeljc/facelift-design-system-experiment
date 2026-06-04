import MediaGrid from '@/components/post/MediaGrid'
import { FieldLabel } from '@/components/post/helpers'
import type { MediaItem } from '@/types'

interface QuickfillFormProps {
  netContent: Record<string, Record<string, unknown>>
  updateNet: (tab: string, k: string, v: unknown) => void
  onApplyAll: () => void
  mediaItems: MediaItem[]
  onAdd: () => void
  onRemove: (id: number) => void
}

const NETWORKS = ['Instagram', 'Facebook', 'LinkedIn', 'X', 'TikTok', 'YouTube']

export default function QuickfillForm({
  netContent,
  updateNet,
  onApplyAll,
  mediaItems,
  onAdd,
  onRemove,
}: QuickfillFormProps) {
  const universalCaption = (netContent.Instagram?.text as string) ?? ''

  const handleCaption = (val: string) => {
    NETWORKS.forEach(net => updateNet(net, 'text', val))
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Info box */}
      <div
        className="rounded-lg p-3"
        style={{ backgroundColor: '#eef3fd', border: '1px solid #c7d9fd' }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: '#1339ec', marginBottom: 4 }}>
          Quickfill
        </div>
        <div style={{ fontSize: 12, color: '#0c228d', lineHeight: 1.5 }}>
          Use Quickfill to write a universal caption that will be applied to all selected networks. You can still customize each network individually in its tab.
        </div>
      </div>

      {/* Universal caption */}
      <div>
        <FieldLabel hint>Universal Caption</FieldLabel>
        <textarea
          value={universalCaption}
          onChange={e => handleCaption(e.target.value)}
          rows={5}
          placeholder="Write a caption to apply to all networks..."
          className="w-full rounded-md px-3 py-2 outline-none resize-none"
          style={{ fontSize: 13, color: '#111317', border: '1px solid #e7eaee', lineHeight: 1.5 }}
        />
      </div>

      {/* Apply to networks */}
      <div>
        <FieldLabel>Apply to networks</FieldLabel>
        <div className="flex flex-wrap gap-2 mt-1">
          {NETWORKS.map(net => (
            <button
              key={net}
              onClick={onApplyAll}
              className="rounded-full px-3 h-7 text-xs font-medium border"
              style={{ borderColor: '#1339ec', color: '#1339ec', backgroundColor: '#eef3fd' }}
            >
              {net}
            </button>
          ))}
        </div>
      </div>

      {/* Media */}
      <div>
        <FieldLabel>Media</FieldLabel>
        <MediaGrid mediaItems={mediaItems} onAdd={onAdd} onRemove={onRemove} />
      </div>
    </div>
  )
}
