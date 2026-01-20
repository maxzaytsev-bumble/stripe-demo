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

This is a Stripe checkout demo built on Next.js 15 (App Router) with **dual checkout modes** (hosted and custom):

1. **Product Fetching**: `/api/products` fetches active prices from Stripe (both recurring subscriptions and one-time purchases) and transforms them into a unified `Product` type
2. **Client Display**: `ProductDisplay` component uses SWR to fetch and cache products, separating them by type (subscription vs one-time)
3. **Checkout Flow** (dual mode):
   - **Hosted Checkout** (default): AJAX POST to `/api/create-checkout-session` → returns `{ url }` → redirects to Stripe-hosted page
   - **Custom Checkout** (feature flag): AJAX POST with `ui_mode=custom` → returns `{ client_secret, mode }` → redirects to `/checkout/custom` with embedded Stripe Elements
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

### Dual Checkout System

The app supports two checkout modes controlled by the `NEXT_PUBLIC_USE_CUSTOM_CHECKOUT` feature flag:

#### Hosted Checkout (Default - Flag OFF)

- Traditional Stripe-hosted checkout page
- AJAX POST to `/api/create-checkout-session` → returns `{ url: session.url }`
- Redirects to Stripe's domain for payment
- Returns to `/paywall?success=true&session_id=...` on success
- **Zero dependencies** beyond core `stripe` package

#### Custom Checkout (Experimental - Flag ON)

- Embedded Stripe Elements checkout on your domain
- AJAX POST with `ui_mode=custom` → returns `{ client_secret, mode }`
- Redirects to `/checkout/custom?client_secret=...&mode=...`
- Uses `CheckoutProvider` and `PaymentElement` from `@stripe/react-stripe-js`
- Returns to `/checkout/complete?session_id=...` on success
- **Requires**: `@stripe/stripe-js` (client-side Stripe) + `@stripe/react-stripe-js` (React components)

**Feature Flag Implementation:**

- `ProductCard` checks `useCustomCheckout()` from `lib/feature-flags.ts`
- Conditionally adds `ui_mode=custom` to FormData
- Routes to different completion pages based on mode
- **Both flows work simultaneously** - toggle flag to switch between them

### Component Structure

Components follow a modular pattern:

- Each component has its own directory with `.tsx` + `.module.css`
- Client components use `"use client"` directive (ProductDisplay, Paywall, CustomCheckoutForm, CheckoutComplete)
- Button component supports polymorphic rendering (`as="link"` or `as="button"`)

#### Custom Checkout Components (Feature Flag Only)

When `NEXT_PUBLIC_USE_CUSTOM_CHECKOUT=true`:

**`CustomCheckoutForm`** (`/checkout/custom` page):

- Uses `CheckoutProvider` from `@stripe/react-stripe-js/checkout`
- Renders `PaymentElement` component for card input
- Uses `useCheckout()` hook for session state and confirmation
- Email input with validation via `checkout.updateEmail()`
- Confirms payment via `checkout.confirm()` → redirects to return_url

**`CheckoutComplete`** (`/checkout/complete` page):

- Fetches session status via `/api/session-status?session_id=...`
- Displays payment confirmation with customer email and status
- Includes billing portal form (reuses existing portal logic)
- Handles loading and error states

**Routes:**

- `/checkout/custom` - Custom checkout page with Stripe Elements (client component)
- `/checkout/complete` - Success page after custom checkout
- `/api/session-status` - GET endpoint to fetch Stripe session status

**Client-Side Stripe Initialization:**

- `lib/stripe-client.ts` - Exports `getStripePromise()` using `loadStripe()` with publishable key
- Singleton pattern to avoid multiple Stripe instances

### Environment Variables

Required in `.env.local`:

- `STRIPE_SECRET_KEY`: Server-side Stripe API key (starts with `sk_`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Client-side Stripe publishable key (starts with `pk_`) - required for custom checkout
- `STRIPE_WEBHOOK_SECRET`: Webhook signature verification (starts with `whsec_`)
- `NEXT_PUBLIC_APP_URL`: Public app URL for redirect URLs
- `NEXT_PUBLIC_USE_CUSTOM_CHECKOUT`: Feature flag (`true`/`false`) - enables custom Stripe Elements checkout (default: `false`)

### Webhook Setup

The webhook endpoint expects:

1. Raw body for signature verification (`request.text()`)
2. `stripe-signature` header from Stripe
3. Handles subscription lifecycle events and active entitlement updates
4. Event handlers are currently stubbed (console.log only)

## Dependencies

### Core Dependencies

- `stripe` (^20.1.2): **Server-side only** - Node.js library for Stripe API (used in API routes)
- `@stripe/stripe-js` (^8.6.3): **Client-side only** - Loads Stripe.js with publishable key (browser-safe)
- `@stripe/react-stripe-js` (^5.4.1): **React components** - Provides `CheckoutProvider`, `PaymentElement`, `useCheckout()` hook

**Why three packages?**

- `stripe` cannot be used in browser (requires secret key)
- `@stripe/stripe-js` loads Stripe in browser with publishable key
- `@stripe/react-stripe-js` wraps Stripe.js with React components
- Custom checkout requires all three; hosted checkout only needs `stripe`

### Type Definitions

Extended types in `lib/stripe.ts`:

```typescript
// Response types for dual checkout
type HostedCheckoutResponse = { url: string };
type CustomCheckoutResponse = { client_secret: string; mode: string };
type CheckoutResponse = HostedCheckoutResponse | CustomCheckoutResponse;

// Session status from Stripe
type SessionStatus = {
  status: string;
  customer_email: string | null;
  payment_status: string;
};
```

## Path Aliases

The project uses `@/*` to reference root-level imports (configured in `tsconfig.json`):

```typescript
import { stripe } from "@/lib/stripe";
import { Button } from "@/components/Button/Button";
import { useCustomCheckout } from "@/lib/feature-flags";
import { getStripePromise } from "@/lib/stripe-client";
```
