/* ==========================================================================
   ASCII art del sito, disegnate con il motore di Asciify (MIT, https://asciify.org).
   Il motore è installato in assets/vendor/asciify-engine/ (npm install → npm run vendor).

   Ogni voce:
     file      il sorgente in assets/ascii/ (video, immagine o modello 3D .glb)
     sezione   id della sezione: chi-sono, progetti, percorso, competenze, contatti
     tipo      "lato" (default): nel margine accanto alla sezione, su schermi da 1360px
               "attraversa": attraversa tutta la pagina sul separatore sopra la sezione
               "modello": modello 3D che gira, si trascina con il mouse
     lato      "destra" o "sinistra"
     alto      spostamento dall'inizio della sezione
     formato   proporzioni del riquadro (larghezza / altezza)
     settings  impostazioni dello Studio di Asciify (https://asciify.org/editor →
               Export → Use on a website → Copy integration code: si incolla qui
               solo l'oggetto "settings"; le voci che mancano prendono il default)
   ========================================================================== */

(() => {
  // Impostazioni comuni dei video e delle immagini (partono da quelle della medusa)
  const base = {
    version: 1,
    style: "ascii",
    cellSize: 5,
    charset: " .:-=+*#%@",
    colorMode: "source",
    ink: "#e6e3da",
    crop: { x: 0.5, y: 0.5, zoom: 1, rotation: 0 },
    backdrop: { mode: "transparent", color: "#1f1f1f", color2: "#181818", blur: 14, opacity: 0.3 },
    color: { brightness: 0.05, contrast: 1.2, saturation: 1.2, grayscale: 0, levels: "auto" },
    effects: { characterBloom: 0.5 },
    motion: { type: "none", speed: 1, amount: 1 },
    hover: { effect: "none", strength: 1, radius: 0.4, edgeSafe: false, scope: "subject", decay: 0 }
  };
  const studio = (extra) => ({ ...base, ...extra });
  // I video si disegnano con il campo di caratteri sulla GPU (asciify-engine/field), fluido
  // al ritmo dello schermo; "settings" resta come riserva per i browser senza WebGL2.
  const campo = (extra) => ({
    cellSize: 8, cellAspect: 0.6, glyphScale: 1, charset: " .:-=+*#%@",
    color: "source", saturation: 1.2, contrast: 1.2, brightness: 0.05,
    ...extra
  });
  // Più dettaglio (medusa e uccello): i 24 caratteri ASCII ordinati per inchiostro misurato
  // (FIELD_PHOTO_CHARSET di Asciify) e, per ogni cella, il carattere i cui tratti seguono la
  // luce del video ("shape"): i bordi diventano / \ | < e le zone chiare non si appiattiscono in @.
  const dettaglio = {
    charset: " _.,:;*!/<[j7Jy23A#0DRNB", sample: "shape", cellSize: 7,
    contrast: 1, brightness: 0, font: '"JetBrains Mono", monospace', fontWeight: 700
  };
  // le due mani della Creazione di Adamo (Michelangelo), una per lato: al passaggio del mouse lasciano una scia
  const mano = studio({
    aspectRatio: "original", cellSize: 4,
    color: { ...base.color, brightness: 0.12 },
    hover: { ...base.hover, effect: "trail", strength: 0.6, radius: 0.45, scope: "all" }
  });

  window.ASCII_ART = [
    {
      id: "medusa",
      file: "assets/ascii/medusa.mp4",
      sezione: "chi-sono",
      lato: "destra",
      alto: "0rem",
      formato: "1 / 1",
      // al passaggio del mouse: la stessa scia delle mani (Trail) e, dentro la scia,
      // per un attimo il video originale al posto dei caratteri
      campo: campo({ ...dettaglio, hover: "trail", trail: { strength: 0.6, radius: 0.45 }, scope: "all" }),
      rivela: { raggio: 0.13, durata: 1.1, opacita: 0.95 },  // raggio in frazione dell'altezza, durata in secondi
      settings: studio({ aspectRatio: "1:1" })
    },
    {
      id: "teschio",
      tipo: "modello",
      file: "assets/ascii/teschio.glb", // «Forgotten Skull» di Nick Scott, CC BY 4.0 (credito nel footer)
      sezione: "progetti",
      lato: "sinistra",
      alto: "1rem",
      formato: "1 / 1",
      giri: 18,                                  // gradi al secondo; 0 = fermo
      vista: { yaw: 20, pitch: 8, zoom: 1.05, ambient: 0.05, outline: 0.65 },
      campo: {                                   // opzioni del campo di caratteri (asciify-engine/field)
        cellSize: 8, cellAspect: 0.6, glyphScale: 1, sample: "shape",
        color: "ink", ink: "#e6e3da", highlight: "#ffb000", shade: 0.6,
        hover: "lantern", lantern: { radius: 0.09, strength: 0.6 }   // luce che segue il mouse: raggio in frazione dell'altezza
      }
    },
    {
      id: "pesce",
      tipo: "attraversa",
      file: "assets/ascii/pesce.mp4",
      sezione: "competenze",        // nuota sul separatore sopra questa sezione
      larghezza: "250px",
      formato: "522 / 228",
      durata: 34,                   // secondi per un passaggio (pausa compresa)
      campo: campo({ cellSize: 7 }),
      settings: studio({ aspectRatio: "4:3", cellSize: 4 })
    },
    {
      id: "uccello",
      file: "assets/ascii/uccello.mp4",
      sezione: "percorso",
      lato: "destra",
      alto: "0rem",
      formato: "4 / 3",             // taglio più stretto: l'uccello è più grande
      campo: campo(dettaglio),
      settings: studio({ aspectRatio: "4:3", cellSize: 4 })
    },
    {
      id: "mano-sinistra",
      file: "assets/ascii/mano-sinistra.jpg",
      sezione: "contatti",
      lato: "sinistra",
      alto: "4.2rem",
      formato: "5 / 3",
      settings: mano
    },
    {
      id: "mano-destra",
      file: "assets/ascii/mano-destra.jpg",
      sezione: "contatti",
      lato: "destra",
      alto: "4.2rem",
      formato: "5 / 3",
      settings: mano
    }
  ];
})();
