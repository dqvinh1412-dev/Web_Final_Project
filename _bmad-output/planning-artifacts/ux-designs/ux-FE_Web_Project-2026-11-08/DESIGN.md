---
name: Wibu Never Die
status: final
updated: 2026-11-08
description: Dark-cinema visual identity for Wibu Never Die — an anime streaming and manga reading web platform built on shadcn/ui + Tailwind CSS with Glacial Cyan brand overrides.
colors:
  background: '#020509'
  foreground: '#EEF6FA'
  card: '#0A1017'
  card-foreground: '#EEF6FA'
  surface-elevated: '#0F1823'
  border: '#1B2938'
  input: '#162230'
  primary: '#FFFFFF'
  primary-foreground: '#02060B'
  accent: '#67E8F9'
  accent-deep: '#38BDF8'
  accent-foreground: '#02060B'
  muted: '#0F1823'
  muted-foreground: '#8FA3B3'
  subtle-foreground: '#5C7285'
  ring: '#38BDF8'
  destructive: '#F43F5E'
  destructive-foreground: '#FFF1F2'
typography:
  sans:
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  display:
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    fontSize: 36px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  display-sm:
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.15'
    letterSpacing: -0.025em
  serif-accent:
    fontFamily: 'Instrument Serif, Georgia, serif'
    fontSize: inherit
    fontWeight: '400'
    lineHeight: '1.1'
  micro-badge:
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    fontSize: 10px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.2em
rounded:
  sm: 6px
  md: 10px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  form-max: 400px
  mobile-gutter: 20px
  desktop-stage-pad: 48px
  field-gap: 16px
components:
  split-stage-auth-shell:
    background: '{colors.background}'
    showcase-surface: '{colors.card}'
    border: '{colors.border}'
    form-max-width: '{spacing.form-max}'
  primary-cta-button:
    background: '{colors.primary}'
    foreground: '{colors.primary-foreground}'
    radius: '{rounded.lg}'
  google-oauth-button:
    background: '{colors.card}'
    foreground: '{colors.foreground}'
    border: '{colors.border}'
    radius: '{rounded.lg}'
  auth-text-input:
    background: '{colors.card}'
    foreground: '{colors.foreground}'
    border: '{colors.input}'
    focus-ring: '{colors.ring}'
    radius: '{rounded.lg}'
  password-input:
    background: '{colors.card}'
    foreground: '{colors.foreground}'
    border: '{colors.input}'
    toggle-icon: '{colors.muted-foreground}'
    radius: '{rounded.lg}'
  password-requirement-chips:
    unmet-background: '{colors.muted}'
    unmet-foreground: '{colors.muted-foreground}'
    met-foreground: '{colors.accent}'
    met-border: '{colors.accent-deep}'
    radius: '{rounded.full}'
  auth-status-banner:
    info-accent: '{colors.accent}'
    error-accent: '{colors.destructive}'
    surface: '{colors.card}'
    radius: '{rounded.lg}'
  protected-hub-navbar:
    background: '{colors.background}'
    border: '{colors.border}'
    user-pill-background: '{colors.surface-elevated}'
    radius: '{rounded.lg}'
---

> **Contract precedence.** This `DESIGN.md` spine wins on conflict with any reference capture in `imports/` or visual preview in `mockups/`.

## Brand & Style

**Wibu Never Die** is a consumer anime streaming and manga reading hub designed like a late-night private screening room: zero clutter, obsidian depth, and crisp broadcast precision. Visually inspired by [`imports/yumezone-reference.md`](imports/yumezone-reference.md), the aesthetic is **Dark-Mode Only** — combining cold obsidian slate surfaces, translucent hairline glass, bold tight-tracked sans-serif headlines punctuated by single italic serif words, and razor-sharp Glacial Cyan telemetry accents.

The system inherits structural primitives from `shadcn/ui` on Tailwind CSS and overrides only the dark-cinema brand layer defined here. Voice in headlines is concise, nocturnal, and fan-native without juvenile slang: confident invitations (*"Pick up right where the episode ended."*) rather than generic SaaS boilerplate.

## Colors

Dark-only palette anchored in cold obsidian and ice-cyan luminescence:

