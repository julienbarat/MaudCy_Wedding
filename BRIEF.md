# Site d'organisation de mariage — cahier des charges

Application web privée pour organiser un mariage.
Date : **samedi 3, dimanche 4 et lundi 5 juin 2028** (lundi de Pentecôte, férié).
Environ **180 invités**, dont 90 à 110 à loger sur place.
Recherche de lieu en cours dans un rayon de 100 km autour de Castelnau-le-Lez (Hérault).

Deux utilisateurs : les mariés. Personne d'autre. Pas de RSVP public, pas de page visible par les invités.

## Stack

Même base que cy-art-luthier.fr, en plus léger :

- React + TypeScript + Vite
- Tailwind CSS
- Déploiement Vercel
- SheetJS (`xlsx`) pour l'import et l'export Excel

**Pas de base de données.** Toutes les données tiennent dans un seul fichier JSON.

## Stockage

Un fichier unique, `wedding-data.json`, contenant les six tableaux de l'application.

- **En développement** : le fichier vit dans `data/wedding-data.json`, lu et écrit par une petite API locale.
- **En production** : le même fichier est stocké dans Vercel Blob, lu et écrit par deux fonctions serverless, `GET /api/data` et `PUT /api/data`.

Le code applicatif ne voit qu'une seule interface : `loadData()` et `saveData()`. L'implémentation change selon l'environnement, rien d'autre.

Sauvegarde automatique après chaque modification, avec un indicateur discret « enregistré » dans l'interface. Un bouton « Télécharger une sauvegarde » exporte le JSON complet, et un bouton « Restaurer » le réimporte — c'est le filet de sécurité, à utiliser de temps en temps.

## Accès

Un mot de passe unique partagé, stocké en variable d'environnement, vérifié côté serveur. Une fois saisi, un cookie garde la session. C'est suffisant pour deux personnes sur un site que personne ne cherchera.

`robots.txt` en `Disallow: /`, pas de sitemap, pas d'indexation.

## Structure du fichier de données

```
{
  guests: [...],
  guestFields: [...],
  venues: [...],
  meals: [...],
  vendors: [...],
  budget: [...],
  tables: [...],
  timeline: [...],
  tasks: [...],
  ideas: [...]
}
```

### `guests` — invités

Champs fixes : `id`, `prenom`, `nom`, `foyer`, `categorie` (famille marié / famille mariée / amis / travail / autre), `statut` (à inviter / invité / confirmé / décliné), `estEnfant`, `age`, `email`, `telephone`, `regime`, `samediMidi`, `samediSoir`, `dimancheBrunch`, `dimancheSoir`, `lundiMidi`, `nuitVendredi`, `nuitSamedi`, `nuitDimanche`, `logeSurPlace`, `table` (identifiant de table, voir `tables` ci-dessous), `notes`, `custom` (objet libre).

### `guestFields` — colonnes personnalisées

**Les mariés doivent pouvoir ajouter leurs propres colonnes depuis l'interface, sans toucher au code.**

Champs : `cle`, `libelle`, `type` (texte, nombre, case à cocher, liste, date), `options`, `ordre`, `visible`.

Les valeurs vont dans `guests[].custom`, indexées par `cle`. L'interface propose Ajouter, Renommer, Masquer, Supprimer — la suppression demande confirmation et prévient de la perte des données. Ces colonnes apparaissent dans le tableau, dans les filtres et dans l'export Excel comme les autres.

### `venues` — lieux candidats

`nom`, `commune`, `distanceMin` (trajet depuis Castelnau-le-Lez), `type` (domaine / camping / mas / résidence), `capaciteAssise`, `couchages`, `bordEau` (rivière / lac / aucun), `prixMin`, `prixMax`, `telephone`, `siteWeb`, `avantages[]`, `inconvenients[]`, `statut` (à appeler / contacté / visite prévue / visite faite / écarté / retenu), `notes`, `photos[]`.

### `meals` — les cinq repas

Samedi midi, samedi soir, dimanche brunch, dimanche soir, lundi midi.
`nom`, `jour`, `prestataire` (traiteur / maison / restaurant / non défini), `nomPrestataire`, `prixParPersonne`, `notes`.

### `vendors` — prestataires

`categorie`, `nomSociete`, `contact`, `telephone`, `email`, `siteWeb`, `statut` (à contacter / devis demandé / devis reçu / retenu / écarté), `prixDevis`, `notes`.

