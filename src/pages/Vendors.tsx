import { useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import { Button, Card, PageHeader, Select, TextInput } from '../components/ui'
import { useWeddingData } from '../data/DataContext'
import { newId } from '../data/newId'
import type { StatutVendor, Vendor } from '../types'

const STATUTS: StatutVendor[] = ['à contacter', 'devis demandé', 'devis reçu', 'retenu', 'écarté']

function emptyVendor(categorie: string): Vendor {
  return {
    id: newId(),
    categorie,
    nomSociete: '',
    contact: '',
    telephone: '',
    email: '',
    siteWeb: '',
    statut: 'à contacter',
    prixDevis: null,
    notes: '',
  }
}

function exportVendorsXlsx(vendors: Vendor[]) {
  const rows = vendors.map((v) => ({
    Catégorie: v.categorie,
    Société: v.nomSociete,
    Contact: v.contact,
    Téléphone: v.telephone,
    Email: v.email,
    'Site web': v.siteWeb,
    Statut: v.statut,
    'Devis (€)': v.prixDevis ?? '',
    Notes: v.notes,
  }))
  const sheet = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, sheet, 'Prestataires')
  XLSX.writeFile(wb, 'prestataires.xlsx')
}

export default function Vendors() {
  const { data, update } = useWeddingData()
  const [nouvelleCategorie, setNouvelleCategorie] = useState('')

  const groups = useMemo(() => {
    const map = new Map<string, Vendor[]>()
    for (const v of data.vendors) {
      if (!map.has(v.categorie)) map.set(v.categorie, [])
      map.get(v.categorie)!.push(v)
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b, 'fr'))
  }, [data.vendors])

  function updateVendor(id: string, patch: Partial<Vendor>) {
    update((d) => ({ ...d, vendors: d.vendors.map((v) => (v.id === id ? { ...v, ...patch } : v)) }))
  }

  function ajouter(categorie: string) {
    update((d) => ({ ...d, vendors: [...d.vendors, emptyVendor(categorie)] }))
  }

  function ajouterCategorie() {
    const cat = nouvelleCategorie.trim()
    if (!cat) return
    update((d) => ({ ...d, vendors: [...d.vendors, emptyVendor(cat)] }))
    setNouvelleCategorie('')
  }

  function supprimer(v: Vendor) {
    if (!window.confirm(`Supprimer « ${v.nomSociete || v.categorie} » ?`)) return
    update((d) => ({ ...d, vendors: d.vendors.filter((x) => x.id !== v.id) }))
  }

  return (
    <div>
      <PageHeader
        title="Prestataires"
        actions={<Button variant="secondary" onClick={() => exportVendorsXlsx(data.vendors)}>Exporter .xlsx</Button>}
      />

      <div className="space-y-6">
        {groups.map(([categorie, vendors]) => (
          <Card key={categorie} className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg">{categorie}</h3>
              <Button variant="ghost" onClick={() => ajouter(categorie)}>
                + Contact
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-[var(--color-text-soft)]">
                    <th className="pb-1 pr-2">Société</th>
                    <th className="pb-1 pr-2">Contact</th>
                    <th className="pb-1 pr-2">Téléphone</th>
                    <th className="pb-1 pr-2">Email</th>
                    <th className="pb-1 pr-2">Statut</th>
                    <th className="pb-1 pr-2">Devis (€)</th>
                    <th className="pb-1 pr-2">Notes</th>
                    <th className="pb-1" />
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((v) => (
                    <tr key={v.id} className="border-t border-[var(--color-border-soft)]">
                      <td className="py-1 pr-2">
                        <TextInput value={v.nomSociete} onChange={(e) => updateVendor(v.id, { nomSociete: e.target.value })} className="w-36" />
                      </td>
                      <td className="py-1 pr-2">
                        <TextInput value={v.contact} onChange={(e) => updateVendor(v.id, { contact: e.target.value })} className="w-28" />
                      </td>
                      <td className="py-1 pr-2">
                        <TextInput value={v.telephone} onChange={(e) => updateVendor(v.id, { telephone: e.target.value })} className="w-28" />
                      </td>
                      <td className="py-1 pr-2">
                        <TextInput value={v.email} onChange={(e) => updateVendor(v.id, { email: e.target.value })} className="w-40" />
                      </td>
                      <td className="py-1 pr-2">
                        <Select value={v.statut} onChange={(e) => updateVendor(v.id, { statut: e.target.value as StatutVendor })}>
                          {STATUTS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </Select>
                      </td>
                      <td className="py-1 pr-2">
                        <TextInput
                          type="number"
                          value={v.prixDevis ?? ''}
                          onChange={(e) => updateVendor(v.id, { prixDevis: e.target.value ? Number(e.target.value) : null })}
                          className="w-24"
                        />
                      </td>
                      <td className="py-1 pr-2">
                        <TextInput value={v.notes} onChange={(e) => updateVendor(v.id, { notes: e.target.value })} className="w-36" />
                      </td>
                      <td className="py-1">
                        <Button variant="danger" onClick={() => supprimer(v)}>
                          Suppr.
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {vendors.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-2 text-[var(--color-text-soft)]">
                        Aucun contact pour cette catégorie.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 flex flex-wrap items-end gap-2 p-4">
        <label className="space-y-1 text-sm">
          <span className="text-xs text-[var(--color-text-soft)]">Nouvelle catégorie</span>
          <TextInput value={nouvelleCategorie} onChange={(e) => setNouvelleCategorie(e.target.value)} placeholder="ex. Wedding planner" />
        </label>
        <Button variant="primary" onClick={ajouterCategorie}>
          Ajouter la catégorie
        </Button>
      </Card>
    </div>
  )
}
