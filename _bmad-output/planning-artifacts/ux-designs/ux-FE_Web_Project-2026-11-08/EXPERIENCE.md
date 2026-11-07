---
name: Wibu Never Die
status: final
sources:
  - _bmad-output/specs/spec-user-auth/SPEC.md
  - _bmad-output/specs/spec-user-auth/stack.md
updated: 2026-11-08
---

# Wibu Never Die — Experience Spine

> **Contract precedence.** Paired with `DESIGN.md` (visual identity & tokens). Both spines win on conflict with any reference capture in [`imports/yumezone-reference.md`](imports/yumezone-reference.md) or visual mockup in `mockups/`.

## Foundation

Single-surface responsive consumer web application (`360px` mobile through `1440px+` desktop) built with React 19, TypeScript, Vite, `shadcn/ui`, `React Hook Form`, `Zustand` (persisted `accessToken` session store), and `React Router DOM`. `DESIGN.md` owns visual tokens and component appearance; this spine owns routing, form behavior, validation timing, state transitions, accessibility, and end-to-end user journeys across both Mock Auth Mode and JWT REST API Mode.

## Information Architecture

| Surface | Route | Reached from | Purpose & Spec Mapping |
|---|---|---|---|
| Sign In | `/login` | Unauthenticated redirect, `/register` redirect/link, `/forgot-password` & `/reset-password` back-links, Sign Out | Authenticate via Email + Password (`CAP-2`), initiate Google OAuth (`CAP-6`), or branch to Sign Up / Forgot Password (`CAP-4`) |
| Sign Up | `/register` | `/login` ("Create an account" link) | Register Full Name, Email, Password, and Confirm Password (`CAP-1`, `CAP-4`, `CAP-6`) |
| Forgot Password | `/forgot-password` | `/login` ("Forgot password?" link) | Submit registered Email to request a password reset link (`CAP-5`, `CAP-4`) |
| Reset Password | `/reset-password?token=...` | Email reset link (or Mock Mode simulated reset link) | Set New Password + Confirm Password validated against `token` query parameter (`CAP-7`, `CAP-4`) |
| OAuth Callback | `/auth/callback?token=...` | Backend `/auth/google` redirect (or Mock Mode simulated callback) | Extract `accessToken`, hydrate user profile in Zustand, and route to `/` (`CAP-6`) |
| Protected Home Hub | `/` | Successful `/login`, `/auth/callback`, or authenticated reload (`F5`) | Guarded streaming/manga hub shell with `Protected hub navbar`, active user identity, sample *Continue Watching* showcase, and `Sign Out` (`CAP-3`) |

Route-guard rules:
- Unauthenticated access to `/` redirects immediately (`replace`) to `/login`.
- Authenticated access to `/login` or `/register` redirects (`replace`) to `/`.

Visual composition references (`mockups/`):
- [`mockups/login.html`](mockups/login.html) — `/login` desktop 55/45 split-stage at rest plus post-registration arrival (`#67E8F9` banner) and failed credential (`#F43F5E` banner) states.
- [`mockups/register.html`](mockups/register.html) — `/register` desktop split-stage with satisfied Glacial Cyan `Password requirement chips` and `360px` mobile collapsed-banner validation error state.
- [`mockups/password-recovery.html`](mockups/password-recovery.html) — `/forgot-password` request & inbox confirmation states plus `/reset-password?token=...` valid chip state and expired-token error guard.
- [`mockups/protected-home.html`](mockups/protected-home.html) — `/` authenticated hub shell on desktop & `360px` mobile (`Protected hub navbar`, `Sign Out`, *Continue Watching* rail) plus the `F5` / `/auth/callback` `"Syncing session..."` hydration interstitial (`/auth/callback` has no separate visual shell beyond this interstitial).

## Voice and Tone

All visible UI copy is **English-only**: concise, calm, nocturnal, and action-oriented. Never blame the user, leak raw HTTP status codes, or use exclamation-heavy hype.

| Context | Do | Don't |
|---|---|---|
| `/login` header | `Welcome *back*` / `Sign in to sync your watchlist and reading progress.` | `Login Form — Enter Credentials Now!` |
| Post-signup banner on `/login` | `Account created — please sign in to continue.` | `Registration successful! Congratulations! 🎉` |
| Credential failure | `Invalid email or password. Please check your details and try again.` | `Error 401: Unauthorized user` |
| `/forgot-password` confirmation | `Check your inbox — if an account exists for {email}, we've sent a password reset link.` | `Email sent!` (leaks account existence / lacks next step) |
| Invalid `/reset-password` token | `This reset link is invalid or has expired. Request a new link to continue.` | `Token missing in URL query string.` |

