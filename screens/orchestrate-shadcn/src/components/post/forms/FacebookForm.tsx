import MediaGrid from '@/components/post/MediaGrid'
import { FieldLabel, NativeSelect } from '@/components/post/helpers'
import type { MediaItem } from '@/types'

interface FacebookFormProps {
  nc: Record<string, unknown>
  upd: (k: string, v: unknown) => void
  mediaItems: MediaItem[]
  onAdd: () => void
  onRemove: (id: number) => void
}

const POST_TYPES = ['Photo Post', 'Video Post', 'Link Post', 'Story', 'Reel']
const CTA_OPTIONS = ['None', 'Book Now', 'Contact Us', 'Download', 'Get Offer', 'Learn More', 'Shop Now', 'Sign Up', 'Watch More']

export default function FacebookForm({ nc, upd, mediaItems, onAdd, onRemove }: FacebookFormProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Post Type */}
      <div>
        <FieldLabel>Post Type</FieldLabel>
        <NativeSelect
          value={(nc.postType as string) ?? 'Photo Post'}
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
          placeholder="Write your Facebook post..."
          className="w-full rounded-md px-3 py-2 outline-none resize-none"
          style={{ fontSize: 13, color: '#111317', border: '1px solid #e7eaee', lineHeight: 1.5 }}
        />
      </div>

      {/* Call to Action */}
      <div>
        <FieldLabel>Call to Action</FieldLabel>
        <NativeSelect
          value={(nc.cta as string) ?? 'None'}
          onChange={v => upd('cta', v)}
          options={CTA_OPTIONS}
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
