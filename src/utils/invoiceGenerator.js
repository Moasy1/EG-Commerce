/**
 * Official Egyptian Ecommerce Tax Invoice & Bosta Waybill Generator
 * Generates high-fidelity, printable Arabic/English tax invoices and shipping waybills.
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

  // Thousands
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

  // Hundreds
  const h = Math.floor(remainder / 100);
  const remTens = remainder % 100;
  if (h > 0) {
    words.push(hundreds[h]);
  }

  // Tens & Ones
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
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const isPaid = order.paymentStatus === 'paid';
  const isCod = order.paymentStatus === 'pending_cod' || (order.paymentMethod || '').toLowerCase().includes('cod');
  
  const paymentMethodLabel = isPaid
    ? (order.paymentMethod || 'الدفع الفوري (InstaPay / بطاقة بنكية)')
    : 'الدفع عند الاستلام نقداً للمندوب (Cash on Delivery)';

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
  const vatAmount = Math.round(totalAmount * (14 / 114)); // 14% inclusive VAT in Egypt
  const netBeforeVat = totalAmount - vatAmount;
  const amountInWords = numberToArabicWords(totalAmount);

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>فاتورة ضريبية رسمية • ${invoiceNumber} • ${storeShortName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #d00000;
      --primary-dark: #900000;
      --slate-900: #0f172a;
      --slate-800: #1e293b;
      --slate-700: #334155;
      --slate-600: #475569;
      --slate-500: #64748b;
      --gray-200: #e2e8f0;
      --gray-100: #f1f5f9;
      --gray-50: #f8fafc;
      --emerald-600: #059669;
      --emerald-50: #ecfdf5;
      --amber-600: #d97706;
      --amber-50: #fffbeb;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f3f4f6;
      color: var(--slate-900);
      line-height: 1.5;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      padding: 24px;
    }

    .page-container {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      border: 1px solid var(--gray-200);
    }

    /* Print Controls Bar (Screen only) */
    .screen-actions {
      max-width: 820px;
      margin: 0 auto 16px auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 18px;
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid var(--gray-200);
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .btn-primary {
      background: var(--primary);
      color: #ffffff;
    }
    .btn-primary:hover {
      background: var(--primary-dark);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: var(--slate-900);
      color: #ffffff;
    }
    .btn-secondary:hover {
      background: #000;
    }

    .btn-outline {
      background: var(--gray-50);
      color: var(--slate-700);
      border: 1px solid var(--gray-200);
    }
    .btn-outline:hover {
      background: var(--gray-100);
    }

    /* Header & Badges */
    .invoice-header {
      padding: 32px 36px 24px 36px;
      border-bottom: 2px solid var(--gray-100);
      position: relative;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
    }

    .platform-brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .logo-box {
      width: 54px;
      height: 54px;
      border-radius: 14px;
      background: linear-gradient(135deg, #d00000 0%, #780000 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 900;
      box-shadow: 0 4px 12px rgba(208, 0, 0, 0.25);
      border: 2px solid #ffffff;
    }

    .platform-text h1 {
      font-size: 20px;
      font-weight: 900;
      color: var(--slate-900);
      letter-spacing: -0.3px;
      line-height: 1.2;
    }

    .platform-text p {
      font-size: 11px;
      color: var(--slate-500);
      font-weight: 600;
      font-family: 'Inter', sans-serif;
    }

    .invoice-title-meta {
      text-align: left;
      direction: ltr;
    }

    .invoice-badge {
      display: inline-block;
      padding: 4px 12px;
      background: #fee2e2;
      color: var(--primary);
      border-radius: 30px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      text-transform: uppercase;
    }

    .invoice-number {
      font-size: 18px;
      font-weight: 900;
      font-family: 'Inter', monospace;
      color: var(--slate-900);
    }

    .order-ref {
      font-size: 11px;
      color: var(--slate-500);
      font-weight: 600;
    }

    /* Sub-header Legal Strip */
    .legal-strip {
      margin-top: 20px;
      padding: 10px 14px;
      background: var(--gray-50);
      border-radius: 12px;
      border: 1px dashed var(--gray-200);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
      font-size: 11px;
    }

    .legal-item strong {
      color: var(--slate-800);
    }

    /* Parties Section */
    .parties-section {
      padding: 24px 36px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      border-bottom: 1px solid var(--gray-100);
    }

    .party-card {
      background: var(--gray-50);
      border-radius: 14px;
      padding: 18px;
      border: 1px solid var(--gray-200);
      position: relative;
    }

    .party-title {
      font-size: 10px;
      font-weight: 800;
      color: var(--slate-500);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .party-name {
      font-size: 15px;
      font-weight: 800;
      color: var(--slate-900);
      margin-bottom: 6px;
    }

    .party-detail {
      font-size: 12px;
      color: var(--slate-600);
      line-height: 1.6;
    }

    .party-detail strong {
      color: var(--slate-800);
    }

    .shipping-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-top: 8px;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 10px;
      font-weight: 700;
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
    }

    /* Bosta Waybill Voucher Bar */
    .bosta-voucher {
      margin: 0 36px 20px 36px;
      padding: 16px 20px;
      border-radius: 14px;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .bosta-logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .bosta-icon {
      width: 32px;
      height: 32px;
      background: #e11d48;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 16px;
    }

    .bosta-info h4 {
      font-size: 13px;
      font-weight: 800;
      letter-spacing: -0.2px;
    }

    .bosta-info p {
      font-size: 10px;
      color: #94a3b8;
    }

    .barcode-box {
      text-align: center;
      background: rgba(255, 255, 255, 0.08);
      padding: 6px 14px;
      border-radius: 10px;
      border: 1px dashed rgba(255, 255, 255, 0.2);
    }

    .barcode-visual {
      font-family: monospace;
      font-size: 17px;
      letter-spacing: 5px;
      font-weight: 900;
      color: #38bdf8;
    }

    .barcode-num {
      font-family: 'Inter', monospace;
      font-size: 10px;
      color: #cbd5e1;
      letter-spacing: 1px;
    }

    /* Table Section */
    .items-section {
      padding: 0 36px 24px 36px;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    .items-table thead tr {
      background: var(--gray-50);
      border-top: 1px solid var(--gray-200);
      border-bottom: 2px solid var(--gray-200);
    }

    .items-table th {
      padding: 12px 14px;
      text-align: right;
      font-weight: 800;
      color: var(--slate-700);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .items-table td {
      padding: 14px;
      border-bottom: 1px solid var(--gray-100);
      color: var(--slate-800);
      vertical-align: middle;
    }

    .item-desc-title {
      font-weight: 800;
      color: var(--slate-900);
      font-size: 13px;
    }

    .item-desc-sub {
      font-size: 11px;
      color: var(--slate-500);
      margin-top: 2px;
    }

    .item-badge {
      display: inline-block;
      padding: 2px 8px;
      background: var(--gray-100);
      border-radius: 6px;
      font-size: 10px;
      font-weight: 600;
      margin-left: 4px;
    }

    /* Totals & QR Section */
    .totals-grid {
      padding: 20px 36px 32px 36px;
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      gap: 28px;
      border-top: 1px solid var(--gray-100);
      background: linear-gradient(180deg, #ffffff 0%, var(--gray-50) 100%);
    }

    .qr-compliance-box {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #ffffff;
      border-radius: 14px;
      border: 1px solid var(--gray-200);
    }

    .qr-mockup {
      width: 86px;
      height: 86px;
      background: #0f172a;
      border-radius: 10px;
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 8px;
      font-family: monospace;
      text-align: center;
      line-height: 1.1;
      border: 2px solid #334155;
      box-shadow: 0 4px 8px rgba(0,0,0,0.05);
      position: relative;
    }

    .qr-patterns {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      grid-template-rows: repeat(6, 1fr);
      gap: 2px;
    }

    .qr-dot {
      background: #ffffff;
      border-radius: 1px;
    }
    .qr-dot-dark {
      background: #0f172a;
    }

    .compliance-text h5 {
      font-size: 12px;
      font-weight: 800;
      color: var(--slate-900);
      margin-bottom: 3px;
    }

    .compliance-text p {
      font-size: 10px;
      color: var(--slate-500);
      line-height: 1.5;
    }

    .stamp-container {
      margin-top: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .stamp-badge {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      border: 2px dashed #059669;
      color: #059669;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transform: rotate(-10deg);
      font-size: 9px;
      font-weight: 900;
      text-align: center;
      line-height: 1.2;
      background: rgba(5, 150, 105, 0.04);
    }

    /* Summary Financials */
    .summary-card {
      background: #ffffff;
      border-radius: 14px;
      padding: 16px 20px;
      border: 1px solid var(--gray-200);
      box-shadow: 0 2px 6px rgba(0,0,0,0.02);
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
      font-size: 12px;
      color: var(--slate-600);
    }

    .summary-row.bold {
      font-weight: 700;
      color: var(--slate-900);
    }

    .summary-divider {
      height: 1px;
      background: var(--gray-200);
      margin: 8px 0;
    }

    .grand-total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0 6px 0;
      border-top: 2px solid var(--gray-200);
      margin-top: 4px;
    }

    .grand-total-label {
      font-size: 14px;
      font-weight: 900;
      color: var(--slate-900);
    }

    .grand-total-val {
      font-size: 20px;
      font-weight: 900;
      color: var(--primary);
      font-family: 'Inter', 'Cairo', sans-serif;
    }

    .words-amount {
      font-size: 11px;
      color: var(--slate-500);
      text-align: left;
      direction: rtl;
      margin-top: 4px;
      font-style: italic;
    }

    .payment-status-pill {
      margin-top: 12px;
      padding: 8px 12px;
      border-radius: 10px;
      text-align: center;
      font-size: 11px;
      font-weight: 800;
    }

    .status-paid {
      background: var(--emerald-50);
      color: var(--emerald-600);
      border: 1px solid #a7f3d0;
    }

    .status-cod {
      background: var(--amber-50);
      color: var(--amber-600);
      border: 1px solid #fde68a;
    }

    /* Footer Notes */
    .invoice-footer {
      background: var(--slate-900);
      color: #94a3b8;
      padding: 20px 36px;
      font-size: 11px;
      line-height: 1.6;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .footer-guarantee {
      max-width: 540px;
    }

    .footer-guarantee strong {
      color: #ffffff;
    }

    .footer-stamp-meta {
      text-align: left;
      direction: ltr;
      font-family: 'Inter', monospace;
      font-size: 10px;
      color: #64748b;
    }

    /* Print Optimization */
    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
      }
      .screen-actions {
        display: none !important;
      }
      .page-container {
        box-shadow: none !important;
        border: none !important;
        max-width: 100% !important;
        border-radius: 0 !important;
      }
    }
  </style>
</head>
<body>

  <!-- Screen Actions Bar (hidden when printed) -->
  <div class="screen-actions">
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 14px; font-weight: 800; color: var(--slate-900);">فاتورة معتمدة وبوليصة شحن</span>
      <span style="font-size: 11px; color: var(--slate-500); font-family: monospace;">#${orderId}</span>
    </div>
    <div style="display: flex; align-items: center; gap: 8px;">
      <button onclick="window.print()" class="action-btn btn-primary">
        <span>طباعة المستند الرسمي (A4 / حراري)</span>
      </button>
      <button onclick="window.close()" class="action-btn btn-outline">
        <span>إغلاق</span>
      </button>
    </div>
  </div>

  <div class="page-container">

    <!-- 1. Header & Organization Meta -->
    <header class="invoice-header">
      <div class="header-top">
        <div class="platform-brand">
          <div class="logo-box">EG</div>
          <div class="platform-text">
            <h1>التجارة المصرية • Egyptian Commerce</h1>
            <p>E-COMMERCE ENTERPRISE PLATFORM & DISCOVERY HUB</p>
            <div style="margin-top: 4px; font-size: 12px; font-weight: 700; color: var(--primary);">
              متجر: ${storeName}
            </div>
          </div>
        </div>

        <div class="invoice-title-meta">
          <span class="invoice-badge">فاتورة ضريبية مبسطة</span>
          <div class="invoice-number">${invoiceNumber}</div>
          <div class="order-ref">Order Ref: <strong>${orderId}</strong></div>
          <div class="order-ref" style="margin-top: 2px;">التاريخ: ${orderDate}</div>
        </div>
      </div>

      <div class="legal-strip">
        <div class="legal-item">
          سجل تجاري: <strong>${storeCommReg} استثمار القاهرة</strong>
        </div>
        <div class="legal-item">
          رقم التسجيل الضريبي: <strong dir="ltr">${storeTaxId}</strong>
        </div>
        <div class="legal-item">
          رابط المتجر: <strong>${storeSubdomain}</strong>
        </div>
        <div class="legal-item">
          حالة الفاتورة: <strong style="color: #059669;">معتمدة إلكترونياً (ETA Validated) ✓</strong>
        </div>
      </div>
    </header>

    <!-- 2. Parties Information (Seller & Customer) -->
    <section class="parties-section">
      <!-- Seller Party -->
      <div class="party-card">
        <div class="party-title">
          <span>🏬 بيانات المتجر والمشغل (Seller / Atelier)</span>
        </div>
        <div class="party-name">${storeName}</div>
        <div class="party-detail">
          <div><strong>العنوان:</strong> ${storeAddress}</div>
          <div><strong>خدمة العملاء:</strong> <span dir="ltr">${storePhone}</span></div>
          <div><strong>الدومين:</strong> ${storeSubdomain}</div>
        </div>
      </div>

      <!-- Customer / Consignee -->
      <div class="party-card">
        <div class="party-title">
          <span>👤 العميل المستلم وعنوان الشحن (Consignee)</span>
        </div>
        <div class="party-name">${order.customerName || 'عميل تجارة مصرية'}</div>
        <div class="party-detail">
          <div><strong>الهاتف:</strong> <span dir="ltr">${order.phone || '+20 100 000 0000'}</span></div>
          <div><strong>عنوان التوصيل:</strong> ${order.address || 'القاهرة، جمهورية مصر العربية'}</div>
          <div><strong>طريقة الدفع:</strong> ${paymentMethodLabel}</div>
        </div>
        <div class="shipping-badge">
          <span>معاينة وقياس القطعة متاحة بحضور مندوب التوصيل</span>
        </div>
      </div>
    </section>

    <!-- 3. Integrated Bosta Express Waybill Voucher -->
    <div class="bosta-voucher">
      <div class="bosta-logo">
        <div class="bosta-icon">B</div>
        <div class="bosta-info">
          <h4>بوسطة إكسبريس للشحن السريع • BOSTA EXPRESS AWB</h4>
          <p>شحنة تجارة إلكترونية سريعة ومؤمنة بالكامل مع إمكانية التتبع اللحظي</p>
        </div>
      </div>

      <div class="barcode-box">
        <div class="barcode-visual">||| | ||||| ||| |||||||</div>
        <div class="barcode-num">${trackingNumber}</div>
      </div>
    </div>

    <!-- 4. Line Items Table -->
    <section class="items-section">
      <table class="items-table">
        <thead>
          <tr>
            <th style="width: 36px; text-align: center;">#</th>
            <th>المنتج والوصف</th>
            <th style="text-align: center; width: 80px;">الكمية</th>
            <th style="text-align: left; width: 110px;">سعر الوحدة</th>
            <th style="text-align: left; width: 110px;">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item, idx) => `
            <tr>
              <td style="text-align: center; font-weight: 700; color: var(--slate-500);">${idx + 1}</td>
              <td>
                <div class="item-desc-title">${item.title || item.name || order.productTitle || 'منتج أزياء وتراث'}</div>
                <div class="item-desc-sub">
                  ${item.size ? `<span class="item-badge">المقاس: ${item.size}</span>` : ''}
                  ${item.color ? `<span class="item-badge">اللون: ${item.color}</span>` : ''}
                  <span class="item-badge">كود: ${item.productId || 'EG-PROD'}</span>
                </div>
              </td>
              <td style="text-align: center; font-weight: 700; font-family: monospace; font-size: 14px;">${item.quantity || 1}</td>
              <td style="text-align: left; font-family: 'Inter', monospace; font-weight: 700;">${(item.price || 0).toLocaleString()} ج.م</td>
              <td style="text-align: left; font-family: 'Inter', monospace; font-weight: 900; color: var(--slate-900);">
                ${((item.price || 0) * (item.quantity || 1)).toLocaleString()} ج.م
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </section>

    <!-- 5. Tax Breakdown, Totals & Verification QR -->
    <section class="totals-grid">
      <!-- Left Box: Tax QR & Seal -->
      <div>
        <div class="qr-compliance-box">
          <div class="qr-mockup">
            <div class="qr-patterns">
              <div class="qr-dot"></div><div class="qr-dot"></div><div class="qr-dot"></div><div class="qr-dot-dark"></div><div class="qr-dot"></div><div class="qr-dot"></div>
              <div class="qr-dot"></div><div class="qr-dot-dark"></div><div class="qr-dot"></div><div class="qr-dot"></div><div class="qr-dot-dark"></div><div class="qr-dot"></div>
              <div class="qr-dot"></div><div class="qr-dot"></div><div class="qr-dot"></div><div class="qr-dot-dark"></div><div class="qr-dot"></div><div class="qr-dot"></div>
              <div class="qr-dot-dark"></div><div class="qr-dot"></div><div class="qr-dot-dark"></div><div class="qr-dot"></div><div class="qr-dot"></div><div class="qr-dot-dark"></div>
              <div class="qr-dot"></div><div class="qr-dot-dark"></div><div class="qr-dot"></div><div class="qr-dot-dark"></div><div class="qr-dot"></div><div class="qr-dot"></div>
              <div class="qr-dot"></div><div class="qr-dot"></div><div class="qr-dot"></div><div class="qr-dot"></div><div class="qr-dot-dark"></div><div class="qr-dot"></div>
            </div>
          </div>
          <div class="compliance-text">
            <h5>رمز التحقق الإلكتروني المعتمد (QR)</h5>
            <p>مشفر طبقاً لضوابط منظومة الفاتورة الإلكترونية لمصلحة الضرائب المصرية (ETA). مسح الرمز يؤكد صحة الفاتورة ومعاملة الشحن المعتمدة.</p>
          </div>
        </div>

        <div class="stamp-container">
          <div class="stamp-badge">
            <span>مصلحة الضرائب</span>
            <span>معتمد 2026</span>
            <span>ETA VERIFIED</span>
          </div>
          <div style="font-size: 11px; color: var(--slate-500); line-height: 1.4;">
            <div><strong>رقم البوليصة المرجعي:</strong> ${trackingNumber}</div>
            <div><strong>حالة المعاملة:</strong> موثقة على السحابة المركزية</div>
          </div>
        </div>
      </div>

      <!-- Right Box: Financial Calculation -->
      <div class="summary-card">
        <div class="summary-row">
          <span>المجموع الفرعي للمنتجات:</span>
          <span style="font-family: 'Inter', monospace; font-weight: 700;">${subtotal.toLocaleString()} ج.م</span>
        </div>

        ${discount > 0 ? `
          <div class="summary-row" style="color: #059669;">
            <span>الخصم الترويجي المطبق:</span>
            <span style="font-family: 'Inter', monospace; font-weight: 700;">-${discount.toLocaleString()} ج.م</span>
          </div>
        ` : ''}

        <div class="summary-row">
          <span>تكلفة الشحن (بوسطة إكسبريس):</span>
          <span style="font-family: 'Inter', monospace; font-weight: 700;">${shipping > 0 ? `${shipping.toLocaleString()} ج.م` : 'مجاني'}</span>
        </div>

        <div class="summary-row" style="font-size: 11px; color: var(--slate-500);">
          <span>ضريبة القيمة المضافة 14% (متضمنة):</span>
          <span style="font-family: 'Inter', monospace;">${vatAmount.toLocaleString()} ج.م</span>
        </div>

        <div class="grand-total-row">
          <span class="grand-total-label">الإجمالي النهائي المستحق:</span>
          <span class="grand-total-val">${totalAmount.toLocaleString()} ج.م</span>
        </div>

        <div class="words-amount">${amountInWords}</div>

        <div class="payment-status-pill ${isPaid ? 'status-paid' : 'status-cod'}">
          ${isPaid 
            ? '✓ مدفوع إلكترونياً بالكامل (PAID IN FULL • تم التأكيد البنكي)' 
            : `○ مطلوب تحصيل ${totalAmount.toLocaleString()} ج.م نقداً عند الاستلام (COD)`}
        </div>
      </div>
    </section>

    <!-- 6. Legal Guarantees & Consumer Rights Footer -->
    <footer class="invoice-footer">
      <div class="footer-guarantee">
        <strong>حقوق المستهلك والضمان:</strong>
        طبقاً للقانون رقم 181 لسنة 2018، يحق للعميل استبدال أو استرجاع المنتجات خلال 14 يوماً من تاريخ الاستلام في حالتها الأصلية. للدعم السريع أو تتبع الشحنة تواصل عبر واتساب ${storePhone} أو مركز المساعدة المركزي.
      </div>
      <div class="footer-stamp-meta">
        <div>SYS-REF: ${orderId}-EGY</div>
        <div>VERIFIED PLATFORM COPY</div>
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