## Component Patterns

Visual specs live in `DESIGN.md.Components`. Every component name below matches `DESIGN.md` verbatim.

| Component | Surfaces | Behavioral rules |
|---|---|---|
| Split-stage auth shell | `/login`, `/register`, `/forgot-password`, `/reset-password` | Preserves static showcase column during client-side route switches between auth views so only the right-hand form column transitions (zero full-page flash). |
| Primary CTA button | All auth forms | Submits active `React Hook Form`. Enters loading state (`disabled`, inline spinner, label updates e.g. `Signing in...`) during async request to prevent double-submit. |
| Google OAuth button | `/login`, `/register` | Triggers `AuthService.initiateGoogleOAuth()`. In REST mode, navigates browser to `{VITE_API_BASE_URL}/auth/google`; in Mock mode, simulates brief handshake and navigates to `/auth/callback?token=...`. Disabled while another form action is in flight. |
| Auth text input | `/login`, `/register`, `/forgot-password` | Validates on `blur` first, then re-validates `onChange` once touched so errors clear immediately as the user fixes them. Preserves typed `email` across failed login attempts. |
| Password input | `/login`, `/register`, `/reset-password` | Right-side toggle button (`type="button"`, `aria-label="Show password"` / `"Hide password"`) flips `password` $\leftrightarrow$ `text` without stealing form submission or resetting cursor position. Resets to masked on route change. |
| Password requirement chips | `/register`, `/reset-password` | Evaluates live on every keystroke (`onChange`) against 3 rules: `8+ characters`, `1 letter`, `1 number`. Chips transition calmly from `{colors.muted-foreground}` to `{colors.accent}` as met; only turns field border `{colors.destructive}` on `blur` or `submit` if still unmet. |
| Auth status banner | `/login`, `/register`, `/forgot-password`, `/reset-password`, `/auth/callback` | Renders `role="status"` for `{colors.accent}` confirmations (e.g., post-signup banner on `/login` via router state) and `role="alert"` for `{colors.destructive}` form/network/token failures. Dismisses automatically when user edits inputs or re-submits. |
| Protected hub navbar | `/` | Displays active user's Full Name (and initials avatar) from Zustand store. Clicking `Sign Out` calls `AuthService.logout()`, clears persisted `accessToken` + user state, and navigates (`replace`) to `/login`. |

## State Patterns

| State | Surface(s) | Behavioral Treatment |
|---|---|---|
| Session hydrating (`F5` reload) | `/` (`ProtectedRoute`), `/auth/callback` | Centered minimal obsidian loader (`Syncing session...` with `{colors.accent}` spinner, `Skeleton` navbar pill) until Zustand rehydrates / `getCurrentUser` resolves; never flashes `/login` prematurely for already-authenticated users. |
| Post-registration arrival | `/login` | Reads router navigation state `{ registeredEmail }`: displays `{colors.accent}` `Auth status banner` (`Account created — please sign in to continue.`), pre-fills `Email`, and places initial focus on `Password`. |
| Inline field invalid | `/login`, `/register`, `/forgot-password`, `/reset-password` | Input border shifts to `{colors.destructive}`, `12px` error message renders directly beneath field in a reserved container (`min-h-[18px]`) to avoid jarring vertical layout jumps, focus moves to first invalid field on submit. |
| Server / credential / duplicate-email error | `/login`, `/register` | Top `Auth status banner` (`role="alert"`) displays actionable message (e.g., `An account with this email already exists.` or `Invalid email or password.`); entered `Email` and `Full Name` remain intact; password stays masked. |
| Reset email requested | `/forgot-password` | Form swaps cleanly to confirmation state inside the right stage (`Auth status banner` in `{colors.accent}` + `Back to Sign In` action + Mock-mode helper link to preview `/reset-password?token=...` during local testing). |
| Missing / invalid / expired reset token | `/reset-password` | If `?token=` is absent or rejected by `AuthService.resetPassword`, hides/disables password submission and displays `{colors.destructive}` `Auth status banner` with primary link `Request New Reset Link` $\rightarrow$ `/forgot-password`. |
| OAuth callback failure or `401 Unauthorized` | `/auth/callback`, `/` | Clears stale `accessToken` in Zustand and redirects (`replace`) to `/login` carrying error banner (`Google sign-in could not be completed. Please try again.` or `Your session expired. Please sign in again.`). |

