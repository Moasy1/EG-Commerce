import { followService } from './followService.js';
import { engagementService } from './engagementService.js';
import { commentService } from './commentService.js';
import { profileService } from './profileService.js';
import { reelService } from './reelService.js';
import { eventTracker } from '../analytics/eventTracker.js';

export const socialService = {
  // Direct access to underlying sub-services
  follow: followService,
  engagement: engagementService,
  comments: commentService,
  profile: profileService,
  reels: reelService,

  /**
   * Coordinated Like action:
   * 1. Toggle like in engagementService
   * 2. Log user_event ('reel_like' or 'reel_unlike')
   * 3. Update counter locally
   */
  async likeReel(reel, userId = null) {
    const isNowLiked = await engagementService.toggleLikeReel(reel.id, userId);

    await eventTracker.trackEvent(isNowLiked ? 'reel_like' : 'reel_unlike', {
      userId,
      entityType: 'reel',
      reelId: reel.id,
      creatorId: reel.creatorId || reel.creator_id,
      merchantId: reel.merchantId || reel.merchant_id,
      metadata: { categoryId: reel.categoryId || 'fashion' }
    });

    return {
      isLiked: isNowLiked,
      likesDelta: isNowLiked ? 1 : -1
    };
  },

  /**
   * Coordinated Save action:
   * 1. Toggle save in engagementService
   * 2. Log user_event ('reel_save' or 'reel_unsave')
   */
  async saveReel(reel, userId = null) {
    const isNowSaved = await engagementService.toggleSaveReel(reel.id, userId);

    await eventTracker.trackEvent(isNowSaved ? 'reel_save' : 'reel_unsave', {
      userId,
      entityType: 'reel',
      reelId: reel.id,
      creatorId: reel.creatorId || reel.creator_id,
      merchantId: reel.merchantId || reel.merchant_id,
      metadata: { categoryId: reel.categoryId || 'fashion' }
    });

    return isNowSaved;
  },

  /**
   * Coordinated Follow action:
   * 1. Toggle follow in followService
   * 2. Follow event logged inside followService
   */
  async toggleFollow(creatorId, currentUserId = null, creatorHandle = null) {
    return followService.toggleFollow(creatorId, currentUserId, creatorHandle);
  },

  /**
   * Coordinated Share action:
   * 1. Record share in reel_shares table
   * 2. Track 'reel_share' user event
   */
  async shareReel(reel, shareType = 'copy_link', userId = null) {
    await engagementService.recordShare(reel.id, shareType, userId);

    await eventTracker.trackEvent('reel_share', {
      userId,
      entityType: 'reel',
      reelId: reel.id,
      creatorId: reel.creatorId || reel.creator_id,
      merchantId: reel.merchantId || reel.merchant_id,
      metadata: { shareType, categoryId: reel.categoryId || 'fashion' }
    });

    return true;
  },

  /**
   * Coordinated Comment action:
   * 1. Add comment via commentService
   * 2. Track 'reel_comment' event
   */
  async postComment(reel, commentPayload) {
    const newComment = await commentService.addComment(reel.id, commentPayload);

    await eventTracker.trackEvent('reel_comment', {
      userId: commentPayload.userId,
      entityType: 'reel',
      reelId: reel.id,
      creatorId: reel.creatorId || reel.creator_id,
      merchantId: reel.merchantId || reel.merchant_id,
      metadata: { commentId: newComment.id, parentId: commentPayload.parentId }
    });

    return newComment;
  }
};
