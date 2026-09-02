import { useEffect, useState } from 'react'
import { loadData, saveData } from './data/client'
import { emptyData } from './data/emptyData'
import type { WeddingData } from './types'

function App() {
  const [data, setData] = useState<WeddingData | null>(null)
  const [statut, setStatut] = useState<'chargement' | 'prêt' | 'enregistrement' | 'enregistré' | 'erreur'>('chargement')

  useEffect(() => {
    loadData()
      .then((d) => {
        setData(d)
        setStatut('prêt')
      })
      .catch(() => {
        setData(emptyData())
        setStatut('prêt')
      })
  }, [])

  async function tester() {
    if (!data) return
    setStatut('enregistrement')
    try {
      await saveData(data)
      setStatut('enregistré')
    } catch {
      setStatut('erreur')
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl">Organisation du mariage</h1>
      <p className="mt-2 text-sm">
        Squelette du projet — couche <code>loadData()</code> / <code>saveData()</code> en place.
      </p>
      <div className="mt-8 rounded border border-[var(--color-border)] bg-white p-4 text-sm">
        <p>Statut : {statut}</p>
        {data && <p className="mt-1">Tableaux chargés : {Object.keys(data).join(', ')}</p>}
        <button
          type="button"
          onClick={tester}
          className="mt-4 rounded bg-[var(--color-garrigue)] px-4 py-2 text-white hover:bg-[var(--color-garrigue-dark)]"
        >
          Tester l'enregistrement
        </button>
      </div>
    </main>
  )
}

export default App