## Interaction Primitives

- **Keyboard:** `Tab` / `Shift+Tab` traverses form controls in strict visual top-to-bottom order (`Google OAuth` $\rightarrow$ inputs $\rightarrow$ password visibility button $\rightarrow$ secondary helper link $\rightarrow$ `Primary CTA button` $\rightarrow$ bottom route-switch link). `Enter` inside any input submits the active form.
- **Touch & Pointer (`360px+`):** Every interactive target (`Primary CTA button`, `Google OAuth button`, `Password input` eye toggle, navbar `Sign Out`) enforces a minimum hit area of `44×44px` (`44px` control height).
- **Motion discipline:** Transitions use `150ms–220ms cubic-bezier(0.16, 1, 0.3, 1)`. Under `prefers-reduced-motion: reduce`, disable glow pulses and slide transitions while keeping instant opacity/color state changes.
- **Banned everywhere:** Modal-on-modal auth popups, auto-clearing the user's typed email on failed login, horizontal scrollbars at `360px`, and silent failures without an `Auth status banner`.

## Accessibility Floor

- **WCAG 2.2 AA compliance** across all dark-cinema surfaces (contrast ratios verified in `DESIGN.md.Colors`: primary text `17.9:1`, muted text `7.1:1`, Glacial Cyan accent `13.6:1`).
- Every `Auth text input` and `Password input` pairs with an explicit `<label htmlFor>` (never placeholder-only), sets `aria-invalid="true"` when errored, and binds `aria-describedby` to its error message and (where present) `Password requirement chips`.
- `Auth status banner` uses `role="alert"` (`aria-live="assertive"`) on authentication/network errors and `role="status"` (`aria-live="polite"`) on confirmations so screen readers announce outcomes immediately.
- Focus rings use `{colors.ring}` (`#38BDF8`) with visible `2px`–`3px` offset/halo on keyboard focus (`:focus-visible`), never `outline: none` without replacement.

## Responsive & Platform

| Breakpoint | Layout & Surface Behavior |
|---|---|
| `≥ 1024px` (`lg+` Desktop) | `Split-stage auth shell` renders 2 columns (`55%` left Glacial Cyan showcase poster with `ANIME · MANGA · SYNC` badge & serif-accented quote; `45%` right `#020509` form column capped at `{spacing.form-max}` `400px`). `Protected hub navbar` shows full horizontal links + user pill + `Sign Out`. |
| `640px – 1023px` (`sm–md` Tablet) | Showcase collapses to a `148px` top atmospheric header banner; form centers below inside a `420px` max-width container. |
| `360px – 639px` (Mobile floor) | Showcase renders as a compact `120px` top brand banner; form spans full width with `{spacing.mobile-gutter}` (`20px`) side padding, full-width `44px` buttons, and wrapped `Password requirement chips` with zero horizontal overflow. |

## Inspiration & Anti-patterns

- **Lifted from YumeZone (`imports/yumezone-reference.md`):** Cinema-dark distraction-free canvas, translucent hairline borders, spotlight `#FFFFFF` primary CTA buttons, and `Inter` + *Instrument Serif italic* headline contrast.
- **Adapted for Wibu Never Die:** Shifted from sage-mist (`#91B8B1`) to **Glacial Cyan (`#67E8F9` / `#38BDF8`)** on cold obsidian (`#020509`) and adopted the **55/45 Editorial Split-Stage** so desktop auth feels like entering a flagship streaming hub rather than a generic utility box.
- **Rejected — Auto-login without confirmation feedback after registration:** Explicit redirect to `/login` with pre-filled email and Glacial Cyan confirmation banner gives clear account-creation closure.
- **Rejected — Aggressive red validation while typing initial characters:** Live `Password requirement chips` guide users positively in `{colors.accent}` before `blur`/`submit` error enforcement.

## Key Flows

### Flow 1 — Late-Night Account Creation & First Sign-In (`CAP-1`, `CAP-2`, `CAP-3`, `CAP-4`)
*Protagonist: **Minh** (21, university student on his laptop at 11:45 PM, wants to create a **Wibu Never Die** account to bookmark episode 14 before sleeping).*

