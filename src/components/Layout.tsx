import { NavLink, Outlet } from 'react-router-dom'
import { useWeddingData } from '../data/DataContext'

const NAV = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/invites', label: 'Invités' },
  { to: '/lieux', label: 'Lieux' },
  { to: '/repas', label: 'Repas' },
  { to: '/prestataires', label: 'Prestataires' },
  { to: '/budget', label: 'Budget' },
  { to: '/plan-de-table', label: 'Plan de table' },
  { to: '/planning-jour-j', label: 'Planning du jour J' },
  { to: '/retroplanning', label: 'Rétroplanning' },
  { to: '/idees', label: 'Idées' },
]

const STATUS_LABEL: Record<string, string> = {
  chargement: 'Chargement…',
  prêt: '',
  enregistrement: 'Enregistrement…',
  enregistré: 'Enregistré',
  erreur: "Erreur d'enregistrement",
}

export default function Layout() {
  const { status } = useWeddingData()
  const label = STATUS_LABEL[status] ?? ''

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-[var(--color-border-soft)] bg-[var(--color-stone)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-5 pt-4">
          <h1 className="text-2xl">Notre mariage</h1>
          <span
            className={`flex items-center gap-1.5 text-xs transition-opacity ${label ? 'opacity-100' : 'opacity-0'} ${status === 'erreur' ? 'text-[var(--color-vine)]' : 'text-[var(--color-text-soft)]'}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${status === 'erreur' ? 'bg-[var(--color-vine)]' : status === 'enregistrement' ? 'bg-amber-500' : 'bg-[var(--color-garrigue)]'}`}
            />
            {label || 'Enregistré'}
          </span>
        </div>
        <nav className="mx-auto flex max-w-7xl flex-wrap gap-1 px-5 pb-3 pt-3 text-sm">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 transition-colors ${
                  isActive
                    ? 'bg-[var(--color-garrigue)] text-white'
                    : 'text-[var(--color-text)] hover:bg-[var(--color-stone-dark)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8">
        <Outlet />
      </main>
    </div>
  )
}
