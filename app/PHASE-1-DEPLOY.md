# LEUSI — Phase 1 deployment

## What Phase 1 delivers

Frontend-only upgrade. **The Worker, the Anthropic API key, and the AI endpoint are unchanged.** Same `https://leusi-ai.moekab.workers.dev`, same secret, same CORS config.

Visible improvements:

- **PWA**: installable to the home screen on iOS and Android; opens chrome-less like a real app.
- **Service worker**: pre-caches the app shell so the UI and lessons work offline.
- **Mobile UX**: bottom-tab navigation on phones, larger touch targets, larger inputs that don't trigger iOS zoom, safe-area padding for the notch.
- **Visual polish**: smoother panel transitions, press-feedback on cards/chips/buttons, skeleton loader animation, accessibility-friendly focus rings.
- **Better chat**: animated typing indicator replaces the static "Thinking..." text.
- **Image library**: 12 contextual photos from Wikimedia (public domain) added across the 6 VCA lessons (TRA, LMRA, PBM, Permit, Confined Space, Heights).
- **WhatsApp button**: green floating action button bottom-right. Tapping opens WhatsApp with a pre-filled message. (No bot yet — link only.)

What is **not** in Phase 1: photo upload, image generation, WhatsApp bot. Those are Phases 2 and 3.

---

## Files delivered

```
phase1/
├── index.html                  ← replaces app/index.html in your repo
├── manifest.json               ← new file (same folder as index.html)
├── service-worker.js           ← new file (same folder as index.html)
├── icon.svg                    ← new file (SVG app icon)
├── icon-192.png                ← new file (192×192 raster icon)
├── icon-512.png                ← new file (512×512 raster icon)
├── icon-192-maskable.png       ← new file (Android maskable icon, 192×192)
└── icon-512-maskable.png       ← new file (Android maskable icon, 512×512)
```

All 8 files go into the **same** folder in your GitHub repo: `app/`. Final repo layout:

```
mokabbara/leusi-clean
├── index.html                  ← your existing landing page (unchanged)
└── app/
    ├── index.html              ← REPLACE with Phase 1 index.html
    ├── manifest.json           ← NEW
    ├── service-worker.js       ← NEW
    ├── icon.svg                ← NEW
    ├── icon-192.png            ← NEW
    ├── icon-512.png            ← NEW
    ├── icon-192-maskable.png   ← NEW
    └── icon-512-maskable.png   ← NEW
```

---

## GitHub upload — step by step

### Option A — Web upload (no Git needed)

1. Go to github.com → open repo `mokabbara/leusi-clean` (or whatever your repo is called).
2. Navigate into the `app/` folder.
3. Click the existing `index.html` → click the **pencil (Edit)** icon → select all (Cmd+A) → delete → paste the contents of the new `index.html` → scroll down → **Commit changes**.
4. Go back to the `app/` folder (breadcrumb at top).
5. Click **Add file → Upload files**.
6. Drag the seven other files (`manifest.json`, `service-worker.js`, `icon.svg`, `icon-192.png`, `icon-512.png`, `icon-192-maskable.png`, `icon-512-maskable.png`) into the upload area.
7. Scroll down → **Commit changes**.

### Option B — Git command line

```bash
cd path/to/your/local/leusi-clean
cp /path/to/phase1/* app/
git add app/
git commit -m "Phase 1: PWA + mobile UX + image library"
git push
```

Cloudflare Pages auto-rebuilds in 30–60 seconds.

---

## Smoke tests (run after Cloudflare finishes deploy)

### Desktop browser

1. Visit `https://leusi.org/app/` → hard-refresh (Cmd+Shift+R).
2. Open DevTools (F12) → Console → confirm:
   - `[Leusi] Service Worker registered: https://leusi.org/app/`
   - No red errors.
3. Click **Hazard Analyzer** → enter a scenario → click **Analyze**. AI response appears within 5 sec.
4. Click **Learn** → open any lesson. You should see the diagram, the lesson text, AND 2 contextual photos at the bottom.
5. Click **Safety Coach** → ask a question. While loading you should see **animated typing dots**, not the old "Thinking..." text.
6. Bottom-right: a green WhatsApp button. Click → opens WhatsApp web/desktop with prefilled message.

### Phone (the real test)

1. Open `https://leusi.org/app/` on Safari (iPhone) or Chrome (Android).
2. Notice the bottom tab bar (Analyzer / Coach / Learn / Alerts / Report) — phone-optimized layout.
3. **iPhone**: tap the Share button → **Add to Home Screen** → confirm. A Leusi icon appears on your home screen. Tap it: opens chrome-less, status bar in app theme, looks like a native app.
4. **Android**: a "Add Leusi to Home screen" prompt appears automatically (or via the browser's three-dot menu → Install app).
5. Once installed, open from home screen → still works → put phone in airplane mode → reload: cached lesson pages and UI still display ("offline-ready").
6. Re-enable internet → tap Analyze with a new prompt → AI works (service worker bypasses cache for AI calls, exactly as designed).

### Lighthouse audit (optional but useful)

In Chrome DevTools → Lighthouse tab → tick "Progressive Web App" → Analyze. You should score 100/100 for PWA. If anything is red, send me the report.

---

## Quick rollback

If anything is wrong, GitHub → Commits → click the previous commit → **Revert**. Cloudflare auto-redeploys the prior version within 60 seconds. Worker is never touched so your AI keeps working regardless.

---

## What changed in index.html (technical notes for your records)

Every change is additive — nothing existing was removed. Diff summary:

- `<head>`: added viewport tag, theme-color, manifest link, Apple PWA meta tags, favicons.
- `<style>`: appended a Phase 1 CSS layer (mobile media queries, animations, skeleton loader, typing dots, WhatsApp FAB, lesson hero/gallery).
- `<script>`: added `LESSON_IMAGES` constant + `renderLessonImages()` function; `openLesson()` now appends gallery to the lesson body. Chat `sendChat()` shows typing dots instead of static text. Service worker registration + install-prompt listener added at the bottom of the script.
- New element before `</body>`: floating WhatsApp FAB.

All AI-related code paths (`askAI`, the meta tag, the fetch to the Worker, the `{prompt, lang, industry}` body shape) are **untouched**. Your existing AI integration works exactly as before — Phase 1 just makes everything around it nicer to use.

---

## When you're ready, the next phases

- **Phase 2**: photo upload + Claude vision (one small Worker change, one frontend change).
- **Phase 3** *(optional)*: AI image generation via a second provider.
- **WhatsApp bot** *(optional)*: Meta Business API + new Worker endpoint.

Phase 1 is shippable on its own — these are independent next steps, not required.
