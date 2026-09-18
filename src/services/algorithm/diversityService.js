export const diversityService = {
  /**
   * Apply sliding window constraints to ensure feed diversity
   * @param {Array} rankedItems - Array of { reel, ranking }
   * @param {Object} options - Diversity configuration
   */
  applyDiversity(rankedItems = [], {
    maxConsecutiveSameCategory = 2,
    minSpacingSameCreator = 3,
    minSpacingSameMerchant = 3
  } = {}) {
    if (!rankedItems || rankedItems.length <= 2) return rankedItems;

    const diversified = [];
    const pool = [...rankedItems];

    while (pool.length > 0) {
      let selectedIndex = -1;

      // Find the best candidate from the pool that satisfies the window diversity rules
      for (let i = 0; i < pool.length; i++) {
        const item = pool[i];
        const reel = item.reel;
        const category = reel.categoryId || (reel.id.includes('sheglam') ? 'beauty' : 'fashion');
        const creatorId = reel.creatorId || reel.creatorHandle;
        const merchantId = reel.merchantId;

        // Check category constraint (no 3 consecutive of identical category)
        const recentCategories = diversified.slice(-maxConsecutiveSameCategory).map(x => 
          x.reel.categoryId || (x.reel.id.includes('sheglam') ? 'beauty' : 'fashion')
        );
        const violatesCategory = recentCategories.length === maxConsecutiveSameCategory &&
          recentCategories.every(c => c === category);

        // Check creator spacing constraint
        const recentCreators = diversified.slice(-minSpacingSameCreator).map(x => x.reel.creatorId || x.reel.creatorHandle);
        const violatesCreator = creatorId && recentCreators.includes(creatorId);

        // Check merchant spacing constraint
        const recentMerchants = diversified.slice(-minSpacingSameMerchant).map(x => x.reel.merchantId).filter(Boolean);
        const violatesMerchant = merchantId && recentMerchants.includes(merchantId);

        if (!violatesCategory && !violatesCreator && !violatesMerchant) {
          selectedIndex = i;
          break;
        }
      }

      // If no item in pool strictly satisfies all constraints (e.g. at end of small pool), take top item
      if (selectedIndex === -1) {
        selectedIndex = 0;
      }

      diversified.push(pool[selectedIndex]);
      pool.splice(selectedIndex, 1);
    }

    return diversified;
  }
};
