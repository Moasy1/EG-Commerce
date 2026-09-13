import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RewardService } from '../services/RewardService';
import { useEffect } from 'react';

export default function RewardsHub() {
  const { rewardPoints, setRewardPoints, user } = useApp();
  const [redeemSuccess, setRedeemSuccess] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      const hist = await RewardService.getHistory(user?.id);
      setHistory(hist);
    };
    loadHistory();
  }, [user]);

  const vouchers = [
    { id: 'v-1', title: '100 EGP Discount Voucher • قسيمة خصم', points: 1000, desc: 'صالحة على جميع البراندات بحد أدنى للطلب 500 EGP' },
    { id: 'v-2', title: 'Free Shipping Voucher • شحن مجاني', points: 600, desc: 'تغطي تكلفة الشحن الموحد لجميع الطرود' },
    { id: 'v-3', title: '250 EGP Discount Voucher • قسيمة خصم', points: 2500, desc: 'صالحة لقسم الفساتين، العبايات، وقطع الكتان' },
  ];

  const handleRedeemVoucher = async (voucher) => {
    const result = await RewardService.redeemPoints(user?.id, voucher.points, `Redeemed: ${voucher.title}`);
    if (result.success) {
      setRewardPoints(result.newBalance);
      setRedeemSuccess(`تم استبدال فوتشر "${voucher.title}" بنجاح! تم حفظ الكود في محفظتك.`);
      setTimeout(() => setRedeemSuccess(''), 4000);
      
      // refresh history
      const hist = await RewardService.getHistory(user?.id);
      setHistory(hist);
    } else {
      alert(result.message || 'عفواً، رصيد الـ Points غير كافٍ لهذا الفوتشر.');
    }
  };

  

  return (
    <div className="w-full flex-1 max-w-4xl mx-auto px-4 md:px-6 py-4 pb-28 md:pb-12 text-on-surface text-right">
      <div className="mb-4">
        <h1 className="font-serif text-xl md:text-2xl font-bold text-on-surface">Rewards & Points • المكافآت ونقاط الولاء</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          تسوقي، اتفرجي على الـ Reels، اجمعي Points واستبدليها بخصومات فورية وفوتشرات
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
              <span>Available Balance • رصيد النقاط المتاح</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl md:text-4xl font-bold text-on-surface">{rewardPoints.toLocaleString()}</span>
              <span className="text-xs font-bold text-secondary">Points</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              تساوي Cash Discount فوري بقيمة <b className="text-on-surface font-bold">{Math.floor(rewardPoints / 10)} EGP</b>
            </p>
          </div>

          {/* Tier Status */}
          <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-container-high shrink-0 min-w-[190px]">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="text-on-surface-variant font-medium">Tier • المستوى:</span>
              <span className="text-secondary font-bold">Silver Member (الفضي)</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden my-1.5">
              <div className="h-full bg-secondary rounded-full w-[65%]" />
            </div>
            <span className="text-[10px] text-on-surface-variant block text-left">باقي 550 Points للـ Gold Tier</span>
          </div>
        </div>
      </div>

      {/* Ways to Earn */}
      <section className="mb-6">
        <h2 className="font-serif text-sm font-bold text-on-surface mb-3">Ways to Earn • طرق جمع الـ Points</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { title: 'Shopping • تسوق مباشر', value: '10 Points لكل 100 EGP', icon: 'shopping_bag' },
            { title: 'Watch Reels • مشاهدة ريلز', value: '+15 Points يومياً', icon: 'play_circle' },
            { title: 'Referral • دعوة صديقة', value: '+200 Points لكل أوردر', icon: 'share' },
            { title: 'UGC Content • تصوير ريلز', value: 'Up to 1,000 Points', icon: 'movie_edit' }
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
        <h2 className="font-serif text-sm font-bold text-on-surface mb-3">Vouchers & Deals • الفوتشرات المتاحة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {vouchers.map((v) => (
            <div key={v.id} className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container-high flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex justify-between items-start mb-1.5">
                  <h3 className="text-xs font-bold text-on-surface">{v.title}</h3>
                  <span className="text-xs font-bold text-secondary">{v.points} Points</span>
                </div>
                <p className="text-[11px] text-on-surface-variant mb-3 leading-relaxed">{v.desc}</p>
              </div>
              <button
                onClick={() => handleRedeemVoucher(v)}
                disabled={rewardPoints < v.points}
                className="w-full py-2 rounded-lg text-xs font-semibold bg-secondary text-on-secondary hover:opacity-90 transition-all disabled:opacity-40"
              >
                Redeem Now • استبدال الآن
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* History Ledger */}
      <section>
        <h2 className="font-serif text-sm font-bold text-on-surface mb-3">Points History • سجل العمليات</h2>
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
