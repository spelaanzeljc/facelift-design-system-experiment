import MediaGrid from '@/components/post/MediaGrid'
import { FieldLabel, NativeSelect } from '@/components/post/helpers'
import type { MediaItem } from '@/types'

interface InstagramFormProps {
  nc: Record<string, unknown>
  upd: (k: string, v: unknown) => void
  mediaItems: MediaItem[]
  onAdd: () => void
  onRemove: (id: number) => void
}

const POST_TYPES = ['Feed', 'Story', 'Reel', 'Carousel']

export default function InstagramForm({ nc, upd, mediaItems, onAdd, onRemove }: InstagramFormProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Post Type */}
      <div>
        <FieldLabel>Post Type</FieldLabel>
        <NativeSelect
          value={(nc.postType as string) ?? 'Feed'}
          onChange={v => upd('postType', v)}
          options={POST_TYPES}
        />
      </div>

      {/* Caption */}
      <div>
        <FieldLabel hint>Caption</FieldLabel>
        <textarea
          value={(nc.text as string) ?? ''}
          onChange={e => upd('text', e.target.value)}
          rows={5}
          maxLength={2200}
          placeholder="Write your Instagram caption..."
          className="w-full rounded-md px-3 py-2 outline-none resize-none"
          style={{ fontSize: 13, color: '#111317', border: '1px solid #e7eaee', lineHeight: 1.5 }}
        />
        <div className="text-right" style={{ fontSize: 11, color: '#a7aebe', marginTop: 2 }}>
          {((nc.text as string) ?? '').length} / 2200
        </div>
      </div>

      {/* Hashtags */}
      <div>
        <FieldLabel>Hashtags</FieldLabel>
        <input
          value={(nc.hashtags as string) ?? ''}
          onChange={e => upd('hashtags', e.target.value)}
          placeholder="#hashtag1 #hashtag2"
          className="w-full rounded-md px-3 h-8 outline-none"
          style={{ fontSize: 13, color: '#111317', border: '1px solid #e7eaee' }}
        />
      </div>

      {/* Media */}
      <div>
        <FieldLabel>Media</FieldLabel>
        <MediaGrid mediaItems={mediaItems} onAdd={onAdd} onRemove={onRemove} />
      </div>
    </div>
  )
}
