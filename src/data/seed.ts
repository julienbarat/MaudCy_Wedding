import type { BudgetItem, Meal, Task, Vendor, Venue, WeddingData } from '../types'

let counter = 0
function id(prefix: string): string {
  counter += 1
  return `${prefix}-${counter}`
}

function seedVenues(): Venue[] {
  return [
    {
      id: id('venue'),
      nom: 'Château Rieutort',
      commune: 'Saint-Pargoire',
      distanceMin: 45,
      type: 'domaine',
      capaciteAssise: 200,
      couchages: null,
      bordEau: 'rivière',
      prixMin: 12000,
      prixMax: 20000,
      telephone: '04 67 89 38 20',
      siteWeb: 'chateau-rieutort.fr',
      avantages: [],
      inconvenients: [],
      statut: 'à appeler',
      notes: 'Couchages nombreux, capacité exacte à confirmer.',
      photos: [],
    },
    {
      id: id('venue'),
      nom: 'Domaine de la Grangette',
      commune: 'Montagnac',
      distanceMin: 45,
      type: 'domaine',
      capaciteAssise: 180,
      couchages: 96,
      bordEau: 'aucun',
      prixMin: 10000,
      prixMax: 16000,
      telephone: '04 67 24 50 92',
      siteWeb: 'domainedelagrangette.fr',
      avantages: [],
      inconvenients: [],
      statut: 'à appeler',
      notes: '',
      photos: [],
    },
    {
      id: id('venue'),
      nom: "Domaine d'Anglas",
      commune: 'Brissac',
      distanceMin: 50,
      type: 'camping',
      capaciteAssise: null,
      couchages: null,
      bordEau: 'rivière',
      prixMin: 4000,
      prixMax: 8000,
      telephone: '04 67 73 70 18',
      siteWeb: 'camping-anglas.com',
      avantages: [],
      inconvenients: [],
      statut: 'à appeler',
      notes: 'Capacité à vérifier.',
      photos: [],
    },
    {
      id: id('venue'),
      nom: "Camping Le Val d'Hérault",
      commune: 'Brissac',
      distanceMin: 40,
      type: 'camping',
      capaciteAssise: null,
      couchages: null,
      bordEau: 'rivière',
      prixMin: 4000,
      prixMax: 8000,
      telephone: '04 67 73 72 29',
      siteWeb: 'camping-levaldherault.com',
      avantages: [],
      inconvenients: [],
      statut: 'à appeler',
      notes: 'Capacité à vérifier.',
      photos: [],
    },
    {
      id: id('venue'),
      nom: 'Parc Sports & Loisirs Brissac-Ganges',
      commune: 'Brissac',
      distanceMin: 50,
      type: 'résidence',
      capaciteAssise: null,
      couchages: null,
      bordEau: 'aucun',
      prixMin: 5000,
      prixMax: 10000,
      telephone: '04 67 69 99 18',
      siteWeb: 'psl-cevennes.com',
      avantages: [],
      inconvenients: [],
      statut: 'à appeler',
      notes: "Capacité à vérifier, pas d'eau directe.",
      photos: [],
    },
    {
      id: id('venue'),
      nom: 'Domaine de Blancardy',
      commune: 'Moulès-et-Baucels',
      distanceMin: 55,
      type: 'mas',
      capaciteAssise: null,
      couchages: null,
      bordEau: 'aucun',
      prixMin: 5000,
      prixMax: 9000,
      telephone: '04 67 73 94 94',
      siteWeb: 'blancardy.com',
      avantages: [],
      inconvenients: [],
      statut: 'à appeler',
      notes: "Capacité à vérifier, pas d'eau directe.",
      photos: [],
    },
  ]
}

function seedMeals(): Meal[] {
  const repas: Array<[string, string]> = [
    ['Samedi midi', 'samedi'],
    ['Samedi soir', 'samedi'],
    ['Dimanche brunch', 'dimanche'],
    ['Dimanche soir', 'dimanche'],
    ['Lundi midi', 'lundi'],
  ]
  return repas.map(([nom, jour]) => ({
    id: id('meal'),
    nom,
    jour,
    prestataire: 'non défini',
    nomPrestataire: '',
    prixParPersonne: null,
    notes: '',
  }))
}

function seedVendors(): Vendor[] {
  const categories = [
    'Traiteur',
    'DJ / musique',
    'Photographe',
    'Vidéaste',
    'Fleuriste',
    'Décoration',
    'Location de mobilier et vaisselle',
  ]
  return categories.map((categorie) => ({
    id: id('vendor'),
    categorie,
    nomSociete: '',
    contact: '',
    telephone: '',
    email: '',
    siteWeb: '',
    statut: 'à contacter',
    prixDevis: null,
    notes: '',
  }))
}

function seedBudget(): BudgetItem[] {
  const postes = [
    'Lieu',
    'Hébergement',
    'Traiteur',
    'Boissons',
    'DJ / musique',
    'Photo et vidéo',
    'Fleurs et décoration',
    'Location mobilier',
    'Tenues',
    'Alliances',
    'Papeterie',
    'Transport',
    'Divers',
  ]
  return postes.map((poste) => ({
    id: id('budget'),
    poste,
    montantEstime: null,
    montantReel: null,
    acompteVerse: null,
    dateEcheanceSolde: '',
    soldeVerse: false,
    notes: '',
  }))
}

function seedTasks(): Task[] {
  const periodes: Array<[string, string[]]> = [
    ['Automne-hiver 2026', [
      'Appeler les six lieux',
      'Visiter les trois plus prometteurs',
      "Réserver le lieu et verser l'acompte",
      'Réserver la date à la mairie',
    ]],
    ['Printemps 2027', [
      "Liste d'invités v1",
      'Trois devis traiteur',
      'Choix du traiteur',
    ]],
    ['Été 2027 (J-12 mois)', [
      'Photographe',
      'DJ ou groupe',
      'Envoi des save-the-date',
    ]],
    ['Automne 2027', [
      'Tenues des mariés',
      'Fleuriste et décoration',
    ]],
    ['Hiver 2027-2028 (J-6 mois)', [
      'Papeterie',
      'Invitations imprimées puis envoyées',
      'Réservation des hébergements',
    ]],
    ['Mars 2028 (J-3 mois)', [
      'Dossier de mariage en mairie',
      'Dégustation menu',
      'Alliances',
      'Essayages',
    ]],
    ['Avril 2028 (J-2 mois)', [
      'Relance des invités sans réponse',
      'Plan de table',
      'Playlist',
    ]],
    ['Début mai 2028 (J-1 mois)', [
      'Effectifs définitifs au traiteur',
      'Répartition des couchages',
      'Planning du week-end',
    ]],
    ['Fin mai 2028', [
      'Brief des prestataires',
      'Derniers réglages',
      "Kits d'accueil",
    ]],
  ]

  const tasks: Task[] = []
  let ordre = 0
  for (const [categorie, titres] of periodes) {
    for (const titre of titres) {
      ordre += 1
      tasks.push({
        id: id('task'),
        titre,
        description: '',
        echeance: '',
        categorie,
        fait: false,
        ordre,
      })
    }
  }
  return tasks
}

export function seedData(): WeddingData {
  return {
    guests: [],
    guestFields: [],
    venues: seedVenues(),
    meals: seedMeals(),
    vendors: seedVendors(),
    budget: seedBudget(),
    tables: [],
    timeline: [],
    tasks: seedTasks(),
    ideas: [],
  }
}
