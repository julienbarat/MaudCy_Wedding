import { useMemo, useState } from 'react'
import { Button, Card, PageHeader, Select, TextInput } from '../components/ui'
import { useWeddingData } from '../data/DataContext'
import { newId } from '../data/newId'
import VenueSection from './venues/VenueSection'
import type { Venue } from '../types'

const TYPES = ['domaine', 'camping', 'mas', 'résidence'] as const
const BORD_EAU = ['rivière', 'lac', 'aucun'] as const
const STATUTS = ['à appeler', 'contacté', 'visite prévue', 'visite faite', 'écarté', 'retenu'] as const

function emptyVenue(ordre: number): Venue {
  return {
    id: newId(),
    ordre,
    nom: '',
    commune: '',
    distanceMin: 60,
    type: 'domaine',
    capaciteAssise: null,
    couchages: null,
    bordEau: 'aucun',
    prixMin: null,
    prixMax: null,
    telephone: '',
    siteWeb: '',
    avantages: [],
    inconvenients: [],
    statut: 'à appeler',
    notes: '',
    photos: [],
  }
}

export default function Venues() {
  const { data, update } = useWeddingData()
  const [distanceMax, setDistanceMax] = useState(150)
  const [couchagesMin, setCouchagesMin] = useState(0)
  const [capaciteMin, setCapaciteMin] = useState(0)
  const [type, setType] = useState('')
  const [bordEau, setBordEau] = useState('')
  const [statut, setStatut] = useState('')

  const sorted = useMemo(() => [...data.venues].sort((a, b) => a.ordre - b.ordre), [data.venues])

  const filtered = useMemo(() => {
    return sorted.filter((v) => {
      if (v.distanceMin > distanceMax) return false
      if (couchagesMin > 0 && (v.couchages ?? 0) < couchagesMin) return false
      if (capaciteMin > 0 && (v.capaciteAssise ?? 0) < capaciteMin) return false
      if (type && v.type !== type) return false
      if (bordEau && v.bordEau !== bordEau) return false
      if (statut && v.statut !== statut) return false
      return true
    })
  }, [sorted, distanceMax, couchagesMin, capaciteMin, type, bordEau, statut])

  function updateVenue(id: string, patch: Partial<Venue>) {
    update((d) => ({ ...d, venues: d.venues.map((v) => (v.id === id ? { ...v, ...patch } : v)) }))
  }

  function ajouter() {
    const maxOrdre = data.venues.reduce((m, v) => Math.max(m, v.ordre), -1)
    update((d) => ({ ...d, venues: [...d.venues, emptyVenue(maxOrdre + 1)] }))
  }

  function supprimer(v: Venue) {
    if (!window.confirm(`Supprimer « ${v.nom || 'ce lieu'} » ?`)) return
    update((d) => ({ ...d, venues: d.venues.filter((x) => x.id !== v.id) }))
  }

  function deplacer(v: Venue, direction: -1 | 1) {
    const i = sorted.findIndex((x) => x.id === v.id)
    const j = i + direction
    if (j < 0 || j >= sorted.length) return
    const other = sorted[j]
    update((d) => ({
      ...d,
      venues: d.venues.map((x) => {
        if (x.id === v.id) return { ...x, ordre: other.ordre }
        if (x.id === other.id) return { ...x, ordre: v.ordre }
        return x
      }),
    }))
  }

  return (
    <div>
      <PageHeader
        title="Lieux"
        subtitle="Fourchettes de prix estimées, pas des tarifs communiqués. Rayon de recherche : 150 km autour de Castelnau-le-Lez."
        actions={<Button variant="primary" onClick={ajouter}>+ Ajouter un lieu</Button>}
      />

      <Card className="mb-6 flex flex-wrap items-center gap-4 p-4 text-sm">
        <label className="flex items-center gap-2">
          Distance max
          <input type="range" min={0} max={150} value={distanceMax} onChange={(e) => setDistanceMax(Number(e.target.value))} />
          <span className="w-16 text-[var(--color-text-soft)]">{distanceMax} min</span>
        </label>
        <label className="flex items-center gap-2">
          Couchages min
          <TextInput type="number" min={0} value={couchagesMin || ''} onChange={(e) => setCouchagesMin(Number(e.target.value) || 0)} className="w-20" />
        </label>
        <label className="flex items-center gap-2">
          Capacité min
          <TextInput type="number" min={0} value={capaciteMin || ''} onChange={(e) => setCapaciteMin(Number(e.target.value) || 0)} className="w-20" />
        </label>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Tous types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
        <Select value={bordEau} onChange={(e) => setBordEau(e.target.value)}>
          <option value="">Eau : indifférent</option>
          {BORD_EAU.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </Select>
        <Select value={statut} onChange={(e) => setStatut(e.target.value)}>
          <option value="">Tous statuts</option>
          {STATUTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <span className="text-[var(--color-text-soft)]">{filtered.length} / {data.venues.length}</span>
      </Card>

      <div className="space-y-4">
        {filtered.map((v, i) => (
          <VenueSection
            key={v.id}
            venue={v}
            index={i}
            total={filtered.length}
            onChange={(patch) => updateVenue(v.id, patch)}
            onDelete={() => supprimer(v)}
            onMove={(dir) => deplacer(v, dir)}
          />
        ))}
        {filtered.length === 0 && <p className="text-sm text-[var(--color-text-soft)]">Aucun lieu pour ces filtres.</p>}
      </div>
    </div>
  )
}
