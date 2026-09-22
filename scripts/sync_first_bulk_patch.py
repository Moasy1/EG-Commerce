import json
import os
import sys

# Set stdout to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

data_dir = r'c:\Users\hmanm\Downloads\EG-Commerce\data'
pub_data_dir = r'c:\Users\hmanm\Downloads\EG-Commerce\public\data'
os.makedirs(data_dir, exist_ok=True)
os.makedirs(pub_data_dir, exist_ok=True)

# 8 Client stores with real assets
stores_data = [
    {
        'id': '14100000-0000-4000-8000-000000000001',
        'name': 'One Four One • ون فور ون',
        'shortName': 'One Four One',
        'slug': 'onefourone',
        'subdomain': 'onefourone.egyptian-commerce.com',
        'email': 'onefourone@egyptian-commerce.com',
        'password': 'adminpassword',
        'logo': '/images/brands/onefourone_logo.jpg',
        'banner': '/images/products/onefourone_summer_tee.webp',
        'category': 'Urban Streetwear & Casuals',
        'categoryAr': 'أزياء شبابية وستريت وير',
        'bio': '🔥 براند مصري رائد في الستريت وير والأزياء العصرية الصيفية بالقاهرة 🇪🇬 | تشكيلة حصرية بخامات قطنية ممتازة',
        'themeColor': '#0f172a',
        'products': [
            {
                'id': '14100000-p001-4000-8000-000000000001',
                'sku': 'OFO-SUMMER-TEE',
                'title': 'One Four One Summer Graphic Tee • تيشرت ون فور ون الصيفي',
                'price': 620,
                'originalPrice': 780,
                'stock': 45,
                'image': '/images/products/onefourone_summer_tee.webp',
                'images': ['/images/products/onefourone_summer_tee.webp'],
                'video': '/images/reels/onefourone_summer_drop.mp4',
                'category': 'Streetwear ستريت وير وكاجوال',
                'description': 'تيشرت صيفي بطباعة جرافيك عصرية وألوان صيفية منعشة من ون فور ون، خامة قطنية 100% باردة ومناسبة لحرارة الصيف.'
            }
        ],
        'reel': {
            'id': '14100000-r001-4000-8000-000000000001',
            'video': '/images/reels/onefourone_summer_drop.mp4',
            'caption': 'Summer drop is officially here! تشكيلة الصيف الجديدة من One Four One متوفرة الآن بخامات قطنية نقية ☀️🔥 #onefourone #streetwear #cairo'
        }
    },
    {
        'id': '40000000-0000-4000-8000-000000000002',
        'name': '4U Store • فور يو',
        'shortName': '4U Store',
        'slug': '4u-store',
        'subdomain': '4u.egyptian-commerce.com',
        'email': '4u@egyptian-commerce.com',
        'password': 'adminpassword',
        'logo': '/images/brands/4u_store_logo.webp',
        'banner': '/images/products/4u_sunglasses_luxury.webp',
        'category': 'Luxury Eyewear & Sunglasses',
        'categoryAr': 'نظارات شمسية واكسسوارات فاخرة',
        'bio': '🕶️ تشكيلات نظارات شمسية كاجوال وموديلات عصرية أصلية 100% مع حماية UV كاملة وشحن لجميع محافظات مصر',
        'themeColor': '#000000',
        'products': [
            {
                'id': '40000000-p001-4000-8000-000000000002',
                'sku': '4U-SUN-SHADES',
                'title': '4U Signature Luxury Sunglasses • نظارة شمسية كلاسيك فاخرة 4U',
                'price': 750,
                'originalPrice': 950,
                'stock': 60,
                'image': '/images/products/4u_sunglasses_luxury.webp',
                'images': ['/images/products/4u_sunglasses_luxury.webp'],
                'video': '/images/reels/4u_store_shades.mp4',
                'category': 'Accessories إكسسوارات ونظارات',
                'description': 'نظارة شمسية فاخرة بإطار متين وعدسات مستقطبة عاكسة ومقاومة للخدوش توفر حماية فائقة من أشعة الشمس فوق البنفسجية UV400.'
            }
        ],
        'reel': {
            'id': '40000000-r001-4000-8000-000000000002',
            'video': '/images/reels/4u_store_shades.mp4',
            'caption': 'أقوى تشكيلة نظارات شمسية لصيف 2026 من 4U Store حماية كاملة UV400 وتصميم عصري لا يُقاوم 😎✨ #4u_store #نظارات_شمس #موضة'
        }
    },
    {
        'id': '171842bd-daed-40ef-853f-917eab2ed437',
        'name': 'Drip Fit • دريب فيت',
        'shortName': 'Drip Fit',
        'slug': 'drip-fit',
        'subdomain': 'drip-fit.egyptian-commerce.com',
        'email': 'dripfit@egyptian-commerce.com',
        'password': 'adminpassword',
        'logo': '/images/brands/dripfit_logo.png',
        'banner': '/images/products/the_sharp_v_yellow_1.webp',
        'category': 'Urban Streetwear & Summer Tops',
        'categoryAr': 'ستريت وير وتوبات صيفية عصرية',
        'bio': '✨ براند مصري عصري للأزياء والملابس الصيفية والستريت وير بالقاهرة 🇪🇬 | تصاميم صيفية حصرية وشحن سريع لجميع المحافظات',
        'themeColor': '#d00000',
        'products': [
            {
                'id': '11111111-d001-4000-8000-000000000001',
                'sku': 'DF-SHARP-V-YEL',
                'title': 'The Sharp V Yellow Oversized T-Shirt • تيشرت شارب في أصفر أوفرسايز',
                'price': 680,
                'originalPrice': 850,
                'stock': 50,
                'image': '/images/products/the_sharp_v_yellow_1.webp',
                'images': [
                    '/images/products/the_sharp_v_yellow_1.webp',
                    '/images/products/the_sharp_v_yellow_2.webp'
                ],
                'video': '/images/reels/the_sharp_v_yellow_reel.mp4',
                'category': 'Streetwear ستريت وير وكاجوال',
                'description': 'تيشرت أوفرسايز فاخر باللون الأصفر العصري مع تصميم Sharp V المميز. مصنوع من أجود أنواع القطن المصري المعالج لملمس ناعم وراحة فائقة طوال اليوم.'
            }
        ],
        'reel': {
            'id': '22222222-d001-4000-8000-000000000001',
            'video': '/images/reels/the_sharp_v_yellow_reel.mp4',
            'caption': 'The Sharp V Yellow drop is here! خامة قطنية استثنائية 100% وقصة أوفرسايز تليق بيومك وتمرينك 💛🔥 متوفر الآن حصرياً عبر متجر Drip Fit #DripFit #Streetwear #موضة_مصرية'
        }
    },
    {
        'id': '50000000-0000-4000-8000-000000000004',
        'name': 'Snugs • سناجز',
        'shortName': 'Snugs',
        'slug': 'snugs',
        'subdomain': 'snugs.egyptian-commerce.com',
        'email': 'snugs@egyptian-commerce.com',
        'password': 'adminpassword',
        'logo': '/images/brands/snugs_logo.jpg',
        'banner': '/images/products/snugs_cozy_sleepwear.webp',
        'category': 'Loungewear & Cozy Sleepwear',
        'categoryAr': 'ملابس منزلية وبيجامات قطنية ناعمة',
        'bio': '🧸 بيجامات وملابس منزلية فائقة الراحة والنعومة لكل أفراد العائلة من سناجز | خامات مريحة وتصاميم مبهجة',
        'themeColor': '#e11d48',
        'products': [
            {
                'id': '50000000-p001-4000-8000-000000000004',
                'sku': 'SNG-COZY-PJ',
                'title': 'Snugs Ultra-Soft Cozy Pajama Set • بيجامة سناجز القطنية فائقة النعومة',
                'price': 720,
                'originalPrice': 890,
                'stock': 40,
                'image': '/images/products/snugs_cozy_sleepwear.webp',
                'images': ['/images/products/snugs_cozy_sleepwear.webp'],
                'video': '/images/reels/snugs_cozy_reel.mp4',
                'category': 'Loungewear ملابس منزلية وبيجامات',
                'description': 'طقم بيجامة قطنية منزلية ناعمة توفر لك أقصى درجات الراحة والاسترخاء في البيت بخامات طبيعية لطيفة على البشرة.'
            }
        ],
        'reel': {
            'id': '50000000-r001-4000-8000-000000000004',
            'video': '/images/reels/snugs_cozy_reel.mp4',
            'caption': 'School’s back in session 🎒📚 And Snuggs is here with the comfiest PJs for all the fam ✨ راحة وأناقة داخل البيت مع سناجز #snugs #بيجامات #راحة #loungewear'
        }
    },
    {
        'id': '60000000-0000-4000-8000-000000000005',
        'name': 'Rakan Fragrances • رَكان للعطور',
        'shortName': 'Rakan Fragrances',
        'slug': 'rakan-fragrances',
        'subdomain': 'rakan.egyptian-commerce.com',
        'email': 'rakan@egyptian-commerce.com',
        'password': 'adminpassword',
        'logo': '/images/brands/rakan_fragrances_logo.jpg',
        'banner': '/images/products/rakan_luxury_perfume.webp',
        'category': 'Artisanal & Niche Perfumes',
        'categoryAr': 'عطور نيش فاخرة وتوليفات خاصة',
        'bio': '👑 عطور نيش فاخرة وتوليفات شرقية وغربية فريدة بثبات وفوحان يدوم طويلاً | الإسماعيلية والقاهرة وشحن لجميع أنحاء الجمهورية',
        'themeColor': '#b45309',
        'products': [
            {
                'id': '60000000-p001-4000-8000-000000000005',
                'sku': 'RKN-ROYAL-BLEND',
                'title': 'Rakan Royal Blend Niche Perfume • عطر رَكان الملكي الفاخر',
                'price': 1150,
                'originalPrice': 1450,
                'stock': 35,
                'image': '/images/products/rakan_luxury_perfume.webp',
                'images': ['/images/products/rakan_luxury_perfume.webp'],
                'video': '/images/reels/rakan_fragrances_reel.mp4',
                'category': 'Fragrances عطور وبخور',
                'description': 'عطر ركان الملكي بتركيز Extrait De Parfum الفاخر، مزيج راقٍ من العود الملكي مع لمسات العنبر والزهور النادرة ليمنحك هيبة وحضوراً لا يُنسى.'
            }
        ],
        'reel': {
            'id': '60000000-r001-4000-8000-000000000005',
            'video': '/images/reels/rakan_fragrances_reel.mp4',
            'caption': 'مش طبيعي 🤯 ثبات وفوحان لا يُقارن مع توليفة رَكان الخاصة المصممة لأصحاب الذوق الرفيع 👑 متوفر للطلب الفوري #عطور #رَكان #fragrance #perfume'
        }
    },
    {
        'id': '70000000-0000-4000-8000-000000000006',
        'name': 'Vermelle • فيرميل',
        'shortName': 'Vermelle',
        'slug': 'vermelle',
        'subdomain': 'vermelle.egyptian-commerce.com',
        'email': 'vermelle@egyptian-commerce.com',
        'password': 'adminpassword',
        'logo': '/images/brands/vermelle_logo.jpg',
        'banner': '/images/products/vermelle_heritage_dress.webp',
        'category': 'High-End Egyptian Fashion & Heritage',
        'categoryAr': 'أزياء راقية وتراث مصري معاصر',
        'bio': '🩵 تصاميم نسائية فاخرة مستوحاة من عراقة التراث والجمال المصري بلمسات عصرية تناسب كل مناسبة مميزة',
        'themeColor': '#0284c7',
        'products': [
            {
                'id': '70000000-p001-4000-8000-000000000006',
                'sku': 'VRM-HERITAGE-SET',
                'title': 'Vermelle Heritage Embroidered Ensemble • تصميم فيرميل التراثي الراقي',
                'price': 1450,
                'originalPrice': 1800,
                'stock': 25,
                'image': '/images/products/vermelle_heritage_dress.webp',
                'images': ['/images/products/vermelle_heritage_dress.webp'],
                'video': '/images/reels/vermelle_heritage_reel.mp4',
                'category': 'Fashion أزياء وفساتين راقية',
                'description': 'إطلالة فيرميل التراثية المطرزة بدقة وعناية فائقة، تجمع بين الخامات النقية والتطريز الفاخر لتعكس أصالة الهوية المصرية بأحدث خطوط الموضة.'
            }
        ],
        'reel': {
            'id': '70000000-r001-4000-8000-000000000006',
            'video': '/images/reels/vermelle_heritage_reel.mp4',
            'caption': 'A collection shaped by beauty and heritage 🩵 تشكيلة فيرميل المستوحاة من أصالة التراث والجمال المصري المعاصر متوفرة الآن حصرياً #vermelle #fashion #egyptian_heritage'
        }
    },
    {
        'id': '80000000-0000-4000-8000-000000000007',
        'name': 'liminal • ليمينال',
        'shortName': 'liminal',
        'slug': 'liminal',
        'subdomain': 'liminal.egyptian-commerce.com',
        'email': 'liminal@egyptian-commerce.com',
        'password': 'adminpassword',
        'logo': '/images/brands/liminal_logo.jpg',
        'banner': '/images/products/liminal_modern_silhouette.webp',
        'category': 'Contemporary Minimalist Silhouette',
        'categoryAr': 'أزياء مودرن مينيمال وقصات عصرية',
        'bio': '✨ استكشاف للأنوثة المعاصرة من خلال الشكل والقصة الانسيابية | تصاميم مدروسة للأناقة اليومية الهادئة',
        'themeColor': '#18181b',
        'products': [
            {
                'id': '80000000-p001-4000-8000-000000000007',
                'sku': 'LMN-MINIMAL-SET',
                'title': 'Liminal Modern Minimalist Tailored Set • طقم ليمينال العصري البسيط',
                'price': 980,
                'originalPrice': 1250,
                'stock': 30,
                'image': '/images/products/liminal_modern_silhouette.webp',
                'images': ['/images/products/liminal_modern_silhouette.webp'],
                'video': '/images/reels/liminal_silhouette_reel.mp4',
                'category': 'Fashion أزياء ومودرن مينيمال',
                'description': 'طقم كاجوال أنيق بتصميم مينيمال انسيابي يمنحك حرية الحركة وشعوراً بالخفة والتميز في كل مناسبة.'
            }
        ],
        'reel': {
            'id': '80000000-r001-4000-8000-000000000007',
            'video': '/images/reels/liminal_silhouette_reel.mp4',
            'caption': 'An exploration of modern femininity through form and silhouette. ليمينال يقدم البساطة المعمارية في أزياء تبرز جمالك اليومي ✨ #liminal #minimalist #fashion'
        }
    },
    {
        'id': '90000000-0000-4000-8000-000000000008',
        'name': 'JK Perfumes • جي كي للعطور',
        'shortName': 'JK Perfumes',
        'slug': 'jk-perfumes',
        'subdomain': 'jk-perfumes.egyptian-commerce.com',
        'email': 'jkperfumes@egyptian-commerce.com',
        'password': 'adminpassword',
        'logo': '/images/brands/jk_perfumes_logo.jpg',
        'banner': '/images/products/jk_butterfly_perfume.webp',
        'category': 'Luxury Perfumes & Fragrances',
        'categoryAr': 'عطور فاخرة وتركيبات شرقية وفرنسية',
        'bio': '🌸 تشكيلة عطور ساحرة تلائم كل الأذواق والشخصيات من جي كي للعطور | نفحات زهرية منعشة وعبير فرنسي أنثوي جذاب',
        'themeColor': '#c026d3',
        'products': [
            {
                'id': '90000000-p001-4000-8000-000000000008',
                'sku': 'JK-BUTTERFLY-EDP',
                'title': 'JK Butterfly Eau De Parfum • عطر بتر فلاي الزهري المنعش',
                'price': 890,
                'originalPrice': 1100,
                'stock': 50,
                'image': '/images/products/jk_butterfly_perfume.webp',
                'images': ['/images/products/jk_butterfly_perfume.webp'],
                'video': '/images/reels/jk_perfumes_reel.mp4',
                'category': 'Fragrances عطور وبخور',
                'description': 'عطر بتر فلاي من جي كي بنفحات زهرية رقيقة ومنعشة تأسر الحواس، ثبات طويل وعبير مبهج مناسب لأوقات النهار والصيف.'
            },
            {
                'id': '90000000-p002-4000-8000-000000000008',
                'sku': 'JK-DIVA-ROUGE-EDP',
                'title': 'JK Diva Rouge Eau De Parfum • عطر ديفا روج الساحر',
                'price': 950,
                'originalPrice': 1200,
                'stock': 45,
                'image': '/images/products/jk_diva_rouge_perfume.webp',
                'images': ['/images/products/jk_diva_rouge_perfume.webp'],
                'video': '/images/reels/jk_perfumes_reel.mp4',
                'category': 'Fragrances عطور وبخور',
                'description': 'عطر ديفا روج الملكي بتركيبة أنثوية جذابة تجمع بين الفواكه الحمراء والتوابل الدافئة والفانيليا لإطلالة مسائية ساحرة.'
            }
        ],
        'reel': {
            'id': '90000000-r001-4000-8000-000000000008',
            'video': '/images/reels/jk_perfumes_reel.mp4',
            'caption': 'اختاري اللي يناسب شخصيتك 🤍 Butterfly بنفحاته المنعشة ولا Diva Rouge بجاذبيته الملكية؟ 👀✨ متوفر الآن لدى JK Perfumes #عطور #JK_Perfumes #perfume'
        }
    }
]

