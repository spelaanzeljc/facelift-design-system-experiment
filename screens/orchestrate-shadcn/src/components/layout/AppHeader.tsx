import { Menu, Settings, HelpCircle, Bell } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface AppHeaderProps {
  onOpenMainNav: () => void
}

export default function AppHeader({ onOpenMainNav }: AppHeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-3 flex-shrink-0"
      style={{ height: 56, backgroundColor: '#111317', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Left side */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenMainNav}
          className="flex items-center justify-center w-8 h-8 rounded"
          style={{ color: '#5f6a82' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2 ml-1">
          {/* Orange diamond logo */}
          <div
            className="flex-shrink-0"
            style={{
              width: 18,
              height: 18,
              backgroundColor: '#f97316',
              transform: 'rotate(45deg)',
              borderRadius: 3,
            }}
          />
          <span style={{ color: '#ffffff', fontSize: 15, fontWeight: 600, letterSpacing: '-0.2px' }}>
            facelift
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">
        {[
          { icon: <Settings size={18} />, label: 'Settings' },
          { icon: <HelpCircle size={18} />, label: 'Help' },
          { icon: <Bell size={18} />, label: 'Notifications' },
        ].map(({ icon, label }) => (
          <button
            key={label}
            className="flex items-center justify-center w-8 h-8 rounded"
            style={{ color: '#5f6a82' }}
            title={label}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {icon}
          </button>
        ))}
        <Avatar className="w-8 h-8 ml-1" style={{ backgroundColor: '#0c228d' } as React.CSSProperties}>
          <AvatarFallback
            style={{ backgroundColor: '#0c228d', color: '#fff', fontSize: 11, fontWeight: 700 }}
          >
            SA
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
