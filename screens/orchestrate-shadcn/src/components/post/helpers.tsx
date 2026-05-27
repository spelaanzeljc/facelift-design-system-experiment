import React from 'react'
import { Switch } from '@/components/ui/switch'
import { X, Upload } from 'lucide-react'

// FieldLabel
export const FieldLabel = ({ children, hint }: { children: React.ReactNode; hint?: boolean }) => (
  <label className="flex items-center gap-1 mb-1" style={{ fontSize: 12, fontWeight: 600, color: '#5f6a82' }}>
    {children}
    {hint && <span className="material-icons" style={{ fontSize: 14, color: '#a7aebe' }}>help_outline</span>}
  </label>
)

// NativeSelect
export const NativeSelect = ({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
}) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    style={{
      width: '100%',
      height: 32,
      paddingLeft: 10,
      paddingRight: 24,
      fontSize: 13,
      color: '#111317',
      backgroundColor: '#fff',
      border: '1px solid #e7eaee',
      borderRadius: 6,
      outline: 'none',
      appearance: 'auto',
    }}
  >
    {options.map(o => (
      <option key={o} value={o}>{o}</option>
    ))}
  </select>
)

// SwitchField
export const SwitchField = ({
  label,
  subtitle,
  checked,
  onChange,
}: {
  label: string
  subtitle?: string
  checked: boolean
  onChange: (v: boolean) => void
}) => (
  <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid #f3f5f7' }}>
    <div>
      <div style={{ fontSize: 13, color: '#111317' }}>{label}</div>
      {subtitle && <div style={{ fontSize: 11, color: '#848ea4' }}>{subtitle}</div>}
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
)

// RemovableChips
export const RemovableChips = ({
  items,
  onRemove,
  color = '#e7eaee',
  textColor = '#5f6a82',
}: {
  items: string[]
  onRemove: (item: string) => void
  color?: string
  textColor?: string
}) => (
  <div className="flex flex-wrap gap-1.5">
    {items.map(item => (
      <span
        key={item}
        className="flex items-center gap-1 rounded-full px-2"
        style={{ fontSize: 11, fontWeight: 500, backgroundColor: color, color: textColor, lineHeight: '22px', height: 22 }}
      >
        {item}
        <button
          onClick={() => onRemove(item)}
          style={{ display: 'flex', alignItems: 'center', color: textColor, opacity: 0.6 }}
        >
          <X size={10} />
        </button>
      </span>
    ))}
  </div>
)

// AddTagRow — input with + button that adds a tag
export const AddTagRow = ({
  placeholder,
  onAdd,
}: {
  placeholder: string
  onAdd: (val: string) => void
}) => {
  const [val, setVal] = React.useState('')
  return (
    <div className="flex gap-2 mt-2">
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && val.trim()) {
            onAdd(val.trim())
            setVal('')
          }
        }}
        placeholder={placeholder}
        className="flex-1 rounded-md px-3 h-8 outline-none text-sm"
        style={{ border: '1px solid #e7eaee', fontSize: 13, color: '#111317' }}
      />
      <button
        onClick={() => { if (val.trim()) { onAdd(val.trim()); setVal('') } }}
        className="w-8 h-8 rounded-md flex items-center justify-center"
        style={{ backgroundColor: '#1339ec', color: '#fff', flexShrink: 0 }}
      >
        +
      </button>
    </div>
  )
}

// VideoUploadZone
export const VideoUploadZone = () => (
  <div
    className="rounded-lg flex flex-col items-center justify-center gap-2 py-6"
    style={{ border: '2px dashed #d3d7de', backgroundColor: '#f9fafc' }}
  >
    <Upload size={24} style={{ color: '#a7aebe' }} />
    <div className="text-center">
      <div style={{ fontSize: 13, fontWeight: 500, color: '#5f6a82' }}>Upload video</div>
      <div style={{ fontSize: 11, color: '#a7aebe' }}>Drag & drop or click to upload</div>
    </div>
    <button
      className="px-4 h-8 rounded-md border text-xs font-semibold mt-1"
      style={{ borderColor: '#e7eaee', color: '#5f6a82' }}
    >
      Choose file
    </button>
  </div>
)
