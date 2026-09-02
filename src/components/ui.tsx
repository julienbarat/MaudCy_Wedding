import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

export function PageHeader({ title, actions, subtitle }: { title: string; actions?: ReactNode; subtitle?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-[var(--color-text-soft)]">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function Card({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-paper)] shadow-[var(--shadow-card)] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-garrigue)] text-white hover:bg-[var(--color-garrigue-dark)]',
  secondary:
    'border border-[var(--color-border)] bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-stone-dark)]',
  danger: 'text-[var(--color-vine)] hover:bg-[var(--color-vine-soft)]',
  ghost: 'text-[var(--color-text)] hover:bg-[var(--color-stone-dark)]',
}

export function Button({
  variant = 'secondary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      type="button"
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${BUTTON_STYLES[variant]} ${className}`}
      {...props}
    />
  )
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--color-garrigue)] ${props.className ?? ''}`}
    />
  )
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--color-garrigue)] ${props.className ?? ''}`}
    />
  )
}

export function Badge({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'garrigue' | 'vine' }) {
  const tones: Record<string, string> = {
    default: 'bg-[var(--color-stone-dark)] text-[var(--color-text)]',
    garrigue: 'bg-[var(--color-garrigue-soft)] text-[var(--color-garrigue-dark)]',
    vine: 'bg-[var(--color-vine-soft)] text-[var(--color-vine)]',
  }
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>
}

export function Modal({ children, onClose, maxWidth = 'max-w-2xl' }: { children: ReactNode; onClose: () => void; maxWidth?: string }) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div
        className={`max-h-[85vh] w-full ${maxWidth} overflow-y-auto rounded-xl bg-[var(--color-paper)] p-5 shadow-lg`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
