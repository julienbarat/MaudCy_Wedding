import { useMemo } from 'react'
import { useWeddingData } from '../data/DataContext'
import { STATUT_OPTIONS } from './guests/columns'

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-[var(--color-border)] bg-white px-4 py-3">
      <div className="text-2xl">{value}</div>
      <div className="text-xs text-[var(--color-text)]">{label}</div>
    </div>
  )
}

export default function Dashboard() {
  const { data } = useWeddingData()

  const stats = useMemo(() => {
    const parStatut = STATUT_OPTIONS.map((statut) => ({
      statut,
      count: data.guests.filter((g) => g.statut === statut).length,
    }))

    const parRepas = [
      ['Samedi midi', data.guests.filter((g) => g.samediMidi).length],
      ['Samedi soir', data.guests.filter((g) => g.samediSoir).length],
      ['Dimanche brunch', data.guests.filter((g) => g.dimancheBrunch).length],
      ['Dimanche soir', data.guests.filter((g) => g.dimancheSoir).length],
      ['Lundi midi', data.guests.filter((g) => g.lundiMidi).length],
    ] as const

    const couchages = [
      ['Vendredi', data.guests.filter((g) => g.nuitVendredi).length],
      ['Samedi', data.guests.filter((g) => g.nuitSamedi).length],
      ['Dimanche', data.guests.filter((g) => g.nuitDimanche).length],
    ] as const

    const adultes = data.guests.filter((g) => !g.estEnfant).length
    const enfants = data.guests.filter((g) => g.estEnfant).length
    const regimes = data.guests.filter((g) => g.regime.trim() !== '').length

    const budgetEstime = data.budget.reduce((s, b) => s + (b.montantEstime ?? 0), 0)
    const budgetReel = data.budget.reduce((s, b) => s + (b.montantReel ?? 0), 0)

    const lieuRetenu = data.venues.find((v) => v.statut === 'retenu') ?? null

    const prochainesTaches = [...data.tasks]
      .filter((t) => !t.fait)
      .sort((a, b) => {
        if (a.echeance && b.echeance) return a.echeance.localeCompare(b.echeance)
        if (a.echeance) return -1
        if (b.echeance) return 1
        return a.ordre - b.ordre
      })
      .slice(0, 5)

    const dernieresIdees = [...data.ideas].slice(-3).reverse()

    return { parStatut, parRepas, couchages, adultes, enfants, regimes, budgetEstime, budgetReel, lieuRetenu, prochainesTaches, dernieresIdees }
  }, [data])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl">Tableau de bord</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.parStatut.map((s) => (
            <StatCard key={s.statut} label={s.statut} value={s.count} />
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-lg">Présents par repas</h3>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {stats.parRepas.map(([label, count]) => (
              <StatCard key={label} label={label} value={count} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg">Couchages nécessaires par nuit</h3>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {stats.couchages.map(([label, count]) => (
              <StatCard key={label} label={label} value={count} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Adultes" value={stats.adultes} />
        <StatCard label="Enfants" value={stats.enfants} />
        <StatCard label="Régimes spéciaux" value={stats.regimes} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-lg">Lieu</h3>
          {stats.lieuRetenu ? (
            <p className="mt-2 text-sm">
              {stats.lieuRetenu.nom} — {stats.lieuRetenu.commune}
            </p>
          ) : (
            <p className="mt-2 text-sm">Aucun lieu retenu pour l'instant.</p>
          )}
        </div>
        <div>
          <h3 className="text-lg">Budget</h3>
          <p className="mt-2 text-sm">
            Estimé : {stats.budgetEstime.toLocaleString('fr-FR')} € — Réel : {stats.budgetReel.toLocaleString('fr-FR')} €
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-lg">Prochaines échéances</h3>
          {stats.prochainesTaches.length === 0 ? (
            <p className="mt-2 text-sm">Rien en attente.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm">
              {stats.prochainesTaches.map((t) => (
                <li key={t.id}>
                  {t.titre}
                  {t.echeance && <span className="text-[var(--color-text)]"> — {t.echeance}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="text-lg">Dernières idées</h3>
          {stats.dernieresIdees.length === 0 ? (
            <p className="mt-2 text-sm">Aucune idée notée pour l'instant.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm">
              {stats.dernieresIdees.map((idea) => (
                <li key={idea.id}>{idea.titre}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
