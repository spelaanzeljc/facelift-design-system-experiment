import { FieldLabel, SwitchField } from '@/components/post/helpers'
import { Image } from 'lucide-react'

interface XFormProps {
  nc: Record<string, unknown>
  upd: (k: string, v: unknown) => void
}

export default function XForm({ nc, upd }: XFormProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Tweet */}
      <div>
        <FieldLabel hint>Tweet</FieldLabel>
        <textarea
          value={(nc.text as string) ?? ''}
          onChange={e => upd('text', e.target.value)}
          rows={4}
          maxLength={280}
          placeholder="What's happening?"
          className="w-full rounded-md px-3 py-2 outline-none resize-none"
          style={{ fontSize: 13, color: '#111317', border: '1px solid #e7eaee', lineHeight: 1.5 }}
        />
        <div className="flex items-center justify-between mt-1">
          <button
            className="flex items-center gap-1.5 text-xs font-medium"
            style={{ color: '#1339ec' }}
          >
            <Image size={14} />
            Add Media
          </button>
          <span style={{ fontSize: 11, color: ((nc.text as string) ?? '').length > 260 ? '#cc0000' : '#a7aebe' }}>
            {280 - ((nc.text as string) ?? '').length} / 280
          </span>
        </div>
      </div>

      {/* Switches */}
      <div className="rounded-lg border" style={{ borderColor: '#e7eaee' }}>
        <div className="px-4">
          <SwitchField
            label="Thread"
            subtitle="Post as a thread"
            checked={(nc.thread as boolean) ?? false}
            onChange={v => upd('thread', v)}
          />
          <SwitchField
            label="Sensitive content"
            subtitle="Mark as potentially sensitive"
            checked={(nc.sensitive as boolean) ?? false}
            onChange={v => upd('sensitive', v)}
          />
        </div>
      </div>
    </div>
  )
}
