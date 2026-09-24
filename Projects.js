/* ============================================================
   CONTATTI: sostituisci i valori (se restano i placeholder,
   i link sono inattivi).
   ============================================================ */
const SITE = {
  email: "INSERISCI QUI EMAIL",        // es. "ciao@tuodominio.it"
  github: "INSERISCI QUI GITHUB",     // es. "https://github.com/tuonome"
  linkedin: "INSERISCI QUI LINKEDIN"  // es. "https://linkedin.com/in/tuonome"
};

/* ============================================================
   STRUTTURA DEI PROGETTI (livelli di navigazione)
   Ogni voce con "children" mostra altre schede; l'ultima voce
   mostra i progetti che hanno path uguale a "chiave/chiave".
   icon: app | web | heart | grid    theme: "rose" = stile romantico
   cta: testo del pulsante nelle card di quel gruppo
   ============================================================ */
const TREE = [
  { key: "app", title: "App", icon: "app", cta: "Esplora progetto",
    text: "Applicazioni per smartphone e computer." },
  { key: "web", title: "Web", icon: "web",
    text: "Siti e applicazioni web, dai siti per gli sposi ai gestionali.",
    children: [
      { key: "matrimoni", title: "Siti per Matrimoni", icon: "heart", theme: "rose", cta: "Visita il sito",
        text: "Un sito su misura per raccontare la storia degli sposi e dare agli invitati tutte le informazioni utili." },
      { key: "altri", title: "Altri siti", icon: "grid", cta: "Esplora progetto",
        text: "Gestionali e applicazioni web per ristoranti e attività." }
    ] }
];

/* ============================================================
   PROGETTI: aggiungi un oggetto e compare da solo.
   - path: dove compare ("web/matrimoni", "web/altri", "app")
   - image: percorso locale (se manca: placeholder elegante)
   - url: aperto in una nuova scheda dal pulsante
   - tag: etichetta opzionale sopra il titolo
   - featured: true = usato per l'anteprima nella hero
   ============================================================ */
const PROJECTS = [
  {
    id: 1, path: "web/matrimoni", featured: true,
    title: "Marco & Elena",
    description: "Sito web creato per raccontare la loro storia, presentare location e programma della giornata e fornire agli invitati tutte le informazioni utili.",
    year: 2026,
    image: "images/projects/marco-elena.png",
    url: "https://marcoeelena.it"
  },
  // Nuovo matrimonio: copia il blocco sopra, cambia id, title, description, year, image, url.
  {
    id: 2, path: "web/altri", tag: "Gestionale",
    title: "Gestionale Magazzino Ristorante",
    description: "Gestione web del magazzino di un ristorante: scorte, carichi e scarichi sempre sotto controllo. Modifica questo testo.",
    year: 2026,
    image: "images/projects/gestionale-magazzino.png",
    url: "https://example.com"
  },
  {
    id: 3, path: "web/altri", tag: "Gestionale",
    title: "Gestione Turni Ristorante",
    description: "Pianificazione web dei turni del personale di un ristorante. Modifica questo testo.",
    year: 2026,
    image: "images/projects/gestione-turni.png",
    url: "https://example.com"
  }
];
