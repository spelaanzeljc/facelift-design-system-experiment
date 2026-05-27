import { Plus, X, Image, Link } from 'lucide-react'
import type { MediaItem } from '@/types'

interface MediaGridProps {
  mediaItems: MediaItem[]
  onAdd: () => void
  onRemove: (id: number) => void
}

export default function MediaGrid({ mediaItems, onAdd, onRemove }: MediaGridProps) {
  return (
    <div>
      {/* Action buttons */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 h-8 rounded-md border text-xs font-semibold"
          style={{ borderColor: '#e7eaee', color: '#5f6a82' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Image size={14} />
          Add Media
        </button>
        <button
          className="flex items-center gap-1.5 px-3 h-8 rounded-md border text-xs font-semibold"
          style={{ borderColor: '#e7eaee', color: '#5f6a82' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Link size={14} />
          Add URL
        </button>
      </div>

      {mediaItems.length === 0 ? (
        /* Empty placeholder */
        <div
          className="rounded-lg flex flex-col items-center justify-center gap-2"
          style={{
            border: '2px dashed #d3d7de',
            height: 100,
            backgroundColor: '#f9fafc',
          }}
        >
          <Image size={24} style={{ color: '#d3d7de' }} />
          <span style={{ fontSize: 12, color: '#a7aebe' }}>No media added</span>
        </div>
      ) : (
        /* Media grid */
        <div className="grid grid-cols-4 gap-2">
          {mediaItems.map(item => (
            <div key={item.id} className="relative group rounded-md overflow-hidden" style={{ aspectRatio: '1' }}>
              {/* Preview */}
              <div className="w-full h-full" style={{ background: item.bg }} />

              {/* IMAGE badge */}
              <div
                className="absolute top-1 left-1 rounded px-1"
                style={{ fontSize: 9, fontWeight: 700, backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff' }}
              >
                IMAGE
              </div>

              {/* Remove button */}
              <button
                onClick={() => onRemove(item.id)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff' }}
              >
                <X size={10} />
              </button>

              {/* Filename */}
              <div
                className="absolute bottom-0 left-0 right-0 px-1 py-0.5"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)', fontSize: 9, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {item.label}
              </div>
            </div>
          ))}

          {/* Add tile */}
          <button
            onClick={onAdd}
            className="rounded-md flex items-center justify-center"
            style={{
              aspectRatio: '1',
              border: '2px dashed #d3d7de',
              backgroundColor: '#f9fafc',
              color: '#a7aebe',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#f9fafc')}
          >
            <Plus size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
