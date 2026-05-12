# AGENTS.md

## Build & Dev Commands

- `npm run dev` — start dev server (Chrome by default)
- `npm run dev:firefox` — start dev server for Firefox
- `npm run build` / `npm run build:firefox` — production build
- `npm run compile` — type-check only (`tsc --noEmit`), no build output
- `npm run zip` — package for store submission

## Setup

- `npm install` runs `wxt prepare` automatically via `postinstall` (generates `.wxt/` with tsconfig base and type shims)
- **Required:** Create `src/models/ESupaKey.ts` manually before running (gitignored):
  ```ts
  export enum ESupaKey {
    SUPABASE_URL = "YOUR_SUPABASE_URL",
    SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY"
  }
  ```

## Architecture

WXT auto-discovers entrypoints in `src/entrypoints/` by filename convention:

| File/Dir | Role |
|---|---|
| `background.ts` | Service worker. Routes `webext-bridge` messages and controls the Side Panel. |
| `content.ts` | Content script (`matches: *://*/*`). Detects `dblclick` on English words, extracts context sentence, sends via bridge. |
| `sidepanel/` | Main UI. Renders word definitions from Supabase, handles save/star actions. |
| `notebook/` | Saved vocabulary list (HTML page). |
| `options/` | Extension options page. |
| `welcomepage/` | Shown on first install (see `background.ts` `chrome.runtime.onInstalled`). |

### Data Flow

```
content script (dblclick) → sendMessage(bridge) → background.ts
  → wxt/storage.setItem(ELocalStorage.SELECTED_WORD_PCKAGE)
  → chrome.sidePanel.open()
  → SidePanel.tsx reads storage → queries Supabase `dictionary_n` table
  → User saves → localforage (IndexedDB) via StoredWord class
```

### Storage Split

- **wxt/storage** — runtime/volatile state (selected word, panel toggle, mute, auto-save). Keys defined in `ELocalStorage` enum.
- **localforage (IndexedDB)** — persistent user data (saved words). CRUD via `StoredWord` class.
- **Supabase** — read-only dictionary definitions (`dictionary_n` table). Client in `src/utils/supabaseClient.ts`.

## Key Conventions

- Path alias: `@/` maps to `src/`
- Plain global CSS (`.css` files co-located with components, imported as side-effect `import './Foo.css'`)
- `type-fest` `JsonValue` is extended for WXT storage item types (must satisfy JSON-serializable constraint)
- `webext-bridge` provides typed message passing between content script ↔ background. Message types defined in `EMessage` enum.
- GEMINI.md is gitignored (similar content but for another tool); AGENTS.md takes precedence
