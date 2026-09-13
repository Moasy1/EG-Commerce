import { supabase } from '../lib/supabase';

export const RewardService = {
  async getBalance(userId) {
    if (!userId) {
      const local = localStorage.getItem('eg_mock_points');
      return local ? parseInt(local, 10) : 2450;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('reward_points_balance')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data?.reward_points_balance || 0;
    } catch (err) {
      console.warn('DB Rewards fetch failed, using local mock data:', err.message);
      const local = localStorage.getItem('eg_mock_points');
      return local ? parseInt(local, 10) : 2450;
    }
  },

  async getHistory(userId) {
    if (!userId) return this.getMockHistory();
    try {
      const { data, error } = await supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Map to UI format
      if (!data || data.length === 0) return this.getMockHistory();
      
      return data.map(tx => ({
        id: tx.id,
        title: tx.description || 'Reward Transaction',
        points: (tx.type === 'earn' ? '+' : '-') + tx.points + ' Points',
        date: new Date(tx.created_at).toLocaleDateString(),
        type: tx.type
      }));
    } catch (err) {
      console.warn('DB Reward history fetch failed:', err.message);
      return this.getMockHistory();
    }
  },

  async redeemPoints(userId, pointsToRedeem, description) {
    if (!userId) {
      let local = parseInt(localStorage.getItem('eg_mock_points') || '2450', 10);
      if (local >= pointsToRedeem) {
        local -= pointsToRedeem;
        localStorage.setItem('eg_mock_points', local.toString());
        return { success: true, newBalance: local };
      }
      return { success: false, message: 'Insufficient points' };
    }

    try {
      // Fetch current balance
      const balance = await this.getBalance(userId);
      if (balance < pointsToRedeem) {
        return { success: false, message: 'Insufficient points' };
      }

      // Decrement profile balance
      const newBalance = balance - pointsToRedeem;
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ reward_points_balance: newBalance })
        .eq('id', userId);
        
      if (profileError) throw profileError;

      // Log transaction
      await supabase.from('reward_transactions').insert({
        user_id: userId,
        type: 'redeem',
        points: pointsToRedeem,
        description: description || 'Redeemed voucher'
      });

      return { success: true, newBalance };
    } catch (err) {
      console.error('Failed to redeem points in DB:', err.message);
      return { success: false, message: 'Failed to redeem points' };
    }
  },

  getMockHistory() {
    return [
      { id: 'h1', title: 'Order Purchase • شراء: فستان كتان صيفي بوهيمي', points: '+140 Points', date: 'Today • اليوم', type: 'earn' },
      { id: 'h2', title: 'Daily Reels Watch • مشاهدة وتفاعل ريلز', points: '+50 Points', date: 'Yesterday • أمس', type: 'earn' },
      { id: 'h3', title: 'Redeemed in Cart • خصم فوري بالسلة', points: '-500 Points', date: '3 days ago', type: 'redeem' },
      { id: 'h4', title: 'Friend Referral • مكافأة دعوة صديقة', points: '+200 Points', date: '5 days ago', type: 'earn' }
    ];
  }
};