1. Minh opens `/` unauthenticated; `ProtectedRoute` redirects him cleanly to `/login` inside the `Split-stage auth shell`. He clicks **Create an account** (`CAP-4`), switching the right stage to `/register` without a page reload.
2. He enters his Full Name (`Minh Nguyen`) and Email (`minh@wibu.dev`). As he types his Password, the three `Password requirement chips` (`8+ characters`, `1 letter`, `1 number`) illuminate one by one in `{colors.accent}` (`#67E8F9`). He clicks the `Password input` eye icon (`CAP-4`) to verify his entry, types Confirm Password, and presses **Create Account** (`CAP-1`).
3. Registration succeeds; the app transitions to `/login` displaying the `{colors.accent}` `Auth status banner` (`Account created — please sign in to continue.`) with `minh@wibu.dev` pre-filled and focus ready in `Password`.
4. Minh enters his password and hits `Enter` (`CAP-2`). `AuthService.login` stores `accessToken` in Zustand and routes him to `/`.
5. **Climax:** The **Wibu Never Die** Protected Home Hub (`/`) opens with `Minh Nguyen` in the `Protected hub navbar` and his *Continue Watching* rail ready. Minh hits `F5` to test his session — he stays signed in (`CAP-3`). When done, clicking **Sign Out** clears his session and returns him to `/login`.

*Failure paths:* If `minh@wibu.dev` is already registered (`CAP-1`), `/register` displays `{colors.destructive}` `Auth status banner` (`An account with this email already exists.`) while keeping his inputs intact. If he mistypes his password on `/login` (`CAP-2`), `/login` alerts `Invalid email or password.` without wiping `minh@wibu.dev`.

### Flow 2 — Mobile Password Recovery from Email Link (`CAP-5`, `CAP-7`, `CAP-4`)
*Protagonist: **Linh** (19, commuting on a `360px` Android phone, forgot her password while trying to check new manga chapters).*

1. On `/login` (rendered with the compact `120px` mobile **Wibu Never Die** banner), Linh taps **Forgot password?** (`CAP-4`) to reach `/forgot-password`.
2. She enters `linh@manga.io` and taps **Send Reset Link** (`CAP-5`). The right stage transitions to the `{colors.accent}` confirmation state (`Check your inbox...`).
3. Linh opens the reset link (`/reset-password?token=rst_98a7f`) on her phone (`CAP-7`).
4. She types a new password, watches all three `Password requirement chips` turn Glacial Cyan, confirms the matching password, and taps **Update Password**.
5. **Climax:** `/reset-password` validates `token`, updates her password, and routes Linh directly to `/login` with an `{colors.accent}` `Auth status banner` (`Password updated — sign in with your new password.`), letting her sign straight back into `/` with zero friction.

*Failure paths:* Malformed email on `/forgot-password` blocks submit with inline error (`CAP-5`). Missing or expired `?token=` on `/reset-password` (`CAP-7`) renders the `{colors.destructive}` banner (`This reset link is invalid or has expired.`) with a single tap action back to `/forgot-password`.

### Flow 3 — Single-Click Google OAuth Sign-In (`CAP-6`, `CAP-3`)
*Protagonist: **Khoa** (22, opening **Wibu Never Die** on desktop between classes, prefers instant Google sign-in).*

1. On `/login`, Khoa clicks **Sign in with Google** (`Google OAuth button`, `CAP-6`).
2. Browser redirects to `{VITE_API_BASE_URL}/auth/google` (or local simulated handshake in Mock Auth Mode) and returns to the SPA callback route `/auth/callback?token=<accessToken>`.
3. `/auth/callback` displays the obsidian session-sync loader, persists `accessToken` into Zustand, hydrates Khoa's user profile via `getCurrentUser`, and replaces history to `/`.
4. **Climax:** Khoa lands directly on the Protected Home Hub (`/`) with his Google profile name visible in `Protected hub navbar` — authenticated in one click and resilient across `F5` reloads (`CAP-3`).

*Failure path:* Missing token or cancelled OAuth callback redirects (`replace`) from `/auth/callback` to `/login` with `{colors.destructive}` `Auth status banner` (`Google sign-in could not be completed. Please try again.`).
