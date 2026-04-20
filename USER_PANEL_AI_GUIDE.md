# AKBcargo User Panel AI Guide

Last updated: 2026-04-16

This document is for AI agents and developers who will continue work on the AKBcargo regular user panel. It intentionally focuses only on user-facing pages and components. Admin, warehouse, verification, POS, manager, and expected-cargo flows are out of scope unless a shared shell or UI primitive directly affects the user panel.

## Goal

The current user-panel task is a UI/UX redesign only. Logic, APIs, route names, query keys, validation schemas, i18n keys, and storage behavior must stay stable.

Design direction is premium minimal with a calm neutral base and blue/sky accents:

- Clean surfaces with small radius, usually `rounded-lg` or smaller.
- Soft neutral or cyan/sky page backgrounds using linear backgrounds, not blurred decorative orbs.
- Compact action cards and stable mobile layouts.
- Avoid returning to the old orange/yellow, purple-heavy, large rounded/glassy design.
- Keep user-facing text through existing i18n keys. Do not invent hardcoded product copy unless an existing component already does that.

## Stack

- Vite
- React 19
- TypeScript strict mode
- Tailwind CSS 4
- shadcn-style local UI primitives
- Framer Motion
- TanStack Query
- lucide-react
- i18next
- Sonner

Important commands:

```powershell
npm run dev
npm run lint
npm run build
npx vite build
```

## Routing And Auth

Routing is controlled manually in `src/App.tsx`. This project does not use React Router route components for these pages.

Regular user pages:

- `user-home` -> `/user/home`
- `user-profile` -> `/user/profile`
- `user-reports` -> `/user/reports`
- `user-history` -> `/user/history`
- `login` -> `/auth/login`
- `register` -> `/auth/register`

Regular user auth:

- Regular user token is stored in `sessionStorage` under `access_token`.
- Admin tokens and admin role are stored in `localStorage`.
- Do not mix user auth with admin auth.
- Do not change redirect behavior or `ROLE_CONFIG` unless the task is explicitly about routing or auth.

Known dirty baseline:

- `src/App.tsx` currently has `TelegramWebAppGuard` imported but wrapper commented out. This causes `npm run build` and `npm run lint` to fail with an unused import error. Do not fix or revert this unless explicitly asked, because it was already dirty before the redesign work.
- `package-lock.json` also has pre-existing changes. Do not revert it unless explicitly asked.

## Main User Panel Files

### Entry And Shell

- `src/App.tsx`
  - Owns page state, access checks, path mapping, nav shell rendering, login/logout routing.
  - User shell background was changed from orange/amber blobs to cyan/sky neutral background.
  - Do not change route names, access checks, token storage, or role logic for UI-only tasks.

- `src/index.css`
  - Global Tailwind setup and CSS variables.
  - Body background is cyan-tinted for user-panel look.
  - Global focus-visible ring still uses existing project styling.

- `src/components/ui/UniqueBackground.tsx`
  - Shared user-panel background layer.
  - Uses cyan/sky linear background and subtle grid.
  - Do not add blurred orbs or one-note purple/orange gradients.

- `src/components/user_panel/premium.ts`
  - Shared class-string constants for user panel UI.
  - Includes `userPanelPage`, `premiumSurface`, `premiumInput`, button classes, and text helpers.
  - Prefer reusing these constants when adding new user-panel surfaces.

### Auth Forms

- `src/components/LoginForm.tsx`
  - Regular user login UI.
  - Uses Telegram WebApp data and auth service.
  - Preserve login payloads, validation, session storage, and callbacks.

- `src/components/RegistrationForm.tsx`
  - Regular user registration UI.
  - Preserve form schema, request payload, Telegram behavior, and navigation callbacks.

- `src/components/NavigationBar.tsx`
  - Top global nav used outside admin area.
  - It is hidden on user pages through `HIDDEN_PAGES`, but can still affect login/register and non-admin pages.
  - Be careful with z-index and top spacing when working on user pages.

### User Home

- `src/pages/UserHome.tsx`
  - Thin wrapper around `Dashboard`.
  - Do not add logic here unless there is a very specific reason.

- `src/pages/Dashboard.tsx`
  - Main user home experience.
  - Owns tabs: home, track, schedule, request, delivery history.
  - Owns carousel, quick search, service action cards, beta badge, and modals.
  - Uses `getActiveCarouselItems`, `trackCarouselView`, and `trackCarouselClick`.
  - Uses lazy-loaded pages/modals:
    - `DeliveryRequestPage`
    - `DeliveryHistoryPage`
    - `FlightSchedulePage`
    - `ChinaAddressModal`
    - `MakePaymentModal`
    - `CalculatorModal`
    - `ProhibitedItemsModal`

