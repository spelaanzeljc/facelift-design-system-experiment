import { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import { ALL_USERS } from '@/data/mock'

interface Props {
  open: boolean
  context: 'post' | 'campaign'
  target?: string
  onClose: () => void
  onConfirm: (selectedUsers: string[]) => void
}

export default function TeamAssignmentModal({ open, context: _context, target, onClose, onConfirm }: Props) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  useEffect(() => {
    if (!open) setSelectedUsers([])
  }, [open])

  if (!open) return null

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(u => u !== userId) : [...prev, userId]
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          width: 440,
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center px-5 py-4"
          style={{ borderBottom: '1px solid #f3f5f7' }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111317' }}>Assign team</h2>
            {target && (
              <div
                style={{
                  fontSize: 12,
                  color: '#848ea4',
                  marginTop: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {target}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
            style={{ color: '#5f6a82' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={18} />
          </button>
        </div>

        {/* User grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 8,
            padding: '16px 20px',
          }}
        >
          {ALL_USERS.map(user => {
            const selected = selectedUsers.includes(user.i)
            return (
              <button
                key={user.i}
                onClick={() => toggleUser(user.i)}
                className="flex flex-col items-center gap-2 rounded-xl p-3 transition-colors"
                style={{
                  border: selected ? '2px solid #1339ec' : '2px solid #e7eaee',
                  backgroundColor: selected ? '#eef3fd' : '#fff',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  if (!selected) e.currentTarget.style.backgroundColor = '#f3f5f7'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = selected ? '#eef3fd' : '#fff'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <div
                    className="rounded-full flex items-center justify-center"
                    style={{
                      width: 44,
                      height: 44,
                      backgroundColor: user.c,
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {user.i}
                  </div>
                  {selected && (
                    <div
                      className="absolute flex items-center justify-center rounded-full"
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: '#1339ec',
                        top: -2,
                        right: -2,
                      }}
                    >
                      <Check size={9} color="#fff" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 12, color: '#111317', fontWeight: 500 }}>{user.n}</span>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 px-5 py-4"
          style={{ borderTop: '1px solid #f3f5f7' }}
        >
          <button
            onClick={onClose}
            className="px-4 h-9 rounded-lg text-sm font-medium"
            style={{ color: '#5f6a82', border: '1px solid #d3d7de' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f5f7')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selectedUsers)}
            className="px-4 h-9 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: '#1339ec', color: '#fff' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0f2ebd')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1339ec')}
          >
            Confirm ({selectedUsers.length} selected)
          </button>
        </div>
      </div>
    </div>
  )
}
