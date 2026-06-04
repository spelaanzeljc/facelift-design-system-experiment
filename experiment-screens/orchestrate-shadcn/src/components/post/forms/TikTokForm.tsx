import { FieldLabel, NativeSelect, VideoUploadZone, SwitchField } from '@/components/post/helpers'

interface TikTokFormProps {
  nc: Record<string, unknown>
  upd: (k: string, v: unknown) => void
}

const PRIVACY_OPTIONS = ['Public', 'Friends', 'Private']

export default function TikTokForm({ nc, upd }: TikTokFormProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Video upload */}
      <div>
        <FieldLabel>Video</FieldLabel>
        <VideoUploadZone />
      </div>

      {/* Caption */}
      <div>
        <FieldLabel hint>Caption</FieldLabel>
        <textarea
          value={(nc.caption as string) ?? ''}
          onChange={e => upd('caption', e.target.value)}
          rows={4}
          maxLength={2200}
          placeholder="Write your TikTok caption..."
          className="w-full rounded-md px-3 py-2 outline-none resize-none"
          style={{ fontSize: 13, color: '#111317', border: '1px solid #e7eaee', lineHeight: 1.5 }}
        />
        <div className="text-right mt-0.5" style={{ fontSize: 11, color: '#a7aebe' }}>
          {((nc.caption as string) ?? '').length} / 2200
        </div>
      </div>

      {/* Privacy */}
      <div>
        <FieldLabel>Privacy</FieldLabel>
        <NativeSelect
          value={(nc.privacy as string) ?? 'Public'}
          onChange={v => upd('privacy', v)}
          options={PRIVACY_OPTIONS}
        />
      </div>

      {/* Switch fields */}
      <div className="rounded-lg border" style={{ borderColor: '#e7eaee' }}>
        <div className="px-4">
          <SwitchField
            label="Allow comments"
            checked={(nc.allowComments as boolean) ?? true}
            onChange={v => upd('allowComments', v)}
          />
          <SwitchField
            label="Allow duet"
            checked={(nc.allowDuet as boolean) ?? true}
            onChange={v => upd('allowDuet', v)}
          />
          <SwitchField
            label="Allow stitch"
            checked={(nc.allowStitch as boolean) ?? false}
            onChange={v => upd('allowStitch', v)}
          />
        </div>
      </div>
    </div>
  )
}
