import MediaGrid from '@/components/post/MediaGrid'
import { FieldLabel, NativeSelect } from '@/components/post/helpers'
import type { MediaItem } from '@/types'

interface LinkedInFormProps {
  nc: Record<string, unknown>
  upd: (k: string, v: unknown) => void
  mediaItems: MediaItem[]
  onAdd: () => void
  onRemove: (id: number) => void
}

const POST_TYPES = ['Text Post', 'Image Post', 'Video Post', 'Article', 'Document', 'Poll']

export default function LinkedInForm({ nc, upd, mediaItems, onAdd, onRemove }: LinkedInFormProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Post Type */}
      <div>
        <FieldLabel>Post Type</FieldLabel>
        <NativeSelect
          value={(nc.postType as string) ?? 'Image Post'}
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
          rows={6}
          maxLength={3000}
          placeholder="Write your LinkedIn post..."
          className="w-full rounded-md px-3 py-2 outline-none resize-none"
          style={{ fontSize: 13, color: '#111317', border: '1px solid #e7eaee', lineHeight: 1.5 }}
        />
        <div className="text-right mt-0.5" style={{ fontSize: 11, color: '#a7aebe' }}>
          {((nc.text as string) ?? '').length} / 3000
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