User home redesign notes:

- Home flow:
  - Home should feel like a focused first screen, not a full duplicate of the bottom navigation.
  - Keep the visible home flow tight: quick track search, service launchpad, important carousel, feedback.
  - Do not re-add "my cargo" or "payment history" shortcut cards to Home because those destinations already exist in the user nav.

- Carousel:
  - Old horizontal scroll/snap carousel is no longer the target design.
  - The current user home carousel is a cube-style single-card rotator in `src/pages/Dashboard.tsx`.
  - It uses `activeCarouselIndex`, `carouselDirection`, `AnimatePresence`, and Framer Motion rotate/slide variants.
  - It should not use `AnimatePresence mode="wait"` or exposed stacked background cards, because that made the empty/back layer visible during transitions.
  - API media cards preserve media, click, view tracking, gallery behavior, and action URLs.
  - View tracking is guarded with `viewedCarouselIdsRef` so auto-rotation does not repeatedly track the same API item.
  - Carousel touch handlers stop propagation so swiping the cube changes carousel cards instead of switching dashboard tabs.
  - Dark mode icon contrast is handled by overriding child SVG color in the icon wrapper.

- Tabs:
  - Header tab active state uses Framer Motion `layoutId` spring animation.
  - `motion` must stay imported from `framer-motion` if the tab active background uses `motion.span`.
  - A missing `motion` import broke UserHome previously; check this first if UserHome stops opening.

- Beta badge:
  - Must not overlap top nav/logo.
  - It lives in dashboard content flow after header tabs, aligned right.
  - Do not move it back to fixed or absolute top navbar area.

- Section titles:
  - Home section titles use compact numbered labels through `SectionTitle`.
  - Do not restore the old vertical colored bars.

- Service action buttons:
  - Rendered as an asymmetric mosaic, not an equal two-column card grid.
  - `ActionButton` sizes are intentionally mixed: hero-wide, tall, slim, and full-width strip layouts.
  - Do not return to one-per-row large cards or equal-size two-column cards unless the user explicitly asks.

- Background:
  - Cyan/sky linear background through local `UniqueBackground` inside Dashboard.
  - Keep it consistent with shared `src/components/ui/UniqueBackground.tsx`.

### User Home Components

- `src/components/user_page/ActionButtons.tsx`
  - Main service/action card component for Dashboard services.
  - Uses `ACTION_LAYOUTS` internally to create mixed button sizes without changing the public `ActionItemData` contract.
  - The dashboard parent grid should stay `grid-cols-4` so the mosaic spans work.
  - Uses CSS variable theme classes.
  - Logic contract: accepts `item` and optional `onClick`; keep `ActionItemData` stable.

- `src/components/user_page/NavigatorButtons.tsx`
  - User-page related navigation component if referenced by future flows.
  - Not central to the current redesign, but still in user panel scope.

### Track Code

- `src/pages/dashboard/TrackCodeTab.tsx`
  - User cargo tracking search tab.
  - Uses `trackCargo` from `src/api/services/cargo.ts`.
  - Uses TanStack Query key `["trackCargo", activeSearch]`.
  - Uses localStorage history key `track_code_history_v2`.
  - Uses `ClientCargoHistory` for cargo history view.
  - Do not change history storage shape, query key, enabled condition, or search flow unless requested.

- `src/pages/dashboard/components/TrackResultCard.tsx`
  - Expandable track result card.
  - Shows status chips, stepper, cargo details, and financial values.
  - Uses `TrackCodeSearchResponse`.
  - Keep date formatting and item data access unchanged unless the API changes.

### User Profile

- `src/pages/UserPage.tsx`
  - User profile route.
  - Uses `useProfile` and `useLogout`.
  - Renders profile hero, quick actions, personal info, session history, wallet/cards/passport modals, edit modal, logout modal.
  - Top clearance was increased so profile card does not collide with navbar.
  - Do not reduce top spacing in a way that lets the card sit under navigation.

- `src/components/profile/ProfileHero.tsx`
  - Avatar, user name, client code copy, wallet/debt summary.
  - Avatar card was moved lower, but must remain fully visible under top nav.
  - Uses wallet balance query key `['walletBalance']` and `walletService.getWalletBalance`.
  - Do not change wallet semantics: debt is negative, displayed as absolute debt value.

- `src/components/profile/QuickActions.tsx`
  - Opens wallet, cards, and extra passports flows.

- `src/components/profile/PersonalInfo.tsx`
  - Displays user profile fields.

