# 🇪🇬 EG-Commerce Platform Documentation
**B2B SaaS Multi-Tenant Storefront Builder + B2C Video-First Social Commerce Marketplace**

---

## 📌 Executive Summary

**EG-Commerce** is a next-generation hybrid commerce platform tailored specifically for the Egyptian and MENA retail ecosystem. It blends the merchant independence of **Shopify / Salla** with the organic discovery power of **TikTok Shop**.

### The Core Problem It Solves:
1. **The Merchant Dilemma:** Creating a standalone website usually yields low organic traffic, high customer acquisition costs (CAC), and complex integration with local payment/logistics services.
2. **The Social Selling Bottleneck:** Selling via Instagram DMs and WhatsApp groups lacks order tracking, automated inventory syndication, thermal shipping label printing, and formal payment verification.
3. **The Solution:** EG-Commerce gives every merchant their own standalone, white-label, customized boutique on a dedicated subdomain (e.g., `talieska.eg-commerce.com`) or custom domain (e.g., `shop.talieskastudio.com`), while simultaneously allowing them to syndicate selected inventory to EG-Commerce's centralized **Reels & Discovery Marketplace** with automated creator affiliate commissions.

---

## 🏗️ System Architecture & Multi-Tenancy

```
                              ┌────────────────────────────────────────────────────────┐
                              │                 EG-Commerce Domain Gateway             │
                              └───────────────────────────┬────────────────────────────┘
                                                          │
                    ┌─────────────────────────────────────┴─────────────────────────────────────┐
                    ▼                                                                           ▼
┌──────────────────────────────────────┐                                    ┌──────────────────────────────────────┐
│  B2C Central Social Marketplace      │                                    │  B2B Multi-Tenant Merchant Engine    │
│  eg-commerce.vercel.app              │                                    │  {subdomain}.eg-commerce.com         │
│  shop.eg-commerce.com                │                                    │  custom-domain.com (CNAME SSL)       │
├──────────────────────────────────────┤                                    ├──────────────────────────────────────┤
│ • 9:16 Shoppable Reels Feed          │                                    │ • Fully Custom Storefront Layout     │
│ • Unified Cross-Brand Search         │                                    │ • Dynamic Theme Modes (Dark/Light)   │
│ • Shared Multi-Merchant Cart         │                                    │ • Custom Accent Colors & Typography  │
│ • Creator UGC Collaboration Hub      │                                    │ • Direct WhatsApp & Hotline Support  │
│ • Tiered Rewards & Loyalty (Points)  │                                    │ • Dedicated Brand Story & Heritage   │
└──────────────────┬───────────────────┘                                    └──────────────────┬───────────────────┘
                   │                                                                           │
                   │               ┌──────────────────────────────────────────┐                │
                   └──────────────►│    Syndication & Attribution Pipeline    │◄───────────────┘
                                   │ • is_marketplace_syndicated toggle       │
                                   │ • Creator affiliate commission (10%-30%) │
                                   │ • Real-time order & revenue analytics    │
                                   └────────────────────┬─────────────────────┘
                                                        │
                                   ┌────────────────────▼─────────────────────┐
                                   │    Egyptian Logistics & Payments Layer   │
                                   │ • Bosta Express Thermal AWB Generation   │
                                   │ • InstaPay Bank Transfer Verification    │
                                   │ • Cash On Delivery (COD) with Inspection │
                                   └──────────────────────────────────────────┘
```

---

## 🌟 Core Modules & Capabilities

### 1. B2C Video-First Social Marketplace
- **Shoppable 9:16 Reels Feed:** Full-screen mobile-optimized vertical video reels featuring Egyptian fashion designers, artisans, and style influencers.
- **Product Pin Overlay & Quick Buy:** Instant checkout drawer without leaving the video stream.
- **Creator Attribution:** Every sale generated via a reel automatically tracks and credits the content creator.
- **Multi-Merchant Unified Cart:** Customers can bundle items from multiple boutiques into a single checkout flow.
- **EG Rewards Loyalty Program:** Customers earn points on orders, reviews, and community shares (Silver, Gold, Platinum tiers) redeemable for cash discounts.

