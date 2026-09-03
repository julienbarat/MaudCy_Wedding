import { next } from '@vercel/functions'

const COOKIE_NAME = 'wedding_session'
const PUBLIC_PATHS = new Set(['/login.html', '/api/login', '/robots.txt', '/favicon.svg'])

function isAuthenticated(request: Request): boolean {
  const password = process.env.SITE_PASSWORD
  if (!password) return true // pas de mot de passe configure : ne pas bloquer l'acces

  const cookieHeader = request.headers.get('cookie') ?? ''
  return cookieHeader
    .split(';')
    .map((c) => c.trim())
    .some((c) => c === `${COOKIE_NAME}=${password}`)
}

export default function middleware(request: Request) {
  const { pathname } = new URL(request.url)

  if (PUBLIC_PATHS.has(pathname)) {
    return next()
  }

  if (!isAuthenticated(request)) {
    return Response.redirect(new URL('/login.html', request.url))
  }

  return next()
}
