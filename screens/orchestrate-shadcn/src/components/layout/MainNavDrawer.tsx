import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet'
import { MAIN_NAV } from '@/data/mock'
import { X } from 'lucide-react'

interface MainNavDrawerProps {
  open: boolean
  onClose: () => void
}

export default function MainNavDrawer({ open, onClose }: MainNavDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={v => { if (!v) onClose() }}>
      <SheetContent side="left" className="p-0 flex flex-col" style={{ width: 300, maxWidth: 300 }}>
        {/* Dark header */}
        <SheetHeader
          className="flex flex-row items-center justify-between px-4"
          style={{ height: 56, backgroundColor: '#111317', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-2">
            <div
              style={{
                width: 18,
                height: 18,
                backgroundColor: '#f97316',
                transform: 'rotate(45deg)',
                borderRadius: 3,
                flexShrink: 0,
              }}
            />
            <span style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>facelift</span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded"
            style={{ color: '#5f6a82' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={18} />
          </button>
        </SheetHeader>

        {/* Nav sections */}
        <div className="flex-1 overflow-y-auto py-2">
          {MAIN_NAV.map((section, si) => (
            <div key={si} className="mb-1">
              {section.section && (
                <div
                  className="px-4 py-1"
                  style={{ fontSize: 11, fontWeight: 600, color: '#a7aebe', textTransform: 'uppercase', letterSpacing: '0.06em' }}
                >
                  {section.section}
                </div>
              )}
              {section.items.map(item => {
                const isActive = 'active' in item && item.active
                return (
                  <button
                    key={item.label}
                    className="flex items-center gap-3 w-full px-4 h-9 text-left"
                    style={{
                      backgroundColor: isActive ? 'rgba(19,57,236,0.08)' : 'transparent',
                      color: isActive ? '#1339ec' : '#5f6a82',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#f3f5f7' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <span
                      className="material-icons"
                      style={{ fontSize: 20, color: isActive ? '#1339ec' : '#5f6a82' }}
                    >
                      {item.icon}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}>
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
