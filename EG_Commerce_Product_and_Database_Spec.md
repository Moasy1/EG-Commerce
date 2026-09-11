# EG Commerce

## Product Overview

EG Commerce is an all-in-one e-commerce marketplace designed around a **content-first commerce experience**.

The platform combines:

- **Product Reels** for product discovery
- **Unified Marketplace** for browsing products from all merchants
- **Reward System** for customer loyalty and engagement
- **UGC Opportunities** connecting merchants with creators
- **Commerce Attribution** connecting content, creators, and purchases

### Core Commerce Loop

```text
Products
   ↓
Reels / Discovery
   ↓
Product Engagement
   ↓
Purchase
   ↓
Rewards
   ↓
UGC Opportunities
   ↓
More Content
   ↓
More Discovery & Sales
```

The goal is to build a marketplace where users do not only search for products; they **discover, engage, buy, earn, and create**.

---

# 1. Core User Experience

## Discover — Reels

Users can discover products through short-form vertical videos.

Key capabilities:

- Personalized product feed
- Swipe-based Reel experience
- Product tagging inside Reels
- Quick-buy product panel
- Like, share, and view tracking
- Product-to-Reel attribution
- Reels published by merchants, creators, or admins

## Shop — Unified Marketplace

A single marketplace where users can browse products from all merchants.

Key capabilities:

- Global product search
- Categories
- Filters and sorting
- Merchant/store pages
- Product detail pages
- Unified cart
- Checkout
- Order tracking

The marketplace should feel similar to an Amazon-style catalog while maintaining a stronger content/discovery layer.

## Earn — Reward System

Users earn points through defined activities.

Potential reward actions:

- Purchases
- Engagement
- Referrals
- Campaign participation
- Other platform-defined actions

The system should support:

- Points balance
- Reward history
- Vouchers / discounts
- Loyalty levels
- Referral rewards
- Redemption rules

## Create — UGC Opportunities

Users can become creators and participate in UGC campaigns launched by merchants.

Typical flow:

```text
Merchant creates campaign
        ↓
Creator discovers campaign
        ↓
Creator applies
        ↓
Merchant approves
        ↓
Product shipped / reward initiated
        ↓
Creator submits content
        ↓
Merchant reviews
        ↓
Content approved
        ↓
Creator receives payout
        ↓
Reel published / attributed
```

---

# 2. User Roles

## Buyer

Can:

- Browse Reels
- Browse marketplace
- Search products
- Add products to cart
- Purchase
- Earn and redeem rewards
- Engage with content
- Potentially become a creator

## Creator

Can:

- Maintain creator profile
- Browse UGC campaigns
- Apply to campaigns
- Receive products/rewards
- Submit content
- Receive payouts
- Publish/associate Reels
- Earn commissions from attributed sales

## Merchant

Can:

- Create and manage store
- Add products
- Manage inventory
- Publish product Reels
- Create UGC campaigns
- Review creator applications
- Approve/reject submitted content
- Define creator commissions
- Track sales and attribution

## Admin

Can:

- Manage users
- Manage merchants
- Manage creators
- Moderate products and Reels
- Manage UGC campaigns
- Manage rewards
- Monitor transactions
- Manage platform configuration

---

# 3. Database Architecture

The database design follows the principle of:

> **Single Database + Soft Tenancy using `merchant_id`**

This approach keeps all merchants inside one shared database while logically isolating merchant-owned data through `merchant_id`.

### Why this architecture?

It simplifies:

- Unified cart
- Global marketplace search
- Cross-merchant product discovery
- Reels-to-product relationships
- UGC campaign relationships
- Sales attribution
- Analytics

It also reduces query complexity compared with separate databases per merchant.

---

# 4. ERD Concept

```text
[Users] ──┬── (1:1) ─── [Merchants] ──── (1:N) ─── [Products] ──┬── (1:N) ── [ReelProducts]
          │                                           │         │
          ├── (1:1) ─── [Creators] ◄────────┐         │         └── (1:N) ── [UgcCampaigns]
          │                                  │         │                            │
          └── (1:N) ─── [Reels] ─────────────┼─────────┴────────────────────────────┼── (1:N) ── [UgcApplications]
                          │                  │                                      │
                          └──────────────────┴──────────────────────────────────────┘
```

