# Transider v2

> 🇬🇧 **Transider** — Your context-aware vocabulary companion.
>
> *Seamlessly translate, save, and review words without leaving your workflow.*

## 📖 Introduction

**Transider** solves a critical pain point in language learning: **loss of context**.

Most translation tools give you a definition but leave you with a list of isolated words that are hard to memorize. Transider bridges this gap by capturing not just the word, but the **entire sentence and source URL** where you encountered it. This allows you to review vocabulary in its original context, significantly improving retention and understanding.

Built with a product-first mindset, Transider is designed to be **unobtrusive**. It integrates directly into the browser side panel, allowing users to build their vocabulary library naturally as they browse the web, without context switching.

## ✨ Core Features

*   **⚡️ Instant Contextual Translation**
    *   Double-click any English word on any webpage.
    *   Instantly view definitions, phonetics, and usage examples in a sleek Side Panel.
    *   **Context Capture**: Automatically grabs the sentence containing the word.
*   **💾 Smart Vocabulary Notebook**
    *   Save words with a single click.
    *   Persists data locally using `IndexedDB` (via `localforage`) for offline access and privacy.
    *   Review saved words with their original context sentences.
*   **🔗 Deep Linking**
    *   Jump back to the exact article where you found a word with one click.
*   **📂 Data Export**
    *   Export your vocabulary list to Excel (`.xlsx`) for integration with Anki or other study tools.
*   **☁️ Cloud Dictionary Integration**
    *   Powered by a custom Supabase backend to provide rich dictionary data (definitions, tenses, difficulty tags).

## 🛠 Tech Stack

**Frontend & Extension Architecture**
*   **Framework**: [WXT](https://wxt.dev/) (Web Extension Tools) + [React 19](https://react.dev/)
*   **Language**: TypeScript
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand) (for pagination and global UI state)
*   **Styling**: CSS Modules with a clean, minimalist design system.

**Data & Storage**
*   **Local Storage**: [LocalForage](https://github.com/localForage/localForage) (Abstraction over IndexedDB for robust local persistence).
*   **Cloud Database**: [Supabase](https://supabase.com/) (PostgreSQL) for querying dictionary definitions.
*   **Messaging**: `webext-bridge` for type-safe communication between Content Scripts, Background Workers, and UI.

## 🚀 How to Run

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v18+)
*   npm or pnpm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/transider-v2.git
    cd transider-v2
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a file named `src/models/ESupaKey.ts`. This file is git-ignored for security.
    ```typescript
    // src/models/ESupaKey.ts
    export enum ESupaKey {
        SUPABASE_URL = "YOUR_SUPABASE_URL",
        SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY"
    }
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    # Or to test in Firefox
    npm run dev:firefox
    ```
    This will open a new Chrome instance with the extension loaded.

## 💡 Highlights & Reflections

### Product Thinking
*   **Frictionless UX**: The decision to use the **Side Panel API** instead of a popup was intentional. It allows the translation to coexist with the content, preventing the "pop-up fatigue" users often face with extension overlays.
*   **Context is King**: The core value proposition isn't the translation (which is a commodity) but the *context*. By saving the sentence, we transform a simple dictionary look-up into a learning moment.

### Technical Challenges & Solutions
*   **Extension Architecture (MV3)**: Moving to Manifest V3 required a robust handling of the service worker lifecycle. I implemented `webext-bridge` to ensure reliable, typed message passing between the ephemeral background script and the content script.
*   **Performance**: To ensure the "double-click" detection doesn't degrade page performance, event listeners are optimized, and heavy operations (like dictionary fetching) are offloaded to the Side Panel, keeping the Content Script lightweight.
*   **Data Persistence**: Balancing local user data (saved words) with cloud data (definitions). `localforage` was chosen over `chrome.storage` for its easier API and better support for larger datasets (like a growing notebook).

### Future Roadmap
*   **Cross-Device Sync**: Implementing user authentication (Supabase Auth) to sync the notebook across devices.
*   **Spaced Repetition**: Integrating a review algorithm (like SuperMemo-2) directly into the notebook.
*   **AI Enhancements**: Using an LLM to generate custom example sentences or explain the word in the specific context of the article.

---
*Created by Yong Xie*
