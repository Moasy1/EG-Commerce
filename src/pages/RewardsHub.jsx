import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function RewardsHub() {
  const { rewardPoints, setRewardPoints } = useApp();
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
    { title: 'شراء منتج: فستان كتان صيفي بوهيمي', points: '+140', date: 'اليوم', type: 'earn' },
    { title: 'تفاعل ومشاهدة ريلز أسبوعي', points: '+50', date: 'أمس', type: 'earn' },
    { title: 'استبدال نقاط في سلة التسوق', points: '-500', date: '3 أيام مضت', type: 'redeem' },
    { title: 'مكافأة إحالة صديقة للتسوق', points: '+200', date: '5 أيام مضت', type: 'earn' },
  ];

  return (
    <div className="w-full flex-1 max-w-4xl mx-auto px-4 md:px-6 py-4 pb-28 md:pb-12 text-on-surface text-right">
      <div className="mb-4">
        <h1 className="font-serif text-xl md:text-2xl font-bold text-on-surface">المكافآت ونقاط الولاء</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          تسوقي، شاهدي الريلز، واكسبي نقاطاً تتحول إلى خصومات فورية
        </p>
      </div>

      {redeemSuccess && (
        <div className="mb-4 p-3 rounded-xl bg-secondary/10 border border-secondary/30 text-secondary font-bold text-xs flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{redeemSuccess}</span>
        </div>
      )}

      {/* Rewards Hero Balance Card */}
      <div className="rounded-2xl bg-surface-container-lowest border border-surface-container-high p-5 md:p-6 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-secondary text-xs font-semibold mb-1">
              <span className="material-symbols-outlined text-[17px]">stars</span>
              <span>رصيدك المتاح من النقاط</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl md:text-4xl font-bold text-on-surface">{rewardPoints.toLocaleString()}</span>
              <span className="text-xs font-bold text-secondary">نقطة</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              تساوي خصم نقدي فوري بقيمة <b className="text-on-surface font-bold">{Math.floor(rewardPoints / 10)} ج.م</b>
            </p>
          </div>

          {/* Tier Status */}
          <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-container-high shrink-0 min-w-[190px]">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="text-on-surface-variant font-medium">المستوى:</span>
              <span className="text-secondary font-bold">الفضي (Silver)</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden my-1.5">
              <div className="h-full bg-secondary rounded-full w-[65%]" />
            </div>
            <span className="text-[10px] text-on-surface-variant block text-left">باقي 550 نقطة للمستوى الذهبي</span>
          </div>
        </div>
      </div>

      {/* Ways to Earn */}
      <section className="mb-6">
        <h2 className="font-serif text-sm font-bold text-on-surface mb-3">طرق كسب النقاط</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { title: 'التسوق المباشر', value: '10 نقاط لكل 100 ج.م', icon: 'shopping_bag' },
            { title: 'مشاهدة الريلز', value: '+15 نقطة يومياً', icon: 'play_circle' },
            { title: 'إحالة الأصدقاء', value: '+200 نقطة لكل طلب', icon: 'share' },
            { title: 'إنشاء محتوى UGC', value: 'حتى 1000 نقطة', icon: 'movie_edit' }
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-high flex items-start gap-2 shadow-xs">
              <span className="material-symbols-outlined text-[20px] text-secondary mt-0.5">
                {item.icon}
              </span>
              <div>
                <h3 className="text-xs font-bold text-on-surface">{item.title}</h3>
                <p className="text-[10px] text-on-surface-variant mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vouchers to Redeem */}
      <section className="mb-6">
        <h2 className="font-serif text-sm font-bold text-on-surface mb-3">قسائم الخصم المتاحة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {vouchers.map((v) => (
            <div key={v.id} className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container-high flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex justify-between items-start mb-1.5">
                  <h3 className="text-xs font-bold text-on-surface">{v.title}</h3>
                  <span className="text-xs font-bold text-secondary">{v.points} نقطة</span>
                </div>
                <p className="text-[11px] text-on-surface-variant mb-3 leading-relaxed">{v.desc}</p>
              </div>
              <button
                onClick={() => handleRedeemVoucher(v)}
                disabled={rewardPoints < v.points}
                className="w-full py-2 rounded-lg text-xs font-semibold bg-secondary text-on-secondary hover:opacity-90 transition-all disabled:opacity-40"
              >
                استبدال الآن
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* History Ledger */}
      <section>
        <h2 className="font-serif text-sm font-bold text-on-surface mb-3">سجل حركة النقاط</h2>
        <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high divide-y divide-surface-container-high overflow-hidden shadow-xs">
          {history.map((tx, idx) => (
            <div key={idx} className="p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className={`material-symbols-outlined text-[18px] ${
                  tx.type === 'earn' ? 'text-secondary' : 'text-on-surface-variant'
                }`}>
                  {tx.type === 'earn' ? 'add_circle' : 'remove_circle'}
                </span>
                <div>
                  <h4 className="font-semibold text-on-surface">{tx.title}</h4>
                  <span className="text-[10px] text-on-surface-variant">{tx.date}</span>
                </div>
              </div>
              <span className={`font-serif font-bold ${
                tx.type === 'earn' ? 'text-secondary' : 'text-on-surface-variant'
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
