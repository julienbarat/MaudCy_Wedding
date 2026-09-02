import { Fragment, useMemo, useState } from 'react'
import { Button, Card, PageHeader, Select, TextInput } from '../components/ui'
import { useWeddingData } from '../data/DataContext'
import { newId } from '../data/newId'
import { normalizeSearch } from '../lib/slug'
import ColumnsManager from './guests/ColumnsManager'
import { CATEGORIE_OPTIONS, STATUT_OPTIONS, emptyGuest, getCellValue, setCellValue, visibleColumns } from './guests/columns'
import { exportEffectifsTraiteur, exportGuestsXlsx } from './guests/exportGuests'
import GuestCell from './guests/GuestCell'
import ImportDialog from './guests/ImportDialog'
import type { Guest } from '../types'

const REPAS_FILTRES: Array<[keyof Guest, string]> = [
  ['samediMidi', 'Samedi midi'],
  ['samediSoir', 'Samedi soir'],
  ['dimancheBrunch', 'Dimanche brunch'],
  ['dimancheSoir', 'Dimanche soir'],
  ['lundiMidi', 'Lundi midi'],
]

const NUITS_FILTRES: Array<[keyof Guest, string]> = [
  ['nuitVendredi', 'Nuit vendredi'],
  ['nuitSamedi', 'Nuit samedi'],
  ['nuitDimanche', 'Nuit dimanche'],
]

export default function Guests() {
  const { data, update } = useWeddingData()
  const [search, setSearch] = useState('')
  const [filterCategorie, setFilterCategorie] = useState('')
  const [filterStatut, setFilterStatut] = useState('')
  const [filterRepas, setFilterRepas] = useState('')
  const [filterNuit, setFilterNuit] = useState('')
  const [groupByFoyer, setGroupByFoyer] = useState(false)
  const [showColumns, setShowColumns] = useState(false)
  const [showImport, setShowImport] = useState(false)

  const columns = useMemo(() => visibleColumns(data.guestFields), [data.guestFields])

  const filtered = useMemo(() => {
    const q = normalizeSearch(search.trim())
    return data.guests.filter((g) => {
      if (q && !normalizeSearch(`${g.prenom} ${g.nom} ${g.foyer}`).includes(q)) return false
      if (filterCategorie && g.categorie !== filterCategorie) return false
      if (filterStatut && g.statut !== filterStatut) return false
      if (filterRepas && !g[filterRepas as keyof Guest]) return false
      if (filterNuit && !g[filterNuit as keyof Guest]) return false
      return true
    })
  }, [data.guests, search, filterCategorie, filterStatut, filterRepas, filterNuit])

  const groups = useMemo(() => {
    if (!groupByFoyer) return [{ foyer: null as string | null, guests: filtered }]
    const map = new Map<string, Guest[]>()
    for (const g of filtered) {
      const key = g.foyer.trim() || 'Sans foyer'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(g)
    }
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b, 'fr'))
      .map(([foyer, guests]) => ({ foyer, guests }))
  }, [filtered, groupByFoyer])

  function updateGuest(id: string, next: Guest) {
    update((d) => ({ ...d, guests: d.guests.map((g) => (g.id === id ? next : g)) }))
  }

  function ajouterInvite() {
    update((d) => ({ ...d, guests: [...d.guests, emptyGuest(newId())] }))
  }

  function dupliquer(g: Guest) {
    update((d) => {
      const copy: Guest = { ...g, id: newId() }
      const i = d.guests.findIndex((x) => x.id === g.id)
      const guests = [...d.guests]
      guests.splice(i + 1, 0, copy)
      return { ...d, guests }
    })
  }

  function supprimer(g: Guest) {
    const nom = `${g.prenom} ${g.nom}`.trim() || 'cet invité'
    if (!window.confirm(`Supprimer ${nom} ?`)) return
    update((d) => ({ ...d, guests: d.guests.filter((x) => x.id !== g.id) }))
  }

  return (
    <div>
      <PageHeader
        title="Invités"
        actions={
          <>
            <Button variant="primary" onClick={ajouterInvite}>+ Ajouter un invité</Button>
            <Button variant="secondary" onClick={() => setShowColumns(true)}>Colonnes</Button>
            <Button variant="secondary" onClick={() => setShowImport(true)}>Importer .xlsx</Button>
            <Button variant="secondary" onClick={() => exportGuestsXlsx(filtered, columns)}>Exporter .xlsx</Button>
            <Button variant="secondary" onClick={() => exportEffectifsTraiteur(data)}>Effectifs traiteur</Button>
          </>
        }
      />

      <Card className="mb-4 flex flex-wrap items-center gap-2 p-4 text-sm">
        <TextInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un nom, prénom, foyer…"
        />
        <Select value={filterCategorie} onChange={(e) => setFilterCategorie(e.target.value)}>
          <option value="">Toutes catégories</option>
          {CATEGORIE_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)}>
          <option value="">Tous statuts</option>
          {STATUT_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Select value={filterRepas} onChange={(e) => setFilterRepas(e.target.value)}>
          <option value="">Tous les repas</option>
          {REPAS_FILTRES.map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
        <Select value={filterNuit} onChange={(e) => setFilterNuit(e.target.value)}>
          <option value="">Toutes les nuits</option>
          {NUITS_FILTRES.map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={groupByFoyer} onChange={(e) => setGroupByFoyer(e.target.checked)} />
          Vue groupée par foyer
        </label>
        <span className="text-[var(--color-text-soft)]">
          {filtered.length} / {data.guests.length} invité(s)
        </span>
      </Card>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-paper)] shadow-[var(--shadow-card)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border-soft)] bg-[var(--color-stone)] text-left">
              {columns.map((c) => (
                <th key={c.key} className="whitespace-nowrap px-2 py-1.5 font-normal">
                  {c.label}
                </th>
              ))}
              <th className="px-2 py-1.5" />
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <Fragment key={group.foyer ?? 'flat'}>
                {group.foyer && (
                  <tr key={`h-${group.foyer}`} className="bg-[var(--color-garrigue-soft)]">
                    <td colSpan={columns.length + 1} className="px-2 py-1.5 text-xs font-medium text-[var(--color-garrigue-dark)]">
                      {group.foyer} — {group.guests.length}
                    </td>
                  </tr>
                )}
                {group.guests.map((g) => (
                  <tr key={g.id} className="border-b border-[var(--color-border-soft)] last:border-0 hover:bg-[var(--color-stone)]/60">
                    {columns.map((c) => (
                      <td key={c.key} className="px-1 py-0.5">
                        <GuestCell column={c} value={getCellValue(g, c)} onChange={(v) => updateGuest(g.id, setCellValue(g, c, v))} />
                      </td>
                    ))}
                    <td className="whitespace-nowrap px-2 py-0.5 text-xs">
                      <button type="button" onClick={() => dupliquer(g)} className="mr-2 text-[var(--color-text-soft)] underline">
                        Dupliquer
                      </button>
                      <button type="button" onClick={() => supprimer(g)} className="text-[var(--color-vine)] underline">
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-2 py-4 text-center text-sm">
                  Aucun invité{data.guests.length > 0 ? ' pour ces filtres' : ' pour le moment'}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showColumns && <ColumnsManager onClose={() => setShowColumns(false)} />}
      {showImport && <ImportDialog onClose={() => setShowImport(false)} />}
    </div>
  )
}