---

### 2. Standalone Merchant Boutique (Storefront)
Each registered merchant receives an independent boutique featuring:
1. **Top Subdomain & Platform Bar:** Displays verified subdomain (e.g., `talieska.eg-commerce.com`), SSL status, and quick role switchers.
2. **Merchant Announcement Bar:** Highlights active promotions, promo codes, and discount percentages.
3. **Custom Branded Header:** High-res logo, verified brand checkmark, sub-navigation pills, and direct WhatsApp chat trigger.
4. **Dynamic Hero Section:** Supports 3 distinct layout styles:
   - *Wide Cinema:* Full-bleed background imagery with gradient overlays and overlay CTAs.
   - *Split Editorial:* Two-column layout with editorial brand narrative on one side and high-res photography on the other.
   - *Minimal Card:* Centered minimalist card layout with concise call-to-actions.
5. **Trust Pillars (Icon Boxes):** Highlights quality standards (e.g., 100% Egyptian cotton/linen, 48h express delivery, InstaPay/COD, 14-day home inspection).
6. **Dynamic Catalog Grid:** Configurable column layout (2, 3, or 4 columns), category filter pills, sort dropdowns, and stock urgency tags.
7. **Customer Testimonials:** Verified Egyptian buyer reviews with 5-star ratings and locations (Maadi, Sheikh Zayed, Alexandria).
8. **Community Reels Showcase:** Carousel of tagged user-generated looks.
9. **Social Media & Community Feed:** Instagram grid and TikTok follower counters.
10. **Customer Service & Contact Us:** Working inquiry form, hotline schedule, showroom location, and 1-click WhatsApp.
11. **Brand Story (About Us Tab):** Dedicated editorial presentation highlighting atelier craftsmanship, fair-trade wages, and slow fashion philosophy.
12. **Floating WhatsApp Widget:** Persistent corner widget with live pulsating availability indicator.

---

### 3. Merchant SaaS Management Portal (`MerchantDashboard.jsx`)
A comprehensive administration console providing:
- **Sales & UGC Attribution KPIs:** Real-time metrics separating revenue driven by direct store visits vs. central Reels marketplace affiliate distribution.
- **Conversion Funnel Analytics:** Tracks the full journey: Visitors ➔ Product Views ➔ Add-to-Cart ➔ Completed Orders.
- **Advanced Inventory Management:** Live stock controls (`+` and `-`), category filters, and one-click syndication toggles.
- **Bosta Express Logistics Hub:** Automatic AWB number assignment, delivery status tracking, and printable thermal shipping waybill generation.
- **InstaPay Instant Verification:** Real-time modal for auditing bank reference codes, sender names, and transfer timestamps.
- **Creator UGC Campaign Approvals:** Approving influencer video drafts, locking funds in escrow, and releasing affiliate commission payouts.

---

### 4. Storefront Theme & Layout Builder (`StorefrontThemeCustomizer.jsx`)
Merchants have full creative control over their boutique's appearance without writing a single line of code:

| Category | Customization Options |
| :--- | :--- |
| **Theme Modes** | • **فخامة داكنة (Dark Luxury):** Obsidian black with high-contrast accents.<br>• **نهاري راقي (Atelier Light):** Warm alabaster and cream.<br>• **ميدنايت مخملي (Midnight Velvet):** Deep royal midnight navy. |
| **Color Palettes** | Interactive color picker + 6 curated luxury presets:<br>• أحمر قرمزي ملكي (`#d00000`)<br>• ذهب فرعوني فاخر (`#feb700`)<br>• زمرد وادي النيل (`#10b981`)<br>• أزرق ياقوتي بحري (`#3b82f6`)<br>• تيراكوتا رملية (`#c5705d`)<br>• فحم أسود مينيمال (`#18181b`) |
| **Typography** | • **Cairo Modern Sans:** Clean contemporary Arabic typography.<br>• **Heritage Serif:** Editorial high-fashion serif typography. |
| **Corner Radius** | Sharp (`rounded-none`), Subtle (`rounded-xl`), Modern (`rounded-2xl`), Pill (`rounded-3xl`). |
| **Hero Styles** | • `wide_cinema` (Full-width atmospheric)<br>• `split_editorial` (Editorial magazine layout)<br>• `minimal_card` (Clean centered minimalism) |
| **Catalog Density** | 2, 3, or 4 columns with toggles for Star Ratings and Stock Urgency badges. |
| **Section Toggles** | 10 independent show/hide switches: Announcement Bar, Hero Banner, Trust Pillars, Catalog, Community Reels, Social Feed, Customer Reviews, Contact Us, Floating WhatsApp, About Us Tab. |
| **Trust Badges Editor** | Inline editor for modifying titles, descriptions, and icons for all 4 trust pillars. |
| **Domain & Identity** | Store name, Arabic category, bio, custom subdomain, custom CNAME domain, logo picker, banner picker, WhatsApp, Instagram. |
| **Live Device Preview** | Responsive viewport toggle (**Desktop** vs. **Mobile**) with real-time state synchronization. |

---

### 5. Product Form Modal with Real-Time Unit Economics (`ProductFormModal.jsx`)
When merchants add or edit products, the modal calculates profitability live:
- **Retail Price vs. Cost of Goods Sold (COGS):** Computes Net Profit per piece and Profit Margin % in real time with dynamic color indicators.
- **Stock Management:** Fast-stock increment buttons (`+10`, `+50`, `+100`).
- **Egyptian Fashion Size Matrix:** Interactive multi-select pills (`S`, `M`, `L`, `XL`, `2XL`, `Free Size`).
- **High-Res Photography Selector:** One-click assignment of bespoke local product photography.
- **Affiliate Commission Slider:** Select commission rate (`10% - 30%`) with automatic calculation of creator earnings per sale.

---

