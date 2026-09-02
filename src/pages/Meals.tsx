import { useMemo } from 'react'
import { Card, PageHeader, Select, TextInput } from '../components/ui'
import { useWeddingData } from '../data/DataContext'
import { convivesForMeal } from '../lib/meals'
import type { Meal, PrestataireRepas } from '../types'

const PRESTATAIRES: PrestataireRepas[] = ['traiteur', 'maison', 'restaurant', 'non défini']

export default function Meals() {
  const { data, update } = useWeddingData()

  function updateMeal(id: string, patch: Partial<Meal>) {
    update((d) => ({ ...d, meals: d.meals.map((m) => (m.id === id ? { ...m, ...patch } : m)) }))
  }

  const rows = useMemo(
    () =>
      data.meals.map((meal) => {
        const convives = convivesForMeal(meal, data.guests)
        const enfants = convives.filter((g) => g.estEnfant).length
        const regimes = convives.filter((g) => g.regime.trim() !== '').length
        const total = meal.prixParPersonne != null ? meal.prixParPersonne * convives.length : null
        return { meal, convives: convives.length, enfants, regimes, total }
      }),
    [data.meals, data.guests],
  )

  const totalGeneral = rows.reduce((s, r) => s + (r.total ?? 0), 0)

  return (
    <div>
      <PageHeader title="Repas" subtitle="Le nombre de convives se met à jour depuis la liste des invités." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map(({ meal, convives, enfants, regimes, total }) => (
          <Card key={meal.id} className="p-4">
            <h3 className="text-lg">{meal.nom}</h3>
            <div className="mt-3 space-y-2 text-sm">
              <label className="block space-y-1">
                <span className="text-xs text-[var(--color-text-soft)]">Prestataire</span>
                <Select
                  value={meal.prestataire}
                  onChange={(e) => updateMeal(meal.id, { prestataire: e.target.value as PrestataireRepas })}
                  className="w-full"
                >
                  {PRESTATAIRES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="block space-y-1">
                <span className="text-xs text-[var(--color-text-soft)]">Nom du prestataire</span>
                <TextInput value={meal.nomPrestataire} onChange={(e) => updateMeal(meal.id, { nomPrestataire: e.target.value })} className="w-full" />
              </label>
              <label className="block space-y-1">
                <span className="text-xs text-[var(--color-text-soft)]">Prix par personne (€)</span>
                <TextInput
                  type="number"
                  value={meal.prixParPersonne ?? ''}
                  onChange={(e) => updateMeal(meal.id, { prixParPersonne: e.target.value ? Number(e.target.value) : null })}
                  className="w-full"
                />
              </label>

              <div className="grid grid-cols-3 gap-2 rounded-lg bg-[var(--color-stone)] p-2 text-center">
                <div>
                  <div className="font-serif text-xl text-[var(--color-ink)]">{convives}</div>
                  <div className="text-xs text-[var(--color-text-soft)]">convives</div>
                </div>
                <div>
                  <div className="font-serif text-xl text-[var(--color-ink)]">{enfants}</div>
                  <div className="text-xs text-[var(--color-text-soft)]">enfants</div>
                </div>
                <div>
                  <div className="font-serif text-xl text-[var(--color-ink)]">{regimes}</div>
                  <div className="text-xs text-[var(--color-text-soft)]">régimes</div>
                </div>
              </div>

              {total != null && (
                <p className="text-sm font-medium text-[var(--color-ink)]">Total : {total.toLocaleString('fr-FR')} €</p>
              )}

              <label className="block space-y-1">
                <span className="text-xs text-[var(--color-text-soft)]">Notes</span>
                <textarea
                  defaultValue={meal.notes}
                  onBlur={(e) => updateMeal(meal.id, { notes: e.target.value })}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] p-2 text-sm"
                  rows={2}
                />
              </label>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-4">
        <p className="text-sm font-medium text-[var(--color-ink)]">
          Budget restauration total (estimé) : {totalGeneral.toLocaleString('fr-FR')} €
        </p>
      </Card>
    </div>
  )
}
