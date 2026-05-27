import { SUBNAV_ITEMS } from '@/data/mock'

interface SubNavProps {
  open: boolean
  onToggle: () => void
  activeItem: string
  onSelect: (label: string) => void
}

export default function SubNav({ open, onToggle, activeItem, onSelect }: SubNavProps) {
  return (
    <nav
      className="flex flex-col flex-shrink-0 overflow-hidden"
      style={{
        width: open ? 240 : 52,
        transition: 'width 0.2s ease',
        backgroundColor: '#fff',
        borderRight: '1px solid #e7eaee',
        height: '100%',
      }}
    >
      {/* Collapse toggle */}
      <div className="flex items-center justify-end px-2 py-2 border-b" style={{ borderColor: '#e7eaee', height: 44 }}>
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-8 h-8 rounded"
          style={{ color: '#5f6a82' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          title={open ? 'Collapse' : 'Expand'}
        >
          <span
            className="material-icons"
            style={{
              fontSize: 20,
              transform: open ? 'scaleX(1)' : 'scaleX(-1)',
              transition: 'transform 0.2s',
              display: 'block',
            }}
          >
            keyboard_tab
          </span>
        </button>
      </div>

      {/* Nav items */}
      <div className="flex flex-col py-1 overflow-hidden">
        {SUBNAV_ITEMS.map(item => {
          const isActive = item.label === activeItem
          return (
            <button
              key={item.label}
              onClick={() => onSelect(item.label)}
              className="flex items-center gap-3 px-3 h-9 w-full text-left flex-shrink-0 rounded-sm mx-1"
              style={{
                width: 'calc(100% - 8px)',
                backgroundColor: isActive ? 'rgba(19,57,236,0.08)' : 'transparent',
                color: isActive ? '#1339ec' : '#5f6a82',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#f3f5f7' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <span
                className="material-icons flex-shrink-0"
                style={{ fontSize: 20, color: isActive ? '#1339ec' : '#5f6a82' }}
              >
                {item.icon}
              </span>
              {open && (
                <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.label}
                </span>
              )}
              {open && 'chevron' in item && item.chevron && (
                <span className="material-icons ml-auto" style={{ fontSize: 16, color: '#a7aebe' }}>
                  chevron_right
                </span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
