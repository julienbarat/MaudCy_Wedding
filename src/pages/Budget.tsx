import { useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import { Button, Card, PageHeader, TextInput } from '../components/ui'
import { useWeddingData } from '../data/DataContext'
import { newId } from '../data/newId'
import type { BudgetItem } from '../types'

function emptyBudgetItem(poste: string): BudgetItem {
  return { id: newId(), poste, montantEstime: null, montantReel: null, acompteVerse: null, dateEcheanceSolde: '', soldeVerse: false, notes: '' }
}

function exportBudgetXlsx(items: BudgetItem[]) {
  const rows = items.map((b) => ({
    Poste: b.poste,
    'Estimé (€)': b.montantEstime ?? '',
    'Réel (€)': b.montantReel ?? '',
    'Écart (€)': b.montantEstime != null && b.montantReel != null ? b.montantReel - b.montantEstime : '',
    'Acompte versé (€)': b.acompteVerse ?? '',
    'Solde versé': b.soldeVerse ? 'Oui' : 'Non',
    'Échéance du solde': b.dateEcheanceSolde,
    Notes: b.notes,
  }))
  const sheet = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, sheet, 'Budget')
  XLSX.writeFile(wb, 'budget.xlsx')
}

export default function Budget() {
  const { data, update } = useWeddingData()
  const [nouveauPoste, setNouveauPoste] = useState('')

  function updateItem(id: string, patch: Partial<BudgetItem>) {
    update((d) => ({ ...d, budget: d.budget.map((b) => (b.id === id ? { ...b, ...patch } : b)) }))
  }

  function ajouter() {
    const poste = nouveauPoste.trim()
    if (!poste) return
    update((d) => ({ ...d, budget: [...d.budget, emptyBudgetItem(poste)] }))
    setNouveauPoste('')
  }

  function supprimer(b: BudgetItem) {
    if (!window.confirm(`Supprimer le poste « ${b.poste} » ?`)) return
    update((d) => ({ ...d, budget: d.budget.filter((x) => x.id !== b.id) }))
  }

  const totals = useMemo(() => {
    const estime = data.budget.reduce((s, b) => s + (b.montantEstime ?? 0), 0)
    const reel = data.budget.reduce((s, b) => s + (b.montantReel ?? 0), 0)
    return { estime, reel, ecart: reel - estime }
  }, [data.budget])

  return (
    <div>
      <PageHeader title="Budget" actions={<Button variant="secondary" onClick={() => exportBudgetXlsx(data.budget)}>Exporter .xlsx</Button>} />

      <Card className="overflow-x-auto p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-[var(--color-text-soft)]">
              <th className="pb-2 pr-2">Poste</th>
              <th className="pb-2 pr-2">Estimé (€)</th>
              <th className="pb-2 pr-2">Réel (€)</th>
              <th className="pb-2 pr-2">Écart (€)</th>
              <th className="pb-2 pr-2">Acompte versé (€)</th>
              <th className="pb-2 pr-2">Échéance du solde</th>
              <th className="pb-2 pr-2">Soldé</th>
              <th className="pb-2 pr-2">Notes</th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody>
            {data.budget.map((b) => {
              const ecart = b.montantEstime != null && b.montantReel != null ? b.montantReel - b.montantEstime : null
              return (
                <tr key={b.id} className="border-t border-[var(--color-border-soft)]">
                  <td className="py-1 pr-2 font-medium text-[var(--color-ink)]">{b.poste}</td>
                  <td className="py-1 pr-2">
                    <TextInput
                      type="number"
                      value={b.montantEstime ?? ''}
                      onChange={(e) => updateItem(b.id, { montantEstime: e.target.value ? Number(e.target.value) : null })}
                      className="w-24"
                    />
                  </td>
                  <td className="py-1 pr-2">
                    <TextInput
                      type="number"
                      value={b.montantReel ?? ''}
                      onChange={(e) => updateItem(b.id, { montantReel: e.target.value ? Number(e.target.value) : null })}
                      className="w-24"
                    />
                  </td>
                  <td className={`py-1 pr-2 ${ecart != null && ecart > 0 ? 'text-[var(--color-vine)]' : ''}`}>
                    {ecart != null ? ecart.toLocaleString('fr-FR') : ''}
                  </td>
                  <td className="py-1 pr-2">
                    <TextInput
                      type="number"
                      value={b.acompteVerse ?? ''}
                      onChange={(e) => updateItem(b.id, { acompteVerse: e.target.value ? Number(e.target.value) : null })}
                      className="w-24"
                    />
                  </td>
                  <td className="py-1 pr-2">
                    <TextInput type="date" value={b.dateEcheanceSolde} onChange={(e) => updateItem(b.id, { dateEcheanceSolde: e.target.value })} />
                  </td>
                  <td className="py-1 pr-2 text-center">
                    <input type="checkbox" checked={b.soldeVerse} onChange={(e) => updateItem(b.id, { soldeVerse: e.target.checked })} />
                  </td>
                  <td className="py-1 pr-2">
                    <TextInput value={b.notes} onChange={(e) => updateItem(b.id, { notes: e.target.value })} className="w-32" />
                  </td>
                  <td className="py-1">
                    <Button variant="danger" onClick={() => supprimer(b)}>
                      Suppr.
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[var(--color-border)] font-medium text-[var(--color-ink)]">
              <td className="pt-2">Total</td>
              <td className="pt-2">{totals.estime.toLocaleString('fr-FR')}</td>
              <td className="pt-2">{totals.reel.toLocaleString('fr-FR')}</td>
              <td className={`pt-2 ${totals.ecart > 0 ? 'text-[var(--color-vine)]' : ''}`}>{totals.ecart.toLocaleString('fr-FR')}</td>
            </tr>
          </tfoot>
        </table>
      </Card>

      <Card className="mt-4 flex flex-wrap items-end gap-2 p-4">
        <label className="space-y-1 text-sm">
          <span className="text-xs text-[var(--color-text-soft)]">Nouveau poste</span>
          <TextInput value={nouveauPoste} onChange={(e) => setNouveauPoste(e.target.value)} placeholder="ex. Coiffure et maquillage" />
        </label>
        <Button variant="primary" onClick={ajouter}>
          Ajouter
        </Button>
      </Card>
    </div>
  )
}
