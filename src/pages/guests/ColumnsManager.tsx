import { useState } from 'react'
import { useWeddingData } from '../../data/DataContext'
import { slugify } from '../../lib/slug'
import type { TypeChampPersonnalise } from '../../types'

const TYPES: TypeChampPersonnalise[] = ['texte', 'nombre', 'case à cocher', 'liste', 'date']

export default function ColumnsManager({ onClose }: { onClose: () => void }) {
  const { data, update } = useWeddingData()
  const [libelle, setLibelle] = useState('')
  const [type, setType] = useState<TypeChampPersonnalise>('texte')
  const fields = [...data.guestFields].sort((a, b) => a.ordre - b.ordre)

  function ajouter() {
    const label = libelle.trim()
    if (!label) return
    const existingKeys = new Set(data.guestFields.map((f) => f.cle))
    let cle = slugify(label)
    let n = 2
    while (existingKeys.has(cle)) {
      cle = `${slugify(label)}-${n}`
      n += 1
    }
    update((d) => ({
      ...d,
      guestFields: [
        ...d.guestFields,
        { cle, libelle: label, type, options: [], ordre: d.guestFields.length, visible: true },
      ],
    }))
    setLibelle('')
    setType('texte')
  }

  function renommer(cle: string, libelle: string) {
    update((d) => ({
      ...d,
      guestFields: d.guestFields.map((f) => (f.cle === cle ? { ...f, libelle } : f)),
    }))
  }

  function changerOptions(cle: string, optionsText: string) {
    const options = optionsText
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean)
    update((d) => ({
      ...d,
      guestFields: d.guestFields.map((f) => (f.cle === cle ? { ...f, options } : f)),
    }))
  }

  function toggleVisible(cle: string) {
    update((d) => ({
      ...d,
      guestFields: d.guestFields.map((f) => (f.cle === cle ? { ...f, visible: !f.visible } : f)),
    }))
  }

  function deplacer(cle: string, direction: -1 | 1) {
    update((d) => {
      const sorted = [...d.guestFields].sort((a, b) => a.ordre - b.ordre)
      const i = sorted.findIndex((f) => f.cle === cle)
      const j = i + direction
      if (i < 0 || j < 0 || j >= sorted.length) return d
      const tmp = sorted[i]
      sorted[i] = sorted[j]
      sorted[j] = tmp
      const reordered = sorted.map((f, idx) => ({ ...f, ordre: idx }))
      return { ...d, guestFields: reordered }
    })
  }

  function supprimer(cle: string, libelle: string) {
    if (!window.confirm(`Supprimer la colonne « ${libelle} » ? Les données saisies dans cette colonne seront perdues pour tous les invités.`)) {
      return
    }
    update((d) => ({
      ...d,
      guestFields: d.guestFields.filter((f) => f.cle !== cle),
      guests: d.guests.map((g) => {
        const custom = { ...g.custom }
        delete custom[cle]
        return { ...g, custom }
      }),
    }))
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 p-4">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-[var(--color-paper)] p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg">Colonnes personnalisées</h2>
          <button type="button" onClick={onClose} className="text-sm underline">
            Fermer
          </button>
        </div>

        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide">
              <th className="pb-1">Libellé</th>
              <th className="pb-1">Type</th>
              <th className="pb-1">Options (si liste)</th>
              <th className="pb-1">Visible</th>
              <th className="pb-1">Ordre</th>
              <th className="pb-1" />
            </tr>
          </thead>
          <tbody>
            {fields.map((f) => (
              <tr key={f.cle} className="border-t border-[var(--color-border)]">
                <td className="py-1 pr-2">
                  <input
                    value={f.libelle}
                    onChange={(e) => renommer(f.cle, e.target.value)}
                    className="w-full rounded border border-[var(--color-border)] px-1.5 py-1"
                  />
                </td>
                <td className="py-1 pr-2 text-xs">{f.type}</td>
                <td className="py-1 pr-2">
                  {f.type === 'liste' && (
                    <input
                      defaultValue={f.options.join(', ')}
                      onBlur={(e) => changerOptions(f.cle, e.target.value)}
                      placeholder="option1, option2"
                      className="w-full rounded border border-[var(--color-border)] px-1.5 py-1"
                    />
                  )}
                </td>
                <td className="py-1 pr-2 text-center">
                  <input type="checkbox" checked={f.visible} onChange={() => toggleVisible(f.cle)} />
                </td>
                <td className="py-1 pr-2 whitespace-nowrap">
                  <button type="button" onClick={() => deplacer(f.cle, -1)} className="px-1">
                    ↑
                  </button>
                  <button type="button" onClick={() => deplacer(f.cle, 1)} className="px-1">
                    ↓
                  </button>
                </td>
                <td className="py-1">
                  <button
                    type="button"
                    onClick={() => supprimer(f.cle, f.libelle)}
                    className="text-xs text-[var(--color-vine)] underline"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {fields.length === 0 && (
              <tr>
                <td colSpan={6} className="py-3 text-sm">
                  Aucune colonne personnalisée pour l'instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-4 flex flex-wrap items-end gap-2 border-t border-[var(--color-border)] pt-4">
          <div>
            <label className="block text-xs">Nouvelle colonne</label>
            <input
              value={libelle}
              onChange={(e) => setLibelle(e.target.value)}
              placeholder="Libellé"
              className="rounded border border-[var(--color-border)] px-2 py-1 text-sm"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TypeChampPersonnalise)}
            className="rounded border border-[var(--color-border)] px-2 py-1 text-sm"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={ajouter}
            className="rounded-lg bg-[var(--color-garrigue)] px-3 py-1.5 text-sm text-white hover:bg-[var(--color-garrigue-dark)]"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}
