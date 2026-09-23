import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ProductService } from '../services/ProductService';
import { ReelsService } from '../services/ReelsService';
import { CartService } from '../services/CartService';
import { AuthService, DEFAULT_CREATORS } from '../services/AuthService';
import { RewardService } from '../services/RewardService';
import { OrderService } from '../services/OrderService';
import { socialService } from '../services/social/socialService.js';
import { feedService } from '../services/algorithm/feedService.js';
import { eventTracker } from '../services/analytics/eventTracker.js';
import { sessionTracker } from '../services/analytics/sessionTracker.js';
import { attributionService } from '../services/analytics/attributionService.js';
import { interestService } from '../services/algorithm/interestService.js';
import { NotificationService } from '../services/NotificationService.js';

import { MERCHANTS_DATA, SOCIAL_PROFILES, INITIAL_PRODUCTS } from '../data/storesData.js';

const AppContext = createContext();

export { MERCHANTS_DATA, SOCIAL_PROFILES } from '../data/storesData.js';

export const INITIAL_ORDERS = [];

export { INITIAL_PRODUCTS } from '../data/storesData.js';

export function detectSubdomain() {
  if (typeof window === 'undefined') return { isSubdomain: false, merchantSlug: null, merchantId: '171842bd-daed-40ef-853f-917eab2ed437' };
  
  const hostname = (window.location.hostname || '').toLowerCase().trim();
  const searchParams = new URLSearchParams(window.location.search);
  const querySub = (searchParams.get('subdomain') || searchParams.get('store') || '').toLowerCase().trim();

  // 1. Explicit query parameter (highest precedence for dev / testing e.g. ?subdomain=talieska or ?subdomain=demo)
  if (querySub) {
    const slug = querySub === 'demo' ? 'drip-fit' : querySub;
    const found = MERCHANTS_DATA.find(m => 
      m.slug.toLowerCase() === slug || 
      m.id.toLowerCase() === slug || 
      m.subdomain?.toLowerCase().includes(slug)
    );
    return {
      isSubdomain: true,
      merchantSlug: slug,
      merchantId: found ? found.id : '171842bd-daed-40ef-853f-917eab2ed437'
    };
  }

  // 2. Custom domain match (e.g. dripfit-eg.com, khancraft-eg.com)
  const customMatched = MERCHANTS_DATA.find(m => 
    m.customDomain && hostname.includes(m.customDomain.toLowerCase())
  );
  if (customMatched) {
    return {
      isSubdomain: true,
      merchantSlug: customMatched.slug,
      merchantId: customMatched.id
    };
  }

  // 3. Skip pure IP addresses and plain localhost
  const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname === '::1';
  if (isIp || hostname === 'localhost') {
    return { isSubdomain: false, merchantSlug: null, merchantId: null };
  }

  // 4. Subdomain on localhost (e.g. talieska.localhost) or production domain (e.g. drip-fit.egyptian-commerce.com)
  const parts = hostname.split('.');
  const isLocalhostDomain = hostname.endsWith('.localhost');
  const minParts = isLocalhostDomain ? 2 : 3;

  if (parts.length >= minParts) {
    const prefix = parts[0].toLowerCase().trim();
    const ignored = ['www', 'app', 'shop', 'api', 'admin', 'stage', 'staging', 'mail', 'cpanel', 'webmail', 'eg-commerce'];
    if (!ignored.includes(prefix)) {
      const slug = prefix === 'demo' ? 'drip-fit' : prefix;
      const found = MERCHANTS_DATA.find(m => 
        m.slug.toLowerCase() === slug || 
        m.id.toLowerCase() === slug || 
        m.subdomain?.toLowerCase().includes(slug)
      );
      if (found) {
        return {
          isSubdomain: true,
          merchantSlug: slug,
          merchantId: found.id
        };
      }
    }
  }

  return { isSubdomain: false, merchantSlug: null, merchantId: null };
}

export function parseRouteFromLocation(pathname, search, isSubdomain) {
  if (typeof window === 'undefined') return { tab: isSubdomain ? 'storefront' : 'reels' };
  const cleanPath = (pathname || '/').replace(/\/+$/, '') || '/';
  const params = new URLSearchParams(search || '');
  
  if (cleanPath === '/' || cleanPath === '') {
    return {
      tab: isSubdomain ? 'storefront' : 'reels',
      productId: params.get('id') || null,
      categorySlug: null
    };
  }

  if (cleanPath === '/reels') return { tab: 'reels' };
  if (cleanPath === '/shop' || cleanPath === '/marketplace') return { tab: 'shop' };
  if (cleanPath === '/cart') return { tab: 'cart' };
  if (cleanPath === '/checkout') return { tab: 'checkout' };
  if (cleanPath === '/tracking') return { tab: 'tracking' };
  if (cleanPath === '/rewards') return { tab: 'rewards' };
  if (cleanPath === '/studio' || cleanPath === '/creator') return { tab: 'studio' };
  if (cleanPath === '/dashboard' || cleanPath === '/merchant') return { tab: 'dashboard' };
  if (cleanPath === '/add-product' || cleanPath === '/add_product') return { tab: 'add_product' };
  if (cleanPath === '/admin' || cleanPath === '/superadmin') return { tab: 'admin' };
  if (cleanPath === '/delivery') return { tab: 'delivery' };
  if (cleanPath === '/settings') return { tab: 'settings' };
  if (cleanPath === '/merchant/dashboard') return { tab: 'dashboard' };

  if (cleanPath === '/profile' || cleanPath.startsWith('/profile/')) {
    const handle = cleanPath.startsWith('/profile/') ? cleanPath.replace('/profile/', '').trim() : 'drip-fit';
    return { tab: 'profile', profileHandle: handle };
  }

  if (cleanPath === '/showcase') return { tab: 'showcase' };

  if (cleanPath === '/storefront' || cleanPath.startsWith('/store')) {
    const rawSlug = cleanPath.startsWith('/store/') ? cleanPath.replace('/store/', '').split('/')[0].split('?')[0].trim() : 'drip-fit';
    const slug = rawSlug || 'drip-fit';
    return { tab: 'storefront', storeSlug: slug };
  }

  if (cleanPath.startsWith('/product/')) {
    const id = cleanPath.replace('/product/', '').trim();
    return { tab: 'product', productId: id };
  }

  if (cleanPath.startsWith('/category/')) {
    const slug = cleanPath.replace('/category/', '').trim();
    return { tab: 'category', categorySlug: slug };
  }

  return { tab: isSubdomain ? 'storefront' : 'reels' };
}

