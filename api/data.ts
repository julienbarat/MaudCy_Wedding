import { put, head } from '@vercel/blob'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const BLOB_PATHNAME = 'wedding-data.json'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const blob = await head(BLOB_PATHNAME)
      const fileRes = await fetch(blob.url)
      const data = await fileRes.json()
      res.status(200).json(data)
    } catch {
      res.status(404).json({ error: 'Aucune donnée enregistrée pour le moment.' })
    }
    return
  }

  if (req.method === 'PUT') {
    const body = req.body
    await put(BLOB_PATHNAME, JSON.stringify(body, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    })
    res.status(200).json({ ok: true })
    return
  }

  res.status(405).json({ error: 'Méthode non autorisée' })
}
