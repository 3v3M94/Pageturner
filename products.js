// =============================================
//  PageTurner — products.js
// =============================================

const PRODUCTS = [
  {
    id: 1,
    nom: "Le Petit Prince",
    auteur: "Antoine de Saint-Exupéry",
    categorie: "romans",
    prix: 850,
    image: "",               // ← remplacez par: "../images/petit-prince.jpg"
    coverColor: ["#1a3a5c","#f5c842"],
    coverIcon: "★",
    description: "Un classique intemporel sur l'amitié, l'amour et la perte d'innocence. Le pilote échoué dans le désert rencontre un petit prince venu d'une autre planète.",
    stock: 12
  },
  {
    id: 2,
    nom: "L'Alchimiste",
    auteur: "Paulo Coelho",
    categorie: "romans",
    prix: 950,
    image: "",               
    coverColor: ["#8B2500","#f0c060"],
    coverIcon: "☀",
    description: "Un voyage initiatique à la poursuite de sa Légende Personnelle. Santiago, jeune berger andalou, part à la recherche d'un trésor en Égypte.",
    stock: 8
  },
  {
    id: 3,
    nom: "Sapiens",
    auteur: "Yuval Noah Harari",
    categorie: "non-fiction",
    prix: 1200,
    image: "",               
    coverColor: ["#1a1a2e","#e94560"],
    coverIcon: "◈",
    description: "Une brève histoire de l'humanité, de la préhistoire à nos jours. Comment Homo sapiens a conquis le monde et façonné notre civilisation.",
    stock: 15
  },
  {
    id: 4,
    nom: "Dune",
    auteur: "Frank Herbert",
    categorie: "science-fiction",
    prix: 1100,
    image: "",               
    coverColor: ["#3d2b00","#e8a030"],
    coverIcon: "◎",
    description: "L'épopée de science-fiction la plus vendue de tous les temps. Sur la planète désertique Arrakis, Paul Atréides affronte son destin.",
    stock: 6
  },
  {
    id: 5,
    nom: "Carnet Moleskine Classic",
    auteur: "",
    categorie: "papeterie",
    prix: 750,
    image: "",               
    coverColor: ["#111111","#cccccc"],
    coverIcon: "✎",
    description: "Le carnet légendaire des artistes et intellectuels du monde entier. Couverture rigide noire, élastique de fermeture, pochette intérieure.",
    stock: 30
  },
  {
    id: 6,
    nom: "Harry Potter T.1",
    auteur: "J.K. Rowling",
    categorie: "jeunesse",
    prix: 900,
    image: "",               
    coverColor: ["#740001","#d3a625"],
    coverIcon: "⚡",
    description: "L'histoire de Harry Potter, jeune sorcier à l'école de Poudlard. Le début d'une saga magique qui a conquis des millions de lecteurs.",
    stock: 20
  },
  {
    id: 7,
    nom: "Stylos Pilot G2 × 5",
    auteur: "",
    categorie: "papeterie",
    prix: 450,
    image: "",               
    coverColor: ["#003366","#99ccff"],
    coverIcon: "✒",
    description: "Lot de 5 stylos à bille rétractables à encre gel. Écriture fluide et précise, encre longue durée, grip confortable.",
    stock: 50
  },
  {
    id: 8,
    nom: "1984",
    auteur: "George Orwell",
    categorie: "romans",
    prix: 880,
    image: "",               
    coverColor: ["#1a1a1a","#cc0000"],
    coverIcon: "◉",
    description: "Le roman dystopique qui a défini le genre. Dans un État totalitaire omniscient, Winston Smith ose penser par lui-même.",
    stock: 10
  },
  {
    id: 9,
    nom: "Agenda 2026 Premium",
    auteur: "",
    categorie: "papeterie",
    prix: 1050,
    image: "",               
    coverColor: ["#2c1810","#c8a96e"],
    coverIcon: "◻",
    description: "Agenda semainier en cuir véritable, pages dorées sur tranche. Vue semaine sur deux pages, carnets de notes intégrés.",
    stock: 18
  },
  {
    id: 10,
    nom: "Le Seigneur des Anneaux",
    auteur: "J.R.R. Tolkien",
    categorie: "science-fiction",
    prix: 1800,
    image: "",               
    coverColor: ["#1a2e1a","#c8a030"],
    coverIcon: "◯",
    description: "L'œuvre maîtresse de la fantasy moderne. Coffret 3 volumes : La Communauté de l'Anneau, Les Deux Tours, Le Retour du Roi.",
    stock: 4
  },
  {
    id: 11,
    nom: "Cosmos",
    auteur: "Carl Sagan",
    categorie: "non-fiction",
    prix: 1350,
    image: "",               
    coverColor: ["#0a0a2e","#4488ff"],
    coverIcon: "✦",
    description: "Un voyage poétique et scientifique à travers l'univers. Carl Sagan nous invite à explorer les origines de la vie et la place de l'humanité.",
    stock: 7
  },
  {
    id: 12,
    nom: "Le Lion et la Sorcière",
    auteur: "C.S. Lewis",
    categorie: "jeunesse",
    prix: 820,
    image: "",               
    coverColor: ["#1a3a1a","#c8e0a0"],
    coverIcon: "♦",
    description: "La porte d'entrée vers le monde magique de Narnia. Quatre enfants découvrent un royaume enchanté caché derrière une armoire.",
    stock: 14
  }
];
