import { useState } from 'react'
import * as XLSX from 'xlsx'
import { useWeddingData } from '../../data/DataContext'
import { newId } from '../../data/newId'
import { normalizeSearch, slugify } from '../../lib/slug'
import type { GuestField } from '../../types'
import { emptyGuest, FIXED_COLUMNS, type GuestColumn } from './columns'

interface ParsedFile {
  headers: string[]
  rows: unknown[][]
}

const NOUVELLE_COLONNE = '__nouvelle__'
const IGNORER = '__ignorer__'

function guessTarget(header: string, columns: GuestColumn[]): string {
  const normalized = normalizeSearch(header)
  const match = columns.find((c) => normalizeSearch(c.label) === normalized)
  return match ? match.key : NOUVELLE_COLONNE
}

function isTruthyCell(value: unknown): boolean {
  const s = normalizeSearch(String(value ?? '')).trim()
  return ['oui', 'vrai', 'true', '1', 'x'].includes(s)
}

export default function ImportDialog({ onClose }: { onClose: () => void }) {
  const { data, update } = useWeddingData()
  const [parsed, setParsed] = useState<ParsedFile | null>(null)
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [resultat, setResultat] = useState<string | null>(null)

  const knownColumns: GuestColumn[] = [
    ...FIXED_COLUMNS,
    ...data.guestFields.map((f) => ({
      key: `custom.${f.cle}`,
      label: f.libelle,
      type: f.type,
      options: f.options,
      custom: true,
      cle: f.cle,
    })),
  ]

  async function onFile(file: File) {
    const buf = await file.arrayBuffer()
    const wb = XLSX.read(buf, { type: 'array' })
    const sheet = wb.Sheets[wb.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' })
    const headers = (rows[0] ?? []).map((h) => String(h))
    const dataRows = rows.slice(1).filter((r) => r.some((cell) => String(cell ?? '').trim() !== ''))
    setParsed({ headers, rows: dataRows })
    const initialMapping: Record<string, string> = {}
    headers.forEach((h) => {
      initialMapping[h] = guessTarget(h, knownColumns)
    })
    setMapping(initialMapping)
  }

  function importer() {
    if (!parsed) return

    const newFields: GuestField[] = []
    let ordre = data.guestFields.length
    const headerToColumn = new Map<string, GuestColumn>()

    for (const header of parsed.headers) {
      const target = mapping[header]
      if (!target || target === IGNORER) continue
      if (target === NOUVELLE_COLONNE) {
        const existingKeys = new Set([...data.guestFields.map((f) => f.cle), ...newFields.map((f) => f.cle)])
        let cle = slugify(header)
        let n = 2
        while (existingKeys.has(cle)) {
          cle = `${slugify(header)}-${n}`
          n += 1
        }
        const field: GuestField = { cle, libelle: header, type: 'texte', options: [], ordre, visible: true }
        ordre += 1
        newFields.push(field)
        headerToColumn.set(header, { key: `custom.${cle}`, label: header, type: 'texte', custom: true, cle })
      } else {
        const col = knownColumns.find((c) => c.key === target)
        if (col) headerToColumn.set(header, col)
      }
    }

    const newGuests = parsed.rows.map((row) => {
      let guest = emptyGuest(newId())
      parsed.headers.forEach((header, i) => {
        const col = headerToColumn.get(header)
        if (!col) return
        const raw = row[i]
        let value: unknown
        if (col.type === 'case à cocher') value = isTruthyCell(raw)
        else if (col.type === 'nombre') {
          const n = Number(raw)
          value = raw === '' || Number.isNaN(n) ? null : n
        } else value = String(raw ?? '').trim()

        if (col.custom && col.cle) {
          guest = { ...guest, custom: { ...guest.custom, [col.cle]: value } }
        } else {
          guest = { ...guest, [col.key]: value }
        }
      })
      return guest
    })

    update((d) => ({
      ...d,
      guestFields: [...d.guestFields, ...newFields],
      guests: [...d.guests, ...newGuests],
    }))
    setResultat(`${newGuests.length} invité(s) importé(s)${newFields.length ? `, ${newFields.length} nouvelle(s) colonne(s) créée(s)` : ''}.`)
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 p-4">
      <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-[var(--color-paper)] p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg">Importer un fichier Excel</h2>
          <button type="button" onClick={onClose} className="text-sm underline">
            Fermer
          </button>
        </div>

        {!parsed && (
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onFile(file)
            }}
            className="mt-4 text-sm"
          />
        )}

        {parsed && !resultat && (
          <>
            <p className="mt-4 text-sm">
              {parsed.rows.length} ligne(s) détectée(s). Fais correspondre chaque colonne du fichier à une colonne de
              l'application.
            </p>
            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide">
                  <th className="pb-1">Colonne du fichier</th>
                  <th className="pb-1">Correspond à</th>
                </tr>
              </thead>
              <tbody>
                {parsed.headers.map((header) => (
                  <tr key={header} className="border-t border-[var(--color-border)]">
                    <td className="py-1 pr-3">{header}</td>
                    <td className="py-1">
                      <select
                        value={mapping[header] ?? NOUVELLE_COLONNE}
                        onChange={(e) => setMapping((m) => ({ ...m, [header]: e.target.value }))}
                        className="w-full rounded border border-[var(--color-border)] px-1.5 py-1"
                      >
                        <option value={IGNORER}>Ignorer</option>
                        <option value={NOUVELLE_COLONNE}>Nouvelle colonne personnalisée</option>
                        {knownColumns.map((c) => (
                          <option key={c.key} value={c.key}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              onClick={importer}
              className="mt-4 rounded-lg bg-[var(--color-garrigue)] px-3 py-1.5 text-sm text-white hover:bg-[var(--color-garrigue-dark)]"
            >
              Importer
            </button>
          </>
        )}

        {resultat && (
          <div className="mt-4">
            <p className="text-sm">{resultat}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 rounded-lg bg-[var(--color-garrigue)] px-3 py-1.5 text-sm text-white hover:bg-[var(--color-garrigue-dark)]"
            >
              Terminé
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
