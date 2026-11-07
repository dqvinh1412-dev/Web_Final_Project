# Input Reconciliation — `yumezone-reference.md` & `SPEC-user-auth`

## Preserved Decisions
- **Dark-only cinema atmosphere (`yumezone-reference.md`):** Preserved dark-only posture, frosted hairline glass borders, high-contrast `#FFFFFF` glowing primary CTA buttons, `Inter` + `Instrument Serif` italic editorial typography pairing, `12px` (`{rounded.lg}`) control geometry, and uppercase wide-tracked micro-badges.
- **Intentional User Deltas over Reference (`yumezone-reference.md`):**
  - Replaced YumeZone's `#000000` + `#91B8B1` sage-teal palette with **Theme 04 — Glacial Cyan** (`#020509` cold obsidian canvas + `#67E8F9` / `#38BDF8` ice-cyan focus/telemetry accents) per user selection.
  - Replaced YumeZone's brand name with **`Wibu Never Die`**.
  - Replaced AniList/MAL OAuth (`llms.txt`) with **Google OAuth** (`/auth/google` redirect) + Email/Password JWT flows per `SPEC-user-auth` (`CAP-1`..`CAP-7`).
- **Upstream Spec Capabilities (`SPEC.md` & `stack.md`):** All 7 capabilities (`CAP-1` through `CAP-7`), Shadcn UI + React Hook Form + Zustand + React Router DOM stack, `360px` mobile floor, English-only UI copy, and single `accessToken` rules are 100% mapped across `DESIGN.md` and `EXPERIENCE.md`.

## Dropped Qualitative Ideas (Intentional & Logged)
- **Username rainbow/neon custom font effects (`ns-effect-prism`, `Press Start 2P`, `Bangers` in YumeZone CSS):** Dropped as out-of-scope community profile cosmetics (`Profile Settings` is a Non-goal in `SPEC-user-auth`).
