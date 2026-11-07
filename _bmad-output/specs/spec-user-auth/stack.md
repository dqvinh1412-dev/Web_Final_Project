# Technology Stack & Auth Architecture Prescription

## Core Runtime & Build
- **Framework:** React 19 with TypeScript (`strict` mode) bundled via Vite 8 (`FE_Web_Project`).
- **Deployment Target:** Render Static Site (`./dist` publish directory with `/* -> /index.html` SPA rewrite configured in `render.yaml`).

## Prescribed Frontend Libraries
- **UI Components & Styling:** Shadcn UI (Radix UI primitives + Tailwind CSS).
- **Form State & Validation:** React Hook Form (`react-hook-form`) managing input state, submission loading states, and inline field validation across `/login`, `/register`, `/forgot-password`, and `/reset-password`.
- **Client Routing:** React Router DOM (`react-router-dom`) defining:
  - Guest/auth routes: `/login`, `/register`, `/forgot-password`, `/reset-password` (consumes `?token=...`), and `/auth/callback` (consumes OAuth redirect `?token=...`).
  - Route-guard wrapper (`ProtectedRoute`) protecting authenticated views and redirecting unauthenticated visitors to `/login`.
- **Auth State Store:** Zustand (`zustand` with `persist` middleware) storing `{ user, accessToken, isAuthenticated }` across `F5` reloads and exposing `setSession` / `logout` actions.

## Token & OAuth Mechanism
- **Single-Token JWT:** Uses `accessToken` only (`Authorization: Bearer <accessToken>`). No client-side `refreshToken` rotation; any `401 Unauthorized` response clears Zustand auth state and redirects to `/login`.
- **Google OAuth Redirect:** Triggering "Sign in with Google" navigates the browser to `{VITE_API_BASE_URL}/auth/google`. After Google authentication, the backend redirects back to the SPA callback route (`/auth/callback?token=<accessToken>`), which stores `accessToken`, fetches/hydrates the user profile, and redirects to the protected home view.

## Dual-Mode Auth Adapter
- **Adapter Contract:** UI components and Zustand actions depend strictly on a single `AuthService` interface (`register`, `login`, `logout`, `requestPasswordReset`, `resetPassword`, `initiateGoogleOAuth`, `getCurrentUser`).
- **Environment Toggle:** Controlled via `VITE_USE_MOCK_AUTH=true|false` and `VITE_API_BASE_URL`:
  - **Mock Mode:** Simulates network latency, stores mock users and reset tokens locally, validates duplicate emails / credentials / reset tokens, and simulates the `/auth/google` -> `/auth/callback?token=...` redirect locally.
  - **REST API Mode:** Targets default endpoints (`POST /auth/register`, `POST /auth/login`, `POST /auth/forgot-password`, `POST /auth/reset-password`, `GET /auth/me`, `GET /auth/google`).
