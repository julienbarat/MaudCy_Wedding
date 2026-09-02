import * as XLSX from 'xlsx'
import type { Guest, WeddingData } from '../../types'
import { getCellValue, type GuestColumn } from './columns'

function formatCell(value: unknown): string | number {
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non'
  if (value === null || value === undefined) return ''
  if (typeof value === 'number') return value
  return String(value)
}

export function exportGuestsXlsx(guests: Guest[], columns: GuestColumn[]) {
  const rows = guests.map((g) => {
    const row: Record<string, string | number> = {}
    for (const col of columns) {
      row[col.label] = formatCell(getCellValue(g, col))
    }
    return row
  })
  const sheet = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, sheet, 'Invités')
  XLSX.writeFile(wb, 'invites.xlsx')
}

const MEAL_TO_GUEST_KEY: Record<string, keyof Guest> = {
  'Samedi midi': 'samediMidi',
  'Samedi soir': 'samediSoir',
  'Dimanche brunch': 'dimancheBrunch',
  'Dimanche soir': 'dimancheSoir',
  'Lundi midi': 'lundiMidi',
}

export function exportEffectifsTraiteur(data: WeddingData) {
  const wb = XLSX.utils.book_new()

  for (const meal of data.meals) {
    const key = MEAL_TO_GUEST_KEY[meal.nom]
    const convives = key ? data.guests.filter((g) => Boolean(g[key])) : []
    const rows = convives.map((g) => ({
      Prénom: g.prenom,
      Nom: g.nom,
      Enfant: g.estEnfant ? 'Oui' : 'Non',
      Régime: g.regime,
    }))
    const sheet = XLSX.utils.json_to_sheet(rows)
    const sheetName = meal.nom.slice(0, 31)
    XLSX.utils.book_append_sheet(wb, sheet, sheetName)
  }

  XLSX.writeFile(wb, 'effectifs-traiteur.xlsx')
}