export function getPathForTab(tab, { product, category, isSubdomain, profileHandle, storeSlug } = {}) {
  switch (tab) {
    case 'reels':
      return isSubdomain ? '/' : '/reels';
    case 'shop':
    case 'marketplace':
      return '/shop';
    case 'category':
      return category?.slug ? `/category/${category.slug}` : '/category';
    case 'product':
      return product?.id ? `/product/${product.id}` : '/product';
    case 'cart':
      return '/cart';
    case 'checkout':
      return '/checkout';
    case 'tracking':
      return '/tracking';
    case 'rewards':
      return '/rewards';
    case 'studio':
    case 'creator':
      return '/studio';
    case 'dashboard':
    case 'merchant':
      return '/merchant/dashboard';
    case 'add_product':
    case 'add-product':
      return '/add-product';
    case 'admin':
    case 'superadmin':
      return '/admin';
    case 'delivery':
      return '/delivery';
    case 'settings':
      return '/settings';
    case 'profile':
      return profileHandle ? `/profile/${profileHandle.replace(/^@/, '')}` : '/profile/drip-fit';
    case 'showcase':
      return '/showcase';
    case 'storefront':
      return storeSlug ? `/store/${storeSlug}` : '/store/drip-fit';
    default:
      return isSubdomain ? '/' : '/';
  }
}

