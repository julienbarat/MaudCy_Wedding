import { useMemo, useState } from 'react'
import { Badge, Button, Card, Modal, PageHeader, Select, TextInput } from '../components/ui'
import { useWeddingData } from '../data/DataContext'
import { newId } from '../data/newId'
import type { BordEau, StatutLieu, TypeLieu, Venue } from '../types'

const TYPES: TypeLieu[] = ['domaine', 'camping', 'mas', 'résidence']
const BORD_EAU: BordEau[] = ['rivière', 'lac', 'aucun']
const STATUTS: StatutLieu[] = ['à appeler', 'contacté', 'visite prévue', 'visite faite', 'écarté', 'retenu']

function statutTone(statut: StatutLieu): 'default' | 'garrigue' | 'vine' {
  if (statut === 'retenu') return 'garrigue'
  if (statut === 'écarté') return 'vine'
  return 'default'
}

function emptyVenue(): Venue {
  return {
    id: newId(),
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

function prixLabel(v: Venue) {
  if (v.prixMin == null && v.prixMax == null) return 'Prix non estimé'
  const fmt = (n: number) => n.toLocaleString('fr-FR')
  if (v.prixMin != null && v.prixMax != null) return `${fmt(v.prixMin)}–${fmt(v.prixMax)} € (estimation)`
  return `${fmt((v.prixMin ?? v.prixMax) as number)} € (estimation)`
}

export default function Venues() {
  const { data, update } = useWeddingData()
  const [distanceMax, setDistanceMax] = useState(100)
  const [couchagesMin, setCouchagesMin] = useState(0)
  const [capaciteMin, setCapaciteMin] = useState(0)
  const [type, setType] = useState('')
  const [bordEau, setBordEau] = useState('')
  const [statut, setStatut] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return data.venues.filter((v) => {
      if (v.distanceMin > distanceMax) return false
      if (couchagesMin > 0 && (v.couchages ?? 0) < couchagesMin) return false
      if (capaciteMin > 0 && (v.capaciteAssise ?? 0) < capaciteMin) return false
      if (type && v.type !== type) return false
      if (bordEau && v.bordEau !== bordEau) return false
      if (statut && v.statut !== statut) return false
      return true
    })
  }, [data.venues, distanceMax, couchagesMin, capaciteMin, type, bordEau, statut])

  const venue = data.venues.find((v) => v.id === selected) ?? null

  function updateVenue(id: string, patch: Partial<Venue>) {
    update((d) => ({ ...d, venues: d.venues.map((v) => (v.id === id ? { ...v, ...patch } : v)) }))
  }

  function ajouter() {
    const v = emptyVenue()
    update((d) => ({ ...d, venues: [...d.venues, v] }))
    setSelected(v.id)
  }

  function supprimer(v: Venue) {
    if (!window.confirm(`Supprimer « ${v.nom || 'ce lieu'} » ?`)) return
    update((d) => ({ ...d, venues: d.venues.filter((x) => x.id !== v.id) }))
    setSelected(null)
  }

  return (
    <div>
      <PageHeader
        title="Lieux"
        subtitle="Fourchettes de prix estimées, pas des tarifs communiqués."
        actions={<Button variant="primary" onClick={ajouter}>+ Ajouter un lieu</Button>}
      />

      <Card className="mb-6 flex flex-wrap items-center gap-4 p-4 text-sm">
        <label className="flex items-center gap-2">
          Distance max
          <input type="range" min={0} max={100} value={distanceMax} onChange={(e) => setDistanceMax(Number(e.target.value))} />
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v) => (
          <Card key={v.id} className="cursor-pointer p-4 transition-shadow hover:shadow-md" onClick={() => setSelected(v.id)}>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg leading-tight">{v.nom || 'Sans nom'}</h3>
              <Badge tone={statutTone(v.statut)}>{v.statut}</Badge>
            </div>
            <p className="mt-1 text-sm text-[var(--color-text-soft)]">
              {v.commune} — {v.distanceMin} min
            </p>
            <p className="mt-2 text-sm">
              {v.type} · {v.capaciteAssise ?? '?'} assis · {v.couchages ?? '?'} couchages · {v.bordEau}
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--color-ink)]">{prixLabel(v)}</p>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-sm text-[var(--color-text-soft)]">Aucun lieu pour ces filtres.</p>}
      </div>

      {venue && (
        <Modal onClose={() => setSelected(null)}>
          <div className="flex items-center justify-between">
            <TextInput
              value={venue.nom}
              onChange={(e) => updateVenue(venue.id, { nom: e.target.value })}
              placeholder="Nom du lieu"
              className="text-lg font-medium"
            />
            <Button variant="ghost" onClick={() => setSelected(null)}>
              Fermer
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <label className="space-y-1">
              <span className="text-xs text-[var(--color-text-soft)]">Commune</span>
              <TextInput value={venue.commune} onChange={(e) => updateVenue(venue.id, { commune: e.target.value })} className="w-full" />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[var(--color-text-soft)]">Distance (min)</span>
              <TextInput
                type="number"
                value={venue.distanceMin}
                onChange={(e) => updateVenue(venue.id, { distanceMin: Number(e.target.value) || 0 })}
                className="w-full"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[var(--color-text-soft)]">Type</span>
              <Select value={venue.type} onChange={(e) => updateVenue(venue.id, { type: e.target.value as TypeLieu })} className="w-full">
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[var(--color-text-soft)]">Capacité assise</span>
              <TextInput
                type="number"
                value={venue.capaciteAssise ?? ''}
                onChange={(e) => updateVenue(venue.id, { capaciteAssise: e.target.value ? Number(e.target.value) : null })}
                className="w-full"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[var(--color-text-soft)]">Couchages</span>
              <TextInput
                type="number"
                value={venue.couchages ?? ''}
                onChange={(e) => updateVenue(venue.id, { couchages: e.target.value ? Number(e.target.value) : null })}
                className="w-full"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[var(--color-text-soft)]">Bord d'eau</span>
              <Select value={venue.bordEau} onChange={(e) => updateVenue(venue.id, { bordEau: e.target.value as BordEau })} className="w-full">
                {BORD_EAU.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </Select>
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[var(--color-text-soft)]">Prix min (€, estimation)</span>
              <TextInput
                type="number"
                value={venue.prixMin ?? ''}
                onChange={(e) => updateVenue(venue.id, { prixMin: e.target.value ? Number(e.target.value) : null })}
                className="w-full"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[var(--color-text-soft)]">Prix max (€, estimation)</span>
              <TextInput
                type="number"
                value={venue.prixMax ?? ''}
                onChange={(e) => updateVenue(venue.id, { prixMax: e.target.value ? Number(e.target.value) : null })}
                className="w-full"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[var(--color-text-soft)]">Statut</span>
              <Select value={venue.statut} onChange={(e) => updateVenue(venue.id, { statut: e.target.value as StatutLieu })} className="w-full">
                {STATUTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[var(--color-text-soft)]">Téléphone</span>
              <TextInput value={venue.telephone} onChange={(e) => updateVenue(venue.id, { telephone: e.target.value })} className="w-full" />
            </label>
            <label className="col-span-2 space-y-1 sm:col-span-1">
              <span className="text-xs text-[var(--color-text-soft)]">Site web</span>
              <TextInput value={venue.siteWeb} onChange={(e) => updateVenue(venue.id, { siteWeb: e.target.value })} className="w-full" />
            </label>
          </div>

          {(venue.telephone || venue.siteWeb) && (
            <p className="mt-3 flex gap-4 text-sm">
              {venue.telephone && (
                <a href={`tel:${venue.telephone.replace(/\s/g, '')}`} className="text-[var(--color-garrigue)] underline">
                  {venue.telephone}
                </a>
              )}
              {venue.siteWeb && (
                <a href={`https://${venue.siteWeb.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="text-[var(--color-garrigue)] underline">
                  {venue.siteWeb}
                </a>
              )}
            </p>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-xs text-[var(--color-text-soft)]">Avantages (séparés par des virgules)</span>
              <textarea
                defaultValue={venue.avantages.join(', ')}
                onBlur={(e) => updateVenue(venue.id, { avantages: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] p-2"
                rows={2}
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-xs text-[var(--color-text-soft)]">Inconvénients (séparés par des virgules)</span>
              <textarea
                defaultValue={venue.inconvenients.join(', ')}
                onBlur={(e) => updateVenue(venue.id, { inconvenients: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] p-2"
                rows={2}
              />
            </label>
          </div>

          <label className="mt-3 block space-y-1 text-sm">
            <span className="text-xs text-[var(--color-text-soft)]">Notes de visite</span>
            <textarea
              defaultValue={venue.notes}
              onBlur={(e) => updateVenue(venue.id, { notes: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] p-2"
              rows={3}
            />
          </label>

          <div className="mt-4 flex justify-end">
            <Button variant="danger" onClick={() => supprimer(venue)}>
              Supprimer ce lieu
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
