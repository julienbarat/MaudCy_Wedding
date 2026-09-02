import { useMemo, type ReactNode } from 'react'
import { useWeddingData } from '../data/DataContext'
import { Card, PageHeader } from '../components/ui'
import { STATUT_OPTIONS } from './guests/columns'

function StatCard({ label, value, tone = 'default' }: { label: string; value: string | number; tone?: 'default' | 'garrigue' }) {
  return (
    <Card className={`px-4 py-3.5 ${tone === 'garrigue' ? 'bg-[var(--color-garrigue-soft)]' : ''}`}>
      <div className="font-serif text-3xl text-[var(--color-ink)]">{value}</div>
      <div className="mt-0.5 text-xs text-[var(--color-text-soft)]">{label}</div>
    </Card>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-lg text-[var(--color-ink)]">{title}</h3>
      {children}
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

    const dans30Jours = new Date()
    dans30Jours.setDate(dans30Jours.getDate() + 30)
    const echeancesProches = data.budget
      .filter((b) => !b.soldeVerse && b.dateEcheanceSolde && new Date(b.dateEcheanceSolde) <= dans30Jours)
      .sort((a, b) => a.dateEcheanceSolde.localeCompare(b.dateEcheanceSolde))

    return {
      parStatut,
      parRepas,
      couchages,
      adultes,
      enfants,
      regimes,
      budgetEstime,
      budgetReel,
      lieuRetenu,
      prochainesTaches,
      dernieresIdees,
      echeancesProches,
    }
  }, [data])

  return (
    <div className="space-y-10">
      <PageHeader title="Tableau de bord" subtitle="180 invités, samedi 3 au lundi 5 juin 2028." />

      {stats.echeancesProches.length > 0 && (
        <Card className="border-[var(--color-vine)] bg-[var(--color-vine-soft)] p-4">
          <h3 className="text-sm font-medium text-[var(--color-vine)]">Soldes à régler dans les 30 jours</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {stats.echeancesProches.map((b) => (
              <li key={b.id} className="flex justify-between gap-2">
                <span>{b.poste}</span>
                <span className="text-[var(--color-text-soft)]">{b.dateEcheanceSolde}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Section title="Invités par statut">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.parStatut.map((s) => (
            <StatCard key={s.statut} label={s.statut} value={s.count} tone={s.statut === 'confirmé' ? 'garrigue' : 'default'} />
          ))}
        </div>
      </Section>

      <div className="grid gap-8 md:grid-cols-2">
        <Section title="Présents par repas">
          <div className="grid grid-cols-2 gap-3">
            {stats.parRepas.map(([label, count]) => (
              <StatCard key={label} label={label} value={count} />
            ))}
          </div>
        </Section>
        <Section title="Couchages nécessaires par nuit">
          <div className="grid grid-cols-3 gap-3">
            {stats.couchages.map(([label, count]) => (
              <StatCard key={label} label={label} value={count} />
            ))}
          </div>
        </Section>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Adultes" value={stats.adultes} />
        <StatCard label="Enfants" value={stats.enfants} />
        <StatCard label="Régimes spéciaux" value={stats.regimes} />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Section title="Lieu">
          <Card className="p-4">
            {stats.lieuRetenu ? (
              <p className="text-sm">
                <span className="font-medium text-[var(--color-ink)]">{stats.lieuRetenu.nom}</span> — {stats.lieuRetenu.commune}
              </p>
            ) : (
              <p className="text-sm text-[var(--color-text-soft)]">Aucun lieu retenu pour l'instant.</p>
            )}
          </Card>
        </Section>
        <Section title="Budget">
          <Card className="p-4">
            <p className="text-sm">
              Estimé : <span className="font-medium text-[var(--color-ink)]">{stats.budgetEstime.toLocaleString('fr-FR')} €</span>
              {' — '}
              Réel : <span className="font-medium text-[var(--color-ink)]">{stats.budgetReel.toLocaleString('fr-FR')} €</span>
            </p>
          </Card>
        </Section>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Section title="Prochaines échéances">
          <Card className="p-4">
            {stats.prochainesTaches.length === 0 ? (
              <p className="text-sm text-[var(--color-text-soft)]">Rien en attente.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {stats.prochainesTaches.map((t) => (
                  <li key={t.id} className="flex justify-between gap-2">
                    <span>{t.titre}</span>
                    {t.echeance && <span className="whitespace-nowrap text-[var(--color-text-soft)]">{t.echeance}</span>}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </Section>
        <Section title="Dernières idées">
          <Card className="p-4">
            {stats.dernieresIdees.length === 0 ? (
              <p className="text-sm text-[var(--color-text-soft)]">Aucune idée notée pour l'instant.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {stats.dernieresIdees.map((idea) => (
                  <li key={idea.id}>{idea.titre}</li>
                ))}
              </ul>
            )}
          </Card>
        </Section>
      </div>
    </div>
  )
}
