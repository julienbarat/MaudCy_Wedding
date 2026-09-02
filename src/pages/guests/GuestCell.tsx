import type { GuestColumn } from './columns'

interface Props {
  column: GuestColumn
  value: unknown
  onChange: (value: unknown) => void
}

const inputClass =
  'w-full min-w-[7ch] rounded border border-transparent bg-transparent px-1.5 py-1 text-sm hover:border-[var(--color-border)] focus:border-[var(--color-garrigue)] focus:bg-white focus:outline-none'

export default function GuestCell({ column, value, onChange }: Props) {
  if (column.type === 'case à cocher') {
    return (
      <input
        type="checkbox"
        checked={Boolean(value)}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[var(--color-garrigue)]"
      />
    )
  }

  if (column.type === 'liste') {
    return (
      <select
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      >
        <option value="" />
        {(column.options ?? []).map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    )
  }

  if (column.type === 'nombre') {
    return (
      <input
        type="number"
        value={typeof value === 'number' ? value : ''}
        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        className={inputClass}
      />
    )
  }

  if (column.type === 'date') {
    return (
      <input
        type="date"
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    )
  }

  return (
    <input
      type="text"
      value={typeof value === 'string' ? value : ''}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  )
}
