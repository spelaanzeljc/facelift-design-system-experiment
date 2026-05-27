import { ChevronDown } from 'lucide-react'
import React from 'react'

interface CollapsibleSectionProps {
  label: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}

export default function CollapsibleSection({ label, open, onToggle, children }: CollapsibleSectionProps) {
  return (
    <div
      className="rounded-[10px] border overflow-hidden"
      style={{
        borderColor: '#e7eaee',
        backgroundColor: '#fff',
        flexShrink: 0,
      }}
    >
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-3"
        style={{ borderBottom: open ? '1px solid #f3f5f7' : 'none' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fafafa')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <span style={{ fontSize: 15, fontWeight: 700, color: '#111317' }}>{label}</span>
        <ChevronDown
          size={18}
          style={{
            color: '#5f6a82',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
            flexShrink: 0,
          }}
        />
      </button>
      {open && <div>{children}</div>}
    </div>
  )
}
