# WorldNewsNow — Frontend

React + Vite single-page application for the WorldNewsNow news platform.

## Tech Stack

- **React 18** — UI
- **Vite 6** — build tool and dev server
- **Redux Toolkit + RTK Query** — state management and API calls
- **react-helmet-async** — dynamic SEO meta tags and JSON-LD
- **CSS3 custom properties** — dark theme design system

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running (see [`bn/README.md`](../bn/README.md))

### Setup

```bash
cp .env.example .env
npm install
npm run dev
```

The app starts on `http://localhost:5173` and proxies all `/api` requests to `VITE_API_URL`.

## Environment Variables

Create a `.env` file in this folder:

```env
VITE_API_URL=http://localhost:5001
VITE_SITE_URL=https://worldnewsnow.vercel.app
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (no trailing slash) |
| `VITE_SITE_URL` | Public site URL — used for canonical URLs and JSON-LD |

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```

## Project Structure

```
src/
├── components/
│   ├── SEO.jsx                # react-helmet-async SEO — meta, OG, Twitter, JSON-LD
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ArticleCard.jsx
│   ├── ArticleDetail.jsx
│   ├── CommentSection.jsx
│   ├── AuthModal.jsx
│   ├── JournalistDashboard.jsx
│   ├── RichTextEditor.jsx
│   ├── AboutPage.jsx
│   ├── JournalistsPage.jsx
│   ├── AdvertisePage.jsx
│   ├── CareersPage.jsx
│   └── PageComponents.jsx
├── store/
│   ├── store.js               # Redux store
│   ├── baseApi.js             # RTK Query base with JWT header injection
│   ├── authSlice.js           # Auth state (user + token, persisted to localStorage)
│   ├── authApi.js             # register, login, logout, getMe, updateProfile
│   ├── articlesApi.js         # articles CRUD, like, publish
│   ├── commentsApi.js         # comments CRUD, like
│   ├── journalistsApi.js      # journalist profiles, dashboard
│   └── contactApi.js          # newsletter, advertise, careers
├── utils/
│   ├── transforms.js          # Normalise MongoDB _id → id, dates → timeAgo
│   ├── timeAgo.js             # Relative time formatter
│   └── helpers.js             # Word count, comment tree utilities
├── data/
│   └── constants.js           # Category list and styles
├── styles/
│   └── global.css             # Design system (CSS variables, keyframes, utilities)
├── App.jsx                    # Root component — routing and global state
└── main.jsx                   # React entry point with Redux and HelmetProvider
```

## SEO

Every page and article gets:

- Dynamic `<title>` and `<meta description>`
- Open Graph tags (Facebook, LinkedIn sharing)
- Twitter Card tags
- `NewsArticle` JSON-LD schema (required for Google News)
- `BreadcrumbList` JSON-LD
- `WebSite` JSON-LD with SearchAction
- `NewsMediaOrganization` JSON-LD
- Canonical URL

## Deployment (Vercel)

1. Import repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** → `fr`
3. Framework preset: **Vite** (auto-detected)
4. Add environment variables:
   ```
   VITE_API_URL=https://your-api.onrender.com
   VITE_SITE_URL=https://your-app.vercel.app
   ```
5. Deploy
