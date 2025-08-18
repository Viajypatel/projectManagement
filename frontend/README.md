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

