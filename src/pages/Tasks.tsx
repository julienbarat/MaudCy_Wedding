import { useMemo, useState } from 'react'
import { Button, Card, PageHeader, TextInput } from '../components/ui'
import { useWeddingData } from '../data/DataContext'
import { newId } from '../data/newId'
import type { Task } from '../types'

function emptyTask(categorie: string, ordre: number): Task {
  return { id: newId(), titre: '', description: '', echeance: '', categorie, fait: false, ordre }
}

const today = () => new Date().toISOString().slice(0, 10)

export default function Tasks() {
  const { data, update } = useWeddingData()
  const [nouvelleCategorie, setNouvelleCategorie] = useState('')

  const groups = useMemo(() => {
    const map = new Map<string, Task[]>()
    for (const t of data.tasks) {
      if (!map.has(t.categorie)) map.set(t.categorie, [])
      map.get(t.categorie)!.push(t)
    }
    return [...map.entries()].map(([categorie, tasks]) => [categorie, tasks.sort((a, b) => a.ordre - b.ordre)] as const)
  }, [data.tasks])

  function updateTask(id: string, patch: Partial<Task>) {
    update((d) => ({ ...d, tasks: d.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }))
  }

  function ajouter(categorie: string) {
    const maxOrdre = data.tasks.filter((t) => t.categorie === categorie).reduce((m, t) => Math.max(m, t.ordre), -1)
    update((d) => ({ ...d, tasks: [...d.tasks, emptyTask(categorie, maxOrdre + 1)] }))
  }

  function ajouterCategorie() {
    const cat = nouvelleCategorie.trim()
    if (!cat) return
    ajouter(cat)
    setNouvelleCategorie('')
  }

  function supprimer(t: Task) {
    if (!window.confirm(`Supprimer « ${t.titre || 'cette tâche'} » ?`)) return
    update((d) => ({ ...d, tasks: d.tasks.filter((x) => x.id !== t.id) }))
  }

  const now = today()

  return (
    <div>
      <PageHeader title="Rétroplanning" />

      <div className="space-y-6">
        {groups.map(([categorie, tasks]) => (
          <Card key={categorie} className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg">{categorie}</h3>
              <Button variant="ghost" onClick={() => ajouter(categorie)}>
                + Ajouter
              </Button>
            </div>
            <ul className="space-y-2 text-sm">
              {tasks.map((t) => {
                const enRetard = !t.fait && t.echeance !== '' && t.echeance < now
                return (
                  <li key={t.id} className="flex flex-wrap items-center gap-2 border-t border-[var(--color-border-soft)] pt-2">
                    <input type="checkbox" checked={t.fait} onChange={(e) => updateTask(t.id, { fait: e.target.checked })} className="h-4 w-4 accent-[var(--color-garrigue)]" />
                    <TextInput
                      value={t.titre}
                      onChange={(e) => updateTask(t.id, { titre: e.target.value })}
                      className={`min-w-40 flex-1 ${t.fait ? 'text-[var(--color-text-soft)] line-through' : ''}`}
                    />
                    <TextInput type="date" value={t.echeance} onChange={(e) => updateTask(t.id, { echeance: e.target.value })} className={enRetard ? 'border-[var(--color-vine)]' : ''} />
                    {enRetard && <span className="text-xs font-medium text-[var(--color-vine)]">en retard</span>}
                    <Button variant="danger" onClick={() => supprimer(t)}>
                      Suppr.
                    </Button>
                  </li>
                )
              })}
              {tasks.length === 0 && <li className="text-[var(--color-text-soft)]">Rien ici pour l'instant.</li>}
            </ul>
          </Card>
        ))}
      </div>

      <Card className="mt-6 flex flex-wrap items-end gap-2 p-4">
        <label className="space-y-1 text-sm">
          <span className="text-xs text-[var(--color-text-soft)]">Nouvelle période / catégorie</span>
          <TextInput value={nouvelleCategorie} onChange={(e) => setNouvelleCategorie(e.target.value)} placeholder="ex. Semaine du mariage" />
        </label>
        <Button variant="primary" onClick={ajouterCategorie}>
          Ajouter
        </Button>
      </Card>
    </div>
  )
}
