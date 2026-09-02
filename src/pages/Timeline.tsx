import { useMemo } from 'react'
import { Button, Card, PageHeader, TextInput } from '../components/ui'
import { useWeddingData } from '../data/DataContext'
import { newId } from '../data/newId'
import type { JourTimeline, TimelineEntry } from '../types'

const JOURS: JourTimeline[] = ['samedi', 'dimanche', 'lundi']
const JOUR_LABEL: Record<JourTimeline, string> = { samedi: 'Samedi', dimanche: 'Dimanche', lundi: 'Lundi' }

function emptyEntry(jour: JourTimeline, ordre: number): TimelineEntry {
  return { id: newId(), jour, heureDebut: '', heureFin: '', titre: '', lieu: '', notes: '', ordre }
}

function sortEntries(entries: TimelineEntry[]): TimelineEntry[] {
  return [...entries].sort((a, b) => {
    if (a.heureDebut && b.heureDebut && a.heureDebut !== b.heureDebut) return a.heureDebut.localeCompare(b.heureDebut)
    if (a.heureDebut && !b.heureDebut) return -1
    if (!a.heureDebut && b.heureDebut) return 1
    return a.ordre - b.ordre
  })
}

export default function Timeline() {
  const { data, update } = useWeddingData()

  const parJour = useMemo(() => {
    return JOURS.map((jour) => ({ jour, entries: sortEntries(data.timeline.filter((e) => e.jour === jour)) }))
  }, [data.timeline])

  function updateEntry(id: string, patch: Partial<TimelineEntry>) {
    update((d) => ({ ...d, timeline: d.timeline.map((e) => (e.id === id ? { ...e, ...patch } : e)) }))
  }

  function ajouter(jour: JourTimeline) {
    const maxOrdre = data.timeline.filter((e) => e.jour === jour).reduce((m, e) => Math.max(m, e.ordre), -1)
    update((d) => ({ ...d, timeline: [...d.timeline, emptyEntry(jour, maxOrdre + 1)] }))
  }

  function supprimer(e: TimelineEntry) {
    if (!window.confirm(`Supprimer « ${e.titre || 'cette entrée'} » ?`)) return
    update((d) => ({ ...d, timeline: d.timeline.filter((x) => x.id !== e.id) }))
  }

  function deplacer(jour: JourTimeline, id: string, direction: -1 | 1) {
    update((d) => {
      const entries = sortEntries(d.timeline.filter((e) => e.jour === jour))
      const i = entries.findIndex((e) => e.id === id)
      const j = i + direction
      if (i < 0 || j < 0 || j >= entries.length) return d
      const a = entries[i]
      const b = entries[j]
      return {
        ...d,
        timeline: d.timeline.map((e) => {
          if (e.id === a.id) return { ...e, ordre: b.ordre }
          if (e.id === b.id) return { ...e, ordre: a.ordre }
          return e
        }),
      }
    })
  }

  return (
    <div>
      <PageHeader title="Planning du jour J" subtitle="Le déroulé heure par heure du week-end, distinct du rétroplanning." />

      <div className="space-y-6">
        {parJour.map(({ jour, entries }) => (
          <Card key={jour} className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg">{JOUR_LABEL[jour]}</h3>
              <Button variant="ghost" onClick={() => ajouter(jour)}>
                + Ajouter
              </Button>
            </div>
            <div className="space-y-2">
              {entries.map((e, i) => (
                <div key={e.id} className="flex flex-wrap items-center gap-2 border-t border-[var(--color-border-soft)] pt-2 text-sm">
                  <TextInput type="time" value={e.heureDebut} onChange={(ev) => updateEntry(e.id, { heureDebut: ev.target.value })} className="w-24" />
                  <span className="text-[var(--color-text-soft)]">→</span>
                  <TextInput type="time" value={e.heureFin} onChange={(ev) => updateEntry(e.id, { heureFin: ev.target.value })} className="w-24" />
                  <TextInput value={e.titre} onChange={(ev) => updateEntry(e.id, { titre: ev.target.value })} placeholder="Titre" className="min-w-40 flex-1" />
                  <TextInput value={e.lieu} onChange={(ev) => updateEntry(e.id, { lieu: ev.target.value })} placeholder="Lieu" className="w-36" />
                  <TextInput value={e.notes} onChange={(ev) => updateEntry(e.id, { notes: ev.target.value })} placeholder="Notes" className="w-36" />
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => deplacer(jour, e.id, -1)} disabled={i === 0} className="px-1 disabled:opacity-30">
                      ↑
                    </button>
                    <button type="button" onClick={() => deplacer(jour, e.id, 1)} disabled={i === entries.length - 1} className="px-1 disabled:opacity-30">
                      ↓
                    </button>
                    <Button variant="danger" onClick={() => supprimer(e)}>
                      Suppr.
                    </Button>
                  </div>
                </div>
              ))}
              {entries.length === 0 && <p className="text-sm text-[var(--color-text-soft)]">Rien de prévu pour l'instant.</p>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
