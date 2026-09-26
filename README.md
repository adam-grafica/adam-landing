# Adam Landing v1 - Marketing Site 🚀

**Adam Landing v1** is a high-performance, premium marketing landing page designed to convert and showcase the brand's digital authority.

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite (Next-gen frontend tooling).
- **Language**: TypeScript (Strong typing for maintainability).
- **Styling**: Tailwind CSS + `tailwindcss-animate`.
- **Animations**: GSAP (GreenSock Animation Platform) for smooth, high-end interactions.
- **Icons**: Lucide React.

## 📂 Project Structure

- **[`src/`](./src/)**: Contains the source code.
    - `components/`: Reusable UI components (Buttons, Hero, Sections).
    - `app/`: Application logic and main page assembly.
- **[`public/`](./public/)**: Static assets (Images, Logos, Favicon).
- **[`nginx.conf`](./nginx.conf)**: Production server configuration with caching optimizations.
- **[`Dockerfile`](./Dockerfile)** & **[`captain-definition`](./captain-definition)**: Used for Caprover deployment.

## 🚀 Development & Deployment

### Local Development
1.  Install dependencies: `npm install`
2.  Start dev server: `npm run dev`
3.  Build for production: `npm run build`

### Deployment (Caprover)
The project is configured for automated deployment via Caprover.
- Uses **Nginx** for serving static files.
- **Gzip compression** and **Cache-Control** are pre-configured in `nginx.conf`.
- Deployment is triggered via `captain-definition`.

## 🔌 API (backend FastAPI + SQLite)

Backend en `backend/` (FastAPI, SQLAlchemy, SQLite). Servicio systemd: `preview-landing-api` en `:3001`.

**Rutas reales — SIN trailing slash (verificado 15:50 CLT 2026-09-26):**

| Método | Ruta | Body | Devuelve |
|---|---|---|---|
| `POST` | `/api/leads` | `{name,email,company,budget,service}` | `201` + lead creado |
| `POST` | `/api/chat` | `{message, visitor_id?, session_id?}` | `200` + `{session_id, reply, intent, confidence, latency_ms, agent_id}` |
| `GET`  | `/api/health` | — | `200` status |

Notas:
- El trailing slash (`/api/leads/`) devuelve **404** — las rutas se registran sin barra final.
- `visitor_id` y `session_id` son UUID v4. El front guarda `visitor_id` en `localStorage["ag_visitor_id"]` y reenvía el `session_id` que devuelve la respuesta para mantener contexto multi-turno.
- CORS habilitado para los orígenes del preview local (`http://127.0.0.1:5181` verificado en preflight `OPTIONS`).
- Persistencia: `backend/adamgrafica.db` — tablas `leads`, `chat_sessions`, `chat_messages`.
- El chat opera con `agent_id: local-fallback` (motor local determinista). No consume tokens de LLM.

## 🧩 ChatAgentBubble (arquetipo C)

`src/components/ChatAgentBubble.tsx`, montado lazy a nivel de `App` (presente en todas las rutas).
Launcher flotante con `aria-label="Abrir chat con el agente"` → panel con greeting, textarea, Enter envía / Shift+Enter nueva línea, estado de carga y metadata de agente + latencia por turno.

## ⚡ Performance Optimizations
- **PageSpeed Focus**: Optimized Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS).
- **GSAP**: Used for the "Rocket" and "Process" animations to ensure smooth, non-blocking performance.

---
*Professional marketing site documentation by Antigravity AI.*