# 1. Build reels array
reels_list = []
for s in stores_data:
    r = s['reel']
    reel_prods = []
    for p in s['products']:
        disc_pct = int((1 - p['price'] / p['originalPrice']) * 100)
        reel_prods.append({
            'id': p['id'],
            'sku': p['sku'],
            'title': p['title'],
            'merchantId': s['id'],
            'price': p['price'],
            'originalPrice': p['originalPrice'],
            'discount': f'{disc_pct}% OFF',
            'image': p['image']
        })
    reels_list.append({
        'id': r['id'],
        'creatorHandle': f"@{s['slug']}",
        'creatorName': s['name'],
        'avatar': s['logo'],
        'videoBg': r['video'],
        'thumbnail': s['banner'],
        'caption': r['caption'],
        'music': f"{s['shortName']} Original Audio • القاهرة 2026",
        'likes': 1850,
        'comments': 24,
        'saves': 430,
        'categoryId': 'fashion',
        'merchantId': s['id'],
        'storeSlug': s['slug'],
        'qualityScore': 1.0,
        'trendScore': 0.99,
        'isMerchantReel': True,
        'publisherRole': 'merchant',
        'publisherId': s['id'],
        'createdAt': '2026-09-22T00:00:00.000Z',
        'products': reel_prods
    })