- `src/components/profile/SessionHistory.tsx`
  - Displays login/session activity.

- `src/components/profile/EditProfileModal.tsx`
  - Profile edit modal.
  - Preserve submit/update service behavior.

- `src/components/profile/ExtraPassportsModal.tsx`
  - Extra passport upload/list modal.
  - Preserve passport service calls.

- `src/components/profile/InfoRow.tsx`
  - Small profile helper component.

- `src/components/profile/PaymentReminders.tsx`
  - Profile-related payment reminder UI if used.

### Wallet And Payment

- `src/components/wallet/WalletModal.tsx`
  - Wallet balance/debt/payment entry UI.
  - Uses wallet service and may open payment paths.

- `src/components/wallet/CardsManagerModal.tsx`
  - User cards manager modal.

- `src/components/modals/MakePaymentModal.tsx`
  - Payment modal used from Dashboard, WalletModal, and Reports.
  - Preserve service calls, payment payloads, modal props, and callbacks.

### Reports And Payment History

- `src/pages/UserReportsPage.tsx`
  - User cargo reports page.
  - Uses report service and can open payment flow.
  - Root background is cyan/sky.
  - Keep report list/detail/payment semantics intact.

- `src/pages/UserHistoryPage.tsx`
  - User payment history page.
  - Root background is cyan/sky.
  - Preserve pagination, API query, and back navigation.

### Delivery And Flight Pages

- `src/components/pages/DeliveryRequestPage.tsx`
  - Multi-step delivery request UI.
  - Preserve delivery service calls, form state, validation logic, and callbacks.
  - Known lint baseline has missing `t` dependency warnings in this file.

- `src/components/pages/DeliveryHistoryPage.tsx`
  - Delivery history UI.
  - Preserve API calls and status mapping.
  - Known lint baseline has missing `t` dependency warning in this file.

- `src/components/pages/FlightSchedulePage.tsx`
  - Flight schedule user view.
  - Preserve calendar URL generation and navigation callbacks.

### Navigation

- `src/components/navigation/UserNav.tsx`
  - Builds user bottom/top floating nav items.
  - Routes to `user-home`, `user-reports`, `user-history`, `user-profile`.

- `src/components/navigation/FloatingNavbar.tsx`
  - Shared floating nav renderer.
  - Current design is an asymmetric dock, not a segmented control.
  - Active/bosilgan button is a longer elevated blue button with white icon/text.
  - Inactive buttons are smaller separate white squares with staggered vertical offsets.
  - Active movement uses a shared Framer Motion `layoutId` spring; keep the props API stable.
  - Keep `FloatingNavItem` and props stable.

## APIs And Hooks To Preserve

Do not alter public service names, request shapes, response shapes, TanStack Query keys, mutations, or storage behavior during UI-only work.

User panel API boundaries:

- `src/api/services/auth.ts`
- `src/hooks/useProfile.ts`
- `src/api/services/reportService.ts`
- `src/api/services/paymentService.ts`
- `src/api/services/deliveryService.ts`
- `src/api/services/walletService.ts`
- `src/api/services/passportService.ts`
- `src/api/services/cargo.ts`
- `src/api/services/carousel.ts`

Important storage keys:

- User auth token: `sessionStorage.access_token`
- Admin token: `localStorage.access_token`
- Admin role: `localStorage.admin_role`
- Track search history: `localStorage.track_code_history_v2`

Important query keys observed in user panel:

- `['carousel-items']`
- `['walletBalance']`
- `['trackCargo', activeSearch]`

There are more query keys in delivery, reports, wallet, and profile hooks. Read those files before editing their flows.

## Work Completed So Far

Created:

- `PROJECT_NOTES.md`
- `USER_PANEL_AI_GUIDE.md`
- `src/components/user_panel/premium.ts`

Main redesign changes completed:

- Login and register forms restyled to the premium minimal direction.
- Top/global navigation and floating user navigation restyled.
- User home background moved from orange/amber to cyan/sky.
- Dashboard carousel redesigned away from old full-gradient cards.
- Dashboard beta badge restyled and moved into content flow to avoid nav/logo overlap.
- Dashboard tabs changed to Framer Motion spring active indicator.
- Dashboard section titles changed to compact numbered labels.
- Dashboard services changed to an asymmetric mosaic launchpad.
- Home report/payment shortcut cards were removed because reports and payment history are already available in the user navigation.
- Track-code search and result card redesigned away from purple-heavy UI.
- Profile page, hero, wallet/card/passport/edit/session components restyled.
- UserPage top spacing adjusted so hero card does not clip under navigation.
- Wallet, cards, extra passports, make payment, delivery request/history, and flight schedule views restyled in the user-panel visual language.
- Shared `UniqueBackground` changed to cyan/sky linear background with subtle grid.
- App user shell background changed to cyan/sky and old orange/amber blob layer removed.

