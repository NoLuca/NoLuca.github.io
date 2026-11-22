/* ==========================================================================
   Contenuti del portfolio di Luca Notarantonio.
   Per cambiare un testo, un progetto o un link basta modificare questo file:
   il resto del sito si aggiorna da solo.
   ATTENZIONE: non scrivere qui IP, MAC, password, token o altri dati sensibili.
   ========================================================================== */

window.DATA = {
  versione: "v1.10",

  profilo: {
    nome: "Luca Notarantonio",
    ruolo: "tecnico sistemista junior · reti, server e cloud",
    github: "https://github.com/NoLuca",
    itch: "https://not-luca.itch.io",
    // Lascia vuoto ("") se non vuoi il pulsante per scaricare il CV.
    // Per attivarlo: copia il PDF in assets/ e scrivi qui il nome del file.
    cv: "",
    neofetch: [
      ["Ruolo", "Tecnico sistemista junior"],
      ["Patente", "B"],
      ["Diploma", "ITI Bearzi · Informatica e Telecom. (2026)"],
      ["Cert", "MikroTik MTCNA (2025)"],
      ["Kernel", "elettricista qualificato, civile e industriale"],
      ["Homelab", "TrueNAS Scale · Docker · Tailscale"],
      ["Shell", "bash · PowerShell"],
      ["Lingue", "italiano · inglese A2"],
      ["Stato", "online · sempre su qualche progetto"]
    ],
    chiSono: [
      "Ho iniziato dagli impianti elettrici: tre anni di qualifica al CFP Bearzi e un anno tra stage e contratto estivo in cantiere, a montare quadri e stendere cavi. Lì ho imparato la precisione e il lavoro in squadra.",
      "Poi sono passato all'informatica, all'ITI Bearzi di Udine. Ho imparato a programmare partendo dal basso, con C e assembly, puntatori e algoritmi, per poi passare a Java e alla programmazione a oggetti. Mi sono diplomato in Informatica e Telecomunicazioni nel 2026, con la certificazione MikroTik MTCNA.",
      "Oggi passo le giornate sui miei progetti: un NAS che gestisco a casa, un server su Oracle Cloud, pipeline AI che girano sulla mia GPU. Mi piace capire come funzionano le cose fino in fondo, documentarle e renderle sicure.",
      "Uso l'AI ogni giorno come uno strumento: io progetto, guido e verifico, il modello esegue. Senza buone pratiche e controlli diventa solo vibe coding."
    ]
  },

  /* Filtri mostrati sopra i progetti (gli altri tag restano sulle schede) */
  filtri: ["Reti", "Sicurezza", "Linux", "Windows", "Docker", "Cloud", "Monitoraggio", "Python", "C#", "AI", "Unity"],

  /* Gruppi in ordine di importanza: prima i progetti da sistemista */
  gruppi: [
    { id: "sistemi", titolo: "Sistemi e reti", sigla: "SYS" },
    { id: "ai", titolo: "AI e automazione", sigla: "AI" },
    { id: "giochi", titolo: "Giochi", sigla: "GAME" }
  ],

  progetti: [
    {
      slug: "infrastruttura-casa",
      gruppo: "sistemi",
      titolo: "Infrastruttura di casa",
      sottotitolo: "NAS TrueNAS Scale, accesso remoto via VPN e rete documentata",
      anno: "2026",
      stato: "in corso",
      tag: ["Reti", "Sicurezza", "Linux", "Storage", "VPN", "Docker"],
      riassunto: "Un portatile riciclato è diventato il server di casa: foto, video, musica e file sincronizzati, raggiungibili da fuori solo tramite VPN.",
      problema: "Foto e file sparsi tra telefoni e PC, nessun backup affidabile e nessun modo sicuro di raggiungerli fuori casa. Il tutto senza comprare hardware nuovo.",
      soluzione: "Ho installato TrueNAS Scale 25.10 su un portatile riciclato, con i dischi in ZFS e le app che servono in casa. Il server non è esposto su Internet: da fuori ci si collega solo con Tailscale.",
      fatto: [
        "Installato TrueNAS Scale con pool ZFS e test SMART pianificati sui dischi",
        "App: Immich (foto), Jellyfin (video, con passthrough della GPU), Navidrome (musica), Syncthing (sincronizzazione)",
        "Accesso da fuori casa solo tramite VPN Tailscale",
        "Interfaccia protetta con 2FA e HTTPS, backup della configurazione, utente API in sola lettura per il monitoraggio",
        "Rete documentata in Obsidian: inventario dei dispositivi, cablaggio e strategia di backup 3-2-1",
        "Prossimo passo (pianificato): segmentazione in VLAN con switch L3 e router pfSense"
      ],
      tecnologie: ["TrueNAS Scale", "ZFS", "Tailscale", "Immich", "Jellyfin", "Navidrome", "Syncthing", "Obsidian"],
      schemi: [
        {
          titolo: "oggi",
          testo: String.raw`
               Internet                  telefono / PC fuori casa
                  │                                 │
          ┌───────┴────────┐                        │
          │ router di casa │                        │
          └───────┬────────┘                        │
                  │ LAN                             │
     ┌────────────┼─────────────┐                   │
     │            │             │                   │
┌────┴────┐ ┌─────┴─────────┐ ┌─┴───────┐           │
│   PC    │ │ TrueNAS Scale │ │ altri   │           │
└─────────┘ │ ZFS · SMART   │ │ disp.   │           │
            ├───────────────┤ └─────────┘           │
            │ Immich        │                       │
            │ Jellyfin (GPU)│◄──── Tailscale (VPN) ─┘
            │ Navidrome     │
            │ Syncthing     │
            └───────────────┘`,
          nodi: {
            "router di casa": "Collega la rete di casa a Internet. Il NAS non è esposto: da fuori si passa solo da Tailscale.",
            "LAN": "La rete di casa, documentata in Obsidian: inventario dei dispositivi e cablaggio.",
            "TrueNAS Scale": "Portatile riciclato con TrueNAS Scale 25.10: dischi in ZFS, test SMART pianificati, 2FA e HTTPS sull'interfaccia, backup della configurazione.",
            "Immich": "Backup e galleria delle foto di casa, in alternativa ai servizi cloud.",
            "Jellyfin (GPU)": "Server video. La GPU è assegnata all'app (passthrough) per la transcodifica.",
            "Navidrome": "Server musicale: la musica di casa, ascoltabile da telefono e PC.",
            "Syncthing": "Sincronizza i file tra i dispositivi senza passare da un cloud esterno.",
            "Tailscale (VPN)": "VPN basata su WireGuard: l'unico modo per raggiungere il NAS da fuori casa."
          }
        },
        {
          titolo: "piano VLAN (pianificato)",
          testo: String.raw`
                 ┌─────────────┐
     Internet ───┤   pfSense   │  regole tra le reti
                 └──────┬──────┘
                        │ trunk 802.1Q
                 ┌──────┴──────┐
                 │  switch L3  │
                 └──────┬──────┘
      ┌───────────┬─────┴─────┬─────────────┐
      ▼           ▼           ▼             ▼
 [ Trusted ] [ Storage ]   [ IoT ]   [ Quarantena ]
  PC e         NAS         smart       dispositivi
  telefoni                 home        sconosciuti`,
          nodi: {
            "pfSense": "Router e firewall (pianificato): le regole decidono quale rete può parlare con quale.",
            "switch L3": "Switch gestito (pianificato): porta le VLAN ai dispositivi con un trunk 802.1Q verso pfSense.",
            "[ Trusted ]": "PC e telefoni di casa, che usano i servizi del NAS.",
            "[ Storage ]": "Solo il NAS, raggiungibile dalla rete Trusted secondo le regole del firewall.",
            "[ IoT ]": "Dispositivi smart isolati: se uno è vulnerabile, non vede il resto della rete.",
            "[ Quarantena ]": "Dove finiscono i dispositivi sconosciuti finché non li verifico."
          }
        }
      ],
      link: []
    },

    {
      slug: "centro-di-controllo",
      gruppo: "sistemi",
      titolo: "Centro di controllo",
      sottotitolo: "Monitoraggio della rete e del NAS in Python",
      anno: "2026",
      stato: "in corso · v2",
      tag: ["Monitoraggio", "Reti", "Python", "CI/CD", "Sicurezza", "Database"],
      riassunto: "Controlla dispositivi e servizi di casa e mi avvisa se qualcosa non risponde o se in rete compare un dispositivo sconosciuto.",
      problema: "Con più servizi in casa è facile accorgersi tardi che qualcosa non funziona, o che un dispositivo sconosciuto è entrato in rete.",
      soluzione: "La v1 è uno script Python che verifica dispositivi e servizi. La v2 è una riscrittura fatta con metodo: progetto diviso in 19 parti, database progettato da zero e controlli di qualità automatici a ogni modifica.",
      fatto: [
        "Controlli: ping, porte aperte, risposta HTTPS, scadenza dei certificati, DNS, velocità della connessione",
        "Segnala i dispositivi sconosciuti presenti in rete",
        "Legge lo stato del NAS tramite un utente API in sola lettura",
        "v2: database progettato dal modello ER fino alla terza forma normale (3NF)",
        "v2: test con pytest, stile con ruff, controllo che nessun segreto finisca nel codice, CI su GitHub Actions",
        "Password e token solo in Bitwarden, mai nei file del progetto"
      ],
      tecnologie: ["Python", "pytest", "ruff", "GitHub Actions", "SQL", "Bitwarden"],
      schemi: [
        {
          titolo: "come funziona",
          testo: String.raw`
  ┌──────────────┐      ┌──────────────────────────────┐
  │ dispositivi  │      │ controlli                    │
  │ e servizi    ├─────►│ ping · porte · HTTPS · cert. │
  │ da tenere    │      │ DNS · velocità · NAS (API)   │
  │ d'occhio     │      └──────────────┬───────────────┘
  └──────────────┘                     │
                        ┌──────────────▼───────────────┐
                        │ database   (ER → 3NF)        │
                        └──────────────┬───────────────┘
                     ┌─────────────────┴──────────────┐
                     ▼                                ▼
               stato e storico                avviso: servizio giù
                                              o dispositivo sconosciuto`
        },
        {
          titolo: "a ogni modifica (CI)",
          testo: String.raw`
  git push ──► ruff ──► pytest ──► controllo segreti ──► [ OK ]
                 │        │               │
                 └────────┴───────────────┴──► [ ERRORE ] la modifica si ferma`
        }
      ],
      link: []
    },

    {
      slug: "laboratorio-sistemi-reti",
      gruppo: "sistemi",
      titolo: "Laboratorio di sistemi e reti",
      sottotitolo: "Active Directory, GNS3, LAMP, DNS, firewall · ITI Bearzi",
      anno: "2023–2026",
      stato: "completato",
      tag: ["Reti", "Windows", "Linux", "Sicurezza", "Virtualizzazione"],
      riassunto: "Tre anni di laboratorio: dominio Active Directory, reti simulate in GNS3, server Linux con web e DNS, firewall e NAT.",
      problema: "Mettere in piedi, in un ambiente di prova, i servizi che si trovano nella rete di una piccola azienda.",
      soluzione: "Ho lavorato su macchine virtuali e reti simulate, configurando ogni servizio a mano e verificandone il funzionamento.",
      fatto: [
        "Windows Server in VMware con dominio Active Directory: utenti, policy, permessi NTFS e cartelle condivise",
        "Reti simulate con GNS3: subnetting FLSM/VLSM, VLAN 802.1Q e inter-VLAN routing",
        "Firewall e ACL, NAT (SNAT e DNAT), DMZ",
        "Server LAMP con virtual host Apache, DNS con BIND, database MySQL",
        "Certificazione MikroTik MTCNA (aprile 2025): configurazione di RouterOS"
      ],
      tecnologie: ["Windows Server", "Active Directory", "VMware", "GNS3", "MikroTik", "Apache", "BIND", "MySQL"],
      schemi: [
        {
          titolo: "schema semplificato",
          testo: String.raw`
                    Internet
                       │
             ┌─────────┴─────────┐
             │  firewall / NAT   │  SNAT in uscita
             └────┬─────────┬────┘  DNAT verso la DMZ
                  │         │
       ┌──────────┴───┐  ┌──┴────────────────┐
       │ LAN (VLAN)   │  │ DMZ               │
       │ inter-VLAN   │  │ Apache · LAMP     │
       │ routing      │  │ DNS BIND          │
       └──────┬───────┘  └───────────────────┘
              │
   ┌──────────┴──────────┐
   │ Windows Server      │
   │ Active Directory    │
   │ policy · NTFS       │
   │ (VM su VMware)      │
   └─────────────────────┘`,
          nodi: {
            "firewall / NAT": "Filtra il traffico con regole e ACL. SNAT: la LAN esce su Internet con un solo indirizzo. DNAT: le richieste da fuori arrivano ai server nella DMZ.",
            "inter-VLAN": "Le VLAN separano la LAN in reti diverse; il routing inter-VLAN le fa comunicare solo dove serve.",
            "DMZ": "Rete separata per i server raggiungibili da Internet: se uno viene compromesso, la LAN resta protetta.",
            "Apache · LAMP": "Server web Linux con Apache, MySQL e PHP, configurato con virtual host.",
            "DNS BIND": "Server DNS con BIND: traduce i nomi dei siti negli indirizzi dei server.",
            "Windows Server": "Domain controller in VMware: utenti, gruppi, policy, permessi NTFS e cartelle condivise in Active Directory."
          }
        }
      ],
      link: []
    },

    {
      slug: "hermes",
      gruppo: "sistemi",
      titolo: "Hermes",
      sottotitolo: "Agente AI condiviso da un team · memoria comune e personale",
      anno: "2026",
      stato: "archiviato",
      tag: ["Cloud", "Docker", "Linux", "Sicurezza", "AI"],
      riassunto: "Un agente AI che più persone di un team usano dalla stessa chat, con una memoria condivisa da tutti e una privata per ognuno. Su un server Ubuntu in Oracle Cloud con un dominio dedicato, poi anche in locale. Circa 100 ore di lavoro.",
      problema: "Un assistente AI usato da un team deve ricordare il contesto comune, come progetti e decisioni prese insieme, senza mescolarlo con quello che ogni persona gli dice in privato. E i dati devono stare su macchine che gestisco io.",
      soluzione: "Ho messo in sicurezza un'istanza Ubuntu su Oracle Cloud, ci ho collegato un dominio comprato per il progetto e ho avviato chat, database e agente in container Docker. La memoria è pensata su due livelli: una comune al team e una personale per ogni membro. Poi ho portato lo stack anche in locale, con Docker Compose e modelli Ollama.",
      fatto: [
        "Messa in sicurezza di un'istanza Ubuntu su Oracle Cloud",
        "Dominio comprato per il progetto e collegato al server",
        "Servizi in container Docker: chat Matrix per il team, database PostgreSQL, agente AI",
        "Memoria su due livelli: condivisa dal team e privata per ogni persona",
        "Container dimensionati per non saturare RAM e CPU del piano",
        "Versione locale: stack Docker Compose con Ollama e Honcho per la memoria",
        "Credenziali in Bitwarden Secrets Manager, script PowerShell di avvio e controllo"
      ],
      tecnologie: ["Oracle Cloud", "Ubuntu", "Docker", "Docker Compose", "Matrix", "PostgreSQL", "Ollama", "PowerShell", "Bitwarden"],
      schemi: [
        {
          titolo: "in cloud",
          testo: String.raw`
   membri del team (telefono / PC)
          │ chat
          ▼
       dominio
          │
  ┌──────────────── Oracle Cloud · Ubuntu ────────────────┐
  │                                                       │
  │   ┌──────────┐     ┌───────────┐     ┌────────────┐   │
  │   │  Matrix  │◄───►│ agente AI │◄───►│ PostgreSQL │   │
  │   └──────────┘     └───────────┘     └────────────┘   │
  │                     container Docker                  │
  └───────────────────────────────────────────────────────┘`,
          nodi: {
            "membri del team": "Più persone scrivono all'agente dalla stessa chat: ognuno ha la sua memoria privata, il team ne condivide una.",
            "dominio": "Comprato per il progetto e collegato al server: la chat si raggiunge da un indirizzo vero.",
            "Oracle Cloud · Ubuntu": "Istanza Ubuntu su Oracle Cloud, messa in sicurezza prima di avviare i servizi.",
            "Matrix": "Server di chat del team: da qui si scrive all'agente, da telefono o PC.",
            "agente AI": "Riceve i messaggi, recupera la memoria comune del team e quella di chi scrive, interroga il modello e risponde.",
            "PostgreSQL": "Database usato dai servizi in container."
          }
        },
        {
          titolo: "in locale",
          testo: String.raw`
  Bitwarden Secrets ──► script PowerShell ──► Docker Compose
                                              ├── Ollama  (modelli)
                                              ├── Honcho  (memoria team / personale)
                                              └── agente AI`
        }
      ],
      link: []
    },

    {
      slug: "comandi-vocali",
      gruppo: "ai",
      titolo: "Dalla voce all'azione",
      sottotitolo: "Stage da NM di Nazareno Manco · speech-to-text e intent recognition",
      anno: "2025",
      stato: "completato",
      tag: ["C#", "AI", "Web", "API"],
      riassunto: "Durante lo stage (112 ore) ho costruito un sistema che capisce un comando detto a voce e lo trasforma in un'azione.",
      problema: "Dare un comando a voce e far capire al software cosa si vuole, anche quando la frase cambia ogni volta.",
      soluzione: "Una pipeline in quattro passi: nel browser la voce diventa testo, un modello riconosce l'intento, un'API lo passa all'applicazione che esegue l'azione.",
      fatto: [
        "Interfaccia web in Blazor (C#) con trascrizione nel browser tramite Web Speech API",
        "Addestrato e valutato il modello di intent recognition con ML.NET e Wit.ai",
        "Automatizzato l'addestramento del modello",
        "Creato un'API tra il riconoscimento vocale e il sito",
        "Refactoring e versionamento del progetto con Git"
      ],
      tecnologie: ["C#", ".NET", "Blazor", "Web Speech API", "ML.NET", "Wit.ai", "Git"],
      schemi: [
        {
          titolo: "flusso dei dati",
          testo: String.raw`
  ┌────────┐   ┌──────────────┐   ┌───────────────┐   ┌───────┐   ┌────────┐
  │  voce  ├──►│    testo     ├──►│    intento    ├──►│  API  ├──►│ azione │
  │        │   │  Web Speech  │   │ ML.NET/Wit.ai │   │       │   │        │
  └────────┘   └──────────────┘   └───────────────┘   └───────┘   └────────┘
   "accendi     "accendi la        intento: luce_on
    la luce"     luce"             stanza: sala`
        }
      ],
      link: []
    },

    {
      slug: "video-dubbing",
      gruppo: "ai",
      titolo: "Doppiaggio video in locale",
      sottotitolo: "Pipeline AI inglese → italiano sulla mia GPU",
      anno: "2026",
      stato: "in corso",
      tag: ["AI", "Python", "GPU", "API"],
      riassunto: "Prende un video in inglese e lo restituisce doppiato in italiano con la stessa voce dell'originale, tutto sul mio PC.",
      problema: "I servizi di doppiaggio AI costano e mandano i video su server esterni. Volevo farlo in locale, mantenendo timbro, emozione e sincronia.",
      soluzione: "Una pipeline in sei fasi che usa solo modelli open source sulla GPU di casa, controllabile tramite un'API REST.",
      fatto: [
        "Separazione voce / sottofondo con BS-RoFormer",
        "Trascrizione e riconoscimento di chi parla con WhisperX e pyannote",
        "Traduzione con un modello linguistico locale (Qwen3 su Ollama)",
        "Voce clonata con Chatterbox e VoxCPM2, dopo aver confrontato altri modelli",
        "Sincronizzazione con rubberband e rendering FFmpeg a blocchi con NVENC",
        "API con FastAPI; 9 ambienti Python riproducibili da file di lock con uv, che condividono la cache: circa 3,5 GB reali su disco invece di 51"
      ],
      tecnologie: ["Python", "WhisperX", "pyannote", "Ollama", "Qwen3", "Chatterbox", "FFmpeg", "NVENC", "FastAPI", "uv"],
      schemi: [
        {
          titolo: "le sei fasi",
          testo: String.raw`
   video.mp4  (inglese)
       │
       ▼
   [1] separazione    voce │ sottofondo        BS-RoFormer
       ▼
   [2] trascrizione   testo + chi parla        WhisperX · pyannote
       ▼
   [3] traduzione     inglese → italiano       Qwen3 su Ollama
       ▼
   [4] voce           stesso timbro            Chatterbox · VoxCPM2
       ▼
   [5] sincronia      tempi dell'originale     rubberband
       ▼
   [6] rendering      voce + sottofondo        FFmpeg + NVENC
       │
       ▼
   video.mp4  (italiano)`
        }
      ],
      link: []
    },

    {
      slug: "clip-generator",
      gruppo: "ai",
      titolo: "Generatore di short",
      sottotitolo: "Clip verticali automatiche da video e dirette Twitch",
      anno: "2026",
      stato: "in corso",
      tag: ["AI", "Python", "Database", "Video"],
      riassunto: "Da un video lungo o da una diretta Twitch ricava in automatico clip verticali con sottotitoli, titolo e testi per i social.",
      problema: "Trovare a mano i momenti migliori di un video lungo e adattarli in verticale richiede ore.",
      soluzione: "Una pipeline che trascrive il video, fa scegliere i momenti migliori a un modello AI (Claude, oppure Ollama in locale), reinquadra in 9:16 seguendo il volto e aggiunge sottotitoli parola per parola ed effetti.",
      fatto: [
        "Funziona con file locali, video online e dirette Twitch",
        "Reinquadratura 9:16 che segue il volto, sottotitoli parola per parola in più stili",
        "Rileva e sfoca i sottotitoli già presenti nel video originale",
        "Prepara i testi per YouTube Shorts, Instagram Reels e TikTok",
        "Dati (lavori, clip, testi) in un database SQLite, con controllo, backup ed export",
        "Circa 40 file di test con pytest; chiavi API nel Gestore credenziali di Windows"
      ],
      tecnologie: ["Python", "WhisperX", "FFmpeg", "SQLite", "pytest", "Ollama"],
      schemi: [
        {
          titolo: "pipeline",
          testo: String.raw`
   video lungo / diretta Twitch
              │
              ▼
   trascrizione (WhisperX) ───► scelta dei momenti (Claude / Ollama)
                                          │
                                          ▼
                   reframe 9:16 · sottotitoli · effetti · FFmpeg
                                          │
                       ┌──────────────────┴──────────────────┐
                       ▼                                     ▼
                clip_01.mp4 …                       testi per i social
                       │                                     │
                       └──────────────► SQLite ◄─────────────┘`
        }
      ],
      link: []
    },

    {
      slug: "game-jam",
      gruppo: "giochi",
      titolo: "UniUD Game Jam × 2",
      sottotitolo: "1° posto 2026 · 2° posto 2025 · programmatore principale",
      anno: "2025–2026",
      stato: "completato",
      tag: ["Unity", "C#", "Lavoro in team"],
      riassunto: "Un gioco completo in 72 ore, due anni di fila, da programmatore principale: 1° posto con Post Modem, 2° con Lost in Depth.",
      problema: "72 ore, un tema segreto annunciato all'ultimo secondo (lo stesso della Ludum Dare, in tutto il mondo) e un team di studenti di scuole diverse.",
      soluzione: "Da programmatore principale ho imparato a separare il cuore del gioco dai dettagli, a decidere in fretta e a lavorare nel caos senza perdere la lucidità.",
      fatto: [
        "2026 · Post Modem, tema \"Signal\": 1° posto",
        "2025 · Lost in Depth, tema \"profondità\": 2° posto",
        "Crash course su Unity con i docenti dell'Università di Udine prima della gara",
        "Team da 3 a 5 persone di scuole diverse"
      ],
      tecnologie: ["Unity", "C#", "Git"],
      schemi: [
        {
          titolo: "bacheca",
          testo: String.raw`
     .-=========-.                 .-=========-.
     \'-=======-'/                 \'-=======-'/
     _|   1°    |_                 _|   2°    |_
    ((|  2026   |))               ((|  2025   |))
     \|         |/                 \|         |/
      \__     __/                   \__     __/
        _)   (_                       _)   (_
       |_______|                     |_______|
      POST MODEM                   LOST IN DEPTH`
        }
      ],
      link: [
        { label: "gioca Post Modem su itch.io", url: "https://not-luca.itch.io/post-modem" },
        { label: "gioca Lost in Depth su itch.io", url: "https://not-luca.itch.io/lost-in-depth" }
      ]
    },

    {
      slug: "incremental-game",
      gruppo: "giochi",
      titolo: "DigBashCash",
      sottotitolo: "Idle game in Unity 6 (nome di lavoro)",
      anno: "2026",
      stato: "in corso",
      tag: ["Unity", "C#", "Test"],
      riassunto: "Un idle game in Unity 6 progettato da zero, con un sistema di salvataggio modulare scritto e testato da me.",
      problema: "In un idle game il progresso salvato è tutto: un salvataggio fragile rovina l'esperienza.",
      soluzione: "Ho scritto per primo un sistema di salvataggio modulare con i suoi test, e su quello ho costruito il resto del gioco.",
      fatto: [
        "Unity 6, 74 script C#",
        "Sistema di salvataggio modulare con test automatici",
        "Progetto ancora in sviluppo"
      ],
      tecnologie: ["Unity 6", "C#"],
      schemi: [],
      link: []
    }
  ],

  /* Repository pubblici dei progetti di scuola (link a GitHub) */
  scuola: ["Tetris-in-C", "Flappy-Goose", "Tower-Defence", "AeroportoConcorrente", "NegozioDiOcchiali", "BotArena"],

  /* Competenze: "breve" va nel globo, "voci" nell'elenco ad albero */
  competenze: [
    {
      id: "reti", titolo: "Reti",
      breve: ["TCP/IP", "Subnetting", "VLAN", "Firewall", "ACL", "NAT", "DMZ", "Tailscale", "MikroTik", "GNS3"],
      voci: ["TCP/IP, subnetting FLSM/VLSM", "VLAN 802.1Q e inter-VLAN routing", "Firewall e ACL, NAT (SNAT/DNAT), DMZ", "VPN con Tailscale", "MikroTik RouterOS (MTCNA)", "Simulazione di reti con GNS3"]
    },
    {
      id: "sistemi", titolo: "Sistemi",
      breve: ["Windows Server", "Active Directory", "VMware", "Linux", "Ubuntu", "Bash", "TrueNAS", "ZFS", "NTFS"],
      voci: ["Windows Server e Active Directory: dominio, policy, permessi NTFS, condivisioni", "Virtualizzazione con VMware", "Linux (Ubuntu, Arch), shell bash", "TrueNAS Scale e ZFS"]
    },
    {
      id: "servizi", titolo: "Servizi e cloud",
      breve: ["Oracle Cloud", "Docker", "Compose", "Apache", "BIND", "MySQL", "PostgreSQL", "Bitwarden"],
      voci: ["Oracle Cloud", "Docker e Docker Compose", "LAMP con virtual host Apache, DNS BIND", "MySQL, PostgreSQL", "Gestione dei segreti con Bitwarden Secrets Manager"]
    },
    {
      id: "script", titolo: "Script e sviluppo",
      breve: ["PowerShell", "Python", "C#", ".NET", "Java", "OOP", "C", "Assembly", "PHP", "SQL", "Git", "Actions", "pytest", "Unity"],
      voci: ["PowerShell, Python", "C#/.NET (Blazor, ML.NET), PHP, SQL", "Java e programmazione a oggetti: polimorfismo e buone pratiche", "C e assembly: puntatori e memoria, complessità, algoritmi di ordinamento, alberi e BST", "Git e GitHub Actions, test con pytest", "Unity (game jam e progetti personali)"]
    },
    {
      id: "ai", titolo: "AI",
      breve: ["Ollama", "Whisper", "ML.NET", "Wit.ai", "LLM locali"],
      voci: ["Modelli locali con Ollama", "Trascrizione con Whisper / WhisperX", "ML.NET e Wit.ai", "Assistenti AI per troubleshooting, codice e documentazione, verificando sempre i risultati"]
    }
  ],

  /* Percorso in stile "git log --graph". ramo: "main" o "elettricista" */
  percorso: [
    { hash: "a1f3c09", data: "2026", ramo: "main", head: true, titolo: "Diploma ITI · Informatica e Telecomunicazioni",
      dettagli: ["ITI G. Bearzi, Udine (EQF 4)", "Materie principali: sistemi e reti, informatica, TPSIT, gestione progetto", "Capolavoro dell'anno: l'esperienza alla UniUD Game Jam"] },
    { hash: "7be21d4", data: "2026", ramo: "main", titolo: "1° posto UniUD Game Jam con Post Modem",
      dettagli: ["Programmatore principale, Unity e C#", "Gioco completo in 72 ore, tema \"Signal\""] },
    { hash: "c4d9e12", data: "2026", ramo: "main", titolo: "Homelab: NAS TrueNAS Scale e server su Oracle Cloud",
      dettagli: ["Vedi i progetti Infrastruttura di casa, Centro di controllo e Hermes"] },
    { hash: "5e0a7f3", data: "2025-05", ramo: "main", titolo: "Stage da NM di Nazareno Manco: dalla voce all'azione",
      dettagli: ["Stage PCTO di 112 ore, maggio–giugno 2025", "Blazor, Web Speech API, ML.NET, Wit.ai, API, Git"] },
    { hash: "9d2b6aa", data: "2025-04", ramo: "main", titolo: "Certificazione MikroTik MTCNA",
      dettagli: ["MikroTik Certified Network Associate, aprile 2025"] },
    { hash: "3f8c1e0", data: "2025", ramo: "main", titolo: "2° posto UniUD Game Jam con Lost in Depth",
      dettagli: ["Prima partecipazione, programmatore principale", "Tema \"profondità\""] },
    { hash: "8c1f5a3", data: "2025", ramo: "main", titolo: "Quarto anno: Java e programmazione a oggetti",
      dettagli: ["Progettare con classi e oggetti: polimorfismo e buone pratiche della OOP"] },
    { hash: "4b8e2d6", data: "2024", ramo: "main", titolo: "Terzo anno: C e assembly, vicino all'hardware",
      dettagli: ["Puntatori e gestione della memoria", "Complessità computazionale e algoritmi di ordinamento, dai più semplici ai più efficienti", "Strutture a nodi: alberi e alberi binari di ricerca (BST)"] },
    { hash: "e61d0b7", data: "2023", ramo: "main", titolo: "Inizio ITI G. Bearzi · Informatica e Telecomunicazioni",
      dettagli: [] },
    { hash: "b7a4420", data: "2023", ramo: "merge", titolo: "Merge branch 'elettricista': dalla manualità al codice",
      dettagli: ["La precisione del cantiere me la porto dietro anche nei sistemi"] },
    { hash: "2a9f5c1", data: "2023", ramo: "elettricista", titolo: "Qualifica di installatore di impianti elettrici",
      dettagli: ["CFP Bearzi, Udine (EQF 3), 2020–2023", "Formazione sicurezza dei lavoratori: generale e rischio elevato"] },
    { hash: "0c3e8d2", data: "2022-03", ramo: "elettricista", titolo: "Fitekno S.R.L.: elettricista civile e industriale",
      dettagli: ["Stage scolastici e un contratto estivo, marzo 2022 – marzo 2023", "Quadri elettrici, stesura e collegamento cavi, corpi illuminanti", "Lavoro in squadra con tempi e vincoli del cantiere"] },
    { hash: "61f0b9e", data: "2020", ramo: "elettricista", titolo: "Inizio corso di qualifica al CFP Bearzi",
      dettagli: [] },
    { hash: "0000001", data: "2019", ramo: "root", titolo: "Initial commit: ECDL (Internet, Word, Excel)",
      dettagli: ["AICA, 2019"] }
  ]
};
