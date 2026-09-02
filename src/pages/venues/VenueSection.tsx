import { useState } from 'react'
import { Badge, Button, Select, TextInput } from '../../components/ui'
import type { BordEau, StatutLieu, TypeLieu, Venue } from '../../types'

const TYPES: TypeLieu[] = ['domaine', 'camping', 'mas', 'résidence']
const BORD_EAU: BordEau[] = ['rivière', 'lac', 'aucun']
const STATUTS: StatutLieu[] = ['à appeler', 'contacté', 'visite prévue', 'visite faite', 'écarté', 'retenu']

function statutTone(statut: StatutLieu): 'default' | 'garrigue' | 'vine' {
  if (statut === 'retenu') return 'garrigue'
  if (statut === 'écarté') return 'vine'
  return 'default'
}

function prixLabel(v: Venue) {
  if (v.prixMin == null && v.prixMax == null) return 'Prix non communiqué'
  const fmt = (n: number) => n.toLocaleString('fr-FR')
  if (v.prixMin != null && v.prixMax != null) return `${fmt(v.prixMin)}–${fmt(v.prixMax)} € (estimation)`
  return `${fmt((v.prixMin ?? v.prixMax) as number)} € (estimation)`
}

function mapsUrl(v: Venue) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${v.nom} ${v.commune}`)}`
}

interface Props {
  venue: Venue
  index: number
  total: number
  onChange: (patch: Partial<Venue>) => void
  onDelete: () => void
  onMove: (direction: -1 | 1) => void
}

