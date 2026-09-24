/* ============================================================
   CONTATTI: sostituisci i valori. Se lasci il placeholder,
   il link resta inattivo.
   ============================================================ */
const SITE = {
  email: "INSERISCI QUI EMAIL",        // es. "ciao@tuodominio.it"
  github: "INSERISCI QUI GITHUB",     // es. "https://github.com/tuonome"
  linkedin: "INSERISCI QUI LINKEDIN"  // es. "https://linkedin.com/in/tuonome"
};

/* ============================================================
   CATEGORIE: chiave usata nei progetti -> etichette.
   Il filtro compare solo se esiste almeno un progetto.
   ============================================================ */
const CATEGORIES = {
  web: "Siti Web",
  matrimonio: "Matrimoni",
  app: "App",
  software: "Software",
  personale: "Personali"
};

/* ============================================================
   PROGETTI: aggiungi un oggetto e compare da solo.
   - category: una chiave di CATEGORIES
   - image: percorso locale (se manca o non esiste: placeholder)
   - url: aperto in una nuova scheda dal pulsante
   - featured: true = compare nella Home
   ============================================================ */
const PROJECTS = [
  {
    id: 1,
    title: "Marco & Elena",
    category: "matrimonio",
    description: "Sito web creato per raccontare la loro storia, presentare location e programma della giornata e fornire agli invitati tutte le informazioni utili.",
    year: 2026,
    image: "images/projects/marco-elena.png",
    url: "https://marcoeelena.it",
    featured: true
  },
  {
    id: 2,
    title: "Progetto demo web",
    category: "web",
    description: "Sito vetrina responsive per un'attività locale. Sostituisci questo testo con la descrizione reale.",
    year: 2026,
    image: "images/projects/progetto2.png",
    url: "https://example.com",
    featured: true
  },
  {
    id: 3,
    title: "Progetto demo software",
    category: "software",
    description: "Applicativo gestionale su misura. Sostituisci questo testo con la descrizione reale.",
    year: 2025,
    image: "images/projects/progetto3.png",
    url: "https://example.com",
    featured: true
  }
];
