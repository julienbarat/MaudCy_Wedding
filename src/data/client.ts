import type { WeddingData } from '../types'

// Interface unique pour toute l'app : GET/PUT sur /api/data.
// En dev, une middleware Vite (vite.config.ts) sert cette route en lisant/écrivant
// data/wedding-data.json. En prod, une fonction serverless Vercel (api/data.ts)
// sert la même route en lisant/écrivant Vercel Blob. L'app ne voit que ça.

export async function loadData(): Promise<WeddingData> {
  const res = await fetch('/api/data')
  if (!res.ok) throw new Error(`Échec du chargement des données (${res.status})`)
  return res.json()
}

export async function saveData(data: WeddingData): Promise<void> {
  const res = await fetch('/api/data', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Échec de l'enregistrement des données (${res.status})`)
}
