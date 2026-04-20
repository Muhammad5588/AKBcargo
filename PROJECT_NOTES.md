# AKBcargo Project Notes

Last updated: 2026-04-16

For the full regular user-panel handoff document, read `USER_PANEL_AI_GUIDE.md`.

## Stack and Commands

- Vite + React 19 + TypeScript strict mode.
- Styling uses Tailwind CSS 4, shadcn-style local UI primitives, Framer Motion, lucide-react, Sonner, and i18next.
- Main commands:
  - `npm run dev`
  - `npm run lint`
  - `npm run build`

## Routing and Auth Shape

- `src/App.tsx` owns the in-app route state. It maps logical pages to browser paths without React Router route components.
- Regular user pages are:
  - `user-home` -> `/user/home`
  - `user-profile` -> `/user/profile`
  - `user-reports` -> `/user/reports`
  - `user-history` -> `/user/history`
- User auth token is stored in `sessionStorage` under `access_token`.
- Admin auth token and role use `localStorage`; do not mix regular user changes into admin auth behavior.
- `LoginForm` and `RegistrationForm` use Telegram WebApp data. Preserve the login/register API payload shapes and validation schemas.

## User Panel Scope

The premium minimal redesign scope is the regular user panel only:

- Auth forms: `src/components/LoginForm.tsx`, `src/components/RegistrationForm.tsx`.
- User routes: `src/pages/UserHome.tsx`, `src/pages/Dashboard.tsx`, `src/pages/UserPage.tsx`, `src/pages/UserReportsPage.tsx`, `src/pages/UserHistoryPage.tsx`.
- User navigation: `src/components/navigation/UserNav.tsx`, `src/components/navigation/FloatingNavbar.tsx`.
- User dashboard components and pages:
  - `src/components/user_page/ActionButtons.tsx`
  - `src/components/pages/DeliveryRequestPage.tsx`
  - `src/components/pages/DeliveryHistoryPage.tsx`
  - `src/components/pages/FlightSchedulePage.tsx`
- Profile/wallet/passport/payment modals used by user panel:
  - `src/components/profile/*`
  - `src/components/wallet/*`
  - `src/components/modals/MakePaymentModal.tsx`

Keep admin, warehouse, verification, POS, and manager logic out of scope unless a shared UI primitive must be touched. If a shared primitive is touched, verify it does not change public API behavior.

## API Boundaries To Preserve

- Auth service: `src/api/services/auth.ts`.
- Profile hooks and endpoints: `src/hooks/useProfile.ts`.
- Reports: `src/api/services/reportService.ts`.
- Payment: `src/api/services/paymentService.ts`.
- Delivery: `src/api/services/deliveryService.ts`.
- Wallet: `src/api/services/walletService.ts`.
- Extra passports: `src/api/services/passportService.ts`.
- Cargo track search: `src/api/services/cargo.ts`.

When redesigning UI, do not change service method names, request bodies, response types, TanStack Query keys, mutation flows, session/local storage behavior, route names, i18n keys, or form schemas.

## Design Direction

- Direction is premium minimal: clean surfaces, restrained accents, stable spacing, strong mobile ergonomics, readable typography, and consistent drawers/modals.
- Avoid dominant orange-heavy, purple-heavy, or overly glassy/orb-based visuals in the user panel.
- Prefer neutral white/zinc surfaces, 8px radius or smaller where practical, subtle borders, and small semantic accents such as emerald, cyan, rose, amber only where they carry meaning.
- Keep user-facing copy unchanged through existing i18n keys.

## 2026-04-14 Follow-up UI Notes

- User home action buttons must stay visually distinct from the old large one-per-row cards. `src/pages/Dashboard.tsx` renders services as a focused launchpad and `src/components/user_page/ActionButtons.tsx` controls the mixed-size mosaic.
- User home carousel was redesigned away from full gradient cards. Static feature cards now use neutral compact notice cards; API media cards keep media behavior and tracking but use a darker side-panel style.
- The beta badge uses a compact zinc/cyan tag style without the previous amber ping indicator.
- User shell background should stay cyan/sky based. `src/App.tsx` no longer applies the old orange/amber user background blobs, and `src/index.css` uses cyan-tinted body background values.
- `src/pages/dashboard/TrackCodeTab.tsx` and `src/pages/dashboard/components/TrackResultCard.tsx` are part of the user-panel redesign scope. Keep tracking logic, query keys, localStorage history key, and `trackCargo` calls unchanged.
- `src/components/profile/ProfileHero.tsx` and `src/pages/UserPage.tsx` include extra top spacing so the profile avatar sits lower on the page.

## 2026-04-14 Follow-up Adjustment

- The beta badge must not overlap the top navbar/logo. It now lives in the dashboard content flow after the header tabs, aligned to the right.
- User-panel page backgrounds should use a cyan/sky palette instead of plain black/white/zinc. Keep this as linear background treatment, not decorative blurred orbs.
- Dashboard tab switching uses a spring `layoutId` active background instead of the old manually positioned sliding indicator.
- Dashboard section titles should use compact numbered labels rather than the old vertical color bars.

## 2026-04-16 Floating Nav And Cube Carousel

- `src/components/navigation/FloatingNavbar.tsx` now uses an asymmetric dock design. The active button is long, elevated, and blue; inactive buttons are separate smaller white squares with staggered vertical offsets. Keep the existing props and route callbacks unchanged.
- `src/pages/Dashboard.tsx` no longer uses the old horizontal scroll/snap carousel for UserHome. The important carousel is now a cube-style single-card rotator with Framer Motion `AnimatePresence`, `activeCarouselIndex`, `carouselDirection`, next/prev controls, dots, auto-advance, and touch swipe support.
- Dashboard action UX is intentionally uneven now: quick search is split into a long input rail plus a square scan trigger, duplicate report/history Home shortcuts are removed, and service buttons use a `grid-cols-4` mosaic through `src/components/user_page/ActionButtons.tsx`.
- The carousel transition should not use `AnimatePresence mode="wait"` or visible background stack cards; those made the back layer linger during slide/rotate transitions.
- API carousel logic is preserved. `getActiveCarouselItems`, `trackCarouselView`, `trackCarouselClick`, gallery modal behavior, action URLs, and static prohibited-item modal behavior must remain intact.
- Carousel touch events stop propagation so cube swipes do not accidentally switch dashboard tabs.
- `src/index.css` focus-visible color and `src/components/user_panel/premium.ts` primary button styling were aligned to the blue/sky user-panel accent.

## Current Dirty Worktree Notes

Before the redesign started, these files were already modified:

- `src/App.tsx`: `TelegramWebAppGuard` is commented out, causing an unused import lint error.
- `package-lock.json`: dependency lock changes exist.

Do not revert these unless the user explicitly asks.

## Current Lint Baseline

`npm run lint` fails before the user-panel redesign. Known baseline issues include:

- `generated_districts.ts`: parsing error.
- `src/App.tsx`: unused `TelegramWebAppGuard` due to the existing commented wrapper.
- Expected cargo and warehouse components: React hooks lint errors/warnings.
- UI primitives such as `badge.tsx`, `button.tsx`, and `form.tsx`: `react-refresh/only-export-components`.
- `src/hooks/useBroadcastChannel.ts`: refs and unused variable lint errors.
- `src/utils/audioUtils.ts`: explicit `any` lint errors.

Implementation should avoid adding new user-panel lint failures and should clearly report any remaining baseline failures after checks.
