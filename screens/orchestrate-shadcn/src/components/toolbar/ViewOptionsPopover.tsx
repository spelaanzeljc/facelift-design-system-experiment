import { useEffect, useState } from 'react'
import React from 'react'
import { Switch } from '@/components/ui/switch'
import type { ViewOpts } from '@/types'

interface ViewOptionsPopoverProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  opts: ViewOpts
  onChange: (opts: ViewOpts) => void
  panelRef: React.RefObject<HTMLDivElement | null>
}

export default function ViewOptionsPopover({ anchorEl, open, opts, onChange, panelRef }: ViewOptionsPopoverProps) {
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (anchorEl) {
      const rect = anchorEl.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, left: rect.right - 240 })
    }
  }, [anchorEl, open])

  const set = (key: keyof ViewOpts, val: boolean) => onChange({ ...opts, [key]: val })

  return (
    <div
      ref={panelRef}
      style={{
        display: open ? 'block' : 'none',
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        zIndex: 1000,
        width: 240,
        backgroundColor: '#fff',
        borderRadius: 10,
        border: '1px solid #e7eaee',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        padding: '12px 0',
      }}
    >
      {/* Title */}
      <div className="px-4 pb-2" style={{ borderBottom: '1px solid #f3f5f7' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#111317' }}>View options</span>
      </div>

      {/* Switch rows */}
      <div className="px-4 pt-2">
        {/* Show images */}
        <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid #f3f5f7' }}>
          <span style={{ fontSize: 13, color: '#111317' }}>Show images</span>
          <Switch
            checked={opts.images}
            onCheckedChange={v => set('images', v)}
          />
        </div>

        {/* Show tags */}
        <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid #f3f5f7' }}>
          <span style={{ fontSize: 13, color: '#111317' }}>Show tags</span>
          <Switch
            checked={opts.tags}
            onCheckedChange={v => set('tags', v)}
          />
        </div>

        {/* Slim tags — indented, only when tags=true */}
        {opts.tags && (
          <div className="flex items-center justify-between py-2.5 pl-4" style={{ borderBottom: '1px solid #f3f5f7' }}>
            <span style={{ fontSize: 12, color: '#5f6a82' }}>Slim tags</span>
            <Switch
              checked={opts.slim}
              onCheckedChange={v => set('slim', v)}
            />
          </div>
        )}

        {/* Colored cards */}
        <div className="flex items-center justify-between py-2.5">
          <span style={{ fontSize: 13, color: '#111317' }}>Colored cards</span>
          <Switch
            checked={opts.colored}
            onCheckedChange={v => set('colored', v)}
          />
        </div>
      </div>
    </div>
  )
}
