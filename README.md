# 🏏 IPL Challenge — Predict & Claim the Crown

A full-stack IPL prediction battle platform where you lock in your boldest match predictions, challenge friends with custom stakes, and climb the global leaderboard.

**Live:** [ipl.devtree.site](https://ipl.devtree.site)

---

## ✨ Features

- **🔒 Lock Predictions** — Predict toss winner, top scorer, total runs bracket, match result & player performance before the match starts
- **⚔️ Friend Challenges** — Create a challenge with custom stakes (e.g. "Loser buys Biryani 🍛"), share a unique link, and see a live VS board showing both predictions side-by-side
- **🏆 Global Leaderboard** — Earn points when your predictions are correct and climb the Hall of Fame rankings
- **📊 Live Results** — Admin resolves matches and points are auto-calculated and distributed
- **📱 WhatsApp Share** — Share challenge links with a rich preview card including match and stakes info
- **🔐 Google OAuth** — Sign in with Google; new users signing up via a challenge link are redirected back to the challenge automatically
- **📈 Vercel Analytics** — Built-in web analytics and Web Vitals tracking

---

## 🧮 Points System

Each match has 5 prediction categories worth **10 points each** (max 50 pts/match):

| Category | Points |
|---|---|
| ✅ Toss Winner | 10 |
| ✅ Top Scorer | 10 |
| ✅ Total Runs Bracket | 10 |
| ✅ Match Winner | 10 |
| ✅ Player Performance | 10 |
| **Max per match** | **50** |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (via [Neon](https://neon.tech)) |
| ORM | [Drizzle ORM](https://orm.drizzle.team) |
| Auth | [Auth.js v5](https://authjs.dev) (Google OAuth) |
| Styling | Tailwind CSS |
| Icons | [Lucide React](https://lucide.dev) |
| Analytics | [Vercel Analytics](https://vercel.com/analytics) |
| Deployment | [Vercel](https://vercel.com) |

---

## 🗃 Database Schema

```
users          → id, name, email, image, totalPoints
matches        → id, team1, team2, matchTime, status, actualResults
challenges     → id, matchId, creatorId, stakesDescription, status
predictions    → id, userId, matchId, challengeId, tossWinner, topScorer,
                 totalRuns, matchResult, playerPerf, pointsEarned
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- Google OAuth credentials

### 1. Clone & Install

```bash
git clone https://github.com/modamaan/ipl_challenge.git
cd ipl_challenge
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL=your_postgres_connection_string
AUTH_SECRET=your_auth_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
ADMIN_EMAIL=your_admin_email@gmail.com
```

### 3. Database Setup

```bash
npx drizzle-kit push
```

### 4. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔧 Admin Panel

Navigate to `/admin` while signed in with the `ADMIN_EMAIL` account to:
- Create new matches
- Resolve matches with actual results (auto-distributes points to all predictors)

---

## 📁 Project Structure

```
app/
  page.tsx                  # Landing page
  dashboard/
    page.tsx                # Main arena — match cards & predictions
    predict/[matchId]/      # Prediction form for a match
    results/[matchId]/      # Results view after match completion
  challenge/[challengeId]/  # VS board for a friend challenge
  admin/                    # Admin panel (protected)
  actions/
    challenge.ts            # Server actions for challenge creation
  actions.ts                # Prediction submit server action
components/
  challenge-dialog.tsx      # "Challenge a Friend" modal
  challenge-share-button.tsx# Share popover (copy + WhatsApp)
  mobile-nav.tsx            # Responsive mobile navigation
  prediction-form.tsx       # Prediction input form
  team-logo.tsx             # IPL team logo renderer
lib/
  db/
    schema.ts               # Drizzle ORM schema
    index.ts                # DB connection
```

---

## 📄 License

MIT — built with ❤️ by [@modamaan](https://github.com/modamaan)
