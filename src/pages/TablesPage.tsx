import { useMemo, useState } from 'react'
import { Button, Card, PageHeader, Select, TextInput } from '../components/ui'
import { useWeddingData } from '../data/DataContext'
import { newId } from '../data/newId'
import type { Guest, Table } from '../types'

export default function TablesPage() {
  const { data, update } = useWeddingData()
  const [nouvelleTable, setNouvelleTable] = useState('')

  const confirmes = useMemo(() => data.guests.filter((g) => g.statut === 'confirmé'), [data.guests])
  const nonPlaces = confirmes.filter((g) => !g.table)

  function updateTable(id: string, patch: Partial<Table>) {
    update((d) => ({ ...d, tables: d.tables.map((t) => (t.id === id ? { ...t, ...patch } : t)) }))
  }

  function assignerTable(guest: Guest, tableId: string) {
    update((d) => ({
      ...d,
      guests: d.guests.map((g) => (g.id === guest.id ? { ...g, table: tableId || null } : g)),
    }))
  }

  function ajouterTable() {
    const nom = nouvelleTable.trim() || `Table ${data.tables.length + 1}`
    update((d) => ({ ...d, tables: [...d.tables, { id: newId(), nom, capacite: null, notes: '' }] }))
    setNouvelleTable('')
  }

  function supprimerTable(t: Table) {
    if (!window.confirm(`Supprimer « ${t.nom} » ? Les invités assignés repasseront en non placés.`)) return
    update((d) => ({
      ...d,
      tables: d.tables.filter((x) => x.id !== t.id),
      guests: d.guests.map((g) => (g.table === t.id ? { ...g, table: null } : g)),
    }))
  }

  return (
    <div>
      <PageHeader title="Plan de table" subtitle="Dérivé de la liste des invités confirmés — aucune saisie de nom ici." />

      {nonPlaces.length > 0 && (
        <Card className="mb-6 border-[var(--color-vine)]/30 p-4">
          <h3 className="text-lg">Non placés ({nonPlaces.length})</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {nonPlaces.map((g) => (
              <li key={g.id} className="flex items-center justify-between gap-2">
                <span>
                  {g.prenom} {g.nom}
                </span>
                <Select value="" onChange={(e) => assignerTable(g, e.target.value)} className="w-40">
                  <option value="">Assigner à…</option>
                  {data.tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nom}
                    </option>
                  ))}
                </Select>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.tables.map((t) => {
          const invites = confirmes.filter((g) => g.table === t.id)
          const surCapacite = t.capacite != null && invites.length > t.capacite
          return (
            <Card key={t.id} className={`p-4 ${surCapacite ? 'border-[var(--color-vine)]' : ''}`}>
              <div className="flex items-center justify-between gap-2">
                <TextInput value={t.nom} onChange={(e) => updateTable(t.id, { nom: e.target.value })} className="font-medium" />
                <Button variant="danger" onClick={() => supprimerTable(t)}>
                  Suppr.
                </Button>
              </div>
              <label className="mt-2 flex items-center gap-2 text-sm">
                <span className="text-xs text-[var(--color-text-soft)]">Capacité</span>
                <TextInput
                  type="number"
                  value={t.capacite ?? ''}
                  onChange={(e) => updateTable(t.id, { capacite: e.target.value ? Number(e.target.value) : null })}
                  className="w-20"
                />
              </label>
              <p className={`mt-2 text-sm ${surCapacite ? 'font-medium text-[var(--color-vine)]' : 'text-[var(--color-text-soft)]'}`}>
                {invites.length}
                {t.capacite != null ? ` / ${t.capacite}` : ''} invité(s){surCapacite ? ' — capacité dépassée' : ''}
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {invites.map((g) => (
                  <li key={g.id} className="flex items-center justify-between gap-2">
                    <span>
                      {g.prenom} {g.nom}
                    </span>
                    <button type="button" onClick={() => assignerTable(g, '')} className="text-xs text-[var(--color-text-soft)] underline">
                      retirer
                    </button>
                  </li>
                ))}
                {invites.length === 0 && <li className="text-[var(--color-text-soft)]">Aucun invité placé.</li>}
              </ul>
            </Card>
          )
        })}
      </div>

      <Card className="mt-6 flex flex-wrap items-end gap-2 p-4">
        <label className="space-y-1 text-sm">
          <span className="text-xs text-[var(--color-text-soft)]">Nouvelle table</span>
          <TextInput value={nouvelleTable} onChange={(e) => setNouvelleTable(e.target.value)} placeholder="ex. Table des mariés" />
        </label>
        <Button variant="primary" onClick={ajouterTable}>
          Ajouter la table
        </Button>
      </Card>
    </div>
  )
}
