const ScrapedUnit = require('../models/ScrapedUnit');

/**
 * Get scraping history for a specific user
 * @param {string} username - Username to filter by
 * @param {number} limit - Maximum number of results to return (default: 20)
 * @returns {Promise<Array>} - Array of scraped units for the user
 */
async function getUserScrapingHistory(username, limit = 20) {
  try {
    console.log(`Retrieving scraping history for user: ${username}`);
    
    // Find all scraped units for this user, sorted by most recent first
    const userHistory = await ScrapedUnit.find({ user: username })
      .sort({ scrapedAt: -1 })
      .limit(limit)
      .lean();
    
    console.log(`Found ${userHistory.length} scraped units for user ${username}`);
    
    // Return the history
    return userHistory;
  } catch (error) {
    console.error(`Error retrieving user history: ${error.message}`);
    throw new Error(`Failed to retrieve scraping history: ${error.message}`);
  }
}

/**
 * Get a summary of scraping history for a specific user
 * @param {string} username - Username to filter by
 * @returns {Promise<Object>} - Summary of user's scraping activity
 */
async function getUserHistorySummary(username) {
  try {
    // Count total units scraped by this user
    const totalCount = await ScrapedUnit.countDocuments({ user: username });
    
    // Get the first and last scraping timestamps
    const firstScrape = await ScrapedUnit.findOne({ user: username })
      .sort({ scrapedAt: 1 })
      .select('scrapedAt')
      .lean();
      
    const lastScrape = await ScrapedUnit.findOne({ user: username })
      .sort({ scrapedAt: -1 })
      .select('scrapedAt')
      .lean();
    
    // Get count by property type
    const propertyTypeCounts = await ScrapedUnit.aggregate([
      { $match: { user: username } },
      { $group: { _id: '$property_type', count: { $sum: 1 } } }
    ]);
    
    // Return summary object
    return {
      totalScraped: totalCount,
      firstScrapedAt: firstScrape?.scrapedAt || null,
      lastScrapedAt: lastScrape?.scrapedAt || null,
      propertyTypes: propertyTypeCounts.map(item => ({
        type: item._id || 'Unknown',
        count: item.count
      }))
    };
  } catch (error) {
    console.error(`Error retrieving user history summary: ${error.message}`);
    throw new Error(`Failed to retrieve scraping history summary: ${error.message}`);
  }
}

module.exports = {
  getUserScrapingHistory,
  getUserHistorySummary
};