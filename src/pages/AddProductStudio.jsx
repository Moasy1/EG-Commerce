import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import EgLogo from '../components/common/EgLogo';

export default function AddProductStudio() {
  const { setActiveTab, addProduct } = useApp();

  // Form State
  const [productName, setProductName] = useState('فستان مطرز مصري فاخر');
  const [description, setDescription] = useState(
    'فستان أنيق بتطريز يدوي مستوحى من التراث المصري، مصنوع من قماش عالي الجودة مناسب للمناسبات والإطلالات الخاصة، يجمع بين الأصالة والموضة العصرية.'
  );
  const [price, setPrice] = useState(1250);
  const [category, setCategory] = useState('الفساتين');
  const [quantity, setQuantity] = useState(20);
  const [selectedSizes, setSelectedSizes] = useState(['L']);
  const [selectedColor, setSelectedColor] = useState('red');
  const [shippingEnabled, setShippingEnabled] = useState(true);
  const [governorate, setGovernorate] = useState('جميع المحافظات');
  const [area, setArea] = useState('جميع المناطق');
  const [codEnabled, setCodEnabled] = useState(true);
  const [specs, setSpecs] = useState('أضف مواصفات المنتج مثل الخامة، القصة، تعليمات الغسيل...');

  // Video Player state
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(35); // percentage

  // Published toast
  const [publishedToast, setPublishedToast] = useState(false);

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handlePublish = (e) => {
    e.preventDefault();
    const newProd = {
      id: `p-${Date.now()}`,
      title: productName,
      price: Number(price),
      category: category,
      image: '/images/products/linen_abaya.jpg',
      rating: 5.0,
      reviewsCount: 1,
      stock: Number(quantity),
      sizes: selectedSizes,
      isSyndicated: true
    };
    addProduct(newProd);
    setPublishedToast(true);
    setTimeout(() => {
      setPublishedToast(false);
      setActiveTab('dashboard');
    }, 2000);
  };

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col font-sans select-none text-right" dir="rtl">
      {/* Top Breadcrumb & Action Banner */}
      <div className="w-full bg-white border-b border-gray-200/80 px-4 md:px-8 py-3.5 sticky top-0 md:top-14 z-20 shadow-2xs">
        <div className="max-w-[1780px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-slate-900 transition-colors"
              title="العودة للوحة التحكم"
            >
              <span className="material-symbols-outlined text-[20px] rtl:rotate-180">arrow_back</span>
            </button>
            <div>
              <h1 className="text-sm md:text-base font-black text-slate-900 leading-tight">استوديو إضافة منتج جديد</h1>
              <p className="text-[11px] text-gray-500 hidden sm:block">ارفع فيديو ريلز تفاعلي وحدد المقاسات والمخزون والشحن الموحد</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            >
              إلغاء
            </button>
            <button 
              onClick={handlePublish}
              className="px-5 py-2 text-xs font-bold bg-[#d00000] hover:bg-[#b00000] text-white rounded-xl shadow-md shadow-red-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">publish</span>
              <span>نشر المنتج الآن</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE WITH RIGHT SIDEBAR (Matching Image 1)                   */}
      {/* ========================================================================= */}
      <div className="max-w-[1780px] mx-auto w-full flex flex-1 p-4 md:p-6 gap-6">
        {/* RIGHT SIDEBAR (RTL) */}
        <aside className="w-56 shrink-0 hidden md:flex flex-col justify-between">
          <div className="space-y-4">
            <nav className="space-y-1 text-xs font-bold">
              <button 
                onClick={() => setActiveTab('reels')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200/60 transition-all"
              >
                <span className="material-symbols-outlined text-[19px]">home</span>
                <span>الرئيسية</span>
              </button>

              <button 
                onClick={() => setActiveTab('shop')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200/60 transition-all"
              >
                <span className="material-symbols-outlined text-[19px]">inventory_2</span>
                <span>المنتجات</span>
              </button>

              {/* ACTIVE RED PILL: إضافة منتج */}
              <button 
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#d00000] text-white shadow-sm"
              >
                <span className="material-symbols-outlined text-[19px]">add_circle</span>
                <span>إضافة منتج</span>
              </button>

              <button 
                onClick={() => setActiveTab('shop')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200/60 transition-all"
              >
                <span className="material-symbols-outlined text-[19px]">format_list_bulleted</span>
                <span>قائمتي</span>
              </button>

              <button 
                onClick={() => setActiveTab('dashboard')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200/60 transition-all"
              >
                <span className="material-symbols-outlined text-[19px]">shopping_bag</span>
                <span>الطلبات</span>
              </button>

              <button 
                onClick={() => setActiveTab('dashboard')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200/60 transition-all"
              >
                <span className="material-symbols-outlined text-[19px]">equalizer</span>
                <span>التحليلات</span>
              </button>

              <button 
                onClick={() => setActiveTab('storefront')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200/60 transition-all"
              >
                <span className="material-symbols-outlined text-[19px]">storefront</span>
                <span>المتجر</span>
              </button>

              <button 
                onClick={() => setActiveTab('dashboard')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200/60 transition-all"
              >
                <span className="material-symbols-outlined text-[19px]">settings</span>
                <span>الإعدادات</span>
              </button>
            </nav>
          </div>

          {/* Bottom Card: ابدأ في بيع منتجات الموضة المصرية */}
          <div className="rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 p-4 space-y-2 text-right relative overflow-hidden shadow-xs">
            <div className="w-12 h-14 rounded-xl overflow-hidden shadow-sm">
              <img src="/images/products/linen_abaya.jpg" alt="Fashion" className="w-full h-full object-cover" />
            </div>
            <h4 className="text-xs font-black text-slate-900 leading-tight">ابدأ في بيع منتجات الموضة المصرية</h4>
            <p className="text-[10px] text-gray-600 leading-snug">ارفع منتجك ووصل لآلاف المشترين الآن</p>
            <div className="pt-1 flex justify-end">
              <div className="w-7 h-7 rounded-full bg-[#d00000] text-white flex items-center justify-center cursor-pointer shadow-xs hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN MULTI-COLUMN FORM (Left Preview, Center Upload, Right Form) */}
        <main className="flex-1 flex flex-col space-y-4 min-w-0">
          {/* Breadcrumb & Title */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                <span className="hover:text-slate-800 cursor-pointer" onClick={() => setActiveTab('shop')}>المنتجات</span>
                <span>/</span>
                <span className="text-[#d00000] font-bold">إضافة منتج</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <h1 className="text-xl font-black text-slate-900">إضافة منتج</h1>
                <span className="w-6 h-6 rounded-full bg-[#d00000] text-white flex items-center justify-center text-sm font-bold shadow-xs">
                  +
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">قم برفع فيديو المنتج وصورته، وأضف التفاصيل لبدء البيع</p>
            </div>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* COLUMN 1 (Left): Live 9:16 Video Preview & Product Photos (4 cols) */}
            <div className="xl:col-span-4 space-y-5">
              {/* Video Preview Card */}
              <div className="bg-white rounded-3xl border border-gray-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-gray-500">videocam</span>
                    <span>معاينة الفيديو</span>
                  </h3>
                  <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">visibility</span>
                    <span>معاينة</span>
                  </span>
                </div>

                {/* 9:16 Video Player Container */}
                <div className="relative aspect-[9/16] w-full max-w-[320px] mx-auto rounded-2xl overflow-hidden bg-black shadow-md group">
                  <img 
                    src="/images/products/linen_abaya.jpg" 
                    alt="Video Preview Model"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

                  {/* Overlay Product Badge (Matching Screenshot) */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-xl p-2 flex items-center gap-2.5 shadow-lg max-w-[210px] border border-white/50 text-right">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                      <img src="/images/products/linen_abaya.jpg" alt="Thumb" className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] font-bold text-slate-900 block truncate">{productName}</span>
                      <span className="text-[11px] font-black text-[#d00000] block mt-0.5">EGP {price.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Center Play/Pause Pulsing Icon */}
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
                  >
                    <span className="material-symbols-outlined text-[28px]">
                      {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>

                  {/* Video Player Timeline Controls (Bottom) */}
                  <div className="absolute bottom-0 inset-x-0 p-3 text-white space-y-1.5 z-20">
                    <div className="w-full h-1 bg-white/40 rounded-full overflow-hidden cursor-pointer">
                      <div className="h-full bg-[#d00000] rounded-full" style={{ width: `${videoProgress}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-white/90">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setIsPlaying(!isPlaying)}>
                          <span className="material-symbols-outlined text-[15px]">{isPlaying ? 'pause' : 'play_arrow'}</span>
                        </button>
                        <span>0:00 / 0:15</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setIsMuted(!isMuted)}>
                          <span className="material-symbols-outlined text-[15px]">{isMuted ? 'volume_off' : 'volume_up'}</span>
                        </button>
                        <button>
                          <span className="material-symbols-outlined text-[15px]">fullscreen</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Photos Upload Gallery */}
              <div className="bg-white rounded-3xl border border-gray-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-gray-500">photo_library</span>
                    <span>صور المنتج</span>
                  </h3>
                </div>

                {/* 4 Thumbnails + Add Button */}
                <div className="grid grid-cols-5 gap-2">
                  {[
                    '/images/products/linen_abaya.jpg',
                    '/images/products/silk_dress.jpg',
                    '/images/products/linen_shirt.jpg',
                    '/images/products/wool_blazer.jpg',
                  ].map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 group cursor-pointer">
                      <img src={img} alt="Product view" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <button className="absolute top-1 left-1 w-4 h-4 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* Add Photos Button */}
                  <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-[#d00000] hover:text-[#d00000] cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                    <span className="text-[9px] font-bold mt-1">إضافة صور</span>
                    <input type="file" multiple accept="image/*" className="hidden" />
                  </label>
                </div>

                <p className="text-[10px] text-gray-400">يمكنك رفع حتى 10 صور • الحد الأقصى لحجم الصورة 5 ميجابايت</p>
              </div>
            </div>

            {/* COLUMN 2 (Center): Video Upload Dropzone & Additional Specs (3 cols) */}
            <div className="xl:col-span-3 space-y-5">
              {/* Upload Video Dropzone */}
              <div className="bg-white rounded-3xl border border-gray-200 p-4 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#d00000]">video_call</span>
                  <span>رفع فيديو</span>
                </h3>

                {/* Dashed Dropzone */}
                <div className="border-2 border-dashed border-red-300 rounded-2xl p-6 text-center space-y-3 bg-red-50/20 hover:bg-red-50/40 transition-colors cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-red-100 mx-auto flex items-center justify-center text-[#d00000] shadow-xs">
                    <span className="material-symbols-outlined text-[30px]">cloud_upload</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">اسحب الفيديو هنا أو اضغط للرفع</h4>
                    <p className="text-[10px] text-gray-500 mt-1">يفضل أن يكون الفيديو عمودياً (9:16)</p>
                    <p className="text-[10px] text-gray-400">الحد الأقصى للحجم 100 ميجابايت</p>
                  </div>
                </div>

                {/* 3 Specs Badges */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="material-symbols-outlined text-[16px] text-gray-400 block mb-0.5">aspect_ratio</span>
                    <span className="text-[11px] font-bold text-slate-800 block font-mono">9:16</span>
                    <span className="text-[9px] text-gray-500">نسبة الفيديو</span>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="material-symbols-outlined text-[16px] text-gray-400 block mb-0.5">movie</span>
                    <span className="text-[11px] font-bold text-slate-800 block font-mono">MP4</span>
                    <span className="text-[9px] text-gray-500">صيغة مقبولة</span>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="material-symbols-outlined text-[16px] text-gray-400 block mb-0.5">timer</span>
                    <span className="text-[11px] font-bold text-slate-800 block">حتى 60 ثانية</span>
                    <span className="text-[9px] text-gray-500">مدة الفيديو</span>
                  </div>
                </div>
              </div>

              {/* Additional Specs & Specifications */}
              <div className="bg-white rounded-3xl border border-gray-200 p-4 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-gray-500">label</span>
                  <span>تفاصيل إضافية</span>
                </h3>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-700 block">المواصفات</label>
                  <textarea
                    rows={4}
                    value={specs}
                    onChange={(e) => setSpecs(e.target.value)}
                    placeholder="أضف مواصفات المنتج مثل الخامة، القصة، تعليمات الغسيل..."
                    className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:border-[#d00000] focus:outline-none bg-gray-50"
                  />
                </div>

                {/* Cash on Delivery Toggle */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">وسائل الدفع والدفع عند الاستلام</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={codEnabled} 
                      onChange={(e) => setCodEnabled(e.target.checked)} 
                      className="sr-only peer" 
                    />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d00000]" />
                  </label>
                </div>
              </div>
            </div>

            {/* COLUMN 3 (Right): Main Product Details & Form (5 cols) */}
            <div className="xl:col-span-5 space-y-5">
              <form onSubmit={handlePublish} className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-4 text-right">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                  <span className="material-symbols-outlined text-[18px] text-[#d00000]">receipt_long</span>
                  <h3 className="text-sm font-bold text-slate-900">تفاصيل المنتج</h3>
                </div>

                {/* Product Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">
                    <span className="text-[#d00000]">*</span> اسم المنتج
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="فستان مطرز مصري فاخر"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#d00000] focus:outline-none bg-gray-50"
                  />
                </div>

                {/* Product Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">
                    <span className="text-[#d00000]">*</span> وصف المنتج
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="اكتب وصفاً مفصلاً للمنتج..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#d00000] focus:outline-none bg-gray-50 leading-relaxed"
                  />
                </div>

                {/* Category & Price (2 cols) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">
                      <span className="text-[#d00000]">*</span> التصنيف
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#d00000] focus:outline-none bg-gray-50 cursor-pointer"
                    >
                      <option value="الفساتين">الفساتين</option>
                      <option value="الجلابيات">الجلابيات</option>
                      <option value="العبايات">العبايات</option>
                      <option value="ملابس نسائية">ملابس نسائية</option>
                      <option value="ملابس رجالية">ملابس رجالية</option>
                      <option value="إكسسوارات">إكسسوارات</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">
                      <span className="text-[#d00000]">*</span> السعر (د.م / EGP)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="1250"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:border-[#d00000] focus:outline-none bg-gray-50"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 font-mono">د.م</span>
                    </div>
                  </div>
                </div>

                {/* Quantity, Sizes & Color (3 cols) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {/* Quantity Counter */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">
                      <span className="text-[#d00000]">*</span> الكمية
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 px-2 py-1">
                      <button
                        type="button"
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="w-6 h-6 rounded-md hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-mono font-bold text-xs">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(prev => prev + 1)}
                        className="w-6 h-6 rounded-md hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Sizes (S, M, L active red, XL, XXL) */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-800 block">
                      <span className="text-[#d00000]">*</span> المقاسات
                    </label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSize(s)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border ${
                            selectedSizes.includes(s)
                              ? 'bg-[#d00000] text-white border-[#d00000] shadow-xs'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Color Swatches */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-slate-800 block">
                    <span className="text-[#d00000]">*</span> اللون
                  </label>
                  <div className="flex items-center gap-2">
                    {[
                      { id: 'red', color: 'bg-red-600' },
                      { id: 'black', color: 'bg-black' },
                      { id: 'emerald', color: 'bg-emerald-700' },
                      { id: 'beige', color: 'bg-amber-100' },
                    ].map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedColor(c.id)}
                        className={`w-6 h-6 rounded-full cursor-pointer transition-all flex items-center justify-center ${c.color} ${
                          selectedColor === c.id ? 'ring-2 ring-offset-2 ring-[#d00000] scale-110' : 'ring-1 ring-gray-300'
                        }`}
                      >
                        {selectedColor === c.id && (
                          <span className="text-white text-[10px] font-bold">✓</span>
                        )}
                      </div>
                    ))}
                    <button type="button" className="w-6 h-6 rounded-full border border-dashed border-gray-300 text-gray-400 flex items-center justify-center text-xs hover:border-gray-500">
                      +
                    </button>
                  </div>
                </div>

                {/* Shipping Settings */}
                <div className="pt-3 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-gray-500">local_shipping</span>
                      <span className="text-xs font-bold text-slate-800">إعدادات الشحن</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={shippingEnabled} 
                        onChange={(e) => setShippingEnabled(e.target.checked)} 
                        className="sr-only peer" 
                      />
                      <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d00000]" />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <select
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="px-2.5 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs cursor-pointer focus:outline-none"
                    >
                      <option value="جميع المحافظات">جميع المحافظات</option>
                      <option value="القاهرة والجيزة">القاهرة والجيزة</option>
                      <option value="الإسكندرية">الإسكندرية</option>
                      <option value="الدلتا والقناة">الدلتا والقناة</option>
                      <option value="الصعيد">الصعيد</option>
                    </select>

                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="px-2.5 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs cursor-pointer focus:outline-none"
                    >
                      <option value="جميع المناطق">جميع المناطق</option>
                      <option value="المعادي ومصر الجديدة">المعادي ومصر الجديدة</option>
                      <option value="الشيخ زايد وأكتوبر">الشيخ زايد وأكتوبر</option>
                      <option value="وسط البلد والتجمع">وسط البلد والتجمع</option>
                    </select>
                  </div>

                  <p className="text-[10px] text-gray-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-[#d00000]">schedule</span>
                    <span>متوسط مدة التوصيل: 2 - 5 أيام عبر بوسطة Bosta</span>
                  </p>
                </div>

                {/* Big Red Publish Button (Matching Image 1) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-[#d00000] text-white font-black text-sm shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>نشر المنتج</span>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </button>
                </div>
              </form>
            </div>

          </div>
        </main>
      </div>

      {/* Published Toast */}
      {publishedToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce border border-white/20">
          <span className="material-symbols-outlined text-[18px] text-emerald-400">check_circle</span>
          <span>تم نشر المنتج بنجاح وإتاحته في ريلز وسوق EG-Commerce! 🚀</span>
        </div>
      )}
    </div>
  );
}
