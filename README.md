# Transider — 随手记单词

A Chrome Extension that helps you translate and save English words while browsing, preserving the original sentence context for better vocabulary retention.

## Features

- **Double-click to translate** — Double-click any English word on any webpage to see its definition, phonetic, Chinese translation, and word-form exchanges in a side panel.
- **Context-aware saving** — Save words with the sentence and source URL where you found them, so you can review vocabulary in its original context.
- **Smart notebook** — Browse saved words with pagination, jump back to the source article, and remove entries.
- **Auto-save mode** — Optionally save words automatically without clicking the star button.
- **Pronunciation** — Click to hear word pronunciation via the Youdao dict API.
- **Export to Excel** — Export your entire vocabulary list as an `.xlsx` file.
- **Side panel control** — Disable the side panel from auto-opening if needed.

## Tech Stack

- [WXT](https://wxt.dev/) — Browser extension framework (Manifest V3)
- [React 19](https://react.dev/) — UI
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Zustand](https://github.com/pmndrs/zustand) — State management (pagination)
- [Supabase](https://supabase.com/) — Cloud dictionary database
- [localforage](https://github.com/localForage/localForage) — IndexedDB persistence for saved words
- [webext-bridge](https://github.com/zikaari/webext-bridge) — Typed messaging between content script and background
- [xlsx](https://github.com/SheetJS/sheetjs) — Excel export

## Architecture

WXT auto-discovers entrypoints in `src/entrypoints/` by filename convention.

```
content script (dblclick) → webext-bridge → background.ts
  → wxt/storage (volatile state)
  → chrome.sidePanel.open()
  → SidePanel.tsx → Supabase query → display definition
  → User saves → localforage (IndexedDB) via StoredWord class
```

### Entrypoints

| Entrypoint | Description |
|---|---|
| `background.ts` | Service worker. Routes messages, controls side panel opening. |
| `content.ts` | Content script on all URLs. Detects `dblclick`, validates English words, extracts context sentence. |
| `sidepanel/` | Main UI panel. Queries Supabase, renders definitions, save/star actions. |
| `notebook/` | Full-page saved vocabulary list with pagination and export. |
| `options/` | Settings page (auto-save, mute, disable side panel). |
| `welcomepage/` | Shown on first install. |

### Storage

- **wxt/storage** — Runtime state (selected word, toggle settings). Keys in `ELocalStorage` enum.
- **localforage** (IndexedDB) — Persistent saved words. CRUD via `StoredWord` class.
- **Supabase** — Read-only dictionary definitions from `dictionary_n` table. Client in `src/utils/supabaseClient.ts`.

## Project Structure

```
src/
├── entrypoints/          # WXT entrypoints (auto-discovered by filename)
│   ├── background.ts     # Service worker
│   ├── content.ts        # Content script
│   ├── sidepanel/        # Main UI panel
│   ├── notebook/         # Vocabulary notebook page
│   ├── options/          # Settings page
│   └── welcomepage/      # First-install welcome page
├── components/           # Reusable React components
│   ├── AudioPlayer/      # Pronunciation playback
│   ├── NoteBook/         # Notebook icon with word count badge
│   ├── Pagination/       # Pagination controls
│   ├── SaveWord/         # Star toggle (save/remove word)
│   ├── SidePanelController/  # Disable side panel toggle
│   └── WordListItemComponent/  # Individual notebook row
├── models/               # TypeScript types, enums, and classes
│   ├── ELocalStorage.ts  # WXT storage keys
│   ├── EMessage.ts       # webext-bridge message types
│   ├── EOpenFrom.ts      # Side panel open source (PAGE/NOTEBOOK)
│   ├── ESupaKey.ts       # Supabase credentials (gitignored)
│   ├── ISupabaseRes.ts   # Raw Supabase response type
│   ├── ITranslation.ts   # Parsed translation display type
│   ├── StoredWord.ts     # localforage CRUD class
│   ├── TSelectedWordPackage.ts  # Word context package type
│   └── WordListItem.ts   # Notebook display item class
├── utils/
│   ├── supabaseClient.ts # Supabase client singleton
│   ├── translationHandler.ts  # Transform raw data → display format
│   └── exportExcel.ts    # Export to .xlsx
└── assets/
    ├── reset.css         # CSS reset + Google Fonts
    └── images/           # SVG icons
```

## Setup

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install         # Also runs `wxt prepare` automatically
```

### Configure Supabase

Create `src/models/ESupaKey.ts` (gitignored):

```ts
export enum ESupaKey {
  SUPABASE_URL = "YOUR_SUPABASE_URL",
  SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY"
}
```

### Development

```bash
npm run dev           # Chrome
npm run dev:firefox   # Firefox
npm run compile       # Type-check only (no build)
```

### Production

```bash
npm run build          # Chrome
npm run build:firefox  # Firefox
npm run zip            # Package for store submission
```

## License

MIT
