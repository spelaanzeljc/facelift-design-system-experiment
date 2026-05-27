import { X } from 'lucide-react'
import { ALL_USERS } from '@/data/mock'

interface Props {
  open: boolean
  context: 'post' | 'campaign'
  target?: string
  onClose: () => void
}

interface TaskItem {
  title: string
  assigneeIdx: number
  done?: boolean
}

const COLUMNS: { label: string; tasks: TaskItem[] }[] = [
  {
    label: 'To Do',
    tasks: [
      { title: 'Review copy & captions', assigneeIdx: 0 },
      { title: 'Check brand compliance', assigneeIdx: 3 },
    ],
  },
  {
    label: 'In Progress',
    tasks: [
      { title: 'Approve imagery', assigneeIdx: 1 },
      { title: 'Final scheduling review', assigneeIdx: 4 },
    ],
  },
  {
    label: 'Done',
    tasks: [
      { title: 'Brief created', assigneeIdx: 2, done: true },
      { title: 'Assets uploaded', assigneeIdx: 5, done: true },
    ],
  },
]

export default function TaskboardPanel({ open, context: _context, target, onClose }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 56,
        right: 0,
        bottom: 0,
        width: 460,
        backgroundColor: '#fff',
        borderLeft: '1px solid #e7eaee',
        transform: `translateX(${open ? '0' : '100%'})`,
        transition: 'transform 200ms cubic-bezier(.4,0,.2,1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 510,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4"
        style={{ height: 48, borderBottom: '1px solid #e7eaee', flexShrink: 0 }}
      >
        <span className="material-icons" style={{ fontSize: 18, color: '#848ea4' }}>table_chart</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#111317' }}>Taskboard</span>
        {target && (
          <>
            <span style={{ color: '#d3d7de', fontSize: 13 }}>·</span>
            <span
              style={{
                fontSize: 12,
                color: '#848ea4',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}
            >
              {target}
            </span>
          </>
        )}
        {!target && <div style={{ flex: 1 }} />}
        <button
          onClick={onClose}
          className="flex items-center justify-center w-7 h-7 rounded flex-shrink-0"
          style={{ color: '#5f6a82' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <X size={16} />
        </button>
      </div>

      {/* Kanban body */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ padding: 12 }}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          {COLUMNS.map(col => (
            <div key={col.label} style={{ flex: 1, minWidth: 0 }}>
              {/* Column header */}
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <span style={{ fontSize: 12, fontWeight: 700, color: '#111317' }}>{col.label}</span>
                <span
                  className="rounded-full px-1.5"
                  style={{ fontSize: 11, fontWeight: 600, backgroundColor: '#f3f5f7', color: '#5f6a82' }}
                >
                  {col.tasks.length}
                </span>
              </div>

              {/* Task cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {col.tasks.map((task, ti) => {
                  const user = ALL_USERS[task.assigneeIdx % ALL_USERS.length]
                  return (
                    <div
                      key={ti}
                      style={{
                        backgroundColor: '#fff',
                        border: '1px solid #e7eaee',
                        borderLeft: task.done ? '3px solid #2e881b' : '1px solid #e7eaee',
                        borderRadius: 8,
                        padding: '10px 10px 8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                      }}
                    >
                      <div style={{ fontSize: 13, color: '#111317', lineHeight: 1.4 }}>
                        {task.done && (
                          <span style={{ color: '#2e881b', marginRight: 6 }}>✓</span>
                        )}
                        {task.title}
                      </div>
                      <div className="flex justify-end mt-2">
                        <div
                          className="rounded-full flex items-center justify-center"
                          style={{
                            width: 20,
                            height: 20,
                            backgroundColor: user.c,
                            color: '#fff',
                            fontSize: 8,
                            fontWeight: 700,
                          }}
                        >
                          {user.i}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-4 py-3 flex-shrink-0"
        style={{ borderTop: '1px solid #f3f5f7' }}
      >
        <span style={{ fontSize: 11, color: '#a7aebe' }}>
          Full Taskboard opens in the Tasks module
        </span>
      </div>
    </div>
  )
}
