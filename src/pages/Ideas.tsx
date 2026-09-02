import { useMemo, useState } from 'react'
import { Badge, Button, Card, Modal, PageHeader, Select, TextInput } from '../components/ui'
import { useWeddingData } from '../data/DataContext'
import { newId } from '../data/newId'
import type { CategorieIdee, Idea } from '../types'

const CATEGORIES: CategorieIdee[] = ['déco', 'musique', 'photo', 'animation', 'tenues', 'logistique', 'autre']

function emptyIdea(): Idea {
  return { id: newId(), titre: '', contenu: '', categorie: 'autre', lien: '', favori: false, date: new Date().toISOString().slice(0, 10) }
}

export default function Ideas() {
  const { data, update } = useWeddingData()
  const [filterCategorie, setFilterCategorie] = useState('')
  const [onlyFavoris, setOnlyFavoris] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return data.ideas
      .filter((i) => (!filterCategorie || i.categorie === filterCategorie) && (!onlyFavoris || i.favori))
      .slice()
      .reverse()
  }, [data.ideas, filterCategorie, onlyFavoris])

  function updateIdea(id: string, patch: Partial<Idea>) {
    update((d) => ({ ...d, ideas: d.ideas.map((i) => (i.id === id ? { ...i, ...patch } : i)) }))
  }

  function ajouter() {
    const idea = emptyIdea()
    update((d) => ({ ...d, ideas: [...d.ideas, idea] }))
    setOpenId(idea.id)
  }

  function supprimer(i: Idea) {
    if (!window.confirm(`Supprimer « ${i.titre || 'cette idée'} » ?`)) return
    update((d) => ({ ...d, ideas: d.ideas.filter((x) => x.id !== i.id) }))
    setOpenId(null)
  }

  const idea = data.ideas.find((i) => i.id === openId) ?? null

  return (
    <div>
      <PageHeader
        title="Idées"
        actions={<Button variant="primary" onClick={ajouter}>+ Nouvelle idée</Button>}
      />

      <Card className="mb-6 flex flex-wrap items-center gap-3 p-4 text-sm">
        <Select value={filterCategorie} onChange={(e) => setFilterCategorie(e.target.value)}>
          <option value="">Toutes catégories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={onlyFavoris} onChange={(e) => setOnlyFavoris(e.target.checked)} />
          Favoris seulement
        </label>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((i) => (
          <Card key={i.id} className="cursor-pointer p-4 transition-shadow hover:shadow-md" onClick={() => setOpenId(i.id)}>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg leading-tight">{i.titre || 'Sans titre'}</h3>
              {i.favori && <span title="Favori">★</span>}
            </div>
            <div className="mt-1">
              <Badge tone="garrigue">{i.categorie}</Badge>
            </div>
            {i.contenu && <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-[var(--color-text)]">{i.contenu}</p>}
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-sm text-[var(--color-text-soft)]">Aucune idée pour ces filtres.</p>}
      </div>

      {idea && (
        <Modal onClose={() => setOpenId(null)}>
          <div className="flex items-center justify-between gap-2">
            <TextInput value={idea.titre} onChange={(e) => updateIdea(idea.id, { titre: e.target.value })} placeholder="Titre" className="flex-1 text-lg font-medium" />
            <Button variant="ghost" onClick={() => setOpenId(null)}>
              Fermer
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <Select value={idea.categorie} onChange={(e) => updateIdea(idea.id, { categorie: e.target.value as CategorieIdee })}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={idea.favori} onChange={(e) => updateIdea(idea.id, { favori: e.target.checked })} />
              Favori
            </label>
            <TextInput type="date" value={idea.date} onChange={(e) => updateIdea(idea.id, { date: e.target.value })} />
          </div>

          <label className="mt-3 block space-y-1 text-sm">
            <span className="text-xs text-[var(--color-text-soft)]">Lien externe</span>
            <TextInput value={idea.lien} onChange={(e) => updateIdea(idea.id, { lien: e.target.value })} placeholder="https://…" className="w-full" />
          </label>

          <label className="mt-3 block space-y-1 text-sm">
            <span className="text-xs text-[var(--color-text-soft)]">Contenu (markdown)</span>
            <textarea
              defaultValue={idea.contenu}
              onBlur={(e) => updateIdea(idea.id, { contenu: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] p-2"
              rows={6}
            />
          </label>

          <div className="mt-4 flex justify-end">
            <Button variant="danger" onClick={() => supprimer(idea)}>
              Supprimer cette idée
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
