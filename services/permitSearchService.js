const RecordsProperty = require('../models/Property'); // This should point to the 'records' collection model

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function sqftToSqm(sqft) {
  return sqft * 0.092903;
}

function generatePermitVariations(permitNumber) {
  const variations = [permitNumber];
  
  // Remove digits from start (beyond the 2 already removed)
  for (let i = 1; i <= 4 && i < permitNumber.length; i++) {
    const variation = permitNumber.substring(i);
    if (variation.length >= 5) {
      variations.push(variation);
    }
  }
  
  // Remove digits from end
  for (let i = 1; i <= 5 && i < permitNumber.length; i++) {
    const variation = permitNumber.substring(0, permitNumber.length - i);
    if (variation.length >= 5) {
      variations.push(variation);
    }
  }
  
  return [...new Set(variations)];
}

function formatResults(matches, matchMethod) {
  const uniqueUnits = new Map();

  matches.forEach(match => {
    if (match.unit) {
      // Use only the unit number as the key to ensure true uniqueness
      const unitKey = match.unit.toString().trim();
      
      if (!uniqueUnits.has(unitKey)) {
        uniqueUnits.set(unitKey, {
          unit: match.unit,
          building: match.additionalData?.BUILDING || 'Unknown Building',
          pNumber: match.pNumber,
          size: match.property?.size || null,
          owner: match.owner?.name || null,
          mobile: match.phone?.mobile || null,
          phone: match.phone?.landline || null,
          email: match.owner?.email || null,
          // registrationDate: match.createdAt ? new Date(match.createdAt).toLocaleDateString() : null
        });
      }
    }
  });

  const uniqueResults = Array.from(uniqueUnits.values());

  return {
    matches: uniqueResults,
    matchMethod,
    totalMatches: matches.length,
    uniqueUnits: uniqueResults.length
  };
}

// ==========================================
// PERMIT-BASED SEARCH FUNCTION
// ==========================================

async function findMatchingPropertiesByPermit(scrapedData) {
  try {
    console.log('\n=== Starting permit-based property search ===');
    console.log('Scraped data:', JSON.stringify(scrapedData, null, 2));
    
    // Convert size from sqft to sqm for potential filtering
    let sizeSqm = null;
    if (scrapedData.size_numeric) {
      sizeSqm = sqftToSqm(scrapedData.size_numeric);
      console.log(`Size converted: ${scrapedData.size_numeric} sqft = ${sizeSqm.toFixed(2)} sqm`);
    }

    // Clean and process permit number
    const originalPermit = scrapedData.permit_number;
    if (!originalPermit) {
      console.log('No permit number found, cannot perform permit-based search');
      return { matches: [], matchMethod: 'no_permit_number' };
    }

    // Remove first two digits from permit number
    const cleanPermitNumber = originalPermit.replace(/[^0-9]/g, ''); // Keep only digits
    if (cleanPermitNumber.length < 3) {
      console.log('Permit number too short for permit-based search');
      return { matches: [], matchMethod: 'permit_too_short' };
    }

    const truncatedPermit = cleanPermitNumber.substring(2); // Remove first 2 digits

    let matches = [];
    let matchMethod = 'none';

    console.log('Starting permit-based search in records collection...');
    console.log(`Original permit: ${originalPermit}`);
    console.log(`Clean permit: ${cleanPermitNumber}`);
    console.log(`Truncated permit: ${truncatedPermit}`);

    // Step 1: Try exact match with truncated permit number
    matches = await RecordsProperty.find({ pNumber: truncatedPermit });
    
    if (matches.length > 0) {
      matchMethod = 'exact_truncated_permit';
      console.log(`Found ${matches.length} matches with exact truncated permit`);
      return formatResults(matches, matchMethod);
    }

    // Step 2: Try partial matches (remove digits from start and end)
    if (truncatedPermit.length >= 6) {
      // Generate variations: remove 2 digits from end and 2 digits from start
      const endTruncated = truncatedPermit.substring(0, truncatedPermit.length - 2); // Remove last 2 digits
      const startTruncated = truncatedPermit.substring(2); // Remove first 2 digits

      console.log(`Trying partial matches: ${endTruncated}, ${startTruncated}`);

      // Search for both variations
      const partialMatches = await RecordsProperty.find({
        $or: [
          { pNumber: endTruncated },
          { pNumber: startTruncated }
        ]
      });

      if (partialMatches.length > 0 && sizeSqm) {
        // Filter by size with ±0.1 sqm tolerance
        const tolerance = 0.1;
        const minSize = sizeSqm - tolerance;
        const maxSize = sizeSqm + tolerance;

        const sizeFilteredMatches = partialMatches.filter(property => {
          const dbSize = parseFloat(property.property?.size);
          if (isNaN(dbSize)) return false;
          return dbSize >= minSize && dbSize <= maxSize;
        });

        if (sizeFilteredMatches.length > 0) {
          matchMethod = 'partial_permit_with_size';
          console.log(`Found ${sizeFilteredMatches.length} matches with partial permit and size filter`);
          return formatResults(sizeFilteredMatches, matchMethod);
        }
      } else if (partialMatches.length > 0) {
        matchMethod = 'partial_permit_only';
        console.log(`Found ${partialMatches.length} matches with partial permit only`);
        return formatResults(partialMatches, matchMethod);
      }
    }

    return { matches: [], matchMethod: 'no_permit_matches' };

  } catch (error) {
    console.error('Error finding matching properties by permit:', error);
    return { matches: [], matchMethod: 'error', error: error.message };
  }
}

// ==========================================
// LOGGING FUNCTIONS
// ==========================================

// Update the logging function to not show anything (we're handling this in app.js now)
function logPermitMatchingResults(propertyMatches) {
  // Empty function as we're handling the logging in app.js
}

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  findMatchingPropertiesByPermit,
  logPermitMatchingResults,
  sqftToSqm,
  generatePermitVariations,
  formatResults
};