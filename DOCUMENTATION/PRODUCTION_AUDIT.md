# EG Commerce - Production Audit

## 1. Overview
EG Commerce is currently a React/Vite frontend prototype demonstrating a rich social commerce experience (Reels, Marketplace, Unified Cart, Creator Studio, Merchant Dashboards, etc.). It uses local state (Context API) and IndexedDB (via `ReelsService.js`) to mock functionality. There is currently no backend, no real database, and no authentication.

## 2. Dependencies
- **Current stack:** React 19, Vite, Tailwind CSS (v3).
- **Missing production dependencies:** Supabase JS client (`@supabase/supabase-js`), routing library (currently using manual state-based routing), form handling (e.g., `react-hook-form`), and data fetching tools (e.g., `react-query` or `swr`).

## 3. Directory Structure & Architecture
- `src/components/`: Contains UI components (e.g., Header, Desktop views, Modals).
- `src/pages/`: Contains 14 distinct frontend screens (Reels, Marketplace, Checkout, etc.).
- `src/context/AppContext.jsx`: The central state store. It currently mocks the global state, cart, routing (`activeTab`), and language.
- `src/services/ReelsService.js`: An IndexedDB wrapper used to mock the persistence of Reel videos and UGC.

## 4. Feature Audit

### 4.1 Authentication & Authorization
- **Status:** Not implemented.
- **Current State:** The app operates in a single, god-mode session where the user can access buyer, creator, and merchant flows simultaneously. 
- **Required Action:** Implement Supabase Auth. Create `profiles` table and role-based access control (RLS). Protect merchant and creator routes.

### 4.2 Marketplace & Products
- **Status:** Mock data.
- **Current State:** Products and stores are hardcoded in the frontend components (e.g., `Marketplace.jsx`, `ProductDetail.jsx`). 
- **Required Action:** Create `merchants` and `products` tables in Supabase. Migrate hardcoded products to seed data. Update UI to fetch from Supabase.

### 4.3 Reels Engine & UGC
- **Status:** Partially implemented (Frontend + IndexedDB).
- **Current State:** Videos can be uploaded and viewed. State is saved to IndexedDB (`ReelsService.js`). 
- **Required Action:** Create `reels`, `reel_products`, `ugc_campaigns`, and `ugc_applications` tables. Move video storage to Supabase Storage. Move metadata to PostgreSQL. Add server-side status tracking.

### 4.4 Cart & Checkout
- **Status:** Frontend state only.
- **Current State:** Cart items are stored in `AppContext.jsx`. Checkout collects addresses but does not persist to a database or process real payments.
- **Required Action:** Create `carts`, `cart_items`, `orders`, and `order_items` tables. Implement server-side pricing validation to prevent tampering. Create an abstraction for payments.

### 4.5 Rewards & Analytics
- **Status:** Frontend state only.
- **Current State:** Points are hardcoded or managed in local state.
- **Required Action:** Create `reward_transactions` and `reel_conversions` tables. Move reward calculations to the backend to prevent frontend manipulation.

## 5. Next Steps
Based on this audit, the recommended execution strategy is:
1. **Phase 1 (Foundation):** Set up Supabase project, initialize Supabase JS client, and create the schema migrations for the core entities (Profiles, Merchants, Products).
2. **Phase 2 (Data Migration):** Move hardcoded products and default reels into a Supabase seed file.
3. **Phase 3 (Auth):** Implement Supabase Auth and RLS policies.
4. **Phase 4 (Integration):** Replace `AppContext` mocks and `ReelsService` IndexedDB with Supabase API calls.
5. **Phase 5 (Security & QA):** Enforce RLS, write E2E flows, and generate the final QA report.

## 6. Known Limitations
- No routing library is used (relies on `activeTab` state). This may need to be preserved to honor the "do not rewrite" constraint, or migrated to React Router if deep linking is required.
- No real payment credentials exist in the repository. Payment flows will need safe development-mode behavior.
- Bosta shipping integration is purely conceptual UI.
