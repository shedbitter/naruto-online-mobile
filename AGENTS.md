# Naruto Online Mobile — Codex instructions

## Goal
Build a free, mobile-first technical proof of concept for running legally obtained Flash content in Safari on an iPhone 15, ultimately assessing compatibility with the English Oasis Games Naruto Online browser game. The user's home Windows PC must not be required. Do not promise the original game will work.

## Stack
Vite + TypeScript + vanilla CSS, Ruffle web package, static PWA deployable over HTTPS (e.g. GitHub Pages). Keep dependencies minimal.

## First milestone
1. Create a responsive landscape-friendly interface with accessible touch controls and a status/diagnostics panel.
2. Integrate Ruffle using a publicly redistributable demo SWF or a user-supplied SWF, never bundling copyrighted game assets.
3. Provide a file-picker for local SWF testing and a safe, explicitly user-triggered URL loader with clear CORS restrictions; do not proxy or bypass security restrictions.
4. Show initialization, loading, and runtime errors as far as browser APIs allow; explain that not all ActionScript/network errors are observable.
5. Provide a PWA manifest, icons that are self-created or generic, and instructions for local testing and free HTTPS deployment to GitHub Pages.
6. Include a compatibility checklist for the original Naruto Online English client, especially AS3, networking, authentication, browser limitations, and mobile input.
7. Do not collect, store, transmit, or log credentials or session cookies. No automation of gameplay or bypassing protections.

## Acceptance criteria
`npm install` and `npm run build` succeed; static page opens on iPhone Safari over HTTPS; demo or user-provided compatible SWF can be tested; diagnostics clearly distinguish unsupported features from loading/CORS failures. State plainly that actual Naruto Online playability remains unverified.