export default function VenueSection({ venue, index, total, onChange, onDelete, onMove }: Props) {
  const [modifier, setModifier] = useState(false)

  return (
    <section className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-paper)] shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--color-border-soft)] p-4">
        <div className="flex flex-col">
          <button type="button" onClick={() => onMove(-1)} disabled={index === 0} className="leading-none disabled:opacity-30">
            ▲
          </button>
          <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} className="leading-none disabled:opacity-30">
            ▼
          </button>
        </div>
        <span className="font-serif text-2xl text-[var(--color-text-soft)]">#{index + 1}</span>
        <h3 className="flex-1 text-2xl">{venue.nom || 'Sans nom'}</h3>
        <Badge tone={statutTone(venue.statut)}>{venue.statut}</Badge>
        <Button variant="ghost" onClick={() => setModifier((m) => !m)}>
          {modifier ? 'Fermer' : 'Modifier'}
        </Button>
      </div>

      {venue.photos.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto p-4 pb-0">
          {venue.photos.map((url) => (
            <img key={url} src={url} alt={venue.nom} className="h-48 w-72 flex-none rounded-lg object-cover" loading="lazy" />
          ))}
        </div>
      ) : (
        <p className="p-4 pb-0 text-sm italic text-[var(--color-text-soft)]">Pas de photo pour l'instant — ajoute des liens d'image via « Modifier ».</p>
      )}

      <div className="p-4">
        <p className="text-sm">
          {venue.commune} — {venue.distanceMin} min · {venue.type} · {venue.capaciteAssise ?? '?'} assis ·{' '}
          {venue.couchages ?? '?'} couchages · {venue.bordEau}
        </p>
        <p className="mt-1 text-sm font-medium text-[var(--color-ink)]">{prixLabel(venue)}</p>

        <div className="mt-2 flex flex-wrap gap-4 text-sm">
          <a href={mapsUrl(venue)} target="_blank" rel="noreferrer" className="text-[var(--color-garrigue)] underline">
            Voir sur Google Maps
          </a>
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
        </div>

        {(venue.avantages.length > 0 || venue.inconvenients.length > 0) && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {venue.avantages.length > 0 && (
              <div>
                <p className="text-xs font-medium text-[var(--color-garrigue-dark)]">Avantages</p>
                <ul className="mt-1 list-inside list-disc text-sm">
                  {venue.avantages.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
            {venue.inconvenients.length > 0 && (
              <div>
                <p className="text-xs font-medium text-[var(--color-vine)]">Inconvénients</p>
                <ul className="mt-1 list-inside list-disc text-sm">
                  {venue.inconvenients.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {venue.notes && <p className="mt-3 text-sm text-[var(--color-text-soft)]">{venue.notes}</p>}
      </div>

      {modifier && (
        <div className="border-t border-[var(--color-border-soft)] p-4">
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <label className="space-y-1">
              <span className="text-xs text-[var(--color-text-soft)]">Nom</span>
              <TextInput value={venue.nom} onChange={(e) => onChange({ nom: e.target.value })} className="w-full" />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[var(--color-text-soft)]">Commune</span>
              <TextInput value={venue.commune} onChange={(e) => onChange({ commune: e.target.value })} className="w-full" />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[var(--color-text-soft)]">Distance (min)</span>
              <TextInput type="number" value={venue.distanceMin} onChange={(e) => onChange({ distanceMin: Number(e.target.value) || 0 })} className="w-full" />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[var(--color-text-soft)]">Type</span>
              <Select value={venue.type} onChange={(e) => onChange({ type: e.target.value as TypeLieu })} className="w-full">
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
                onChange={(e) => onChange({ capaciteAssise: e.target.value ? Number(e.target.value) : null })}
                className="w-full"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[var(--color-text-soft)]">Couchages</span>
              <TextInput
                type="number"
                value={venue.couchages ?? ''}
                onChange={(e) => onChange({ couchages: e.target.value ? Number(e.target.value) : null })}
                className="w-full"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[var(--color-text-soft)]">Bord d'eau</span>
              <Select value={venue.bordEau} onChange={(e) => onChange({ bordEau: e.target.value as BordEau })} className="w-full">
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
                onChange={(e) => onChange({ prixMin: e.target.value ? Number(e.target.value) : null })}
                className="w-full"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[var(--color-text-soft)]">Prix max (€, estimation)</span>
              <TextInput
                type="number"
                value={venue.prixMax ?? ''}
                onChange={(e) => onChange({ prixMax: e.target.value ? Number(e.target.value) : null })}
                className="w-full"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[var(--color-text-soft)]">Statut</span>
              <Select value={venue.statut} onChange={(e) => onChange({ statut: e.target.value as StatutLieu })} className="w-full">
                {STATUTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[var(--color-text-soft)]">Téléphone</span>
              <TextInput value={venue.telephone} onChange={(e) => onChange({ telephone: e.target.value })} className="w-full" />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-[var(--color-text-soft)]">Site web</span>
              <TextInput value={venue.siteWeb} onChange={(e) => onChange({ siteWeb: e.target.value })} className="w-full" />
            </label>
          </div>

          <label className="mt-3 block space-y-1 text-sm">
            <span className="text-xs text-[var(--color-text-soft)]">Photos (URLs séparées par des virgules)</span>
            <textarea
              defaultValue={venue.photos.join(', ')}
              onBlur={(e) => onChange({ photos: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] p-2"
              rows={2}
            />
          </label>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-xs text-[var(--color-text-soft)]">Avantages (séparés par des virgules)</span>
              <textarea
                defaultValue={venue.avantages.join(', ')}
                onBlur={(e) => onChange({ avantages: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] p-2"
                rows={2}
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-xs text-[var(--color-text-soft)]">Inconvénients (séparés par des virgules)</span>
              <textarea
                defaultValue={venue.inconvenients.join(', ')}
                onBlur={(e) => onChange({ inconvenients: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] p-2"
                rows={2}
              />
            </label>
          </div>

          <label className="mt-3 block space-y-1 text-sm">
            <span className="text-xs text-[var(--color-text-soft)]">Notes de visite</span>
            <textarea
              defaultValue={venue.notes}
              onBlur={(e) => onChange({ notes: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] p-2"
              rows={3}
            />
          </label>

          <div className="mt-3 flex justify-end">
            <Button variant="danger" onClick={onDelete}>
              Supprimer ce lieu
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
