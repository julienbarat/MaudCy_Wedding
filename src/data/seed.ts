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
      ordre: 0,
      nom: 'Domaine de la Grangette',
      commune: 'Montagnac',
      distanceMin: 45,
      type: 'domaine',
      capaciteAssise: 180,
      couchages: 96,
      bordEau: 'aucun',
      prixMin: 3500,
      prixMax: 16000,
      telephone: '04 67 24 50 92',
      siteWeb: 'domainedelagrangette.fr',
      avantages: ['Capacité assise pile 180', '96 couchages sur place (proche du besoin réel)', 'Ancien chai en pierre climatisé, cour ombragée de 800 m²'],
      inconvenients: ["Pas d'accès à l'eau"],
      statut: 'à appeler',
      notes: '',
      photos: [],
    },
    {
      id: id('venue'),
      ordre: 1,
      nom: 'Château Rieutort',
      commune: 'Saint-Pargoire',
      distanceMin: 45,
      type: 'domaine',
      capaciteAssise: 200,
      couchages: 60,
      bordEau: 'rivière',
      prixMin: 8400,
      prixMax: 20000,
      telephone: '04 67 89 38 20',
      siteWeb: 'chateau-rieutort.fr',
      avantages: ["Bord de l'Hérault", 'Domaine viticole du XVIIIe siècle, très photogénique', '7 gîtes + 5 chambres sur place'],
      inconvenients: ['Plus cher que la moyenne'],
      statut: 'à appeler',
      notes: '',
      photos: [
        'https://www.chateau-rieutort.fr/wp-content/uploads/brume-matinale.jpg',
        'https://www.chateau-rieutort.fr/wp-content/uploads/entree-du-chateau-400x284.jpg',
        'https://www.chateau-rieutort.fr/wp-content/uploads/table-de-mariage-400x284.jpg',
        'https://www.chateau-rieutort.fr/wp-content/uploads/parc-et-statues-400x284.jpg',
      ],
    },
    {
      id: id('venue'),
      ordre: 2,
      nom: 'Le Sauvage — Domaine en Camargue',
      commune: 'Saintes-Maries-de-la-Mer (Bouches-du-Rhône)',
      distanceMin: 85,
      type: 'domaine',
      capaciteAssise: 300,
      couchages: 121,
      bordEau: 'lac',
      prixMin: null,
      prixMax: null,
      telephone: '04 90 85 28 41',
      siteWeb: 'domainelesauvage.com',
      avantages: [
        '121 couchages sur place (44 chambres) — le meilleur match avec le besoin de 90 à 110 personnes logées',
        'Domaine de 2000 ha entre mer, étangs et pinède, avec plage sauvage',
        'Capacité assise jusqu\'à 300, debout jusqu\'à 500-750',
      ],
      inconvenients: [
        'Un des plus loin de Castelnau-le-Lez (~1h20-1h30)',
        "Prix uniquement sur devis",
        "Une fiche pro (ABC Salles) le donne comme ne louant plus ses espaces — à vérifier en priorité à l'appel",
      ],
      statut: 'à appeler',
      notes: "Trouvé en élargissant la recherche à 150 km, ajouté sur demande. Bord de mer/étangs plutôt qu'un lac au sens strict — pas d'option plus précise dans les catégories.",
      photos: [
        'https://images.kactus.com/64ovd7w962s903fhl4p1xlvhr2u6?compress=true&fm=auto&h=480&q=80&w=580&s=6559692a67e9c1549ff7536ead768c46',
        'https://images.kactus.com/6561hfd512nd6l9umhuo4xkbbzuk?compress=true&fm=auto&h=240&q=70&w=360&s=bec5e1a2373b874bbe73996d09a1f22c',
        'https://images.kactus.com/mkiscafa49ht48651qhymgokgdtk?compress=true&fm=auto&h=240&q=70&w=360&s=7f60fecaf2c46f919f3f2a7ddf14cc7d',
      ],
    },
    {
      id: id('venue'),
      ordre: 3,
      nom: 'Domaine de Combelles',
      commune: 'Le Monastère (Rodez, Aveyron)',
      distanceMin: 115,
      type: 'domaine',
      capaciteAssise: 200,
      couchages: 200,
      bordEau: 'aucun',
      prixMin: 2000,
      prixMax: 10000,
      telephone: '05 65 67 32 79',
      siteWeb: 'combelles-aveyron.fr',
      avantages: ['Hébergement sur place très important (chalets et cottages)', 'Deux salles modulables (Bergerie 200 pers., Étable 120-150 pers.)', 'Prix de location parmi les plus bas'],
      inconvenients: ['Le plus loin de Castelnau-le-Lez (~1h50-2h de route)', "Pas d'accès à l'eau"],
      statut: 'à appeler',
      notes: "Trouvé en élargissant la recherche à 150 km. Capacité de couchage estimée, à confirmer à l'appel — plusieurs sources évoquent jusqu'à 360 couchages.",
      photos: [
        'https://combelles-aveyron.fr/wp-content/uploads/2025/07/cadre-mariage-combelles-e1757493947930-1024x357.webp',
        'https://combelles-aveyron.fr/wp-content/uploads/2025/07/salle-mariage-reception-aveyron-768x1024.webp',
      ],
    },
    {
      id: id('venue'),
      ordre: 4,
      nom: 'Mas du Versadou',
      commune: 'Saint-Gilles (Camargue, Gard)',
      distanceMin: 65,
      type: 'mas',
      capaciteAssise: 150,
      couchages: 60,
      bordEau: 'lac',
      prixMin: null,
      prixMax: null,
      telephone: '06 84 77 21 74',
      siteWeb: 'masduversadou.fr',
      avantages: ['Cadre Camargue au bord d\'un étang', 'Cérémonie laïque possible sous le platane face à l\'étang', 'Emplacements pour tentes en plus des 26 lits du mas'],
      inconvenients: ['Capacité assise un peu sous les 180 recherchés', 'Prix non communiqué en ligne, à demander'],
      statut: 'à appeler',
      notes: 'Trouvé en élargissant la recherche à 150 km.',
      photos: [
        'https://masduversadou.fr/wp-content/uploads/2023/01/9-scaled.jpg',
        'https://masduversadou.fr/wp-content/uploads/2023/02/320952877_882390549613454_2734819643339507462_n.jpg',
        'https://masduversadou.fr/wp-content/uploads/2023/02/Grande-table.png',
      ],
    },
    {
      id: id('venue'),
      ordre: 5,
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
      avantages: ['Le plus proche de Castelnau-le-Lez', 'Plage privée en bord de rivière'],
      inconvenients: [],
      statut: 'à appeler',
      notes: 'Capacité à vérifier.',
      photos: [
        'https://www.camping-levaldherault.com/wp-content/uploads/2024/11/ESPACE-AQUATIQUE-plage-privee-riviere1-1-420x420.jpg.webp',
        'https://www.camping-levaldherault.com/wp-content/uploads/2024/11/photo-drone-camping-1-420x420.jpg.webp',
        'https://www.camping-levaldherault.com/wp-content/uploads/2024/12/NOUMEA-SMART-VIEW-2019-BD-terrasse-ESPELETTE-420x420.jpg.webp',
      ],
    },
    {
      id: id('venue'),
      ordre: 6,
      nom: 'Parc Sports & Loisirs Brissac-Ganges',
      commune: 'Brissac',
      distanceMin: 50,
      type: 'résidence',
      capaciteAssise: 200,
      couchages: 150,
      bordEau: 'aucun',
      prixMin: 5000,
      prixMax: 10000,
      telephone: '04 67 69 99 18',
      siteWeb: 'psl-cevennes.com',
      avantages: ['53 appartements sur place (jusqu\'à ~150 couchages)', 'Beaucoup d\'activités (aquatique, karting, mini-golf) pour un week-end de 3 jours'],
      inconvenients: ["Pas d'eau directe", 'Ambiance village vacances plus que romantique'],
      statut: 'à appeler',
      notes: '',
      photos: [
        'https://privateaser-media.s3.eu-west-1.amazonaws.com/etab_photos/9882/1500x750/67430.jpg',
        'https://privateaser-media.s3.eu-west-1.amazonaws.com/etab_photos/9882/750x375/67431.jpg',
      ],
    },
    {
      id: id('venue'),
      ordre: 7,
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
      siteWeb: 'domaine-anglas.com',
      avantages: ['12 ha de vignes en bord de rivière'],
      inconvenients: [],
      statut: 'à appeler',
      notes: "L'ancien site camping-anglas.com ne répond plus, nouvelle adresse domaine-anglas.com. Capacité à vérifier à l'appel, pas de photo fiable trouvée en ligne.",
      photos: [],
    },
    {
      id: id('venue'),
      ordre: 8,
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
      siteWeb: 'blancardy.fr',
      avantages: [],
      inconvenients: [],
      statut: 'à appeler',
      notes: "Capacité à vérifier, pas d'eau directe.",
      photos: [],
    },
    {
      id: id('venue'),
      ordre: 9,
      nom: 'Château de Linsolas',
      commune: 'Villeneuve-lès-Avignon (Gard)',
      distanceMin: 70,
      type: 'domaine',
      capaciteAssise: 150,
      couchages: 46,
      bordEau: 'aucun',
      prixMin: 4500,
      prixMax: 9000,
      telephone: '06 72 00 82 43',
      siteWeb: 'chateau-de-linsolas.fr',
      avantages: ['46 couchages 4 étoiles', 'Piscine chauffée, spa, jacuzzi', 'Très haut de gamme'],
      inconvenients: ['Capacité assise sous les 180 recherchés (max 150)', 'Le plus cher de la liste'],
      statut: 'à appeler',
      notes: 'Trouvé en élargissant la recherche à 150 km. À garder en solution de repli plutôt qu\'en premier choix, vu la capacité.',
      photos: [
        'https://chateau-de-linsolas.fr/img/mariage/mariage-ceremonie-large.webp',
        'https://chateau-de-linsolas.fr/img/mariage/mariage-facade-guirlandes.webp',
        'https://chateau-de-linsolas.fr/img/mariage/mariage-couple-piscine.webp',
      ],
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