---

# 5. Database Entities

## 5.1 Users & Profiles

### `users`

The main shared account for every platform user.

| Field | Type | Description |
|---|---|---|
| `id` | UUID / BigInt | Primary key |
| `phone` | String | User phone |
| `email` | String | User email |
| `password_hash` | String | Hashed password |
| `name` | String | User name |
| `role` | Enum | `buyer`, `creator`, `merchant`, `admin` |
| `reward_points_balance` | Integer | Current loyalty points balance |
| `created_at` | Timestamp | Creation date |
| `updated_at` | Timestamp | Last update |

### `merchants`

Merchant/store profile.

| Field | Type | Description |
|---|---|---|
| `id` | PK | Merchant ID |
| `user_id` | FK → `users.id` | Merchant owner |
| `store_name` | String | Store name |
| `slug` | String | Unique store URL/subdomain identifier |
| `commission_rate` | Decimal | Platform commission rate |
| `is_verified` | Boolean | Verification status |
| `created_at` | Timestamp | Creation date |
| `updated_at` | Timestamp | Last update |

Constraint:

- `user_id` should be Unique.

### `creators`

Creator / UGC profile.

| Field | Type | Description |
|---|---|---|
| `id` | PK | Creator ID |
| `user_id` | FK → `users.id` | Creator account |
| `bio` | Text | Creator biography |
| `social_links` | JSONB | Social profiles |
| `total_earnings` | Decimal | Total creator earnings |
| `rating` | Decimal | Average merchant rating |
| `created_at` | Timestamp | Creation date |
| `updated_at` | Timestamp | Last update |

Constraint:

- `user_id` should be Unique.

---

# 6. Catalog & Commerce Core

## `products`

Products listed by merchants.

| Field | Type | Description |
|---|---|---|
| `id` | PK | Product ID |
| `merchant_id` | FK → `merchants.id` | Product owner |
| `title` | String | Product title |
| `slug` | String | Product URL slug |
| `description` | Text | Product description |
| `base_price` | Decimal | Original price |
| `sale_price` | Decimal | Current sale price |
| `stock_quantity` | Integer | Available stock |
| `affiliate_commission_rate` | Decimal | Creator commission per sale |
| `status` | Enum | `draft`, `active`, `archived` |
| `created_at` | Timestamp | Creation date |
| `updated_at` | Timestamp | Last update |

---

# 7. Reels Engine

## `reels`

Short-form videos uploaded by merchants, creators, or admins.

| Field | Type | Description |
|---|---|---|
| `id` | PK | Reel ID |
| `creator_id` | FK → `creators.id` | Nullable when not creator-published |
| `merchant_id` | FK → `merchants.id` | Nullable when not merchant-published |
| `campaign_application_id` | FK → `ugc_applications.id` | Nullable when not UGC-generated |
| `video_provider_id` | String | Cloudflare Stream / Mux video ID |
| `thumbnail_url` | String | Thumbnail |
| `caption` | Text | Reel caption |
| `views_count` | Integer | Views |
| `likes_count` | Integer | Likes |
| `shares_count` | Integer | Shares |
| `status` | Enum | `processing`, `active`, `flagged`, `rejected` |
| `created_at` | Timestamp | Creation date |
| `updated_at` | Timestamp | Last update |

A Reel can be associated with either a creator, merchant, or approved UGC application depending on its source.

## `reel_products`

Many-to-many relationship between Reels and products.

| Field | Type | Description |
|---|---|---|
| `id` | PK | ID |
| `reel_id` | FK → `reels.id` | Reel |
| `product_id` | FK → `products.id` | Product |
| `display_order` | Integer | Product order in Quick Buy panel |

Indexes:

- `reel_id`
- `product_id`

---

# 8. UGC & Creator Collaboration Engine

## `ugc_campaigns`

Campaigns launched by merchants to request creator content.

