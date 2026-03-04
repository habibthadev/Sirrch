# Sirrch

> Fast, beautiful word definitions. Instant results, offline-ready.

**[sirrch.netlify.app](https://sirrch.netlify.app)**

---

## What it is

Sirrch is a clean, minimal English dictionary app. Type any word and get its definitions, phonetic pronunciation, part of speech, usage examples, synonyms, and antonyms — instantly. The word you searched appears the moment you hit Enter, while the definitions shimmer in from the API. No spinners, no waiting.

Built as a Progressive Web App — install it on any device and it works offline.

---

## Features

- **Optimistic UI** — the searched word appears immediately; definitions animate in as data arrives
- **Phonetics & audio** — IPA transcription and one-click pronunciation playback
- **Full definitions** — up to 5 definitions per part of speech, with usage examples
- **Synonyms & antonyms** — displayed as clickable chips that trigger a new search
- **Recent searches** — last 6 searches persist across sessions via localStorage
- **Suggestion chips** — quick-start words on the empty state
- **Dark mode** — system-preference aware, toggleable, persisted
- **URL deep-linking** — share or bookmark `/?q=ephemeral` to auto-search on load
- **PWA / offline** — installable, cached assets, works without internet
- **SEO** — Open Graph, Twitter Card, JSON-LD (WebSite + SearchAction schema), sitemap

---

## Stack

| Layer | Tech |
|-------|------|
| Markup | HTML5, semantic elements |
| Styles | Vanilla CSS, custom properties, no framework |
| Logic | Vanilla JavaScript (ES2020+) |
| Icons | [Tabler Icons](https://tabler-icons.io) webfont |
| Font | [Inter](https://rsms.me/inter/) via Google Fonts |
| Data | [Free Dictionary API](https://dictionaryapi.dev) |
| Hosting | [Netlify](https://netlify.com) |
| PWA | Service Worker + Web App Manifest |

---

## Getting started

No build step. No dependencies to install.

```bash
git clone https://github.com/habibAdebayo/Sirrch.git
cd Sirrch
```

Open `index.html` in any modern browser, or serve it locally:

```bash
# Python
python -m http.server 3000

# Node (npx)
npx serve .
```

Then open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
Sirrch/
├── index.html        # App shell, SEO meta, structured data
├── index.css         # Design tokens, components, dark mode
├── index.js          # Search logic, optimistic UI, recent searches
├── manifest.json     # PWA manifest
├── service-worker.js # Offline caching strategy
├── sitemap.xml       # Search engine sitemap
├── robots.txt        # Crawler directives
├── icon.svg          # App icon (192×192 SVG)
└── README.md
```

---

## Design tokens

The UI is built on a small set of CSS custom properties:

```css
--brand          /* #16a34a — primary green */
--canvas         /* page background */
--surface        /* card / input background */
--ink            /* primary text */
--ink-3          /* secondary / muted text */
--line           /* subtle border */
```

Dark mode overrides every token under `body.dark`. No separate stylesheet needed.

---

## API

Sirrch uses the [Free Dictionary API](https://dictionaryapi.dev) — open source, no key required.

```
GET https://api.dictionaryapi.dev/api/v2/entries/en/{word}
```

Responses include definitions, phonetics, audio URLs, examples, synonyms, and antonyms.

---

## PWA install

Visit [sirrch.netlify.app](https://sirrch.netlify.app) in Chrome, Edge, or Safari on iOS and use the browser's **"Add to Home Screen"** option. The app caches all static assets on first load and works offline after that. API requests fall back gracefully when offline.

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m "feat: describe your change"`
4. Push and open a pull request

Keep the vanilla stack — no bundlers, no frameworks.

---

## License

MIT © [Habib Adebayo](https://github.com/habibthadev)

