import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const DATA_FILE = path.resolve(import.meta.dirname, 'data/wedding-data.json')

// Sert /api/data en dev en lisant/écrivant data/wedding-data.json,
// pour correspondre à l'interface unique loadData()/saveData() (voir src/data/client.ts).
// En prod, api/data.ts sert la même route via Vercel Blob.
function localDataApi(): Plugin {
  return {
    name: 'local-data-api',
    configureServer(server) {
      server.middlewares.use('/api/data', async (req, res) => {
        if (req.method === 'GET') {
          if (!existsSync(DATA_FILE)) {
            res.statusCode = 404
            res.end(JSON.stringify({ error: 'Aucune donnée enregistrée pour le moment.' }))
            return
          }
          const content = await readFile(DATA_FILE, 'utf-8')
          res.setHeader('Content-Type', 'application/json')
          res.end(content)
          return
        }

        if (req.method === 'PUT') {
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const body = Buffer.concat(chunks).toString('utf-8')
          await mkdir(path.dirname(DATA_FILE), { recursive: true })
          await writeFile(DATA_FILE, body, 'utf-8')
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: true }))
          return
        }

        res.statusCode = 405
        res.end(JSON.stringify({ error: 'Méthode non autorisée' }))
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), localDataApi()],
})
