import type { Guest, GuestField, TypeChampPersonnalise } from '../../types'

export interface GuestColumn {
  key: string
  label: string
  type: TypeChampPersonnalise
  options?: string[]
  custom: boolean
  cle?: string
}

export const CATEGORIE_OPTIONS = ['famille marié', 'famille mariée', 'amis', 'travail', 'autre']
export const STATUT_OPTIONS = ['à inviter', 'invité', 'confirmé', 'décliné']

export const FIXED_COLUMNS: GuestColumn[] = [
  { key: 'prenom', label: 'Prénom', type: 'texte', custom: false },
  { key: 'nom', label: 'Nom', type: 'texte', custom: false },
  { key: 'foyer', label: 'Foyer', type: 'texte', custom: false },
  { key: 'categorie', label: 'Catégorie', type: 'liste', options: CATEGORIE_OPTIONS, custom: false },
  { key: 'statut', label: 'Statut', type: 'liste', options: STATUT_OPTIONS, custom: false },
  { key: 'estEnfant', label: 'Enfant', type: 'case à cocher', custom: false },
  { key: 'age', label: 'Âge', type: 'nombre', custom: false },
  { key: 'email', label: 'Email', type: 'texte', custom: false },
  { key: 'telephone', label: 'Téléphone', type: 'texte', custom: false },
  { key: 'regime', label: 'Régime', type: 'texte', custom: false },
  { key: 'samediMidi', label: 'Sam. midi', type: 'case à cocher', custom: false },
  { key: 'samediSoir', label: 'Sam. soir', type: 'case à cocher', custom: false },
  { key: 'dimancheBrunch', label: 'Dim. brunch', type: 'case à cocher', custom: false },
  { key: 'dimancheSoir', label: 'Dim. soir', type: 'case à cocher', custom: false },
  { key: 'lundiMidi', label: 'Lundi midi', type: 'case à cocher', custom: false },
  { key: 'nuitVendredi', label: 'Nuit ven.', type: 'case à cocher', custom: false },
  { key: 'nuitSamedi', label: 'Nuit sam.', type: 'case à cocher', custom: false },
  { key: 'nuitDimanche', label: 'Nuit dim.', type: 'case à cocher', custom: false },
  { key: 'logeSurPlace', label: 'Logé sur place', type: 'case à cocher', custom: false },
  { key: 'table', label: 'Table', type: 'texte', custom: false },
  { key: 'notes', label: 'Notes', type: 'texte', custom: false },
]

export function visibleColumns(guestFields: GuestField[]): GuestColumn[] {
  const custom: GuestColumn[] = [...guestFields]
    .filter((f) => f.visible)
    .sort((a, b) => a.ordre - b.ordre)
    .map((f) => ({
      key: `custom.${f.cle}`,
      label: f.libelle,
      type: f.type,
      options: f.options,
      custom: true,
      cle: f.cle,
    }))
  return [...FIXED_COLUMNS, ...custom]
}

export function getCellValue(guest: Guest, column: GuestColumn): unknown {
  if (column.custom && column.cle) return guest.custom[column.cle]
  return (guest as unknown as Record<string, unknown>)[column.key]
}

export function setCellValue(guest: Guest, column: GuestColumn, value: unknown): Guest {
  if (column.custom && column.cle) {
    return { ...guest, custom: { ...guest.custom, [column.cle]: value } }
  }
  return { ...guest, [column.key]: value }
}

export function emptyGuest(id: string): Guest {
  return {
    id,
    prenom: '',
    nom: '',
    foyer: '',
    categorie: 'autre',
    statut: 'à inviter',
    estEnfant: false,
    age: null,
    email: '',
    telephone: '',
    regime: '',
    samediMidi: false,
    samediSoir: false,
    dimancheBrunch: false,
    dimancheSoir: false,
    lundiMidi: false,
    nuitVendredi: false,
    nuitSamedi: false,
    nuitDimanche: false,
    logeSurPlace: false,
    table: null,
    notes: '',
    custom: {},
  }
}
