# WorldNewsNow — Backend API

Node.js + Express + Mongoose REST API for the WorldNewsNow news platform.

## Tech Stack

- **Node.js + Express** — HTTP server and routing
- **Mongoose** — MongoDB ODM
- **MongoDB Atlas** — cloud database
- **JWT** — access tokens (7d) + refresh tokens (30d)
- **bcryptjs** — password hashing
- **helmet** — HTTP security headers
- **express-rate-limit** — brute-force protection
- **express-validator** — request validation

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (free tier works)

### Setup

```bash
cp .env.example .env    # fill in your values
npm install
npm run dev             # starts on http://localhost:5001
```

### Seed the database

```bash
npm run seed
```

Creates 7 journalist accounts, 5 reader accounts, 12 published articles, 25 comments, and 10 newsletter subscribers. All passwords: `password123`.

## Environment Variables

Create a `.env` file in this folder:

```env
PORT=5001
NODE_ENV=development

MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/worldnewsnow

JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=30d

CLIENT_URL=http://localhost:5173
```

| Variable | Description |
|---|---|
| `PORT` | Server port (default 5001 — port 5000 is used by macOS AirPlay) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for signing access tokens |
| `JWT_EXPIRE` | Access token expiry (e.g. `7d`) |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `JWT_REFRESH_EXPIRE` | Refresh token expiry (e.g. `30d`) |
| `CLIENT_URL` | Allowed CORS origin — comma-separated for multiple |

## Scripts

```bash
npm run dev      # Start with nodemon (auto-restart)
npm start        # Start without nodemon (production)
npm run seed     # Seed database with sample data
```

## Project Structure

```
bn/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # register, login, logout, refresh, getMe, updateProfile
│   ├── articleController.js   # CRUD, publish/unpublish, like, journalist articles
│   ├── commentController.js   # CRUD, like, nested replies
│   ├── journalistController.js# list, profile, dashboard stats
│   └── contactController.js   # newsletter, advertise inquiry, careers notify
├── middleware/
│   ├── auth.js                # protect (JWT), optionalAuth, requireRole
│   ├── errorHandler.js        # global error handler
│   └── validate.js            # express-validator error formatter
├── models/
│   ├── User.js                # name, email, passwordHash, role, avatar, bio
│   ├── Article.js             # title, content, category, author, likes, draft/publish
│   ├── Comment.js             # text, author, article, parent (nested replies), likes
│   ├── JournalistProfile.js   # specialty, bio, socialLinks, verified
│   └── Subscriber.js          # newsletter email subscriptions
├── routes/
│   ├── auth.js
│   ├── articles.js
│   ├── comments.js
│   ├── journalists.js
│   ├── contact.js
│   └── sitemap.js             # /sitemap.xml and /robots.txt
├── utils/
│   ├── AppError.js            # operational error class
│   └── jwtHelpers.js          # signAccessToken, signRefreshToken, sendTokenResponse
└── server.js                  # Express app entry point
```

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Login → tokens |
| POST | `/api/auth/logout` | Bearer | Logout |
| POST | `/api/auth/refresh` | — | Refresh access token |
| GET | `/api/auth/me` | Bearer | Get current user |
| PATCH | `/api/auth/update-profile` | Bearer | Update name/bio/avatar |
| PATCH | `/api/auth/change-password` | Bearer | Change password |

### Articles
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/articles` | Public | List articles (category, page, limit, search, featured, breaking) |
| GET | `/api/articles/:id` | Public | Get article + comments |
| POST | `/api/articles` | Journalist | Create article |
| PATCH | `/api/articles/:id` | Journalist | Update article |
| DELETE | `/api/articles/:id` | Journalist | Delete article |
| POST | `/api/articles/:id/publish` | Journalist | Publish draft |
| POST | `/api/articles/:id/unpublish` | Journalist | Unpublish article |
| POST | `/api/articles/:id/like` | Bearer | Like / unlike article |
| GET | `/api/articles/journalist/:userId` | Public | Articles by journalist |

### Comments
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/comments?articleId=` | Public | Get comments for article |
| POST | `/api/comments` | Bearer | Post comment or reply |
| PATCH | `/api/comments/:id` | Bearer | Edit comment |
| DELETE | `/api/comments/:id` | Bearer | Delete comment |
| POST | `/api/comments/:id/like` | Bearer | Like / unlike comment |

### Journalists
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/journalists` | Public | List all journalist profiles |
| GET | `/api/journalists/:id` | Public | Get journalist + their articles |
| GET | `/api/journalists/dashboard` | Journalist | Dashboard stats and articles |
| PATCH | `/api/journalists/profile` | Journalist | Update journalist profile |

### Contact
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/contact/subscribe` | Public | Newsletter subscribe |
| POST | `/api/contact/unsubscribe` | Public | Newsletter unsubscribe |
| POST | `/api/contact/advertise` | Public | Advertising inquiry |
| POST | `/api/contact/careers` | Public | Job notification signup |

### SEO
| Method | Endpoint | Description |
|---|---|---|
| GET | `/sitemap.xml` | Dynamic XML sitemap (all published articles + static pages) |
| GET | `/robots.txt` | Robots directives |

## CORS

In `development`, any `localhost` port is allowed automatically.
In `production`, only origins listed in `CLIENT_URL` are allowed (comma-separated for multiple).

## Deployment (Render)

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo
3. Set **Root Directory** → `bn`
4. Set **Build Command** → `npm install`
5. Set **Start Command** → `node server.js`
6. Add all environment variables from `.env.example`
7. Deploy

> **Free tier note:** Render free services sleep after 15 min of inactivity. Use [UptimeRobot](https://uptimerobot.com) (free) to ping `/api/health` every 5 minutes to keep it awake.
