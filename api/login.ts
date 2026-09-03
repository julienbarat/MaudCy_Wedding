import type { VercelRequest, VercelResponse } from '@vercel/node'

const COOKIE_NAME = 'wedding_session'
const THIRTY_DAYS = 60 * 60 * 24 * 30

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée' })
    return
  }

  const sitePassword = process.env.SITE_PASSWORD
  const { password } = req.body ?? {}

  if (!sitePassword || password !== sitePassword) {
    res.status(401).json({ error: 'Mot de passe incorrect' })
    return
  }

  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${sitePassword}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${THIRTY_DAYS}`,
  )
  res.status(200).json({ ok: true })
}
