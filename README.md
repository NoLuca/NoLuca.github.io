# noluca.github.io

Il mio portfolio online, in stile terminale e ASCII art: chi sono, i progetti, il percorso e le competenze.

**Sito:** https://noluca.github.io

## Com'è fatto

- HTML, CSS e JavaScript puri: niente framework, niente build, niente cookie.
- Tutti i testi stanno in `assets/data.js`: per aggiungere o cambiare un progetto basta modificare quel file.
- Ogni progetto ha il suo indirizzo: `#/p/<nome-progetto>` (es. `#/p/infrastruttura-casa`).
- Sul sito c'è un terminale: si apre con `\` o `` ` `` (o dal pulsante in alto); `help` elenca i comandi.

```
index.html             struttura della pagina
assets/style.css       tema grafite e ambra, impaginazione
assets/app.js          interattività: sfondo animato, filtri, globo, git log, terminale, ASCII art
assets/data.js         contenuti: profilo, progetti, percorso, competenze
assets/ascii/          sorgenti delle ASCII art (video, immagini, modello 3D) e arts.js con le impostazioni
assets/vendor/         motore Asciify, copiato da npm
scripts/               copia del motore da node_modules (npm run vendor)
```

## ASCII art

Medusa, colomba, pesce, mani e teschio 3D sono disegnati dal vivo, in caratteri, con
[asciify-engine](https://www.npmjs.com/package/asciify-engine). Il motore è copiato in
`assets/vendor/asciify-engine/`, così il sito non dipende da CDN esterne. Per aggiornarlo:

```
npm install        # installa la versione scritta in package.json
npm run vendor     # copia i file che servono in assets/vendor/asciify-engine/
```

## Provarlo in locale

Aperto con un doppio clic su `index.html` il sito funziona, ma senza ASCII art: i browser non
caricano i moduli JavaScript da file. Serve un piccolo server:

```
npm run serve      # poi apri http://localhost:8080
```

## Crediti

- Teschio: [«Forgotten Skull»](https://sketchfab.com/3d-models/forgotten-skull-a3d96696c1c140429dc2499d731be479) di Nick Scott, licenza [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); nel sito è usato senza texture e disegnato in caratteri.
- Mani: dalla *Creazione di Adamo* di Michelangelo (pubblico dominio).
- Motore ASCII: [Asciify](https://asciify.org), licenza MIT.

Sul sito gli stessi crediti si leggono con il comando `crediti` del terminale.
