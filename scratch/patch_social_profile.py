import re

path = r'c:\Users\hmanm\Downloads\EG-Commerce\src\pages\SocialProfile.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Clean linen abaya from highlights
content = content.replace("img: '/images/products/linen_abaya.jpg'", "img: '/images/products/the_sharp_v_yellow_1.webp'")

# 2. Add event listeners for eg_reels_updated and eg_merchant_updated
old_effect = """  useEffect(() => {
    let isMounted = true;
    async function fetchReels() {
      setIsLoadingReels(true);
      try {
        const allReels = await ReelsService.getReels();"""

new_effect = """  useEffect(() => {
    let isMounted = true;
    async function fetchReels() {
      setIsLoadingReels(true);
      try {
        const allReels = await ReelsService.getReels();"""

old_mount_cleanup = """    fetchReels();
    return () => { isMounted = false; };
  }, [currentProfile.id, currentProfile.merchantId, currentProfile.creatorId, currentProfile.handle, currentProfile.slug, currentProfile.role, isAr]);"""

new_mount_cleanup = """    fetchReels();
    const handleReelsUpdated = () => {
      fetchReels();
    };
    window.addEventListener('eg_reels_updated', handleReelsUpdated);
    window.addEventListener('eg_merchant_updated', handleReelsUpdated);
    return () => {
      isMounted = false;
      window.removeEventListener('eg_reels_updated', handleReelsUpdated);
      window.removeEventListener('eg_merchant_updated', handleReelsUpdated);
    };
  }, [currentProfile.id, currentProfile.merchantId, currentProfile.creatorId, currentProfile.handle, currentProfile.slug, currentProfile.role, isAr]);"""

if old_mount_cleanup in content:
    content = content.replace(old_mount_cleanup, new_mount_cleanup)
    print("Added eg_reels_updated listener to SocialProfile.jsx")
else:
    print("WARNING: old_mount_cleanup not matched")

# 3. Merge custom saved merchant profile data dynamically
old_profile_init = """  // Fallback profile if activeProfile is null
  const currentProfile = activeProfile || (socialProfiles && socialProfiles['drip-fit']) || {"""

new_profile_init = """  // Fallback profile if activeProfile is null
  const baseProfile = activeProfile || (socialProfiles && socialProfiles['drip-fit']) || {"""

if old_profile_init in content:
    content = content.replace(old_profile_init, new_profile_init)
    
    # Insert mergedProfile logic
    insertion = """
  // Merge live custom merchant storefront / profile customizations
  const currentProfile = (() => {
    try {
      const merchId = baseProfile.merchantId || baseProfile.id;
      const slug = baseProfile.slug;
      const raw = localStorage.getItem(`eg_merchant_settings_${merchId}`) || 
                  (slug ? localStorage.getItem(`eg_merchant_settings_${slug}`) : null);
      if (!raw) return baseProfile;
      const parsed = JSON.parse(raw);
      return {
        ...baseProfile,
        name: parsed.name || baseProfile.name,
        bio: parsed.bio || baseProfile.bio,
        avatar: parsed.logo || baseProfile.avatar,
        banner: parsed.banner || baseProfile.banner,
        categoryAr: parsed.categoryAr || baseProfile.categoryAr,
        whatsapp: parsed.whatsapp || baseProfile.whatsapp,
        instagram: parsed.instagram || baseProfile.instagram,
        website: parsed.customDomain || parsed.subdomain || baseProfile.website
      };
    } catch (e) {
      return baseProfile;
    }
  })();
"""
    # Find where baseProfile ends
    marker = "    reelsCount: 8\n  };\n"
    if marker in content:
        content = content.replace(marker, marker + insertion)
        print("Merged dynamic profile customizations in SocialProfile.jsx")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("SocialProfile.jsx patched successfully")
