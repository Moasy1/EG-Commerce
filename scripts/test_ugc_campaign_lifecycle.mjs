// Test script: UGC Campaign full lifecycle test
// Run with: node scripts/test_ugc_campaign_lifecycle.mjs

class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
}

globalThis.localStorage = new LocalStorageMock();

// Dynamically import UgcService and ReelsService
const { UgcService } = await import('../src/services/UgcService.js');
const { ReelsService } = await import('../src/services/ReelsService.js');

console.log('--- TEST 1: Create New Merchant Campaign ---');
const testMerchantId = 'm-test-789';
const campaignData = {
  title: 'حملة فساتين الحرير المصرية لخريف 2026',
  titleEn: 'Egyptian Silk Dress Autumn Campaign',
  brandName: 'Nile Couture • نايل كوتور',
  merchantId: testMerchantId,
  productId: 'p-silk-01',
  productName: 'فستان حرير مطرز يدوياً',
  rewardType: 'hybrid',
  fixedAmount: 1800,
  commissionRate: 15,
  creatorSlots: 4,
  brief: 'تصوير فيديو ريلز يبرز بريق الحرير مع إضاءة طبيعية دافئة.'
};

const createdCampaign = await UgcService.createCampaign(campaignData);
console.log('Created Campaign:', {
  id: createdCampaign.id,
  title: createdCampaign.title,
  merchantId: createdCampaign.merchantId,
  rewardLabel: createdCampaign.rewardLabel,
  slotsAvailable: createdCampaign.slotsAvailable
});

if (!createdCampaign.id || createdCampaign.merchantId !== testMerchantId) {
  throw new Error('Failed to create campaign properly');
}

console.log('\n--- TEST 2: Query Merchant Campaigns ---');
const merchantCampaigns = await UgcService.getCampaigns(testMerchantId);
console.log(`Found ${merchantCampaigns.length} campaigns for merchant ${testMerchantId}`);
if (merchantCampaigns.length !== 1 || merchantCampaigns[0].id !== createdCampaign.id) {
  throw new Error('Merchant campaign filter failed');
}

console.log('\n--- TEST 3: Creator Applies for Campaign ---');
const creatorProfile = {
  id: 'cr-test-01',
  name: 'نور الهدى • Nour El-Hoda',
  handle: '@nour_fashion',
  avatar: '/images/reels/reel_2.jpg',
  followers: '310K',
  niche: 'أزياء راقية ومحجبات',
  city: 'القاهرة'
};

const appliedCamp = await UgcService.applyForCampaign(
  createdCampaign.id,
  creatorProfile,
  'لدي خبرة واسعة في تنسيقات الحرير وجمهور مهتم جداً بالأزياء التراثية.'
);
console.log('Campaign after application:', {
  applied: appliedCamp.applied,
  applicationStatus: appliedCamp.applicationStatus,
  slotsRemaining: appliedCamp.slotsAvailable
});

if (!appliedCamp.applied || appliedCamp.applicationStatus !== 'applied') {
  throw new Error('Application state was not updated on campaign');
}

console.log('\n--- TEST 4: Merchant Reviews & Approves Application ---');
const apps = await UgcService.getApplications(createdCampaign.id);
console.log(`Found ${apps.length} applications for campaign:`, apps.map(a => ({ id: a.id, creator: a.creatorName, status: a.status })));
if (apps.length === 0) {
  throw new Error('Application was not saved to applications registry');
}

const targetApp = apps[0];
const approvedApp = await UgcService.reviewApplication(targetApp.id, 'approved', 'تم قبول طلبك! يمكنك إرسال المسودة الآن.');
console.log('Approved Application Status:', approvedApp.status);
if (approvedApp.status !== 'approved') {
  throw new Error('Failed to approve application');
}

console.log('\n--- TEST 5: Creator Submits Video Draft ---');
const draftUrl = '/videos/test_silk_dress_draft.mp4';
const draftSubmittedCamp = await UgcService.submitCampaignDraft(
  createdCampaign.id,
  draftUrl,
  'تم تصوير الفيديو بجودة 4K في حديقة الأندلس مع إبراز كود الخصم.'
);
console.log('Campaign after draft submitted:', {
  status: draftSubmittedCamp.applicationStatus,
  submittedUrl: draftSubmittedCamp.submittedUrl
});

if (draftSubmittedCamp.applicationStatus !== 'draft_submitted' || draftSubmittedCamp.submittedUrl !== draftUrl) {
  throw new Error('Draft submission failed');
}

console.log('\n--- TEST 6: Merchant Approves Draft & Publishes to Reels Feed ---');
const initialReels = await ReelsService.getReels();
const initialReelsCount = initialReels.length;

const publishResult = await UgcService.approveDraftAndPublish(
  createdCampaign.id,
  targetApp.id,
  'فيديو رائع وجودة استثنائية! تم اعتماده للنشر.'
);
console.log('Publish result:', {
  success: publishResult.success,
  campStatus: publishResult.campaign.applicationStatus
});

const updatedReels = await ReelsService.getReels();
console.log(`Reels count: ${initialReelsCount} -> ${updatedReels.length}`);
const publishedReel = updatedReels[0];
console.log('Latest published Reel:', {
  id: publishedReel.id,
  creatorHandle: publishedReel.creatorHandle,
  caption: publishedReel.caption,
  videoBg: publishedReel.videoBg
});

if (updatedReels.length <= initialReelsCount) {
  throw new Error('Reel was not published to ReelsService feed!');
}

console.log('\n✅ ALL UGC CAMPAIGN END-TO-END LIFECYCLE TESTS PASSED PERFECTLY!');