| Field | Type | Description |
|---|---|---|
| `id` | PK | Campaign ID |
| `merchant_id` | FK → `merchants.id` | Campaign owner |
| `product_id` | FK → `products.id` | Promoted product |
| `title` | String | Campaign title |
| `brief_requirements` | Text | Content requirements |
| `reward_type` | Enum | `free_product`, `fixed_pay`, `commission_only`, `hybrid` |
| `fixed_reward_amount` | Decimal | Fixed creator reward |
| `slots_available` | Integer | Required creator count |
| `status` | Enum | `open`, `in_progress`, `completed`, `cancelled` |
| `created_at` | Timestamp | Creation date |
| `updated_at` | Timestamp | Last update |

## `ugc_applications`

Creator applications to UGC campaigns.

| Field | Type | Description |
|---|---|---|
| `id` | PK | Application ID |
| `campaign_id` | FK → `ugc_campaigns.id` | Campaign |
| `creator_id` | FK → `creators.id` | Creator |
| `status` | Enum | `applied`, `product_shipped`, `content_submitted`, `approved`, `rejected` |
| `draft_video_url` | String | Draft content |
| `brand_feedback` | Text | Merchant feedback |
| `payout_status` | Enum | `pending`, `escrowed`, `released`, `refunded` |
| `created_at` | Timestamp | Application date |
| `updated_at` | Timestamp | Last update |

---

# 9. Attribution & Sales Analytics

## `reel_conversions`

Tracks sales generated from a Reel so creator commissions can be calculated.

| Field | Type | Description |
|---|---|---|
| `id` | PK | Conversion ID |
| `reel_id` | FK → `reels.id` | Source Reel |
| `order_item_id` | FK → `order_items.id` | Converted order item |
| `creator_id` | FK → `creators.id` | Credited creator |
| `commission_amount` | Decimal | Creator commission |
| `status` | Enum | `pending_fulfillment`, `credited`, `cancelled_refund` |
| `created_at` | Timestamp | Conversion date |

---

# 10. Commerce Entities Required for MVP

The current ERD references commerce tables that should also be implemented.

## `carts`

Unified shopping cart for a user.

Recommended fields:

- `id`
- `user_id`
- `status`
- `created_at`
- `updated_at`

## `cart_items`

Products from multiple merchants can exist in the same cart.

Recommended fields:

- `id`
- `cart_id`
- `product_id`
- `merchant_id`
- `quantity`
- `unit_price`

This is one of the main benefits of the single-database architecture.

## `orders`

The customer's unified order.

Recommended fields:

- `id`
- `user_id`
- `status`
- `subtotal`
- `discount_amount`
- `shipping_amount`
- `total_amount`
- `reward_points_used`
- `reward_points_earned`
- `created_at`
- `updated_at`

## `order_items`

Individual products within an order.

Recommended fields:

- `id`
- `order_id`
- `product_id`
- `merchant_id`
- `quantity`
- `unit_price`
- `creator_id` nullable
- `commission_amount`
- `status`

`order_items` is intentionally merchant-aware so a single order can contain products from multiple merchants while maintaining correct merchant ownership and attribution.

---

# 11. Reward System

The `reward_points_balance` on `users` should be treated as the current balance/cache.

A separate transaction ledger is recommended.

## `reward_transactions`

| Field | Type | Description |
|---|---|---|
| `id` | PK | Transaction ID |
| `user_id` | FK → `users.id` | User |
| `type` | Enum | Earn / redeem / adjustment / refund |
| `points` | Integer | Points change |
| `reference_type` | String | Source entity |
| `reference_id` | UUID | Source record |
| `description` | Text | Transaction reason |
| `created_at` | Timestamp | Transaction date |

This prevents reward history from being lost and makes balances auditable.

---

# 12. Recommended Additional Tables

The initial schema should eventually expand to support the full platform.

### Marketplace

- `categories`
- `product_categories`
- `product_images`
- `product_variants`
- `product_attributes`

### Reels

- `reel_likes`
- `reel_views`
- `reel_shares`
- `reel_saves`

### Creators

- `creator_social_accounts`
- `creator_payout_accounts`
- `creator_campaign_metrics`

### UGC

