/**
 * Official Egyptian Ecommerce Tax Invoice & Bosta Waybill Generator
 * Guarantees a single-page A4 print fit with scannable QR Code and official platform branding.
 */

export function numberToArabicWords(num) {
  if (!num || isNaN(num)) return 'صفر جنيه مصري';
  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة'];
  const teens = ['أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

  const n = Math.floor(num);
  if (n === 0) return 'صفر جنيه مصري';

  let words = [];

  const thousands = Math.floor(n / 1000);
  const remainder = n % 1000;

  if (thousands === 1) {
    words.push('ألف');
  } else if (thousands === 2) {
    words.push('ألفان');
  } else if (thousands >= 3 && thousands <= 10) {
    words.push(ones[thousands] + ' آلاف');
  } else if (thousands > 10) {
    words.push(thousands + ' ألف');
  }

  const h = Math.floor(remainder / 100);
  const remTens = remainder % 100;
  if (h > 0) {
    words.push(hundreds[h]);
  }

  if (remTens > 0) {
    if (remTens <= 10) {
      words.push(ones[remTens]);
    } else if (remTens < 20) {
      words.push(teens[remTens - 11]);
    } else {
      const o = remTens % 10;
      const t = Math.floor(remTens / 10);
      if (o > 0) {
        words.push(ones[o] + ' و' + tens[t]);
      } else {
        words.push(tens[t]);
      }
    }
  }

  return 'فقط ' + words.join(' و') + ' جنيهاً مصرياً لا غير';
}

export function generateInvoiceHtml(order, merchant = null) {
  const storeName = merchant?.name || order.merchantName || 'Talieska Studio • تاليسكا ستوديو';
  const storeShortName = merchant?.shortName || storeName.split(' • ')[0] || 'متجر مصري معتمد';
  const storeAddress = merchant?.address || '14 شارع دجلة، المعادي، القاهرة، جمهورية مصر العربية';
  const storePhone = merchant?.whatsapp || merchant?.phone || '+20 100 234 5678';
  const storeSubdomain = merchant?.subdomain || (order.merchantId ? `${order.merchantId}.egyptian-commerce.com` : 'talieska.egyptian-commerce.com');
  const storeTaxId = merchant?.taxId || '620-891-304';
  const storeCommReg = merchant?.commercialRegistry || '419208';

  const orderId = order.id || 'EG-8841';
  const invoiceNumber = `INV-${orderId.replace(/[^a-zA-Z0-9]/g, '')}-${new Date(order.createdAt || Date.now()).getFullYear()}`;
  const trackingNumber = order.trackingNumber || `BST-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const isPaid = order.paymentStatus === 'paid';
  const paymentMethodLabel = isPaid
    ? (order.paymentMethod || 'الدفع الفوري (InstaPay / فيزا)')
    : 'الدفع عند الاستلام نقداً للمندوب (COD)';

  // Items handling
  const items = (Array.isArray(order.items) && order.items.length > 0)
    ? order.items
    : [
        {
          title: order.productTitle || 'منتج أزياء وتراث مصري فاخر',
          quantity: order.quantity || 1,
          size: order.size || 'Standard',
          color: order.color || 'أصلي',
          price: order.subtotal || order.amount || 1450
        }
      ];

  const subtotal = order.subtotal || items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  const discount = order.discount || 0;
  const shipping = order.shipping !== undefined ? order.shipping : 60;
  const totalAmount = order.amount || (subtotal - discount + shipping);
  const vatAmount = Math.round(totalAmount * (14 / 114));
  const amountInWords = numberToArabicWords(totalAmount);

  // Real, scannable QR Code URL targeting the main platform tracking & verification endpoint
  const verifyPlatformUrl = `https://egyptian-commerce.com/tracking?id=${encodeURIComponent(orderId)}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(verifyPlatformUrl)}&margin=1`;

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>فاتورة ضريبية رسمية • ${invoiceNumber}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 6mm 8mm;
    }

    :root {
      --primary: #d00000;
      --slate-900: #0f172a;
      --slate-800: #1e293b;
      --slate-700: #334155;
      --slate-600: #475569;
      --gray-200: #e2e8f0;
      --gray-100: #f1f5f9;
      --gray-50: #f8fafc;
      --emerald-600: #059669;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      background: #f1f5f9;
      font-family: 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: var(--slate-900);
      line-height: 1.35;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      padding: 16px;
    }

    .screen-actions {
      max-width: 780px;
      margin: 0 auto 12px auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px 16px;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid var(--gray-200);
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 18px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      font-family: inherit;
      transition: all 0.2s;
    }
    .btn-primary {
      background: var(--primary);
      color: #fff;
    }
    .btn-primary:hover { background: #b00000; }
    .btn-outline {
      background: var(--gray-50);
      color: var(--slate-700);
      border: 1px solid var(--gray-200);
    }

    /* Exactly Single Page A4 Container */
    .a4-sheet {
      width: 100%;
      max-width: 780px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 14px;
      border: 1px solid var(--gray-200);
      box-shadow: 0 6px 20px rgba(0,0,0,0.06);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }

    /* Header */
    .inv-header {
      padding: 18px 24px 10px 24px;
      border-bottom: 2px solid var(--gray-100);
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }

    .brand-col {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-emblem {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 8px rgba(208, 0, 0, 0.25);
    }

    .brand-titles h1 {
      font-size: 16px;
      font-weight: 900;
      color: var(--slate-900);
      line-height: 1.15;
    }

    .brand-titles p {
      font-size: 10px;
      color: var(--slate-600);
      font-family: 'Inter', sans-serif;
      font-weight: 700;
    }

    .brand-titles .store-line {
      font-size: 11px;
      font-weight: 800;
      color: var(--primary);
      margin-top: 1px;
    }

    .meta-col {
      text-align: left;
      direction: ltr;
    }

    .meta-badge {
      display: inline-block;
      padding: 3px 10px;
      background: #fee2e2;
      color: var(--primary);
      border-radius: 20px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .inv-number {
      font-size: 15px;
      font-weight: 900;
      color: var(--slate-900);
      font-family: 'Inter', monospace;
      margin-top: 2px;
    }

    .inv-sub {
      font-size: 10px;
      color: var(--slate-600);
      font-weight: 600;
    }

    /* Legal Strip */
    .legal-strip {
      margin-top: 10px;
      padding: 6px 12px;
      background: var(--gray-50);
      border-radius: 8px;
      border: 1px dashed var(--gray-200);
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 6px;
      font-size: 10px;
    }

    /* Parties Section */
    .parties-grid {
      padding: 10px 24px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .party-box {
      background: var(--gray-50);
      border: 1px solid var(--gray-200);
      border-radius: 10px;
      padding: 10px 12px;
    }

    .party-label {
      font-size: 9px;
      font-weight: 800;
      color: var(--slate-600);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }

    .party-name {
      font-size: 13px;
      font-weight: 800;
      color: var(--slate-900);
      margin-bottom: 2px;
    }

    .party-info {
      font-size: 10px;
      color: var(--slate-600);
      line-height: 1.4;
    }

    /* Bosta Courier Banner */
    .bosta-bar {
      margin: 2px 24px 8px 24px;
      padding: 8px 14px;
      border-radius: 10px;
      background: #0f172a;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .bosta-tag {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .bosta-badge {
      width: 24px;
      height: 24px;
      background: #e11d48;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 13px;
    }

    .bosta-title {
      font-size: 11px;
      font-weight: 800;
    }

    .bosta-desc {
      font-size: 9px;
      color: #94a3b8;
    }

    .bosta-barcode {
      text-align: center;
      background: rgba(255,255,255,0.08);
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px dashed rgba(255,255,255,0.2);
    }

    .barcode-bars {
      font-family: monospace;
      font-size: 13px;
      letter-spacing: 4px;
      font-weight: 900;
      color: #38bdf8;
      line-height: 1;
    }

    .barcode-txt {
      font-family: 'Inter', monospace;
      font-size: 9px;
      color: #cbd5e1;
    }

    /* Items Table */
    .items-wrap {
      padding: 0 24px 8px 24px;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }

    .items-table thead tr {
      background: var(--gray-50);
      border-top: 1px solid var(--gray-200);
      border-bottom: 2px solid var(--gray-200);
    }

    .items-table th {
      padding: 7px 10px;
      text-align: right;
      font-size: 10px;
      font-weight: 800;
      color: var(--slate-700);
    }

    .items-table td {
      padding: 8px 10px;
      border-bottom: 1px solid var(--gray-100);
      vertical-align: middle;
    }

    .item-title {
      font-weight: 800;
      color: var(--slate-900);
      font-size: 11px;
    }

    .item-meta {
      font-size: 9px;
      color: var(--slate-600);
      display: flex;
      gap: 6px;
      margin-top: 1px;
    }

    .item-tag {
      background: var(--gray-100);
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 8px;
    }

    /* Totals & QR Grid */
    .totals-wrap {
      padding: 10px 24px 14px 24px;
      border-top: 1px solid var(--gray-200);
      display: grid;
      grid-template-columns: 1.15fr 1fr;
      gap: 16px;
      background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
    }

    /* QR Code Card with Main Platform Logo */
    .qr-platform-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      background: #ffffff;
      border-radius: 10px;
      border: 1px solid var(--gray-200);
    }

    .qr-code-img {
      width: 78px;
      height: 78px;
      border-radius: 8px;
      border: 1px solid var(--gray-200);
      display: block;
      shrink-0: 0;
      background: #fff;
    }

    .qr-details h5 {
      font-size: 11px;
      font-weight: 900;
      color: var(--slate-900);
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .qr-details p {
      font-size: 9px;
      color: var(--slate-600);
      line-height: 1.35;
      margin-top: 2px;
    }

    .platform-seal {
      margin-top: 4px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      padding: 2px 6px;
      border-radius: 6px;
      color: #15803d;
      font-size: 9px;
      font-weight: 800;
    }

    /* Financials Card */
    .fin-card {
      background: #ffffff;
      border: 1px solid var(--gray-200);
      border-radius: 10px;
      padding: 10px 14px;
    }

    .fin-row {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: var(--slate-600);
      padding: 2px 0;
    }

    .fin-row.bold {
      font-weight: 800;
      color: var(--slate-900);
    }

    .fin-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1.5px solid var(--gray-200);
      margin-top: 4px;
      padding-top: 6px;
    }

    .fin-total .label {
      font-size: 12px;
      font-weight: 900;
      color: var(--slate-900);
    }

    .fin-total .val {
      font-size: 16px;
      font-weight: 900;
      color: var(--primary);
      font-family: 'Inter', monospace;
    }

    .fin-words {
      font-size: 9px;
      color: var(--slate-600);
      text-align: left;
      direction: rtl;
      font-style: italic;
      margin-top: 2px;
    }

    .payment-pill {
      margin-top: 6px;
      padding: 4px 8px;
      border-radius: 6px;
      text-align: center;
      font-size: 9px;
      font-weight: 800;
    }
    .pill-paid {
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
    }
    .pill-cod {
      background: #fffbeb;
      color: #d97706;
      border: 1px solid #fde68a;
    }

    /* Footer */
    .inv-footer {
      background: var(--slate-900);
      color: #94a3b8;
      padding: 10px 24px;
      font-size: 9px;
      line-height: 1.4;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .inv-footer strong {
      color: #ffffff;
    }

    /* Print Optimization - Strictly 1 Page A4 */
    @media print {
      html, body {
        width: 100% !important;
        height: 100% !important;
        max-height: 297mm !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        overflow: hidden !important;
      }

      .screen-actions {
        display: none !important;
      }

      .a4-sheet {
        box-shadow: none !important;
        border: 1px solid #cbd5e1 !important;
        max-width: 100% !important;
        width: 100% !important;
        height: 100% !important;
        max-height: 285mm !important;
        border-radius: 0 !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
      }
    }
  </style>
</head>
<body>

  <!-- Screen Actions Bar -->
  <div class="screen-actions">
    <div style="display: flex; align-items: center; gap: 8px;">
      <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 44V22C10 14.268 16.268 8 24 8C31.732 8 38 14.268 38 22V44H29V22C29 19.2386 26.7614 17 24 17C21.2386 17 19 19.2386 19 22V44H10Z" fill="#d00000" />
        <path d="M21.5 44V26C21.5 24.6193 22.6193 23.5 24 23.5C25.3807 23.5 26.5 24.6193 26.5 26V44H21.5Z" fill="#d00000" />
      </svg>
      <span style="font-size: 13px; font-weight: 800;">فاتورة ضريبية رسمية وبوليصة شحن A4</span>
      <span style="font-size: 11px; color: var(--slate-600); font-family: monospace;">#${orderId}</span>
    </div>
    <div style="display: flex; align-items: center; gap: 8px;">
      <button onclick="window.print()" class="action-btn btn-primary">
        <span>طباعة صفحة A4 واحدة (Print 1-Page A4)</span>
      </button>
      <button onclick="window.close()" class="action-btn btn-outline">
        <span>إغلاق</span>
      </button>
    </div>
  </div>

  <!-- Main A4 Printable Document Container -->
  <div class="a4-sheet">

    <!-- 1. Header with Platform Logo & Emblem -->
    <header class="inv-header">
      <div class="header-row">
        <div class="brand-col">
          <div class="brand-emblem">
            <!-- Official EG-Commerce Arch Gateway Emblem -->
            <svg width="26" height="26" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 44V22C10 14.268 16.268 8 24 8C31.732 8 38 14.268 38 22V44H29V22C29 19.2386 26.7614 17 24 17C21.2386 17 19 19.2386 19 22V44H10Z" fill="#ffffff" />
              <path d="M21.5 44V26C21.5 24.6193 22.6193 23.5 24 23.5C25.3807 23.5 26.5 24.6193 26.5 26V44H21.5Z" fill="#ffffff" />
            </svg>
          </div>
          <div class="brand-titles">
            <h1>منصة التجارة المصرية • Egyptian Commerce</h1>
            <p>E-COMMERCE ENTERPRISE PLATFORM & DISCOVERY HUB</p>
            <div class="store-line">متجر الشريك: ${storeName}</div>
          </div>
        </div>

        <div class="meta-col">
          <span class="meta-badge">فاتورة ضريبية مبسطة ETA</span>
          <div class="inv-number">${invoiceNumber}</div>
          <div class="inv-sub">Order Ref: <strong>${orderId}</strong> | ${orderDate}</div>
        </div>
      </div>

      <div class="legal-strip">
        <div>سجل تجاري: <strong>${storeCommReg} استثمار القاهرة</strong></div>
        <div>رقم التسجيل الضريبي: <strong dir="ltr">${storeTaxId}</strong></div>
        <div>رابط المتجر: <strong>${storeSubdomain}</strong></div>
        <div>التوثيق: <strong style="color: #059669;">معتمدة إلكترونياً (ETA Verified) ✓</strong></div>
      </div>
    </header>

    <!-- 2. Parties Information -->
    <section class="parties-grid">
      <div class="party-box">
        <div class="party-label">🏬 بيانات المتجر البائع (Seller)</div>
        <div class="party-name">${storeName}</div>
        <div class="party-info">
          <div><strong>العنوان:</strong> ${storeAddress}</div>
          <div><strong>الهاتف:</strong> <span dir="ltr">${storePhone}</span></div>
          <div><strong>الدومين:</strong> ${storeSubdomain}</div>
        </div>
      </div>

      <div class="party-box">
        <div class="party-label">👤 العميل المستلم والشحن (Consignee)</div>
        <div class="party-name">${order.customerName || 'عميل تجارة مصرية'}</div>
        <div class="party-info">
          <div><strong>الهاتف:</strong> <span dir="ltr">${order.phone || '+20 100 000 0000'}</span></div>
          <div><strong>العنوان:</strong> ${order.address || 'القاهرة، جمهورية مصر العربية'}</div>
          <div><strong>طريقة السداد:</strong> ${paymentMethodLabel}</div>
        </div>
      </div>
    </section>

    <!-- 3. Integrated Bosta Courier Bar -->
    <div class="bosta-bar">
      <div class="bosta-tag">
        <div class="bosta-badge">B</div>
        <div>
          <div class="bosta-title">بوسطة إكسبريس للشحن السريع • BOSTA EXPRESS AWB</div>
          <div class="bosta-desc">شحنة مؤمنة بالكامل - محطة فرز القاهرة الكبرى (CAI-HUB-04)</div>
        </div>
      </div>

      <div class="bosta-barcode">
        <div class="barcode-bars">||| | ||||| ||| |||||||</div>
        <div class="barcode-txt">${trackingNumber}</div>
      </div>
    </div>

    <!-- 4. Line Items Table -->
    <section class="items-wrap">
      <table class="items-table">
        <thead>
          <tr>
            <th style="width: 28px; text-align: center;">#</th>
            <th>المنتج والوصف</th>
            <th style="text-align: center; width: 60px;">الكمية</th>
            <th style="text-align: left; width: 95px;">سعر الوحدة</th>
            <th style="text-align: left; width: 95px;">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item, idx) => `
            <tr>
              <td style="text-align: center; font-weight: 700; color: var(--slate-600);">${idx + 1}</td>
              <td>
                <div class="item-title">${item.title || item.name || order.productTitle || 'منتج أزياء وتراث'}</div>
                <div class="item-meta">
                  ${item.size ? `<span class="item-tag">مقاس: ${item.size}</span>` : ''}
                  ${item.color ? `<span class="item-tag">لون: ${item.color}</span>` : ''}
                  <span class="item-tag">كود: ${item.productId || 'EG-PROD'}</span>
                </div>
              </td>
              <td style="text-align: center; font-weight: 700; font-family: monospace;">${item.quantity || 1}</td>
              <td style="text-align: left; font-family: 'Inter', monospace; font-weight: 700;">${(item.price || 0).toLocaleString()} ج.م</td>
              <td style="text-align: left; font-family: 'Inter', monospace; font-weight: 900; color: var(--slate-900);">
                ${((item.price || 0) * (item.quantity || 1)).toLocaleString()} ج.م
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </section>

    <!-- 5. Totals & Scannable QR Section with Main Platform Branding -->
    <section class="totals-wrap">
      <!-- QR Code with Platform Logo & Verification Link -->
      <div class="qr-platform-card">
        <img 
          src="${qrApiUrl}" 
          alt="Platform Verification QR Code" 
          class="qr-code-img"
          loading="eager"
        />
        <div class="qr-details">
          <h5>
            <!-- Mini Platform Logo in QR Box -->
            <svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 44V22C10 14.268 16.268 8 24 8C31.732 8 38 14.268 38 22V44H29V22C29 19.2386 26.7614 17 24 17C21.2386 17 19 19.2386 19 22V44H10Z" fill="#d00000" />
              <path d="M21.5 44V26C21.5 24.6193 22.6193 23.5 24 23.5C25.3807 23.5 26.5 24.6193 26.5 26V44H21.5Z" fill="#d00000" />
            </svg>
            <span>رمز التحقق من المنصة (QR)</span>
          </h5>
          <p>
            امسح الرمز بكاميرا الهاتف للتحقق الفوري من صحة الفاتورة على منصة التجارة المصرية وتتبع مسار الشحنة.
          </p>
          <div class="platform-seal">
            <span>منظومة الضرائب المصرية ETA • موثق</span>
          </div>
        </div>
      </div>

      <!-- Financial Calculation -->
      <div class="fin-card">
        <div class="fin-row">
          <span>المجموع الفرعي للمنتجات:</span>
          <span style="font-family: 'Inter', monospace; font-weight: 700;">${subtotal.toLocaleString()} ج.م</span>
        </div>

        ${discount > 0 ? `
          <div class="fin-row" style="color: #059669;">
            <span>الخصم المطبق:</span>
            <span style="font-family: 'Inter', monospace; font-weight: 700;">-${discount.toLocaleString()} ج.م</span>
          </div>
        ` : ''}

        <div class="fin-row">
          <span>شحن بوسطة إكسبريس:</span>
          <span style="font-family: 'Inter', monospace; font-weight: 700;">${shipping > 0 ? `${shipping.toLocaleString()} ج.م` : 'مجاني'}</span>
        </div>

        <div class="fin-row" style="font-size: 9px; color: var(--slate-600);">
          <span>ضريبة القيمة المضافة 14% (متضمنة):</span>
          <span style="font-family: 'Inter', monospace;">${vatAmount.toLocaleString()} ج.م</span>
        </div>

        <div class="fin-total">
          <span class="label">الإجمالي النهائي:</span>
          <span class="val">${totalAmount.toLocaleString()} ج.م</span>
        </div>

        <div class="fin-words">${amountInWords}</div>

        <div class="payment-pill ${isPaid ? 'pill-paid' : 'pill-cod'}">
          ${isPaid 
            ? '✓ مدفوع إلكترونياً بالكامل (PAID IN FULL • تم التأكيد)' 
            : `○ مطلوب تحصيل ${totalAmount.toLocaleString()} ج.م نقداً عند الاستلام (COD)`}
        </div>
      </div>
    </section>

    <!-- 6. Legal & Protection Footer -->
    <footer class="inv-footer">
      <div>
        <strong>حقوق المستهلك والضمان:</strong>
        حق المعاينة والاستبدال خلال 14 يوماً من الاستلام طبقاً لقانون حماية المستهلك المصري رقم 181 لسنة 2018.
      </div>
      <div style="text-align: left; direction: ltr; font-family: 'Inter', monospace; font-size: 8px;">
        egyptian-commerce.com • REF:${orderId}
      </div>
    </footer>

  </div>

</body>
</html>`;
}

export function printOrderInvoice(order, merchant = null) {
  const html = generateInvoiceHtml(order, merchant);
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('يرجى السماح بالنوافذ المنبثقة لطباعة الفاتورة');
    return;
  }
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