- **Obsidian Canvas (`{colors.background}` `#020509`) & Slate Glass (`{colors.card}` `#0A1017`, `{colors.surface-elevated}` `#0F1823`):** Primary viewport background and elevated card/showcase layers. Cards use translucent glass overlays (`rgba(103, 232, 249, 0.035)`) framed by 1px `{colors.border}` (`#1B2938` / `rgba(186, 230, 253, 0.11)`).
- **Spotlight White CTA (`{colors.primary}` `#FFFFFF` on `{colors.primary-foreground}` `#02060B`):** Reserved exclusively for the single primary form submission button per screen (`Sign In`, `Create Account`, `Send Reset Link`, `Update Password`). Contrasts at **19.4:1** against `{colors.primary-foreground}`.
- **Glacial Cyan (`{colors.accent}` `#67E8F9` & `{colors.accent-deep}` `#38BDF8`):** Telemetry and active-state signal — used for input focus rings (`{colors.ring}`), interactive text links, satisfied password requirement chips, pill badges, and positive confirmation banners (`Account created — please sign in`). Contrasts at **13.6:1** (`#67E8F9`) and **9.4:1** (`#38BDF8`) against `{colors.background}`. Never used as a full-width button fill where `{colors.primary}` belongs.
- **Foreground Ramp (`{colors.foreground}` `#EEF6FA`, `{colors.muted-foreground}` `#8FA3B3`, `{colors.subtle-foreground}` `#5C7285`):** `#EEF6FA` (**17.9:1** on `#020509`) carries headings, labels, and typed input values; `#8FA3B3` (**7.1:1** on `#020509`, exceeding WCAG AA 4.5:1) carries helper copy and secondary links; `#5C7285` is restricted to non-essential placeholders and decorative dividers.
- **Signal Crimson (`{colors.destructive}` `#F43F5E` on `{colors.destructive-foreground}` `#FFF1F2`):** Used strictly for inline validation errors, invalid/expired reset token states, and failed authentication alerts (**5.3:1** against `#020509`).

## Typography

- **UI & Display Sans (`{typography.sans}`, `{typography.display}`, `{typography.display-sm}`):** Set in **Inter**. Form headings use `{typography.display-sm}` (`28px`, weight `700`, `-0.025em` tracking); split-stage showcase headlines use `{typography.display}` (`36px`, weight `800`, `-0.03em` tracking). Labels use `13px` weight `500`; field error messages use `12px` weight `500`.
- **Editorial Serif Accent (`{typography.serif-accent}`):** Set in **Instrument Serif** (`italic`, weight `400`). Used strictly as an inline 1–3 word emphasis inside display headings (e.g., `Welcome *back*`, `Create your *account*`, `Pick up right where the *episode* ended`). Never used for body paragraphs, labels, or inputs.
- **Telemetry Micro-Badge (`{typography.micro-badge}`):** Uppercase `10px` Inter (`700`, `0.2em` letter-spacing) for showcase pills (`ANIME · MANGA · SYNC`).

## Layout & Spacing

- **Desktop Editorial Split-Stage (`≥ 1024px`):** Full-viewport `min-h-screen` 2-column grid (`55%` left duotone Glacial Cyan anime/manga showcase stage; `45%` right pure `{colors.background}` form stage with `{spacing.desktop-stage-pad}` `48px` padding). Form content centers inside `{spacing.form-max}` (`400px`) with `{spacing.field-gap}` (`16px`) vertical rhythm.
- **Tablet & Mobile Collapse (`360px` – `1023px`):** Left showcase collapses into a compact top atmospheric header (`120px`–`148px` height) displaying the **Wibu Never Die** wordmark and micro-badge, stacked above the single-column form stage with `{spacing.mobile-gutter}` (`20px`) horizontal gutters and zero horizontal overflow down to `360px`.
- **Promoted Visual References (`mockups/`):** [`mockups/login.html`](mockups/login.html) (`/login` 55/45 split-stage & status banners), [`mockups/register.html`](mockups/register.html) (`/register` desktop chips & `360px` mobile error layout), [`mockups/password-recovery.html`](mockups/password-recovery.html) (`/forgot-password` & `/reset-password` layouts), and [`mockups/protected-home.html`](mockups/protected-home.html) (`/` navbar, *Continue Watching* rail & session-sync interstitial).

## Elevation & Depth

Hierarchy relies on tonal luminance steps (`#020509` $\rightarrow$ `#0A1017` $\rightarrow$ `#0F1823`) and 1px translucent ice-tinted borders rather than heavy drop shadows. Two controlled light sources exist:
1. **Primary CTA Halo:** `0 0 24px rgba(103, 232, 249, 0.25), 0 0 12px rgba(255, 255, 255, 0.14)` on `{components.primary-cta-button}`, intensifying slightly on hover.
2. **Showcase Vignette:** Radial Glacial Cyan ambient glow (`rgba(56, 189, 248, 0.14)`) behind duotone artwork fading cleanly into `{colors.background}` at the seam.