- `ugc_campaign_products` if campaigns support multiple products
- `ugc_submissions`
- `ugc_reviews`

### Orders

- `payments`
- `shipments`
- `refunds`
- `addresses`

### Rewards

- `reward_catalog`
- `reward_redemptions`
- `referrals`

### Merchant

- `merchant_settings`
- `merchant_users` if multiple staff members are supported

### Platform

- `notifications`
- `reports`
- `moderation_actions`
- `audit_logs`

---

# 13. Indexing Strategy

The following indexes are important for performance.

## Reels Feed

```sql
CREATE INDEX idx_reels_status_created
ON reels(status, created_at DESC);
```

Used for:

- General Reel feed
- Latest content retrieval
- Active content filtering

## Reel Products

```sql
CREATE INDEX idx_reel_products_reel
ON reel_products(reel_id);
```

Used to retrieve products immediately when a Reel is displayed.

Also recommended:

```sql
CREATE INDEX idx_reel_products_product
ON reel_products(product_id);
```

## Products by Merchant

```sql
CREATE INDEX idx_products_merchant
ON products(merchant_id);
```

Used for:

- Merchant storefronts
- Merchant catalog
- Subdomain/store pages

## Product Search

For PostgreSQL, consider:

- Full-text search indexes
- `GIN` indexes for searchable text
- Trigram indexes for fuzzy matching

Example concept:

```sql
CREATE INDEX idx_products_search
ON products
USING GIN (
  to_tsvector('simple', title || ' ' || description)
);
```

---

# 14. Data Ownership Rules

Because EG Commerce uses Soft Tenancy:

### Merchant-owned entities

Must carry `merchant_id` directly or be traceable through a parent entity.

Examples:

- Products
- UGC Campaigns
- Merchant Reels
- Orders / Order Items
- Merchant settings

### Platform-wide entities

Do not require `merchant_id`.

Examples:

- Users
- Categories
- Rewards configuration
- Notifications

### Critical rule

Every merchant-facing query must enforce merchant ownership.

Example:

```sql
SELECT *
FROM products
WHERE merchant_id = :merchant_id
  AND status = 'active';
```

Never rely only on frontend filtering for tenancy/security.

---

# 15. Important Architectural Considerations

## Unified Cart

The architecture must allow:

```text
User
 └── Cart
      ├── Merchant A Product
      ├── Merchant B Product
      └── Merchant C Product
```

The checkout/order system then splits fulfillment logically by merchant while maintaining one customer-facing order.

## Content Attribution

A purchase can originate from:

```text
Reel
 ↓
Product
 ↓
Order Item
 ↓
Creator
 ↓
Commission
```

This relationship is central to the business model.

## UGC Attribution

A Reel can originate from:

```text
UGC Campaign
 ↓
UGC Application
 ↓
Creator
 ↓
Reel
 ↓
Product
 ↓
Order
```

This enables performance-based creator economics.

---

# 16. Suggested MVP Scope

The first release should focus on the smallest version that validates the business model.

### Buyer

- Registration/login
- Marketplace
- Product search
- Product pages
- Unified cart
- Checkout
- Orders
- Reels
- Rewards balance

### Merchant

- Merchant registration
- Store profile
- Product CRUD
- Inventory
- Reels upload
- UGC campaign creation
- Campaign/application management
- Orders

### Creator

- Creator profile
- Campaign discovery
- Campaign applications
- Content submission
- Approved Reel publishing
- Earnings

### Admin

- User management
- Merchant management
- Creator management
- Product moderation
- Reel moderation
- UGC moderation
- Orders
- Rewards
- Basic analytics

---

# 17. Product Vision

EG Commerce should not be positioned internally as just another e-commerce marketplace.

The product architecture is built around three connected engines:

```text
       DISCOVERY
          │
        Reels
          │
          ▼
       COMMERCE
          │
      Marketplace
          │
          ▼
       CREATION
          │
       UGC / Creators
          │
          └──────────────┐
                         ▼
                    More Content
                         │
                         ▼
                    More Discovery
```

The strategic advantage is the connection between:

**Content → Commerce → Rewards → Creators → Content**

That loop is the foundation of EG Commerce.