## Current Verification State

Targeted user-panel lint has passed for recently changed user-panel files in prior checks.

`npx vite build` passed after the latest UserHome fix. It still prints existing bundle/chunk warnings such as dynamic imports also being statically imported and large chunks over 500 kB.

`npm run build` currently fails because of the pre-existing dirty `src/App.tsx` unused `TelegramWebAppGuard` import. This is not a UserHome or Dashboard runtime issue.

`npm run lint` currently fails on known baseline issues outside the user-panel UI work:

- `generated_districts.ts` parse error.
- `src/App.tsx` unused `TelegramWebAppGuard`.
- Expected cargo and warehouse hook/compiler lint issues.
- `src/components/ui/badge.tsx`, `button.tsx`, `form.tsx` fast-refresh export warnings/errors.
- `src/hooks/useBroadcastChannel.ts` refs and unused variable lint errors.
- `src/utils/audioUtils.ts` explicit `any` lint errors.
- Delivery pages have existing missing `t` dependency warnings.

When reporting verification, separate user-panel targeted checks from global baseline failures.

## Safe Change Rules For Future Agents

Follow these rules unless the user explicitly requests otherwise:

- UI-only task means no API/service/schema/query/storage/route changes.
- Preserve all props and callback names for user-panel components.
- Preserve all i18n keys.
- Preserve TanStack Query keys unless the task is specifically about cache behavior.
- Keep user page root backgrounds cyan/sky based.
- Keep card radius modest: prefer `rounded-lg` or smaller.
- Avoid old orange/yellow and purple-heavy themes.
- Avoid decorative blurred orbs.
- Do not reintroduce old carousel gradient-banner style.
- Do not reintroduce horizontal overflow/snap carousel on UserHome; keep the cube-style card rotator unless the user explicitly asks otherwise.
- Do not add exposed background stack layers or `mode="wait"` to the carousel transition.
- Do not add Home shortcut cards for reports/payment history while those flows remain in the user nav.
- Do not reintroduce one-per-row large service cards or equal-size service grids.
- Do not change the floating user nav back to dark/glass pill styling or a segmented bar; it should remain an asymmetric dock with a blue active state.
- Do not move beta badge into the navbar/top absolute zone.
- Do not reduce UserPage top clearance so the hero card clips under nav.
- If using Framer Motion in a component, import `motion` from `framer-motion`. A missing `motion` import previously broke UserHome.
- Respect dirty files. Never revert `src/App.tsx`, `package-lock.json`, or unrelated user changes unless explicitly asked.

## Recommended Workflow For Next Tasks

1. Read this file.
2. Read `PROJECT_NOTES.md`.
3. Inspect the specific target component and its service/hook dependencies.
4. Make UI-only changes with `apply_patch`.
5. Run targeted lint for changed TS/TSX files.
6. Run `git diff --check`.
7. Run `npx vite build`.
8. If asked for global checks, run `npm run lint` or `npm run build`, but report known baseline failures separately.

Suggested targeted checks:

```powershell
npx eslint src\pages\Dashboard.tsx src\pages\UserPage.tsx src\pages\UserReportsPage.tsx src\pages\UserHistoryPage.tsx
git diff --check
npx vite build
```

## Quick Troubleshooting

UserHome does not open:

- Check `src/pages/Dashboard.tsx` first.
- If tabs use `motion.span`, confirm `import { motion } from "framer-motion";` exists.
- Run `npx eslint src\pages\Dashboard.tsx`.
- Run `npx vite build`.

Dark mode carousel icons disappear:

- Check static carousel icon wrapper in `CarouselCard`.
- Child SVGs may carry their own text color classes. Use Tailwind child selector overrides such as `[&_svg]:text-white` and `dark:[&_svg]:text-cyan-950`.

Beta overlaps logo/navbar:

- Keep `BetaBadge` in dashboard content flow after `HeaderTabs`.
- Avoid `fixed`, `absolute top-4`, or navbar z-index zones.

UserPage card clips under nav:

- Check the outer layout top padding in `src/pages/UserPage.tsx`.
- Keep enough `pt-*` clearance before `ProfileHero`.

Global build fails on `TelegramWebAppGuard`:

- This is a known dirty baseline in `src/App.tsx`.
- Do not fix it unless the user explicitly authorizes changing that dirty state.