Catégories pré-remplies, sans société : traiteur, DJ / musique, photographe, vidéaste, fleuriste, décoration, location de mobilier et vaisselle.

### `budget`

`poste`, `montantEstime`, `montantReel`, `acompteVerse`, `dateEcheanceSolde`, `soldeVerse`, `notes`.

Les trois champs de paiement sont optionnels et ne concernent que les postes où un acompte a été versé (lieu, traiteur, prestataires...). `dateEcheanceSolde` sert à faire remonter une alerte sur le tableau de bord quand le solde approche.

Postes pré-remplis : lieu, hébergement, traiteur, boissons, DJ / musique, photo et vidéo, fleurs et décoration, location mobilier, tenues, alliances, papeterie, transport, divers.

### `tables` — plan de table

`id`, `nom` (ex. « Table 1 », « Table des mariés »), `capacite`, `notes`.

Les invités ne sont **pas** dupliqués ici : chaque invité pointe vers une table via `guests[].table` (l'identifiant de la table, ou vide si pas encore placé). La page Plan de table n'est qu'une vue groupée par table sur la liste des invités confirmés, avec réaffectation par glisser-déposer ou sélection.

### `timeline` — planning horaire du jour J

`id`, `jour` (samedi / dimanche / lundi), `heureDebut`, `heureFin`, `titre`, `lieu`, `notes`, `ordre`.

Distinct du rétroplanning (`tasks`) : ceci décrit le déroulé heure par heure du week-end lui-même (arrivée des invités, cérémonie, cocktail, dîner, soirée...), pas les tâches à faire en amont.

### `tasks` — rétroplanning

`titre`, `description`, `echeance`, `categorie`, `fait`, `ordre`. Pré-rempli avec le calendrier plus bas, **entièrement modifiable**.

### `ideas`

`titre`, `contenu` (markdown), `categorie` (déco / musique / photo / animation / tenues / logistique / autre), `lien`, `favori`, `date`.

## Pages

### Accueil — tableau de bord

Chiffres calculés en direct depuis la liste des invités :

- Invités par statut
- **Présents par repas** : un chiffre pour chacun des cinq repas
- **Couchages nécessaires par nuit** : vendredi, samedi, dimanche
- Adultes / enfants
- Nombre de régimes spéciaux à signaler au traiteur

Puis le lieu retenu s'il y en a un, les prochaines échéances du rétroplanning, le budget estimé face au réel, les dernières idées.

### Invités

La page centrale, tout le reste en découle.

- Tableau éditable en ligne, édition au clic dans la cellule
- Ajout, suppression, duplication d'une ligne
- Recherche par nom, filtres par catégorie, statut, présence à un repas, nuit
- Cases à cocher de présence directement dans le tableau
- Vue groupée par foyer, pour les invitations
- Gestion des colonnes personnalisées
- **Import et export `.xlsx`** : l'export reprend toutes les colonnes visibles ; l'import détecte les colonnes du fichier, propose une correspondance, et permet de créer une colonne personnalisée pour celles sans équivalent
- Export dédié « effectifs traiteur » : une feuille par repas avec convives, enfants et régimes

La liste part de zéro, tout sera saisi dans l'application.

### Lieux

Cartes avec photo, résumé, prix, capacité. Filtres combinables : distance maximale (curseur 0 à 100 min), couchages minimum, capacité assise minimum, type, bord d'eau, fourchette de prix, statut. Fiche détaillée au clic avec avantages, inconvénients, notes de visite, coordonnées cliquables.

Pré-remplir avec ces six lieux :

1. **Château Rieutort**, Saint-Pargoire, 45 min, domaine, 200 assis, couchages nombreux, bord de fleuve, 12 000–20 000 €, 04 67 89 38 20, chateau-rieutort.fr
2. **Domaine de la Grangette**, Montagnac, 45 min, domaine, 180 assis, 96 couchages, pas d'eau, 10 000–16 000 €, 04 67 24 50 92, domainedelagrangette.fr
3. **Domaine d'Anglas**, Brissac, 50 min, camping, capacité à vérifier, bord de rivière, 4 000–8 000 €, 04 67 73 70 18, camping-anglas.com
4. **Camping Le Val d'Hérault**, Brissac, 40 min, camping, capacité à vérifier, bord de rivière, 4 000–8 000 €, 04 67 73 72 29, camping-levaldherault.com
5. **Parc Sports & Loisirs Brissac-Ganges**, Brissac, 50 min, résidence, capacité à vérifier, pas d'eau directe, 5 000–10 000 €, 04 67 69 99 18, psl-cevennes.com
6. **Domaine de Blancardy**, Moulès-et-Baucels, 55 min, mas, capacité à vérifier, pas d'eau directe, 5 000–9 000 €, 04 67 73 94 94, blancardy.com

Les fourchettes de prix sont des estimations, pas des tarifs communiqués : le préciser sur la page.

### Repas

Les cinq repas en colonnes. Pour chacun : prestataire choisi, nombre de convives calculé automatiquement depuis la liste des invités, prix par personne, total, régimes spéciaux concernés. Budget restauration total en bas.

### Prestataires

Liste groupée par catégorie, statut de chaque contact, montant du devis. Export Excel.

### Budget

Tableau simple : poste, estimé, réel, écart, acompte versé, solde dû et sa date d'échéance. Totaux en bas. Les soldes dont l'échéance approche remontent en alerte sur le tableau de bord. Export Excel.

### Plan de table

Vue par table : chaque table affiche sa capacité, le nombre d'invités confirmés déjà placés et la liste de ces invités. Une colonne « non placés » regroupe les invités confirmés sans table. Réaffectation d'un invité à une table par sélection (glisser-déposer si simple à faire, sinon une liste déroulante suffit). Ajout, renommage, suppression de table. Alerte visuelle si une table dépasse sa capacité.

Purement dérivé de la liste des invités : aucune saisie de nom ici, seulement le champ `table` de chaque invité.

### Planning du jour J

Déroulé horaire du week-end, un bloc par jour (samedi, dimanche, lundi), trié par heure. Chaque ligne : heure de début, heure de fin optionnelle, titre, lieu, notes. Ajout, modification, suppression, réordonnancement libres. Rien de pré-rempli, à construire au fur et à mesure que les prestataires et horaires se précisent.

### Rétroplanning

Liste chronologique groupée par période, avec cases à cocher. Les échéances passées non faites remontent en alerte. Ajout, modification et suppression libres.

Contenu de départ :

- **Automne-hiver 2026** — appeler les six lieux ; visiter les trois plus prometteurs ; réserver le lieu et verser l'acompte ; réserver la date à la mairie
- **Printemps 2027** — liste d'invités v1 ; trois devis traiteur ; choix du traiteur
- **Été 2027 (J-12 mois)** — photographe, DJ ou groupe, envoi des save-the-date
- **Automne 2027** — tenues des mariés, fleuriste et décoration
- **Hiver 2027-2028 (J-6 mois)** — papeterie, invitations imprimées puis envoyées, réservation des hébergements
- **Mars 2028 (J-3 mois)** — dossier de mariage en mairie, dégustation menu, alliances, essayages
- **Avril 2028 (J-2 mois)** — relance des invités sans réponse, plan de table, playlist
- **Début mai 2028 (J-1 mois)** — effectifs définitifs au traiteur, répartition des couchages, planning du week-end
- **Fin mai 2028** — brief des prestataires, derniers réglages, kits d'accueil

### Idées

Mur de notes : ajout rapide, catégorie, lien externe, favori, filtre. Contenu en markdown.

## Direction artistique

Sobre et naturel. Pas de rose, pas de calligraphie, pas d'imagerie de faire-part, et **pas les couleurs de Cy Art Luthier** — ce site n'a rien à voir avec l'atelier. Le mariage se tient dans l'arrière-pays héraultais en juin : garrigue, pierre calcaire, rivière, vignes. Palette verte et minérale, une typographie sérif de caractère pour les titres, un sans-serif lisible pour les tableaux.

Les pages de données restent denses et rapides à lire — c'est un outil de travail. Le tableau des invités doit rester fluide avec 180 lignes et une vingtaine de colonnes.

Responsive : le tableau des invités doit être utilisable sur téléphone, au moins en consultation et en cochage.

## Ordre de construction

1. Projet Vite + React + TS + Tailwind, couche `loadData()` / `saveData()` avec les deux implémentations
2. Données de départ : lieux, repas, postes de budget, catégories de prestataires, tâches du rétroplanning
3. Page invités : tableau éditable, colonnes personnalisées, import et export Excel
4. Tableau de bord et calculs de présence et de couchages
5. Page lieux et filtres
6. Pages repas, prestataires, budget (avec échéancier de paiement), rétroplanning, idées
7. Plan de table et planning du jour J
8. Mot de passe et déploiement Vercel
