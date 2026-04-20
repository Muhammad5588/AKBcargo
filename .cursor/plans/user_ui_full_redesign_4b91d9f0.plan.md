---
name: User UI Full Redesign
overview: Completely replace user-facing design with an Apple-minimal, flow-first experience while preserving all existing logic, APIs, routes, storage behavior, query keys, and i18n usage. Admin/warehouse/manager/verification/POS surfaces remain untouched.
todos:
  - id: lock-scope-and-invariants
    content: Enforce user-only redesign scope and freeze logic/API/query/storage/route/i18n behavior.
    status: completed
  - id: rebuild-design-foundation
    content: Refactor premium token layer, background, and global user visual foundations to Apple-minimal style.
    status: completed
  - id: redesign-auth-and-navigation
    content: Redesign login/register and user navigation shell to establish the new visual language.
    status: completed
  - id: redesign-dashboard-ecosystem
    content: Redesign dashboard, action cards, track surfaces, and nested user flow entry points with flow-first structure.
    status: in_progress
  - id: redesign-profile-and-modals
    content: Redesign profile page and user modals (wallet/cards/passports/edit/payment) under the same system.
    status: pending
  - id: redesign-reports-and-history
    content: Redesign user reports/history pages and align all list/detail cards to the unified system.
    status: pending
  - id: phasewise-validation
    content: Run targeted lint/build and manual route smoke checks after each batch, reporting only user-surface regressions.
    status: pending
isProject: false
---

# Full User-Panel Redesign Plan (Apple Minimal + Flow-First)

## Scope Lock
- Only redesign regular user-visible surfaces:
  - Auth: [src/components/LoginForm.tsx](src/components/LoginForm.tsx), [src/components/RegistrationForm.tsx](src/components/RegistrationForm.tsx)
  - User shell/routes: [src/App.tsx](src/App.tsx) (user shell rendering only)
  - User pages: [src/pages/Dashboard.tsx](src/pages/Dashboard.tsx), [src/pages/UserPage.tsx](src/pages/UserPage.tsx), [src/pages/UserReportsPage.tsx](src/pages/UserReportsPage.tsx), [src/pages/UserHistoryPage.tsx](src/pages/UserHistoryPage.tsx)
  - User nav: [src/components/navigation/FloatingNavbar.tsx](src/components/navigation/FloatingNavbar.tsx), [src/components/NavigationBar.tsx](src/components/NavigationBar.tsx), [src/components/navigation/UserNav.tsx](src/components/navigation/UserNav.tsx)
  - Shared user visuals: [src/components/ui/UniqueBackground.tsx](src/components/ui/UniqueBackground.tsx), [src/components/user_panel/premium.ts](src/components/user_panel/premium.ts), [src/index.css](src/index.css)
  - User-only modals/components under `src/components/profile/*`, `src/components/wallet/*`, `src/components/modals/MakePaymentModal.tsx`, `src/components/pages/*`, `src/pages/dashboard/components/*`
- Explicitly excluded: admin/warehouse/manager/verification/POS flows and components.
- Hard invariant: no logic/API/schema/query/storage/route/i18n changes.

## Target Design System (What Will Change)
- Replace current cyan-strong premium look with Apple-minimal system:
  - Neutral base palette (off-white/light gray in light mode, graphite in dark mode)
  - Very subtle accent color (single primary accent used sparingly for CTA/focus/status)
  - Cleaner spacing rhythm (larger vertical breathing room, consistent 8pt grid)
  - Simplified elevation model (1–2 shadow levels only)
  - Softer but controlled radius scale (consistent component radius mapping)
  - Typography hierarchy with calmer weights and clearer section cadence
- Interaction style to match flow-first UX:
  - Progressive disclosure (show essentials first, advanced actions later)
  - Fewer competing cards per viewport
  - More explicit page progression and section sequencing
  - Reduced visual noise in icons/badges/background effects

## Visual Architecture Refactor
- Rebuild user design tokens in [src/components/user_panel/premium.ts](src/components/user_panel/premium.ts):
  - page container classes, surface classes, input/button variants, muted/headline text tokens
- Rework background system in [src/components/ui/UniqueBackground.tsx](src/components/ui/UniqueBackground.tsx):
  - remove patterned/decorative prominence, keep near-flat subtle depth
- Align global CSS foundations in [src/index.css](src/index.css):
  - tune base background/foreground and focus-visible treatment for new minimal style
