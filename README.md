## Project Management API (Backend)

Express.js + MongoDB backend for user auth, projects, and tasks with JWT-based protection.

### Tech stack
- **Runtime**: Node.js, Express 5
- **Database/ODM**: MongoDB, Mongoose
- **Auth**: JWT (Bearer token)
- **Other**: bcrypt, dotenv, CORS

### Requirements
- Node.js >= 18
- MongoDB (local or Atlas)

### Getting started
1. Change into the backend folder and install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in `backend/` with:
   ```bash
   MONGO_URI="mongodb://localhost:27017/project_management"
   JWT_SECRET="super-secret-key"
   NODE_ENV=development
   ```
3. Start the API:
   ```bash
   npm start
   ```
   The server runs on `http://localhost:5000`.

### Seeding test data
Run:
```bash
npm run seed
```
This will clear existing collections and insert:
- A test user: `ruudeuetest@example.com` / `Test@123`
- Two projects for the user
- Three tasks per project (todo/in-progress/done)

### Scripts`
- `npm run seed`: seed MongoDB with test data
- npm start`: start dev server with nodemon
- `npm run build`: install frontend and build it (see Production notes)

### Environment variables
- **MONGO_URI**: MongoDB connection string
- **JWT_SECRET**: secret for signing JWTs
- **NODE_ENV**: `development` or `production`

### API overview
Base URL: `http://localhost:5000`

All non-auth routes require the header:
```
Authorization: Bearer <jwt>
```

#### Auth
- `POST /api/users/register`
  - body: `{ name, email, password }`
  - 201 → `{ message, user }`
- `POST /api/users/login`
  - body: `{ email, password }`
  - 200 → `{ message, token }`
- `GET /api/users/profile` (protected)
  - 200 → user object (without password)

#### Projects (protected)
- `GET /api/projects` → list current user's projects
- `POST /api/projects`
  - body: `{ title, description? }`
- `PUT /api/projects/:id`
  - body: any of `{ title, description, status }` (`status` in `active|completed`)
- `DELETE /api/projects/:id`

#### Tasks (protected)
- `GET /api/tasks/:projectId?status=<todo|in-progress|done>` → list project tasks (optional filter by status)
- `POST /api/tasks`
  - body: `{ project, title, description?, dueDate? }`
- `PUT /api/tasks/:id`
  - body: any of `{ title, description, status, dueDate }`
- `DELETE /api/tasks/:id`

### Minimal request examples
```bash
# Register
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"user@example.com","password":"Pass@123"}'

# Login → get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ruudeuetest@example.com","password":"Test@123"}' | jq -r .token)

# Create project
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"New Project","description":"Demo"}'
```

### Project structure
```
backend/
  config/            # database connection
  controllers/       # route handlers (users, projects, tasks)
  middleware/        # auth middleware (JWT protect)
  models/            # Mongoose models
  routes/            # express routers
  index.js           # server entry
  seeder.js          # database seeder
```

### Production notes
- When `NODE_ENV=production`, the server is set up to serve the built frontend. Ensure the static path in `index.js` matches your frontend build output directory.
- Typical deployment steps:
  1) Build frontend from `frontend/` (`npm run build`)
  2) Start backend with `NODE_ENV=production` and correct `.env` values








# Project Management App (Frontend)

React + TypeScript + Vite frontend that consumes the backend API for auth, projects, and tasks.

## Tech stack
- **React 19**, **TypeScript**, **Vite 7**
- **Router**: react-router-dom
- **Forms/Validation**: react-hook-form, zod
- **HTTP**: axios (with auth interceptor)
- **Styling**: Tailwind CSS

## Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Configure environment variables (optional): create `frontend/.env` with:
   ```bash
   VITE_API_URL=http://localhost:5000
   ```
   Defaults to `http://localhost:5000` if not set (see `src/lib/api.ts`).

## Scripts
- `npm run dev`: start dev server with HMR
- `npm run build`: typecheck and build production assets
- `npm run preview`: preview the production build
- `npm run lint`: run ESLint

## How auth works
- On login, the backend returns a JWT. The frontend stores it in `localStorage` under `auth_token`.
- `src/lib/api.ts` sets `Authorization: Bearer <token>` on all requests if a token exists.
- Helpers in `src/lib/auth.ts` manage the token and dispatch an `auth-changed` event.

## API usage from the frontend
See typed helpers in `src/lib/`:
- `projects.ts`: CRUD on `/api/projects`
- `tasks.ts`: CRUD on `/api/tasks`
- `api.ts`: axios instance with base URL and auth interceptor

Example:
```ts
import { fetchProjects, createProject } from '@/lib/projects'

const projects = await fetchProjects()
await createProject({ title: 'New Project', description: 'Demo' })
```

## Directory structure
```
frontend/
  src/
    lib/           # axios instance + API helpers
    pages/         # views (Auth, Projects, Profile)
    App.tsx        # routes
```

## Build + serve via backend (production)
- Build the frontend:
  ```bash
  npm run build
  ```
- Start the backend with `NODE_ENV=production` to serve the built assets. Make sure the backend static path matches your build output.