## Shapes

- **Controls & Inputs (`{rounded.lg}` `12px`):** Buttons, inputs, status banners, and cards share a uniform `12px` corner radius matching the YumeZone cinema geometry.
- **Badges & Requirement Chips (`{rounded.full}` `9999px`):** Showcase category pills, password strength chips, and navbar user avatar pills use full capsules.

## Components

Inherited from `shadcn/ui` with Dark Cinema token mapping (`Form`, `Label`, `Separator`, `Skeleton`, `Avatar`). Brand-specified components (paired behaviorally in `EXPERIENCE.md`):

- **Split-stage auth shell (`{components.split-stage-auth-shell}`):** 55/45 desktop split container (`{colors.background}` right form canvas; `{colors.card}` left editorial poster panel with `1px` `{colors.border}` divider and duotone cyan vignette), collapsing to stacked mobile banner + form below `1024px`.
- **Primary CTA button (`{components.primary-cta-button}`):** Full-width `44px`-height button in `{colors.primary}` fill, `{colors.primary-foreground}` `14px` extrabold label, `{rounded.lg}` corners, icy cyan ambient glow, and inline spinner when loading.
- **Google OAuth button (`{components.google-oauth-button}`):** Full-width `44px`-height secondary glass button in `{colors.card}` (`rgba(186, 230, 253, 0.05)` hover `{colors.surface-elevated}`), `1px` `{colors.border}`, official multicolor Google `G` SVG mark + `{colors.foreground}` semibold label, `{rounded.lg}` corners.
- **Auth text input (`{components.auth-text-input}`):** `44px`-height input in `{colors.card}` fill, `1px` `{colors.input}` border, `{colors.foreground}` text, `{colors.subtle-foreground}` placeholder, `{rounded.lg}` radius. Focus applies `1px` `{colors.ring}` border + `3px` `rgba(56, 189, 248, 0.25)` halo; invalid state applies `1px` `{colors.destructive}` border.
- **Password input (`{components.password-input}`):** Extends `Auth text input` with `44px` right-aligned icon button (`Eye` / `EyeOff` in `{colors.muted-foreground}`, `{colors.foreground}` on hover) inside the field frame.
- **Password requirement chips (`{components.password-requirement-chips}`):** Horizontal wrap row of 3 compact `{rounded.full}` pills (`8+ characters`, `1 letter`, `1 number`). Unmet chips render in `{colors.muted}` with `{colors.muted-foreground}` text; satisfied chips illuminate with `rgba(103, 232, 249, 0.12)` fill, `1px` `{colors.accent-deep}` border, check icon, and `{colors.accent}` text.
- **Auth status banner (`{components.auth-status-banner}`):** `{rounded.lg}` inline alert card above form fields. Confirmation variant (post-signup / reset-sent) uses `rgba(103, 232, 249, 0.10)` fill, `1px` `{colors.accent-deep}` border, and `{colors.accent}` icon/title; error variant uses `rgba(244, 63, 94, 0.10)` fill, `1px` `{colors.destructive}` border, and `{colors.destructive-foreground}` copy.
- **Protected hub navbar (`{components.protected-hub-navbar}`):** Sticky top bar (`64px` height) on `/` with `backdrop-blur-md` over `{colors.background}`, `1px` bottom `{colors.border}`, left **Wibu Never Die** wordmark + nav links (`Home`, `Browse`, `Manga`, `Watchlist`), right `{colors.surface-elevated}` user pill (initials avatar + Full Name/Email) and ghost/outline `Sign Out` button.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Keep the entire UI Dark-Mode Only on `{colors.background}` (`#020509`) | Introduce light-mode white page backgrounds or warm beige/cream surfaces |
| Use `{colors.primary}` (`#FFFFFF`) for the single primary submit button per screen | Render two solid `#FFFFFF` buttons on the same screen competing for hierarchy |
| Reserve `{typography.serif-accent}` (*Instrument Serif italic*) for 1–3 words in headings | Set form labels, error alerts, or button text in serif italic |
| Illuminate `{components.password-requirement-chips}` in `{colors.accent}` as rules pass | Flash destructive red on password chips while the user is still typing their first characters |
| Collapse the 55% poster stage into a compact top banner below `1024px` | Hide brand context completely on mobile or force horizontal scrolling at `360px` |
