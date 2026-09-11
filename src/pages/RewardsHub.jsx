import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function RewardsHub() {
  const { rewardPoints, setRewardPoints, setActiveTab } = useApp();
  const [redeemSuccess, setRedeemSuccess] = useState('');

  const vouchers = [
    { id: 'v-1', title: 'قسيمة خصم 100 ج.م', points: 1000, desc: 'صالحة على جميع المتاجر بحد أدنى للطلب 500 ج.م' },
    { id: 'v-2', title: 'شحن مجاني لطلبك القادم', points: 600, desc: 'تغطي تكلفة الشحن الموحد لجميع الطرود' },
    { id: 'v-3', title: 'قسيمة خصم 250 ج.م', points: 2500, desc: 'صالحة لمنتجات قسم الفساتين والعبايات' },
  ];

  const handleRedeemVoucher = (voucher) => {
    if (rewardPoints >= voucher.points) {
      setRewardPoints(prev => prev - voucher.points);
      setRedeemSuccess(`تم استبدال قسيمة "${voucher.title}" بنجاح! تم حفظ الكود في محفظتك.`);
      setTimeout(() => setRedeemSuccess(''), 4000);
    } else {
      alert('عفواً، رصيد نقاطك غير كافٍ لهذه القسيمة.');
    }
  };

  const history = [
    { title: 'شراء منتج: فستان لينين كايزن', points: '+185', date: 'اليوم', type: 'earn' },
    { title: 'تفاعل ومشاهدة ريلز أسبوعي', points: '+50', date: 'أمس', type: 'earn' },
    { title: 'خصم نقاط في السلة الموحدة', points: '-500', date: '3 أيام مضت', type: 'redeem' },
    { title: 'مكافأة إحالة صديق للتسوق', points: '+200', date: '5 أيام مضت', type: 'earn' },
  ];

  return (
    <div className="w-full flex-1 max-w-4xl mx-auto px-4 md:px-6 py-6 pb-28 md:pb-12 text-on-surface">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-white">المكافآت ونقاط الولاء</h1>
        <p className="text-xs text-on-surface-variant mt-1">
          تسوق، شاهد الريلز، انشر محتوى واكسب نقاطاً تتحول إلى خصومات نقدية حقيقية
        </p>
      </div>

      {redeemSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-tertiary/20 border border-tertiary/40 text-tertiary font-bold text-xs flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{redeemSuccess}</span>
        </div>
      )}

      {/* Rewards Hero Balance Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-500/25 via-surface-container-high to-surface-container p-6 md:p-8 mb-8 border border-amber-500/30 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-secondary text-xs font-bold mb-1">
              <span className="material-symbols-outlined text-[18px]">stars</span>
              <span>رصيدك المتاح من النقاط</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl md:text-5xl font-black text-white">{rewardPoints.toLocaleString()}</span>
              <span className="text-base font-bold text-secondary">نقطة</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-2 font-medium">
              تساوي خصم نقدي فوري بقيمة <b className="text-white font-bold">{Math.floor(rewardPoints / 10)} ج.م</b>
            </p>
          </div>

          {/* Tier Status */}
          <div className="bg-surface-container-low/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0 min-w-[200px]">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="text-on-surface-variant font-bold">المستوى الحالي:</span>
              <span className="text-secondary font-black">الفضي (Silver)</span>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden my-2">
              <div className="h-full bg-gradient-to-r from-secondary to-amber-300 rounded-full w-[65%]" />
            </div>
            <span className="text-[10px] text-on-surface-variant block text-left">باقي 550 نقطة للوصول للمستوى الذهبي 👑</span>
          </div>
        </div>
      </div>

      {/* Ways to Earn Points */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-white mb-4">طرق سريعة لكسب المزيد من النقاط</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { title: 'التسوق المباشر', value: '10 نقاط لكل 100 ج.م', icon: 'shopping_bag', color: 'text-primary' },
            { title: 'مشاهدة الريلز', value: '+15 نقطة يومياً', icon: 'play_circle', color: 'text-secondary' },
            { title: 'إحالة الأصدقاء', value: '+200 نقطة لكل طلب', icon: 'share', color: 'text-tertiary' },
            { title: 'إنشاء محتوى UGC', value: 'حتى 1000 نقطة + عمولة', icon: 'movie_edit', color: 'text-purple-400' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-surface-container-low border border-surface-variant/30 flex items-start gap-3">
              <span className={`material-symbols-outlined text-[24px] ${item.color} mt-0.5`}>
                {item.icon}
              </span>
              <div>
                <h3 className="text-xs font-bold text-white">{item.title}</h3>
                <p className="text-[11px] text-on-surface-variant mt-1">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vouchers to Redeem */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-white mb-4">قسائم الخصم المتاحة للاستبدال</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vouchers.map((v) => (
            <div key={v.id} className="p-5 rounded-2xl bg-surface-container-low border border-surface-variant/30 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-bold text-white">{v.title}</h3>
                  <span className="text-xs font-black text-secondary">{v.points} نقطة</span>
                </div>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">{v.desc}</p>
              </div>
              <button
                onClick={() => handleRedeemVoucher(v)}
                disabled={rewardPoints < v.points}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-secondary hover:bg-secondary-container text-slate-950 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                استبدال الآن
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* History Ledger (reward_transactions) */}
      <section>
        <h2 className="text-sm font-bold text-white mb-4">سجل حركة النقاط الأخيرة</h2>
        <div className="rounded-2xl bg-surface-container-low border border-surface-variant/30 divide-y divide-surface-variant/30 overflow-hidden">
          {history.map((tx, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[20px] ${
                  tx.type === 'earn' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {tx.type === 'earn' ? 'add_circle' : 'remove_circle'}
                </span>
                <div>
                  <h4 className="font-bold text-white">{tx.title}</h4>
                  <span className="text-[10px] text-on-surface-variant">{tx.date}</span>
                </div>
              </div>
              <span className={`font-black text-sm ${
                tx.type === 'earn' ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {tx.points}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
