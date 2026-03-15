# Karma'a Clash (Reddit Game)

Karma'a Clash is a **daily Reddit "Higher or Lower" game** built with Devvit Web. Each day, the game fetches hot posts from a random subreddit and challenges players to guess which post has more upvotes.

The goal is simple: **pick the post with higher karma** and score as many correct guesses as possible across a series of post pairs.

---

## 🎮 Gameplay Overview

### How the game works
1. The server loads **top posts from a random subreddit** (daily) via the Reddit API.
2. Posts are paired up into a series of **5 matchups**.
3. The player chooses which post they think has **more upvotes**.
4. The game immediately reveals the actual vote counts and awards a point for correct guesses.
5. After all pairs are played, the final score is shown and users can copy/share their result.

### What makes it fun
- ✅ **Live Reddit data** (posts change every day)
- ✅ Visual “battle” UI with swipe-style choice cards
- ✅ Shareable daily score for competition
- ✅ Lightweight splash view for quick play from the Reddit feed

---

## 🧩 Project Structure

```
src/
  client/        # Frontend (runs in Reddit iframe)
    game.html    # Expanded view (full game UI)
    splash.html  # Inline feed view (quick entry)
    game.tsx     # Main game logic + UI
    splash.tsx   # Entry landing page (goes to expanded view)
    index.css    # Shared styles
  server/        # Serverless backend (Devvit runtime)
    index.ts     # Hono app + route registration
    routes/
      api.ts     # Fetches Reddit posts for the daily challenge
  shared/        # Shared types (currently unused but ready for expansion)

devvit.json      # Devvit app configuration (entrypoints, permissions)
package.json     # Scripts + dependencies
```

---

## 🔧 How the backend works

The backend is a small Hono server that runs inside Devvit’s serverless environment.

### Post Feed Logic (`src/server/routes/api.ts`)
- Selects a random subreddit from a curated list:
  - `aww`, `pics`, `gaming`, `mildlyinteresting`, `todayilearned`
- Fetches the **top 10 posts (daily)** from that subreddit via `reddit.getTopPosts`
- Returns a simplified payload to the frontend:
  - `{ title, sub, upvotes }`

The frontend uses these posts to create 5 pairs and run the daily challenge.

---

## 🏁 Running Locally

```bash
git clone https://github.com/Jeswanth-009/karmaa-clash-reddit-game.git
cd karmaa-clash
npm install
npm run login    # authenticate with Devvit
npm run dev      # start dev server + open preview
```

Once the dev server is running, use the Devvit preview in your browser to open the inline view (splash) and launch the full game.

---

## 🧪 Available NPM scripts

- `npm run dev` – Start the Devvit dev server (hot reload)
- `npm run build` – Build both client and server bundles for production
- `npm run deploy` – Upload/update your app on Devvit
- `npm run launch` – Publish the app for review
- `npm run type-check` – Run TypeScript type checks, linting, and formatting

---

## 🛠️ Customization Ideas

### Add more subreddits
Edit `src/server/routes/api.ts` and add new subreddit names to the `subreddits` array.

### Change game length or rules
Modify `src/client/game.tsx`:
- Adjust how many pairs are generated (currently 5)
- Change scoring, timing, or reveal behavior

### Add new entrypoints
1. Create a new HTML/TSX pair under `src/client/`
2. Register it in `devvit.json` under `tooling.entrypoints`

---

## 🧩 Notes

- The app uses **live Reddit data**, so results will vary every day.
- If you make TypeScript changes in shared code, restart `npm run dev` to reload the backend.

---

## 📄 License

This project is released under the terms of the [MIT License](LICENSE).
