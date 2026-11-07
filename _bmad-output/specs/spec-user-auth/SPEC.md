---
id: SPEC-user-auth
companions:
  - stack.md
sources: []
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# User Authentication (Sign In, Sign Up & Password Recovery)

## Why

`FE_Web_Project` (Web Programming final-term project) requires an authentication gateway so visitors can create accounts and sign in before accessing personalized and protected system features. Without client-side authentication flows, session persistence, and route protection, downstream application modules cannot identify the active user or guard private views.

## Capabilities

- **CAP-1**
  - **intent:** Visitors can register a new account using Full Name, Email, Password, and Confirm Password with immediate validation feedback prior to submission.
  - **success:** Submitting valid registration inputs creates the account and transitions the user into the authenticated flow (or sign-in view); invalid email format, non-compliant password strength, mismatched password confirmation, or an already-registered email blocks completion and renders field-specific English error messages.

- **CAP-2**
  - **intent:** Registered users can sign in with Email and Password to access protected routes, receiving clear error feedback when authentication fails.
  - **success:** Valid credentials establish an authenticated session with an `accessToken` and redirect the user to the protected destination; invalid credentials or network/server errors keep the user on `/login` with an English error alert while preserving the entered email.

- **CAP-3**
  - **intent:** Authenticated users retain their active session across browser reloads and can explicitly sign out, while unauthenticated visitors are blocked from protected routes.
  - **success:** Reloading (`F5`) a protected route keeps the user signed in; navigating to a protected route while unauthenticated redirects to `/login`; invoking Sign Out clears the stored `accessToken` and user state and redirects to `/login`.

- **CAP-4**
  - **intent:** Users can navigate seamlessly among Sign In, Sign Up, and Forgot Password screens and toggle password character visibility on any password input.
  - **success:** Action links switch between `/login`, `/register`, and `/forgot-password` via client-side routing without full-page reloads, and toggling the visibility control switches password inputs (across login, registration, and reset screens) between masked (`password`) and plain text (`text`).

- **CAP-5**
  - **intent:** Users who cannot recall their password can submit their registered email address to request a password reset link.
  - **success:** Submitting a valid email address on `/forgot-password` displays an English confirmation message stating that reset instructions have been sent; malformed or empty email input prevents submission with inline validation feedback.

- **CAP-6**
  - **intent:** Users can initiate authentication using their Google account directly from the authentication screens.
  - **success:** Activating "Sign in with Google" redirects to the backend `/auth/google` OAuth endpoint (or simulated local OAuth callback in Mock Auth mode), captures the returned `accessToken` on the SPA callback route, and transitions the user into an authenticated session.

- **CAP-7**
  - **intent:** Users arriving from an email reset link can set a new password via `/reset-password?token=...` by submitting New Password and Confirm Password.
  - **success:** Submitting compliant, matching passwords with a valid `token` updates the user's password and directs them to `/login` with an English success confirmation; missing/expired/invalid `token` or invalid password inputs block completion and render an actionable English error state.

## Constraints

- **Dual-Mode Auth Boundary:** Authentication flows must operate against both a custom JWT REST API backend and a toggleable Frontend Mock Auth Service so frontend development, demos, and automated tests run independently before backend endpoints are live (see `stack.md`).
- **Single-Token JWT & Backend OAuth Redirect:** Client auth state uses a single `accessToken` (no `refreshToken` rotation), clearing state and redirecting to `/login` on `401 Unauthorized`; Google OAuth delegates initial authorization to backend redirect `/auth/google` and completes via a client-side SPA callback route (see `stack.md`).
- **Prescribed Frontend Stack:** Implementation must adhere to the component, form, routing, and state libraries defined in `stack.md`.
- **English Copy & Viewport Range:** All user-facing UI labels, placeholders, buttons, validation messages, and alerts must be written in English and render cleanly without horizontal scrolling across viewports from `360px` mobile screens up to desktop.
- **Static SPA Hosting:** All routing (`/login`, `/register`, `/forgot-password`, `/reset-password`, `/auth/callback`) must execute purely client-side within a static Vite build compatible with Render Static Site hosting (`/* -> /index.html` rewrite), with no SSR or frontend Node server dependency.
- **Credential Hygiene:** Plaintext passwords must never be persisted in browser storage outside the isolated Mock Auth Service's simulated dataset.

## Non-goals

- Implementing backend API servers, databases, or email-sending infrastructure in this repository.
- Client-side `refreshToken` rotation or silent background token renewal.
- Multi-factor authentication (2FA, SMS OTP, or authenticator apps).
- A separate "Remember Me" toggle for variable session TTLs.
- Post-login user profile editing (avatar/account settings) and role-based admin access control (RBAC).
- Social OAuth providers other than Google (e.g., GitHub, Facebook, Apple).

## Success signal

- A new user registers on `/register`, signs in to a protected route, reloads (`F5`) without losing session access, requests and completes a password reset via `/forgot-password` $\rightarrow$ `/reset-password?token=...`, signs in via Google OAuth callback, and signs out back to `/login` — demonstrable end-to-end in Mock Auth mode and switchable to the live JWT REST API via environment configuration alone.

## Assumptions

- Password validation defaults to a minimum of 8 characters containing at least 1 letter and 1 digit until backend password rules specify otherwise.
- Default REST endpoint paths (`/auth/register`, `/auth/login`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/me`, `/auth/google`) and SPA OAuth callback route (`/auth/callback?token=...`) apply unless overridden by backend API documentation.