- Keep all class APIs stable where consumed broadly, changing visuals not behavior.

## Layout & Navigation Redesign
- App-level user shell polish in [src/App.tsx](src/App.tsx):
  - adjust user area spacing/wrappers only
- Replace current nav visual language:
  - [src/components/NavigationBar.tsx](src/components/NavigationBar.tsx): cleaner top bar, less glass effect, calmer contrast
  - [src/components/navigation/FloatingNavbar.tsx](src/components/navigation/FloatingNavbar.tsx): simplify active pill and reduce animation heaviness
  - [src/components/navigation/UserNav.tsx](src/components/navigation/UserNav.tsx): preserve routes/items, refine presentation
- Ensure profile/top spacing constraints remain safe (no overlap regressions).

## Page-by-Page Redesign Sequence
- Auth first (visual baseline):
  - [src/components/LoginForm.tsx](src/components/LoginForm.tsx), [src/components/RegistrationForm.tsx](src/components/RegistrationForm.tsx)
  - cleaner card shells, inputs, action hierarchy, helper text layout
- Dashboard next (largest blast radius):
  - [src/pages/Dashboard.tsx](src/pages/Dashboard.tsx)
  - [src/components/user_page/ActionButtons.tsx](src/components/user_page/ActionButtons.tsx)
  - [src/pages/dashboard/TrackCodeTab.tsx](src/pages/dashboard/TrackCodeTab.tsx)
  - [src/pages/dashboard/components/TrackResultCard.tsx](src/pages/dashboard/components/TrackResultCard.tsx)
  - flatten carousel/action density, improve scanning and flow steps
- Profile ecosystem:
  - [src/pages/UserPage.tsx](src/pages/UserPage.tsx)
  - [src/components/profile/ProfileHero.tsx](src/components/profile/ProfileHero.tsx)
  - [src/components/profile/QuickActions.tsx](src/components/profile/QuickActions.tsx)
  - [src/components/profile/PersonalInfo.tsx](src/components/profile/PersonalInfo.tsx)
  - [src/components/profile/SessionHistory.tsx](src/components/profile/SessionHistory.tsx)
  - related user modals under `src/components/profile/*` and `src/components/wallet/*`
- Reports/History pages:
  - [src/pages/UserReportsPage.tsx](src/pages/UserReportsPage.tsx)
  - [src/pages/UserHistoryPage.tsx](src/pages/UserHistoryPage.tsx)
  - align cards/list detail surfaces to same minimal system
- Flow pages/modals from dashboard:
  - [src/components/pages/DeliveryRequestPage.tsx](src/components/pages/DeliveryRequestPage.tsx)
  - [src/components/pages/DeliveryHistoryPage.tsx](src/components/pages/DeliveryHistoryPage.tsx)
  - [src/components/pages/FlightSchedulePage.tsx](src/components/pages/FlightSchedulePage.tsx)
  - [src/components/modals/MakePaymentModal.tsx](src/components/modals/MakePaymentModal.tsx)

## Motion & Interaction Policy
- Keep Framer Motion usage where functionally needed, but reduce amplitude/duration:
  - subtler fades/transitions, fewer spring-heavy accents
  - preserve current state logic and event hooks
- Maintain touch targets and mobile ergonomics while increasing whitespace and visual calm.

## Consistency & Regression Controls
- Build a reusable component style checklist applied to each edited user file:
  - spacing scale, radius scale, border/shadow levels, icon sizing, heading/body styles, CTA hierarchy
- Preserve all existing function signatures/props and route navigation callbacks.
- Do not touch admin routes/components while editing shared files.

## Verification Plan
- After each major phase (auth, dashboard, profile, reports/history, flow pages):
  - run targeted lint only for changed user files
  - run build check (`npx vite build`) to catch runtime/type regressions
  - manually smoke-check user routes: `/auth/login`, `/auth/register`, `/user/home`, `/user/profile`, `/user/reports`, `/user/history`
- If global lint/build fails on known pre-existing baseline issues, isolate and report separately without unrelated fixes.

## Deliverable Strategy
- Deliver redesign in controlled batches so you can review visual direction early:
  1) Design tokens + auth + nav shell
  2) Dashboard full redesign
  3) Profile + wallet/passport/edit modals
  4) Reports + payment history + remaining user flow pages
- Each batch ends with a compact changelog and verification notes before moving to next batch.