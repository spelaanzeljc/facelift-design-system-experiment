import MediaGrid from '@/components/post/MediaGrid'
import { FieldLabel, NativeSelect } from '@/components/post/helpers'
import type { MediaItem } from '@/types'

interface XINGFormProps {
  nc: Record<string, unknown>
  upd: (k: string, v: unknown) => void
  mediaItems: MediaItem[]
  onAdd: () => void
  onRemove: (id: number) => void
}

const POST_TYPES = ['News', 'Activity', 'Share']

export default function XINGForm({ nc, upd, mediaItems, onAdd, onRemove }: XINGFormProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Post Type */}
      <div>
        <FieldLabel>Post Type</FieldLabel>
        <NativeSelect
          value={(nc.postType as string) ?? 'News'}
          onChange={v => upd('postType', v)}
          options={POST_TYPES}
        />
      </div>

      {/* Text */}
      <div>
        <FieldLabel hint>Text</FieldLabel>
        <textarea
          value={(nc.text as string) ?? ''}
          onChange={e => upd('text', e.target.value)}
          rows={5}
          maxLength={1000}
          placeholder="Write your XING post..."
          className="w-full rounded-md px-3 py-2 outline-none resize-none"
          style={{ fontSize: 13, color: '#111317', border: '1px solid #e7eaee', lineHeight: 1.5 }}
        />
        <div className="text-right mt-0.5" style={{ fontSize: 11, color: '#a7aebe' }}>
          {((nc.text as string) ?? '').length} / 1000
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
