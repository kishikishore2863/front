# Greenfield Radar — Frontend README

This doc explains how to run and develop the frontend located in `frontend/`, what APIs the UI expects, how to wire the backend, and how to run the app locally with stubs for fast integration testing.

## Quick summary

- Frontend stack: React + Vite + MapLibre + Tailwind + @tanstack/react-query
- Dev server: single Express server (dev mode sets up Vite) started from `frontend/server/index.ts`
- Dev port (default): 5000
- Client entry: `frontend/client/src/main.tsx`
- HTTP helpers: `frontend/client/src/lib/queryClient.ts`
- API reference: `frontend/FRONTEND-API.md` (detailed contract and example payloads)

## Quickstart (developer)

Requirements
- Node.js (>=18 recommended)
- npm

Commands (zsh)

```bash
cd frontend
npm ci            # install dependencies (or `npm install` if needed)
npm run dev       # starts Express + Vite dev server (default PORT=5000)
```

Production build

```bash
cd frontend
npm ci
npm run build     # builds server dist via `script/build.ts`
npm start         # runs production server (NODE_ENV=production)
```

If `npm run dev` fails because PORT 5000 is in use, set a different port:

```bash
PORT=3000 npm run dev
```

## What the dev server does

- In development (`NODE_ENV !== 'production'`), `frontend/server/index.ts` sets up Vite in middleware mode and serves the client on the same Express server. This simplifies CORS and keeps a single port for both API stubs and client assets.
- In production, the app serves static files from the built `dist/public` folder.

## Where important code lives

- Server bootstrap & middleware: `frontend/server/index.ts`
- Server-side route registration: `frontend/server/routes.ts` (currently a placeholder; good place to add API proxy or stubs)
- Vite dev integration: `frontend/server/vite.ts`
- Client source: `frontend/client/src/`
  - App: `App.jsx`, `main.tsx`
  - Map components: `client/src/components/map/*` (TileHeatmapLayer, POILayer, IsochroneLayer, etc.)
  - HTTP helpers: `client/src/lib/queryClient.ts`
  - Hooks: `client/src/hooks` (e.g. `useScoreLocation`, `useCompareLocations`)

## API contract (short summary)

Full, detailed API contract with request/response examples is in `frontend/FRONTEND-API.md`. Key endpoints the UI expects:

- POST `/api/score-location` — compute isochrone, tiles, heatmap, POIs, and scores for a single location.
- POST `/api/compare` — compare two locations (runs two scoring jobs and returns diffs).
- POST `/api/nearby` — fetch POIs inside a polygon or radius.
- GET `/api/geocode` and `/api/reverse-geocode` — address ↔ coordinates.
- GET `/api/users/me`, PATCH `/api/users/me` — basic profile endpoints used by toolbar/profile UI.
- POST `/api/export-pdf` — request PDF export (sync or async depending on load).

See `frontend/FRONTEND-API.md` for examples, schemas, and developer notes.

## Running frontend with mock backend (fast integration)

If you don't have a backend yet, add lightweight stub routes in `frontend/server/routes.ts`. Example minimal stubs:

```ts
// frontend/server/routes.ts
export async function registerRoutes(httpServer, app) {
  app.post('/api/score-location', (req, res) => {
    // return a mocked response matching FRONTEND-API.md shape
    res.json({ ok: true, data: { score: 75, isochrone: null, tiles: { type: 'FeatureCollection', features: [] }, pois: { type: 'FeatureCollection', features: [] }, topTiles: [] } });
  });

  app.post('/api/compare', (req, res) => {
    res.json({ ok: true, data: { left: null, right: null, comparison: {} } });
  });

  return httpServer;
}
```

After adding stubs restart `npm run dev`. The frontend will call `/api/*` on the same origin and the mock responses will populate the UI.

## API_KEY (backend)

This project exposes a simple development endpoint that returns an API key from the server environment. It's intended for local dev/testing only.

- Endpoint: POST `/api/apikey`
- Request body (optional): JSON with `{ "lng": <number>, "lat": <number> }` — the server will log coords when present.
- Response: `{ "key": "<value or null>" }` where the value is taken from the `API_KEY` environment variable.

How to set and test locally (zsh):

```bash
cd frontend1
export API_KEY="my-test-key"
npm run dev
# in another terminal, test with curl:
curl -X POST -H "Content-Type: application/json" -d '{"lng":-0.12,"lat":51.5}' http://localhost:5000/api/apikey
# expected response: {"key":"my-test-key"}
```

The frontend `MapContainer` component is wired to POST the clicked coordinates to `/api/apikey` and will log the returned key to the browser console. This is convenient for local development, but be careful:

- Security note: returning a raw secret (API key) to the browser is insecure for production. If the key gives access to a third-party service, prefer keeping it server-side and have the server make third-party calls and return only the necessary data to the client (or issue short-lived tokens).

If you'd like, I can:

- Store the returned key in the React `AppContext` so components can read it during dev, or
- Change the server to call a third-party API using the key and return only processed results (recommended for production).

## Replacing mocks with a real backend

Options:
- Implement the backend on the same host (add routes to `frontend/server/routes.ts`) — quickest for local dev.
- Run a separate backend server and update frontend `apiRequest` calls to use absolute URLs (or configure a proxy in Vite). If using a separate host, ensure CORS and credentials are configured properly.

Auth notes
- The frontend's HTTP helpers (`apiRequest`, `getQueryFn`) use `credentials: 'include'`. If you implement auth via cookies (refresh tokens in httpOnly cookie), this will work without client-side cookie management. If you choose JWT in Authorization header, update the frontend wrapper to attach the `Authorization` header.

## How to wire the scoring endpoint in the frontend (example)

Replace the mock hook `useScoreLocation` with a real fetch using the existing helper:

```js
import { apiRequest } from '@/lib/queryClient';

async function fetchScore(location, filters, priorities) {
  const payload = { lat: location.lat, lng: location.lng, transport: filters.transport, minutes: filters.timeBudget, priorityProfile: 'balanced' };
  const res = await apiRequest('POST', '/api/score-location', payload);
  return await res.json().then(r => r.data);
}
```

Then update the react-query hook to call this function as `queryFn`.

## Useful developer commands

- Run TypeScript checks (frontend is a hybrid TS/JX project):

```bash
cd frontend
npm run check   # runs tsc
```

- Rebuild production bundle:

```bash
cd frontend
npm run build
```

## Troubleshooting

- If Vite fails to start: check Node version and delete `node_modules` + `package-lock.json` then `npm ci`.
- If the client shows network 401/403: verify `Authorization` and `credentials` policy with your backend; if using cookies, ensure server sets `HttpOnly` and `SameSite` correctly for your domain.
- If map tiles do not show: ensure MapLibre resources are available and API keys (if any) are configured.

## Tests & validation

- Add API contract tests using Postman or an OpenAPI-generated test suite.
- Unit test hooks and services in `client/src/hooks` using Jest + React Testing Library.

## Where to add changes

- Small backend stubs: `frontend/server/routes.ts`
- Long-term backend: create a separate `backend/` folder (recommended structure described in `frontend/FRONTEND-API.md`).

## Further help

- I can:
  - Add the stub routes to `frontend/server/routes.ts` for `/api/score-location` and `/api/compare` so you can run the UI end-to-end locally. (recommended for fast demos)
  - Generate an OpenAPI spec from `frontend/FRONTEND-API.md` so backend devs can scaffold quickly.

If you'd like either, tell me which and I will add the changes now.

<!-- EOF -->
# front