export function AppProvider({ children }) {
  const initialSubdomain = detectSubdomain();
  const initialRoute = typeof window !== 'undefined'
    ? parseRouteFromLocation(window.location.pathname, window.location.search, initialSubdomain.isSubdomain)
    : { tab: initialSubdomain.isSubdomain ? 'storefront' : 'reels' };

  const [isSubdomainMode, setIsSubdomainMode] = useState(initialSubdomain.isSubdomain);
  const [activeTab, setActiveTabState] = useState(() => initialRoute.tab);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(() => {
    if (initialRoute.productId) {
      const match = INITIAL_PRODUCTS.find(p => p.id === initialRoute.productId);
      if (match) return match;
    }
    return INITIAL_PRODUCTS[0];
  });
  const [merchants, setMerchants] = useState(MERCHANTS_DATA);
  const [creators, setCreators] = useState(DEFAULT_CREATORS);
  // Robustly resolve initial store from route or subdomain
  const initialStoreSlug = initialRoute.storeSlug || initialSubdomain.merchantSlug || null;
  const initialMerchantMatch = initialStoreSlug
    ? (MERCHANTS_DATA.find(m => 
        (m.slug && m.slug.toLowerCase() === initialStoreSlug.toLowerCase()) || 
        (m.id && m.id.toLowerCase() === initialStoreSlug.toLowerCase()) ||
        (m.shortName && m.shortName.toLowerCase() === initialStoreSlug.toLowerCase()) ||
        (m.subdomain && m.subdomain.toLowerCase().includes(initialStoreSlug.toLowerCase())) ||
        (m.handle && m.handle.toLowerCase().replace(/^@/, '') === initialStoreSlug.toLowerCase())
      ) || null)
    : null;

  const [selectedMerchantId, setSelectedMerchantId] = useState(() => 
    initialMerchantMatch?.id || initialSubdomain.merchantId || '171842bd-daed-40ef-853f-917eab2ed437'
  );
  const [activeStoreSlug, setActiveStoreSlug] = useState(() => 
    initialMerchantMatch?.slug || initialStoreSlug || 'drip-fit'
  );
  const [orders, setOrders] = useState(() => OrderService.getInitialOrders());

  const updateOrderStatus = async (orderId, newStatus) => {
    const updated = await OrderService.updateOrderStatus(orderId, newStatus);
    setOrders(updated);
  };
  const [role, setRole] = useState('buyer');
  const [deviceMode, setDeviceMode] = useState('responsive');
  const [language, setLanguage] = useState('ar'); // 'ar' | 'en'
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (initialRoute.categorySlug) {
      const match = ProductService.getCategoryBySlug(initialRoute.categorySlug);
      if (match) return match;
    }
    return {
      id: 'women',
      slug: 'women',
      label: 'Women',
      labelAr: 'أزياء نسائية'
    };
  });

  // Social Profile State & Navigation Layer
  const [activeProfileHandle, setActiveProfileHandle] = useState(() => initialRoute.profileHandle || 'drip-fit');
  
  const socialProfiles = useMemo(() => {
    const base = { ...SOCIAL_PROFILES };
    // Merge dynamic merchants
    (merchants || []).forEach(m => {
      const key = (m.slug || m.id || '').replace(/^@/, '');
      if (key && !base[key]) {
        base[key] = {
          id: m.id,
          handle: `@${m.slug || key}`,
          slug: m.slug || key,
          name: m.name || m.store_name,
          verified: m.verified ?? true,
          role: 'merchant',
          merchantId: m.id,
          avatar: m.logo || m.avatar || '/images/brands/dripfit_logo.png',
          category: m.category || 'Egyptian Merchant',
          categoryAr: m.categoryAr || 'متجر مصري',
          bio: m.bio || m.description || 'متجر موثق على إيجي كومرس',
          location: m.location || 'القاهرة، مصر',
          website: m.website || `${m.slug || key}.eg-commerce.com`,
          followersCount: m.followersCount || '1.2K',
          followingCount: '84',
          productsCount: m.productsCount || 0,
          reelsCount: m.reelsCount || 0
        };
      }
    });
    // Merge dynamic creators
    (creators || []).forEach(c => {
      const key = (c.slug || c.handle || c.id || '').replace(/^@/, '');
      if (key && !base[key]) {
        base[key] = {
          id: c.id,
          handle: c.handle?.startsWith('@') ? c.handle : `@${key}`,
          slug: c.slug || key,
          name: c.name,
          verified: c.verified ?? true,
          role: 'creator',
          creatorId: c.id,
          avatar: c.avatar || '/images/reels/reel_1.jpg',
          category: c.category || 'Egyptian Fashion Creator',
          categoryAr: c.categoryAr || 'صانع محتوى مصري',
          bio: c.bio || 'مبدع محتوى على منصة إيجي كومرس',
          location: c.location || 'القاهرة، مصر',
          website: c.website || `${key}.eg-commerce.com`,
          followersCount: c.followersCount || '2.4K',
          followingCount: '120',
          productsCount: 0,
          reelsCount: 0
        };
      }
    });
    return base;
  }, [merchants, creators]);

  const activeProfile = useMemo(() => {
    const rawClean = (activeProfileHandle || (user ? (user.slug || user.merchant_id || user.handle || user.username || user.name) : 'drip-fit')).replace(/^@/, '').trim();
    const clean = rawClean.toLowerCase();

    // 1. If viewing own profile (handle matches user id, email prefix, username, handle, merchant_id, creator_id, slug, name or 'me')
    if (user && (
      clean === 'me' ||
      clean === user.id?.toLowerCase() ||
      clean === user.email?.split('@')[0]?.toLowerCase() ||
      clean === user.username?.toLowerCase() ||
      clean === user.handle?.replace(/^@/, '').toLowerCase() ||
      clean === user.slug?.toLowerCase() ||
      clean === user.merchant_id?.toLowerCase() ||
      clean === user.creator_id?.toLowerCase() ||
      clean === user.name?.toLowerCase().replace(/\s+/g, '-') ||
      clean === user.name?.toLowerCase()
    )) {
      if (user.role === 'merchant') {
        const merchantMatch = (merchants || []).find(m => 
          m.id === user.merchant_id || 
          m.slug?.toLowerCase() === clean || 
          m.user_id === user.id
        );
        const slug = user.slug || merchantMatch?.slug || user.name?.toLowerCase().replace(/\s+/g, '-') || 'store';
        return {
          id: user.merchant_id || user.id,
          handle: `@${slug}`,
          slug: slug,
          name: merchantMatch?.name || `${user.name} Store • متجر ${user.name}`,
          verified: true,
          role: 'merchant',
          merchantId: user.merchant_id || merchantMatch?.id || 'm-custom',
          avatar: user.avatar_url || user.profile?.avatar_url || merchantMatch?.logo || '/images/brands/dripfit_logo.png',
          banner: merchantMatch?.banner || '/images/products/the_sharp_v_yellow_1.webp',
          category: merchantMatch?.category || 'Egyptian Fashion & Retail',
          categoryAr: merchantMatch?.categoryAr || 'أزياء وتجارة مصرية معتمدة',
          bio: merchantMatch?.bio || user.bio || `✨ متجر مصري موثق لـ ${user.name} على منصة EG-Commerce`,
          location: 'القاهرة، مصر • Cairo, Egypt',
          website: merchantMatch?.customDomain || merchantMatch?.subdomain || `${slug}.egyptian-commerce.com`,
          followersCount: '1.2K',
          followingCount: '30',
          productsCount: (products || []).filter(p => p.merchantId === user.merchant_id || p.merchant_id === user.merchant_id).length,
          reelsCount: 0,
          isOwner: true
        };
      } else if (user.role === 'creator') {
        const handle = user.handle || `@${(user.username || user.name).toLowerCase().replace(/\s+/g, '_')}`;
        const slug = user.slug || user.name?.toLowerCase().replace(/\s+/g, '-') || 'creator';
        return {
          id: user.creator_id || user.id,
          handle,
          slug,
          name: user.name,
          verified: true,
          role: 'creator',
          creatorId: user.creator_id || user.id,
          avatar: user.avatar_url || user.profile?.avatar_url || '/images/reels/reel_2.jpg',
          category: 'Fashion Stylist & UGC Creator',
          categoryAr: 'منسقة أزياء وصانعة محتوى معتمدة',
          bio: user.bio || `✨ إطلالات وتنسيقات أزياء عصرية | صانع محتوى مصري معتمد لـ ${user.name}`,
          location: 'القاهرة، مصر • Cairo, Egypt',
          followersCount: '2.4K',
          followingCount: '65',
          productsCount: (products || []).filter(p => p.creator_id === user.creator_id || p.creatorId === user.creator_id).length,
          reelsCount: 0,
          isOwner: true
        };
      } else {
        return {
          id: user.id,
          handle: `@${(user.username || user.name || user.email?.split('@')[0]).replace(/\s+/g, '_').toLowerCase()}`,
          name: user.name || 'مستخدم المنصة',
          verified: false,
          role: 'buyer',
          avatar: user.avatar_url || user.profile?.avatar_url || '/images/reels/reel_1.jpg',
          bio: user.bio || 'متسوق أزياء ومتابع نشط في EG-Commerce 🇪🇬',
          followersCount: '120',
          followingCount: '85',
          productsCount: 0,
          reelsCount: 0,
          isOwner: true
        };
      }
    }

    // 2. Direct key match in static social profiles
    if (socialProfiles[clean]) return socialProfiles[clean];
    if (socialProfiles[rawClean]) return socialProfiles[rawClean];

    // 3. Check registered merchants array
    const merchantMatch = (merchants || []).find(m => 
      m.slug?.toLowerCase() === clean || 
      m.id?.toLowerCase() === clean || 
      m.shortName?.toLowerCase() === clean ||
      m.handle?.replace(/^@/, '').toLowerCase() === clean
    );
    if (merchantMatch) {
      return {
        id: `p-${merchantMatch.slug}`,
        handle: `@${merchantMatch.slug}`,
        slug: merchantMatch.slug,
        name: merchantMatch.name,
        verified: true,
        role: 'merchant',
        merchantId: merchantMatch.id,
        avatar: merchantMatch.logo,
        banner: merchantMatch.banner,
        category: merchantMatch.category,
        categoryAr: merchantMatch.categoryAr,
        bio: merchantMatch.bio,
        location: 'القاهرة، مصر • Cairo, Egypt',
        website: merchantMatch.customDomain || merchantMatch.subdomain,
        followersCount: merchantMatch.followersCount || '36.4K',
        followingCount: merchantMatch.followingCount || '110',
        productsCount: (products || []).filter(p => p.merchantId === merchantMatch.id || p.merchant_id === merchantMatch.id).length,
        reelsCount: 6
      };
    }

    // 4. Check dynamic creators array
    const creatorMatch = (creators || []).find(c => 
      c.slug?.toLowerCase() === clean || 
      c.id?.toLowerCase() === clean || 
      c.handle?.replace(/^@/, '').toLowerCase() === clean ||
      c.name?.toLowerCase().replace(/\s+/g, '-') === clean ||
      c.name?.toLowerCase() === clean
    );
    if (creatorMatch) {
      return {
        id: creatorMatch.id,
        handle: creatorMatch.handle?.startsWith('@') ? creatorMatch.handle : `@${creatorMatch.handle}`,
        slug: creatorMatch.slug || creatorMatch.handle?.replace(/^@/, ''),
        name: creatorMatch.name,
        verified: creatorMatch.verified ?? true,
        role: 'creator',
        creatorId: creatorMatch.id,
        avatar: creatorMatch.avatar || '/images/reels/reel_2.jpg',
        category: creatorMatch.category || 'Fashion Stylist & UGC Creator',
        categoryAr: creatorMatch.categoryAr || 'منسقة أزياء وصانعة محتوى معتمدة',
        bio: creatorMatch.bio || `✨ إطلالات وتنسيقات أزياء عصرية | صانع محتوى مصري معتمد 🇪🇬`,
        location: 'القاهرة، مصر • Cairo, Egypt',
        followersCount: creatorMatch.followersCount || '24.5K',
        followingCount: creatorMatch.followingCount || '115',
        productsCount: (products || []).filter(p => p.creatorId === creatorMatch.id || p.creator_id === creatorMatch.id).length,
        reelsCount: 4
      };
    }

    // 5. If clean is empty or talieska, return Drip Fit
    if (!clean || clean === 'drip-fit') {
      return socialProfiles['drip-fit'];
    }

    // 6. Dynamic Fallback Creator Profile for any clicked creator handle!
    const formattedName = rawClean
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    return {
      id: `p-${clean}`,
      handle: `@${rawClean}`,
      slug: clean,
      name: formattedName,
      verified: true,
      role: 'creator',
      creatorId: `cr-${clean}`,
      avatar: '/images/reels/fashion_oneshoulder_top_thumb.jpg',
      category: 'Fashion Stylist & UGC Creator',
      categoryAr: 'منسقة أزياء وصانعة محتوى معتمدة',
      bio: `✨ إطلالات وتنسيقات أزياء عصرية | صانعة محتوى مصرية معتمدة 🇪🇬`,
      location: 'القاهرة، مصر • Cairo, Egypt',
      followersCount: '45.8K',
      followingCount: '124',
      productsCount: 4,
      reelsCount: 6,
      highlights: [
        { id: 'h1', title: 'إطلالات الصيف', icon: 'style', img: '/images/reels/fashion_citrine_blazer_thumb.jpg' }
      ]
    };
  }, [activeProfileHandle, merchants, creators, products, socialProfiles, user]);

  const navigateToMyProfile = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const myHandle = user.slug || 
      (user.handle ? user.handle.replace(/^@/, '') : null) || 
      user.merchant_id || 
      user.creator_id || 
      user.username || 
      user.name || 
      user.id;
    setActiveProfileHandle(myHandle);
    setActiveTab('profile', { profileHandle: myHandle });
  };

  const navigateToProfile = (profileOrHandle) => {
    let handle = 'drip-fit';
    if (!profileOrHandle && user) {
      navigateToMyProfile();
      return;
    }
    if (typeof profileOrHandle === 'string') {
      handle = profileOrHandle.replace(/^@/, '');
    } else if (profileOrHandle?.slug) {
      handle = profileOrHandle.slug;
    } else if (profileOrHandle?.handle) {
      handle = profileOrHandle.handle.replace(/^@/, '');
    } else if (profileOrHandle?.merchantId) {
      const match = (merchants || []).find(m => m.id === profileOrHandle.merchantId);
      if (match) handle = match.slug;
    }
    setActiveProfileHandle(handle);
    setActiveTab('profile', { profileHandle: handle });
  };

  const navigateToStorefront = (merchantIdOrSlug) => {
    if (merchantIdOrSlug) {
      const target = String(merchantIdOrSlug).toLowerCase().trim().replace(/^@/, '');
      const match = (merchants || []).find(m => 
        m.id === merchantIdOrSlug || 
        (m.slug && m.slug.toLowerCase() === target) || 
        (m.shortName && m.shortName.toLowerCase() === target) ||
        (m.handle && m.handle.toLowerCase().replace(/^@/, '') === target) ||
        (m.subdomain && m.subdomain.toLowerCase().includes(target))
      );
      if (match) {
        setSelectedMerchantId(match.id);
        setActiveStoreSlug(match.slug);
        setActiveTab('storefront', { storeSlug: match.slug, merchantId: match.id });
        return;
      }
      setActiveStoreSlug(target);
      setActiveTab('storefront', { storeSlug: target });
      return;
    }
    setActiveTab('storefront', { storeSlug: 'drip-fit' });
  };

  const navigateToDashboard = () => {
    setActiveTab('dashboard');
  };

  // URL-synchronized navigation function
  const setActiveTab = (tab, options = {}) => {
    setActiveTabState(tab);
    
    if (typeof window === 'undefined') return;

    if (tab === 'storefront' || options.storeSlug) {
      const targetSlug = options.storeSlug || activeStoreSlug;
      if (targetSlug) {
        const cleanSlug = String(targetSlug).toLowerCase().trim();
        const match = (merchants || []).find(m => 
          (m.slug && m.slug.toLowerCase() === cleanSlug) || 
          m.id === targetSlug ||
          (m.shortName && m.shortName.toLowerCase() === cleanSlug) ||
          (m.handle && m.handle.toLowerCase().replace(/^@/, '') === cleanSlug)
        );
        if (match) {
          setSelectedMerchantId(match.id);
          setActiveStoreSlug(match.slug);
        } else {
          setActiveStoreSlug(targetSlug);
        }
      }
    }
    if (options.merchantId) {
      setSelectedMerchantId(options.merchantId);
      const match = (merchants || []).find(m => m.id === options.merchantId);
      if (match?.slug) setActiveStoreSlug(match.slug);
    }

    const prod = options.product || selectedProduct;
    const cat = options.category || selectedCategory;
    const profHandle = options.profileHandle || activeProfileHandle;
    const curMerchant = (merchants || []).find(m => m.id === (options.merchantId || selectedMerchantId));
    const sSlug = options.storeSlug || curMerchant?.slug || activeStoreSlug || 'drip-fit';

    const newPath = getPathForTab(tab, { 
      product: prod, 
      category: cat, 
      isSubdomain: isSubdomainMode,
      profileHandle: profHandle,
      storeSlug: sSlug
    });

    // Preserve existing query params like subdomain=talieska or store=talieska
    const currentParams = new URLSearchParams(window.location.search);
    const searchString = currentParams.toString();
    const targetUrl = searchString ? `${newPath}?${searchString}` : newPath;

    if (window.location.pathname !== newPath || options.forceUrl) {
      if (options.replace) {
        window.history.replaceState({ tab, productId: prod?.id, categorySlug: cat?.slug, profileHandle: profHandle, storeSlug: sSlug, merchantId: options.merchantId || selectedMerchantId }, '', targetUrl);
      } else {
        window.history.pushState({ tab, productId: prod?.id, categorySlug: cat?.slug, profileHandle: profHandle, storeSlug: sSlug, merchantId: options.merchantId || selectedMerchantId }, '', targetUrl);
      }
    }
  };

  const loadData = async (activeUserOverride = null) => {
    // Step 1: Identify the current user
    const currentUser = activeUserOverride || (await AuthService.getCurrentUser());
    let activeMerchantId = null;

    if (currentUser) {
      setUser(currentUser);
      if (currentUser.role) setRole(currentUser.role);
      if (currentUser.merchant_id) {
        activeMerchantId = currentUser.merchant_id;
        const onStoreRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/store/');
        if (!onStoreRoute) {
          setSelectedMerchantId(prev => prev || currentUser.merchant_id);
        }
      }
      try {
        const balance = await RewardService.getBalance(currentUser.id);
        setRewardPoints(balance);
        sessionTracker.setAuthenticatedUser(currentUser.id);
      } catch (e) {}
    }

    // Step 2: ALWAYS load the FULL product catalogue for marketplace display.
    // The marketplace must show products from ALL stores, regardless of who is logged in.
    let fetchedProducts = await ProductService.getProducts(null, null);
    fetchedProducts = (fetchedProducts || []).map(p => {
      const isDripFit = p.title?.toLowerCase().includes('drip fit') || 
                        p.description?.toLowerCase().includes('drip fit') ||
                        p.merchant?.toLowerCase().includes('drip fit') ||
                        p.merchantSlug?.toLowerCase() === 'drip-fit';
      if (isDripFit) {
        return {
          ...p,
          merchant: 'Drip Fit • دريب فيت',
          merchantId: '171842bd-daed-40ef-853f-917eab2ed437',
          merchantSlug: 'drip-fit'
        };
      }
      return p;
    });
    setProducts(fetchedProducts);

    // Step 3: Load merchants list (always full, includes all registered custom merchants)
    const fetchedMerchants = await ProductService.getMerchants();
    setMerchants(fetchedMerchants);

    // Sync active merchant from current route if visiting a store
    if (typeof window !== 'undefined') {
      const currentRoute = parseRouteFromLocation(window.location.pathname, window.location.search, isSubdomainMode);
      const targetSlug = currentRoute.storeSlug || (window.location.pathname.startsWith('/store/') ? window.location.pathname.replace('/store/', '').split('/')[0].split('?')[0].trim() : null);
      if (targetSlug) {
        const cleanSlug = targetSlug.toLowerCase().trim();
        const found = (fetchedMerchants || []).find(m => 
          (m.slug && m.slug.toLowerCase() === cleanSlug) ||
          (m.id && m.id.toLowerCase() === cleanSlug) ||
          (m.shortName && m.shortName.toLowerCase() === cleanSlug) ||
          (m.subdomain && m.subdomain.toLowerCase().includes(cleanSlug)) ||
          (m.handle && m.handle.toLowerCase().replace(/^@/, '') === cleanSlug)
        );
        if (found) {
          setSelectedMerchantId(found.id);
          setActiveStoreSlug(found.slug);
        }
      }
    }

    // Step 4: Load creators list (always full, includes all registered creators)
    const fetchedCreators = await AuthService.getCreators();
    setCreators(fetchedCreators);

    // Step 5: Load cart (always user-scoped)
    const fetchedCart = await CartService.getCartItems();
    setCartItems(fetchedCart);

    // Step 6: Load orders — merchants only see their own orders, buyers/admins see all
    const isMerchantRole = currentUser?.role === 'merchant';
    const orderScopedMerchantId = isMerchantRole
      ? (activeMerchantId || currentUser?.merchant_id || null)
      : null;
    const fetchedOrders = await OrderService.getOrders(currentUser?.id || null, orderScopedMerchantId);
    setOrders(fetchedOrders);
  };

  const refreshData = async (userOverride = null) => {
    await loadData(userOverride);
  };

  useEffect(() => {
    loadData();

    // Real-time listener for cross-tab or local registration events
    const handleStorageChange = (e) => {
      if (e.key === 'eg_custom_merchants' || e.key === 'eg_custom_creators' || e.key === 'eg_active_session' || e.key === 'eg_registered_users_registry') {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('eg_profiles_updated', loadData);

    // ─── Cross-device real-time sync polling ───
    // Poll /api/sync-status every 8 seconds. If the server data changed (new merchant
    // registered from another device), reload all data so this browser sees it immediately.
    let lastKnownSyncTs = Date.now();
    let syncPollInterval = null;
    const startSyncPolling = () => {
      syncPollInterval = setInterval(async () => {
        try {
          const res = await fetch('/api/sync-status', { cache: 'no-store' });
          if (!res.ok) return;
          const { ts } = await res.json();
          if (ts && ts > lastKnownSyncTs + 500) {
            // Server data is newer than what we loaded - reload everything
            lastKnownSyncTs = ts;
            console.log('[AppContext] 🔄 Remote data change detected — reloading merchant/user data');
            loadData();
          }
        } catch (e) {
          // Server unreachable or dev server restarting - ignore silently
        }
      }, 8000);
    };
    startSyncPolling();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('eg_profiles_updated', loadData);
      if (syncPollInterval) clearInterval(syncPollInterval);
    };
  }, []);

  const updateUserProfile = async (updates) => {
    try {
      const res = await AuthService.updateCurrentUser(updates);
      if (res?.user) {
        setUser(res.user);
        if (res.user.role) setRole(res.user.role);
        return res.user;
      }
    } catch (e) {
      console.error('Failed to update user profile in context:', e);
      throw e;
    }
  };

  // Sync Subdomain & Storefront if window location or merchants change
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check path-based store (/store/:slug)
    const currentRoute = parseRouteFromLocation(window.location.pathname, window.location.search, isSubdomainMode);
    const storeSlug = currentRoute.storeSlug || (window.location.pathname.startsWith('/store/') ? window.location.pathname.replace('/store/', '').split('/')[0].split('?')[0].trim() : null);

    if (storeSlug) {
      const cleanSlug = storeSlug.toLowerCase().trim();
      const match = (merchants || []).find(m => 
        (m.slug && m.slug.toLowerCase() === cleanSlug) || 
        (m.id && m.id.toLowerCase() === cleanSlug) || 
        (m.shortName && m.shortName.toLowerCase() === cleanSlug) ||
        (m.subdomain && m.subdomain.toLowerCase().includes(cleanSlug)) ||
        (m.handle && m.handle.toLowerCase().replace(/^@/, '') === cleanSlug)
      );
      if (match) {
        setSelectedMerchantId(match.id);
        setActiveStoreSlug(match.slug);
        return;
      }
    }

    // 2. Check subdomain
    const detected = detectSubdomain();
    if (detected.isSubdomain) {
      setIsSubdomainMode(true);
      if (detected.merchantId) {
        setSelectedMerchantId(detected.merchantId);
      }
      if (detected.merchantSlug) {
        setActiveStoreSlug(detected.merchantSlug);
      }
    }
  }, [merchants]);

  // When the store switcher changes merchant, reload products and orders for that merchant
  // (Only active for merchant/admin roles — buyers get the full catalogue)
  useEffect(() => {
    if (!selectedMerchantId || !user) return;
    const isMerchantRole = user?.role === 'merchant';
    if (!isMerchantRole) return; // buyers don't need re-scoped data

    // Only re-scope ORDERS for the merchant dashboard — NOT products!
    // Products are always the full catalogue for the marketplace.
    const reloadMerchantData = async () => {
      const fetchedOrders = await OrderService.getOrders(user.id, selectedMerchantId);
      setOrders(fetchedOrders);
    };
    reloadMerchantData();
  }, [selectedMerchantId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle Browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const route = parseRouteFromLocation(
        window.location.pathname,
        window.location.search,
        isSubdomainMode
      );
      setActiveTabState(route.tab);
      if (route.profileHandle) {
        setActiveProfileHandle(route.profileHandle);
      }
      if (route.storeSlug) {
        const cleanSlug = route.storeSlug.toLowerCase().trim();
        const foundM = (merchants || []).find(m => 
          (m.slug && m.slug.toLowerCase() === cleanSlug) || 
          (m.id && m.id.toLowerCase() === cleanSlug) ||
          (m.shortName && m.shortName.toLowerCase() === cleanSlug)
        );
        if (foundM) {
          setSelectedMerchantId(foundM.id);
          setActiveStoreSlug(foundM.slug);
        } else {
          setActiveStoreSlug(route.storeSlug);
        }
      }
      if (route.productId) {
        const found = products.find(p => p.id === route.productId);
        if (found) setSelectedProduct(found);
      }
      if (route.categorySlug) {
        const foundCat = ProductService.getCategoryBySlug(route.categorySlug);
        if (foundCat) setSelectedCategory(foundCat);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isSubdomainMode, products, merchants]);

  const updateProductSyndication = (productId) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, isSyndicated: !p.isSyndicated } : p
    ));
  };

  const addProduct = async (newProd) => {
    const activeMerchant = merchants.find(m => m.id === selectedMerchantId) || merchants[0];
    const merchantName = newProd.merchant || activeMerchant?.name || user?.name || 'Drip Fit • دريب فيت';
    const merchantId = newProd.merchantId || activeMerchant?.id || 'm0000000-0000-0000-0000-000000000001';

    const enrichedProd = {
      ...newProd,
      merchant: merchantName,
      merchantId: merchantId,
      createdBy: user?.id || null
    };

    // 1. Persist product via ProductService
    const created = await ProductService.createProduct(enrichedProd);

    // 2. Automatically create a real Reel in ReelsService linked to merchant profile & storefront!
    const isMerchant = user?.role === 'merchant' || !!user?.storeName || user?.type === 'merchant' || activeMerchant?.id === merchantId;
    const derivedHandle = user?.handle 
      || (user?.name ? `@${user.name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_')}` : null)
      || (activeMerchant?.slug ? `@${activeMerchant.slug}` : '@store');
    const creatorHandle = newProd.creatorHandle || (user?.role === 'creator' ? `@${(user.name || 'creator').replace(/\s+/g, '_')}` : derivedHandle);
    const creatorName = newProd.creatorName || user?.name || merchantName;
    const creatorAvatar = newProd.creatorAvatar || user?.profile?.avatar_url || user?.avatar_url || user?.avatar || user?.logo || activeMerchant?.logo || created.image;
    const merchantSlug = activeMerchant?.slug || user?.slug || user?.name?.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const reelMediaUrl = newProd.video || created.video || created.image || (created.images && created.images[0]) || '';

    try {
      await ReelsService.saveReel({
        id: `reel-${created.id}`,
        creatorId: user?.id || null,
        creatorHandle: creatorHandle,
        creatorName: creatorName,
        publisherId: user?.id || null,
        publisherRole: isMerchant ? 'merchant' : (user?.role || 'creator'),
        merchantId: merchantId,
        storeSlug: merchantSlug,
        isMerchantReel: isMerchant,
        avatar: creatorAvatar,
        videoBg: reelMediaUrl,
        thumbnail: created.image || (created.images && created.images[0]) || reelMediaUrl,
        caption: newProd.caption || `${created.title} • ${created.description ? created.description.slice(0, 100) + '...' : 'متوفر الآن عبر متجرنا الرسمي'} 🇪🇬✨ #${merchantSlug || 'DripFit'}`,
        music: 'Drip Fit Official • Streetwear Vibes',
        products: [created]
      });
      try {
        window.dispatchEvent(new CustomEvent('eg_reels_updated', { detail: { productId: created.id, reelId: `reel-${created.id}` } }));
      } catch (e) {}
    } catch (reelErr) {
      console.warn('Reel creation notice:', reelErr);
    }

    // 3. Update active in-memory products state
    setProducts(prev => [created, ...prev.filter(p => p.id !== created.id)]);
    return created;
  };

  const updateProduct = async (updatedProd) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
    try {
      await ProductService.updateProduct(updatedProd.id, updatedProd);
    } catch (e) {
      console.warn('Could not persist updated product:', e);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await ProductService.deleteProduct(productId);
      await ReelsService.deleteReel(`reel-${productId}`);
    } catch (e) {}
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const updateMerchant = async (merchantId, updatedFields) => {
    setMerchants(prev => prev.map(m => {
      if (m.id === merchantId || m.slug === updatedFields.slug) {
        return {
          ...m,
          ...updatedFields,
          themeColor: updatedFields.themeConfig?.accentColor || updatedFields.themeColor || m.themeColor,
          themeConfig: {
            ...(m.themeConfig || {}),
            ...(updatedFields.themeConfig || {})
          },
          layoutConfig: {
            ...(m.layoutConfig || {}),
            ...(updatedFields.layoutConfig || {})
          }
        };
      }
      return m;
    }));

    try {
      await ProductService.updateMerchant(merchantId, updatedFields);
    } catch (err) {
      console.warn('Merchant persistence error:', err);
    }
  };

  const [cartItems, setCartItems] = useState([]);

  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);
  const [quickBuyProduct, setQuickBuyProduct] = useState(INITIAL_PRODUCTS[0]);
  const [rewardPoints, setRewardPoints] = useState(2450);
  const [pointsRedeemed, setPointsRedeemed] = useState(500);
  const [unreadNotifications, setUnreadNotifications] = useState(() => 
    NotificationService.getUnreadCount('buyer', 'guest')
  );

  const refreshNotificationCount = () => {
    const count = NotificationService.getUnreadCount(user?.role || 'buyer', user?.id || 'guest');
    setUnreadNotifications(count);
  };

  useEffect(() => {
    refreshNotificationCount();
  }, [user]);

  const openCategoryPage = (categoryOrSlug) => {
    let catObj = categoryOrSlug;
    if (typeof categoryOrSlug === 'string') {
      catObj = ProductService.getCategoryBySlug(categoryOrSlug) || {
        id: categoryOrSlug,
        slug: categoryOrSlug,
        label: categoryOrSlug.charAt(0).toUpperCase() + categoryOrSlug.slice(1),
        labelAr: categoryOrSlug
      };
    } else if (categoryOrSlug?.id && !categoryOrSlug.labelAr) {
      const found = ProductService.getCategoryBySlug(categoryOrSlug.id);
      if (found) catObj = { ...found, ...categoryOrSlug };
    }
    setSelectedCategory(catObj);
    setActiveTab('category', { category: catObj });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setActiveTab('product', { product });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openQuickBuy = (product) => {
    setQuickBuyProduct(product || INITIAL_PRODUCTS[0]);
    setIsQuickBuyOpen(true);
  };

  const closeQuickBuy = () => {
    setIsQuickBuyOpen(false);
  };

  const addToCart = async (product, selectedVariant = {}) => {
    const size = selectedVariant.size || 'M';
    const color = selectedVariant.color || 'Default';
    
    // Save to CartService with full metadata
    await CartService.addToCart(
      product.id, 
      product.merchantId, 
      product.price, 
      1, 
      size, 
      color, 
      null, 
      product.title, 
      product.image, 
      product.merchant || product.brand || 'EG-Commerce'
    );
    
    const fetchedCart = await CartService.getCartItems();
    setCartItems(fetchedCart);
  };

  const updateQuantity = (cartItemId, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === cartItemId) {
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
    CartService.updateLocalQuantity(cartItemId, delta);
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));
    CartService.removeFromLocalCart(cartItemId);
  };

  const clearCart = async () => {
    setCartItems([]);
    try {
      await CartService.clearCart(user?.id || null);
    } catch (e) {
      console.warn('Error clearing cart:', e);
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountFromPoints = Math.floor(pointsRedeemed / 10);
  const shippingTotal = cartItems.length > 0 ? 60 : 0;
  const grandTotal = Math.max(0, subtotal - discountFromPoints + shippingTotal);

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      selectedProduct,
      openProductDetail,
      role,
      setRole,
      deviceMode,
      setDeviceMode,
      language,
      setLanguage,
      user,
      setUser,
      updateUserProfile,
      isAuthModalOpen,
      setIsAuthModalOpen,
      cartItems,
      setCartItems,
      clearCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      totalCartCount,
      subtotal,
      discountFromPoints,
      shippingTotal,
      grandTotal,
      rewardPoints,
      setRewardPoints,
      pointsRedeemed,
      setPointsRedeemed,
      isQuickBuyOpen,
      openQuickBuy,
      closeQuickBuy,
      quickBuyProduct,
      products,
      setProducts,
      merchants,
      setMerchants,
      creators,
      setCreators,
      selectedMerchantId,
      setSelectedMerchantId,
      activeStoreSlug,
      setActiveStoreSlug,
      orders,
      setOrders,
      updateOrderStatus,
      updateProductSyndication,
      addProduct,
      updateProduct,
      deleteProduct,
      updateMerchant,
      selectedCategory,
      setSelectedCategory,
      openCategoryPage,
      unreadNotifications,
      setUnreadNotifications,
      refreshNotificationCount,
      isSubdomainMode,
      setIsSubdomainMode,
      socialProfiles,
      activeProfile,
      activeProfileHandle,
      setActiveProfileHandle,
      navigateToProfile,
      navigateToMyProfile,
      refreshData,
      navigateToStorefront,
      navigateToDashboard,
      // Engine Services
      socialService,
      feedService,
      eventTracker,
      attributionService,
      interestService
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