# Save reels to data/shared_reels.json & public/data/shared_reels.json
for pth in [os.path.join(data_dir, 'shared_reels.json'), os.path.join(pub_data_dir, 'shared_reels.json')]:
    with open(pth, 'w', encoding='utf-8') as f:
        json.dump(reels_list, f, indent=2, ensure_ascii=False)
    print(f'Saved {len(reels_list)} reels to {pth}')

# 2. Build registered accounts registry
users_dict = {}
for s in stores_data:
    email_clean = s['email'].lower().strip()
    users_dict[email_clean] = {
        'id': s['id'],
        'email': email_clean,
        'password': s['password'],
        'name': s['name'],
        'role': 'merchant',
        'merchant_id': s['id'],
        'store_slug': s['slug'],
        'store_name': s['name'],
        'avatar_url': s['logo'],
        'is_merchant': True,
        'reward_points_balance': 1000,
        'user_metadata': {
            'name': s['name'],
            'role': 'merchant',
            'merchant_id': s['id']
        }
    }

# Alias drip.fit_egy@eg-commerce.com
users_dict['drip.fit_egy@eg-commerce.com'] = {
    **users_dict['dripfit@egyptian-commerce.com'],
    'email': 'drip.fit_egy@eg-commerce.com'
}

for pth in [os.path.join(data_dir, 'registered_users.json'), os.path.join(pub_data_dir, 'registered_users.json')]:
    with open(pth, 'w', encoding='utf-8') as f:
        json.dump(users_dict, f, indent=2, ensure_ascii=False)
    print(f'Saved {len(users_dict)} registered merchant accounts to {pth}')

print('Done creating reels and registered users json!')
