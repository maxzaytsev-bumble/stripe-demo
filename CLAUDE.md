# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application

```bash
npm run dev          # Start development server at http://localhost:3000
npm run build        # Create production build
npm start            # Start production server
```

### Code Quality

```bash
npm run lint         # Run ESLint on codebase
npx prettier --write <file>      # Format specific file
npx stylelint --fix <file>       # Lint and fix CSS files
```

### Git Hooks

- Pre-commit hook automatically runs `lint-staged` which formats and lints staged files
- TypeScript/TSX files: ESLint + Prettier
- CSS files: Stylelint + Prettier
- JSON/MD files: Prettier

## Architecture Overview

### Stripe Integration Pattern

This is a Stripe checkout demo built on Next.js 15 (App Router). The core pattern:

1. **Product Fetching**: `/api/products` fetches active prices from Stripe (both recurring subscriptions and one-time purchases) and transforms them into a unified `Product` type
2. **Client Display**: `ProductDisplay` component uses SWR to fetch and cache products, separating them by type (subscription vs one-time)
3. **Checkout Flow**: AJAX POST to `/api/create-checkout-session` with `price_id`, which creates a Stripe Checkout session and returns the URL as JSON for client-side redirect
4. **Webhook Handling**: `/api/webhook` receives Stripe events (subscription lifecycle, entitlements) with signature verification

### Key Type: Product

The central type lives in `lib/stripe.ts`:

- Combines Stripe `Product` + `Price` data
- Supports both `recurring` (subscriptions) and `one_time` (purchases)
- Used across API routes and client components

### Data Flow with SWR

- `lib/fetcher.ts`: Generic SWR fetcher with error handling
- Products are fetched client-side and cached by SWR
- No server-side data fetching for products (all client-side)

### AJAX-Based Checkout

Product checkout uses AJAX (`fetch`) to submit to API routes, providing enhanced UX:

- Loading states during checkout session creation
- Client-side error handling and display
- Prevents double-submissions with disabled button state
- API returns JSON `{ url: session.url }`, client redirects via `window.location.href`
- Better user feedback compared to native form submission

### Component Structure

Components follow a modular pattern:

- Each component has its own directory with `.tsx` + `.module.css`
- Client components use `"use client"` directive (ProductDisplay, Paywall)
- Button component supports polymorphic rendering (`as="link"` or `as="button"`)

### Environment Variables

Required in `.env.local`:

- `STRIPE_SECRET_KEY`: Server-side Stripe API key (starts with `sk_`)
- `STRIPE_WEBHOOK_SECRET`: Webhook signature verification (starts with `whsec_`)
- `NEXT_PUBLIC_APP_URL`: Public app URL for redirect URLs

### Webhook Setup

The webhook endpoint expects:

1. Raw body for signature verification (`request.text()`)
2. `stripe-signature` header from Stripe
3. Handles subscription lifecycle events and active entitlement updates
4. Event handlers are currently stubbed (console.log only)

## Path Aliases

The project uses `@/*` to reference root-level imports (configured in `tsconfig.json`):

```typescript
import { stripe } from "@/lib/stripe";
import { Button } from "@/components/Button/Button";
```
