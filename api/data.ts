import { put, get } from '@vercel/blob'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const BLOB_PATHNAME = 'wedding-data.json'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const result = await get(BLOB_PATHNAME, { access: 'private' })
    if (result?.statusCode !== 200) {
      res.status(404).json({ error: 'Aucune donnée enregistrée pour le moment.' })
      return
    }
    const data = await new Response(result.stream).json()
    res.status(200).json(data)
    return
  }

  if (req.method === 'PUT') {
    const body = req.body
    await put(BLOB_PATHNAME, JSON.stringify(body, null, 2), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    })
    res.status(200).json({ ok: true })
    return
  }

  res.status(405).json({ error: 'Méthode non autorisée' })
}
