# WorldNewsNow

Independent global journalism platform — breaking news, politics, technology, business, science, sports and entertainment.

## Project Structure

```
WorldNewsNow/
├── fr/          # React + Vite frontend
├── bn/          # Node.js + Express + Mongoose backend API
├── .gitignore
└── README.md
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Redux Toolkit, RTK Query |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT (access + refresh tokens) |
| SEO | react-helmet-async, JSON-LD structured data |
| Hosting | Vercel (fr) + Render (bn) |

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/your-username/worldnewsnow.git
cd worldnewsnow
```

### 2. Set up the backend

```bash
cd bn
cp .env.example .env       # fill in your values
npm install
npm run seed               # seed the database with sample articles
npm run dev                # starts on http://localhost:5001
```

### 3. Set up the frontend

```bash
cd fr
cp .env.example .env       # fill in your values
npm install
npm run dev                # starts on http://localhost:5173
```

## Environment Variables

| File | Key variables |
|---|---|
| `bn/.env` | `MONGO_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `PORT`, `CLIENT_URL` |
| `fr/.env` | `VITE_API_URL`, `VITE_SITE_URL` |

See [`bn/.env.example`](bn/.env.example) and [`fr/.env.example`](fr/.env.example) for full templates.

## Deployment

| Service | Platform | Docs |
|---|---|---|
| Frontend | Vercel | [fr/README.md](fr/README.md) |
| Backend | Render | [bn/README.md](bn/README.md) |

## Features

- Multi-category news feed (World, Politics, Tech, Business, Sports, Science, Entertainment)
- JWT authentication — readers and journalists
- Journalist dashboard — write, edit, publish, draft articles
- Rich text editor with formatting toolbar
- Nested comments and replies with likes
- Newsletter subscription
- Advertising inquiry and careers contact forms
- Full SEO — NewsArticle JSON-LD, Open Graph, Twitter Cards, dynamic sitemap
- Dark theme UI with gold accents