## 💻 Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/) with bespoke luxury tokens (`primary: #d00000`, `secondary: #feb700`, `tertiary: #10b981`, `surface: #131315`) |
| **Typography** | [Google Fonts](https://fonts.google.com/) — *Plus Jakarta Sans*, *Cinzel Decorative*, *Cairo*, and *Material Symbols Outlined* |
| **State Management** | Centralized React Context (`AppContext.jsx`) with multi-merchant and cart persistence |
| **Deployment & Hosting** | [Vercel](https://vercel.com/) with automatic preview branches and production CDN aliasing |
| **Version Control** | [GitHub](https://github.com/Moasy1/EG-Commerce) (`Moasy1/EG-Commerce`) |
| **Design Specifications** | Google DeepMind Stitch Screens (`stitch-screens/`) |

---

## 🗄️ Data Model & Schema Overview

The application's data models are architected for multi-tenant scalability:

### 1. `merchants` (المتاجر والعلامات التجارية)
```json
{
  "id": "m-1",
  "name": "تاليسكا ستوديو • Talieska Studio",
  "slug": "talieska",
  "subdomain": "talieska.eg-commerce.com",
  "customDomain": "shop.talieskastudio.com",
  "categoryAr": "أزياء الكتان والتطريز اليدوي",
  "themeColor": "#d00000",
  "themeConfig": {
    "themeMode": "dark",
    "accentColor": "#d00000",
    "fontFamily": "sans",
    "borderRadius": "rounded-2xl",
    "heroStyle": "wide_cinema",
    "heroHeadline": "أزياء الكتان المصري الفاخر • Authentic Heritage",
    "heroSubheadline": "قطع انسيابية مستوحاة من هدوء الطبيعة...",
    "heroCtaText": "تسوق الكولكشن الآن",
    "productsGridCols": 4,
    "showRatings": true,
    "showStockBadges": true
  },
  "layoutConfig": {
    "showAnnouncementBar": true,
    "showHeroBanner": true,
    "showTrustBadges": true,
    "showProductsCatalog": true,
    "showCommunityReels": true,
    "showSocialMediaFeed": true,
    "showTestimonials": true,
    "showContactSection": true,
    "showWhatsAppFloat": true,
    "showAboutUsTab": true,
    "trustBadges": [...]
  }
}
```

### 2. `products` (المنتجات والمخزون)
```json
{
  "id": "p-1",
  "merchantId": "m-1",
  "title": "عباية كتان كايزن بوهيمية",
  "category": "كتان مصري فاخر",
  "price": 1850,
  "originalPrice": 2200,
  "cogs": 890,
  "stock": 18,
  "sizes": ["S", "M", "L", "XL"],
  "image": "/images/products/linen_abaya.jpg",
  "isMarketplaceSyndicated": true,
  "affiliateCommissionRate": 15,
  "rating": 4.9,
  "reviewsCount": 42
}
```

### 3. `reels` (ريلز الفيديو والمحتوى الترويجي)
```json
{
  "id": "r-1",
  "merchantId": "m-1",
  "creatorHandle": "@nour_style",
  "creatorName": "نور ستايل",
  "caption": "تنسيق فستان الكتان للعمل والمساء ✨ أقمشة مصرية 100%",
  "views": "34.2K",
  "likes": "2.8K",
  "videoImage": "/images/reels/reel_1.jpg",
  "taggedProductId": "p-1"
}
```

---

## 🚀 Getting Started & Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm 9+ or pnpm / yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Moasy1/EG-Commerce.git

# Navigate into the project folder
cd EG-Commerce

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The app will be available locally at `http://localhost:3000/`.

### Production Build
```bash
# Compile and optimize for production
npm run build

# Preview the production build locally
npm run preview
```

---

## 🌐 Live Deployment & Environments

- **Production URL:** [https://eg-commerce.vercel.app](https://eg-commerce.vercel.app)
- **GitHub Repository:** [https://github.com/Moasy1/EG-Commerce](https://github.com/Moasy1/EG-Commerce)
- **Production Host:** Vercel Global Edge Network

---

## 📂 Project Directory Structure

```
EG-Commerce/
├── public/
│   └── images/
│       ├── banners/          # High-resolution hero banners (Talieska, Khan Craft)
│       ├── brands/           # Brand monograms and logos
│       ├── products/         # High-resolution Egyptian fashion & craft photos
│       └── reels/            # 9:16 vertical creator photography
├── src/
│   ├── components/
│   │   ├── admin/            # ProductFormModal (Unit Economics, Fast Stock)
│   │   ├── layout/           # Header, Navigation, Role Switcher
│   │   ├── marketplace/      # ProductCard, FilterDrawer, ReelsOverlay
│   │   └── merchant/         # StorefrontThemeCustomizer (Theme & Layout Builder)
│   ├── context/
│   │   └── AppContext.jsx    # Global state (Merchants, Products, Cart, Configs)
│   ├── pages/
│   │   ├── CheckoutPage.jsx       # Multi-tender checkout (InstaPay, COD, Cards)
│   │   ├── CreatorPortal.jsx      # Creator UGC escrow & payout hub
│   │   ├── DiscoverReels.jsx      # 9:16 vertical shoppable video feed
│   │   ├── MarketplaceShop.jsx    # Central catalog with category filters
│   │   ├── MerchantDashboard.jsx  # Merchant SaaS administration portal
│   │   ├── MerchantStorefront.jsx # Standalone dynamic merchant boutique
│   │   └── RewardsPage.jsx        # Tiered loyalty and reward redemption
│   ├── App.jsx               # Root application router & layout orchestrator
│   └── main.jsx              # Vite entry point
├── stitch-screens/           # 17 High-fidelity Stitch screen specifications
├── tailwind.config.js        # Kinetic Retail Dark color tokens & font definitions
├── vite.config.js            # Vite configuration with port 3000
├── package.json              # Project dependencies & scripts
├── DOCUMENTATION.md          # Comprehensive platform technical documentation
└── README.md                 # Quick-start project overview
```

---

## 📄 License & Attribution

Designed and developed for **EG-Commerce**. All intellectual property, UI designs, and brand concepts are reserved.
Built with modern Web & AI design engineering standards.
