export type CategorieInvite = 'famille marié' | 'famille mariée' | 'amis' | 'travail' | 'autre'
export type StatutInvite = 'à inviter' | 'invité' | 'confirmé' | 'décliné'

export interface Guest {
  id: string
  prenom: string
  nom: string
  foyer: string
  categorie: CategorieInvite
  statut: StatutInvite
  estEnfant: boolean
  age: number | null
  email: string
  telephone: string
  regime: string
  samediMidi: boolean
  samediSoir: boolean
  dimancheBrunch: boolean
  dimancheSoir: boolean
  lundiMidi: boolean
  nuitVendredi: boolean
  nuitSamedi: boolean
  nuitDimanche: boolean
  logeSurPlace: boolean
  table: string | null
  notes: string
  custom: Record<string, unknown>
}

export type TypeChampPersonnalise = 'texte' | 'nombre' | 'case à cocher' | 'liste' | 'date'

export interface GuestField {
  cle: string
  libelle: string
  type: TypeChampPersonnalise
  options: string[]
  ordre: number
  visible: boolean
}

export type TypeLieu = 'domaine' | 'camping' | 'mas' | 'résidence'
export type BordEau = 'rivière' | 'lac' | 'aucun'
export type StatutLieu = 'à appeler' | 'contacté' | 'visite prévue' | 'visite faite' | 'écarté' | 'retenu'

export interface Venue {
  id: string
  ordre: number
  nom: string
  commune: string
  distanceMin: number
  type: TypeLieu
  capaciteAssise: number | null
  couchages: number | null
  bordEau: BordEau
  prixMin: number | null
  prixMax: number | null
  telephone: string
  siteWeb: string
  avantages: string[]
  inconvenients: string[]
  statut: StatutLieu
  notes: string
  photos: string[]
}

export type PrestataireRepas = 'traiteur' | 'maison' | 'restaurant' | 'non défini'

export interface Meal {
  id: string
  nom: string
  jour: string
  prestataire: PrestataireRepas
  nomPrestataire: string
  prixParPersonne: number | null
  notes: string
}

export type StatutVendor = 'à contacter' | 'devis demandé' | 'devis reçu' | 'retenu' | 'écarté'

export interface Vendor {
  id: string
  categorie: string
  nomSociete: string
  contact: string
  telephone: string
  email: string
  siteWeb: string
  statut: StatutVendor
  prixDevis: number | null
  notes: string
}

export interface BudgetItem {
  id: string
  poste: string
  montantEstime: number | null
  montantReel: number | null
  acompteVerse: number | null
  dateEcheanceSolde: string
  soldeVerse: boolean
  notes: string
}

export interface Table {
  id: string
  nom: string
  capacite: number | null
  notes: string
}

export type JourTimeline = 'samedi' | 'dimanche' | 'lundi'

export interface TimelineEntry {
  id: string
  jour: JourTimeline
  heureDebut: string
  heureFin: string
  titre: string
  lieu: string
  notes: string
  ordre: number
}

export interface Task {
  id: string
  titre: string
  description: string
  echeance: string
  categorie: string
  fait: boolean
  ordre: number
}

export type CategorieIdee = 'déco' | 'musique' | 'photo' | 'animation' | 'tenues' | 'logistique' | 'autre'

export interface Idea {
  id: string
  titre: string
  contenu: string
  categorie: CategorieIdee
  lien: string
  favori: boolean
  date: string
}

export interface WeddingData {
  guests: Guest[]
  guestFields: GuestField[]
  venues: Venue[]
  meals: Meal[]
  vendors: Vendor[]
  budget: BudgetItem[]
  tables: Table[]
  timeline: TimelineEntry[]
  tasks: Task[]
  ideas: Idea[]
}
