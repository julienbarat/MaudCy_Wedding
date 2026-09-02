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
      <header className="border-b border-[var(--color-border)] bg-[var(--color-stone-dark)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <h1 className="text-xl">Notre mariage</h1>
          {label && (
            <span
              className={`text-xs ${status === 'erreur' ? 'text-[var(--color-vine)]' : 'text-[var(--color-text)]'}`}
            >
              {label}
            </span>
          )}
        </div>
        <nav className="mx-auto flex max-w-7xl flex-wrap gap-1 px-4 pb-2 text-sm">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded px-3 py-1.5 ${
                  isActive
                    ? 'bg-[var(--color-garrigue)] text-white'
                    : 'text-[var(--color-text)] hover:bg-[var(--color-stone)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
