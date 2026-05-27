import { ChevronDown, ChevronLeft, MoreHorizontal, ChevronRight } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface PageTitleBarProps {
  onOpenDrafts: () => void
  onNewPost: () => void
  onAction: (label: string) => void
}

const EXPORT_OPTIONS = ['Export as CSV', 'Export as PDF', 'Export as Excel', 'Schedule Export']
const CREATE_OPTIONS = ['New Post', 'New Campaign', 'New Event', 'Schedule Post', 'Import Posts']
const MORE_OPTIONS = ['Edit columns', 'Manage tags', 'Settings', 'Help', 'Keyboard shortcuts']

export default function PageTitleBar({ onOpenDrafts, onNewPost, onAction }: PageTitleBarProps) {
  return (
    <div
      className="flex items-center gap-2 px-3 flex-shrink-0"
      style={{ height: 52, backgroundColor: '#fff', borderBottom: '1px solid #e7eaee' }}
    >
      {/* Left: nav controls */}
      <button
        className="flex items-center justify-center w-7 h-7 rounded"
        style={{ color: '#5f6a82' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <ChevronLeft size={16} />
      </button>

      <span style={{ fontSize: 14, fontWeight: 600, color: '#111317', whiteSpace: 'nowrap' }}>
        All Posts, Campaigns & Events
      </span>

      <button
        className="flex items-center justify-center w-6 h-6 rounded"
        style={{ color: '#5f6a82' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <ChevronDown size={14} />
      </button>

      {/* More options dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center justify-center w-7 h-7 rounded hover:bg-[#f3f5f7]"
          style={{ color: '#5f6a82' }}
        >
          <MoreHorizontal size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {MORE_OPTIONS.map(opt => (
            <DropdownMenuItem key={opt} style={{ fontSize: 13 }} onClick={() => onAction(opt)}>{opt}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Right side buttons */}
      <div className="flex items-center gap-2 ml-auto">
        {/* View Drafts */}
        <button
          onClick={onOpenDrafts}
          className="flex items-center gap-1.5 px-3 h-8 rounded-md border"
          style={{ fontSize: 13, fontWeight: 500, color: '#5f6a82', borderColor: '#e7eaee' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          View Drafts
        </button>

        {/* Export split button */}
        <div className="flex">
          <button
            onClick={() => onAction('Export')}
            className="flex items-center gap-1.5 px-3 h-8 rounded-l-md border border-r-0"
            style={{ fontSize: 13, fontWeight: 500, color: '#5f6a82', borderColor: '#e7eaee' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Export
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center justify-center w-7 h-8 rounded-r-md border hover:bg-[#f3f5f7]"
              style={{ color: '#5f6a82', borderColor: '#e7eaee' }}
            >
              <ChevronDown size={13} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {EXPORT_OPTIONS.map(opt => (
                <DropdownMenuItem key={opt} style={{ fontSize: 13 }} onClick={() => onAction(opt)}>{opt}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Create split button */}
        <div className="flex">
          <button
            onClick={onNewPost}
            className="flex items-center gap-1.5 px-3 h-8 rounded-l-md"
            style={{ fontSize: 13, fontWeight: 600, backgroundColor: '#1339ec', color: '#fff', borderRight: '1px solid rgba(255,255,255,0.2)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0f2ebd')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1339ec')}
          >
            <span style={{ marginRight: 2 }}>+</span> Create
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center justify-center w-7 h-8 rounded-r-md"
              style={{ backgroundColor: '#1339ec', color: '#fff' }}
            >
              <ChevronRight size={13} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {CREATE_OPTIONS.map(opt => (
                <DropdownMenuItem
                  key={opt}
                  style={{ fontSize: 13 }}
                  onClick={opt === 'New Post' ? onNewPost : () => onAction(opt)}
                >
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
