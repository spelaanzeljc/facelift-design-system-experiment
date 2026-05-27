import { FieldLabel, NativeSelect, VideoUploadZone } from '@/components/post/helpers'

interface YouTubeFormProps {
  nc: Record<string, unknown>
  upd: (k: string, v: unknown) => void
}

const VISIBILITY_OPTIONS = ['Public', 'Unlisted', 'Private', 'Scheduled']

export default function YouTubeForm({ nc, upd }: YouTubeFormProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Video upload */}
      <div>
        <FieldLabel>Video</FieldLabel>
        <VideoUploadZone />
      </div>

      {/* Title */}
      <div>
        <FieldLabel hint>Title</FieldLabel>
        <input
          value={(nc.title as string) ?? ''}
          onChange={e => upd('title', e.target.value)}
          placeholder="Enter video title..."
          maxLength={100}
          className="w-full rounded-md px-3 h-8 outline-none"
          style={{ fontSize: 13, color: '#111317', border: '1px solid #e7eaee' }}
        />
        <div className="text-right mt-0.5" style={{ fontSize: 11, color: '#a7aebe' }}>
          {((nc.title as string) ?? '').length} / 100
        </div>
      </div>

      {/* Description */}
      <div>
        <FieldLabel hint>Description</FieldLabel>
        <textarea
          value={(nc.description as string) ?? ''}
          onChange={e => upd('description', e.target.value)}
          rows={5}
          maxLength={5000}
          placeholder="Describe your video..."
          className="w-full rounded-md px-3 py-2 outline-none resize-none"
          style={{ fontSize: 13, color: '#111317', border: '1px solid #e7eaee', lineHeight: 1.5 }}
        />
        <div className="text-right mt-0.5" style={{ fontSize: 11, color: '#a7aebe' }}>
          {((nc.description as string) ?? '').length} / 5000
        </div>
      </div>

      {/* Tags */}
      <div>
        <FieldLabel>Tags</FieldLabel>
        <input
          value={(nc.tags as string) ?? ''}
          onChange={e => upd('tags', e.target.value)}
          placeholder="tag1, tag2, tag3"
          className="w-full rounded-md px-3 h-8 outline-none"
          style={{ fontSize: 13, color: '#111317', border: '1px solid #e7eaee' }}
        />
      </div>

      {/* Visibility */}
      <div>
        <FieldLabel>Visibility</FieldLabel>
        <NativeSelect
          value={(nc.visibility as string) ?? 'Public'}
          onChange={v => upd('visibility', v)}
          options={VISIBILITY_OPTIONS}
        />
      </div>
    </div>
  )
}
