const mongoose = require('mongoose');

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function sqftToSqm(sqft) {
  return sqft * 0.092903;
}

function normalizeText(text) {
  if (!text) return '';
  return text.toString().trim().toLowerCase().replace(/\s+/g, ' ');
}

function allWordsContainedInOrder(source, target) {
  if (!source || !target) return false;
  const normalizedSource = normalizeText(source);
  const normalizedTarget = normalizeText(target);

  // Check if all words from source appear in target in order
  let currentPos = 0;
  const sourceWords = normalizedSource.split(/\s+/);

  for (const word of sourceWords) {
    if (word.length <= 1) continue; // Skip very short words

    const pos = normalizedTarget.indexOf(word, currentPos);
    if (pos === -1) return false; // Word not found after current position
    currentPos = pos + word.length;
  }

  return true;
}

// Replace the existing stringContains function with a more strict one
function stringContains(haystack, needle) {
  if (!haystack || !needle) return false;

  // For multi-word needles, use the stricter allWordsContainedInOrder function
  if (needle.trim().includes(' ')) {
    return allWordsContainedInOrder(needle, haystack);
  }

  // For single words, use exact word matching, not just substring
  const haystackWords = normalizeText(haystack).split(/\s+/);
  return haystackWords.includes(normalizeText(needle));
}

function stringsMatch(str1, str2) {
  if (!str1 || !str2) return false;
  return normalizeText(str1) === normalizeText(str2);
}

function parseSize(sizeValue) {
  if (sizeValue === null || sizeValue === undefined) return null;

  if (typeof sizeValue === 'string') {
    const cleanedValue = sizeValue.replace(/[^\d.]/g, '');
    return parseFloat(cleanedValue) || null;
  }

  return parseFloat(sizeValue) || null;
}

function calculateProjectMatchScore(scrapedData, property) {
  let score = 0;

  console.log(`\n--- Calculating match score for property: ${property.unit_number} ---`);
  console.log(`Property project: ${property.project}`);
  console.log(`Property building: ${property.building_name}`);
  console.log(`Scraped project: ${scrapedData.location_details?.project}`);

  // Project name matching - exact matches get high score, partial matches get lower score
  if (scrapedData.location_details?.project) {
    const scrapedProject = scrapedData.location_details.project;

    // Check for exact matches first (high score)
    if (stringsMatch(property.project, scrapedProject) ||
      stringsMatch(property.building_name, scrapedProject) ||
      stringsMatch(property.building_name_2, scrapedProject) ||
      stringsMatch(property.project_lnd, scrapedProject) ||
      stringsMatch(property.building_name_en, scrapedProject)) {
      score += 5; // High score for exact project match
    }
    // Check for all words in exact order (slightly lower score for matches with additional text)
    else if (allWordsContainedInOrder(scrapedProject, property.project) ||
      allWordsContainedInOrder(scrapedProject, property.building_name) ||
      allWordsContainedInOrder(scrapedProject, property.building_name_2) ||
      allWordsContainedInOrder(scrapedProject, property.project_lnd) ||
      allWordsContainedInOrder(scrapedProject, property.building_name_en)) {
      score += 4
    }
  }

  // Size matching - give high score for exact size matches
  if (scrapedData.size_numeric && (property.size || property.actual_size)) {
    const scrapedSizeSqm = sqftToSqm(scrapedData.size_numeric);

    const propertySize = parseSize(property.size);
    const propertyActualSize = parseSize(property.actual_size);

    const propertySizeToCheck = propertySize || propertyActualSize;

    if (propertySizeToCheck !== null) {
      const sizeDifference = Math.abs(scrapedSizeSqm - propertySizeToCheck);

      if (sizeDifference <= 0.01) {
        score += 4;
      } else if (sizeDifference <= 0.02) {
        score += 3;
      }
    }
  }

  // Property type matching
  if (scrapedData.property_type && property.property_type) {
    // Normalize property types for comparison
    const scrapedType = normalizeText(scrapedData.property_type);
    const propertyType = normalizeText(property.property_type);

    if (scrapedType.includes('apartment') && propertyType.includes('apartment')) {
      score += 2;
      console.log(`Property type match (apartments)! Score +2`);
    } else if (stringContains(property.property_type, scrapedData.property_type) ||
      stringContains(scrapedData.property_type, property.property_type)) {
      score += 2;
      console.log(`Property type match! Score +2`);
    }
  }

  console.log(`Total score: ${score}`);
  return score;
}

function buildProjectQueryConditions(scrapedData) {
  const queryConditions = [];

  console.log('\n--- Building query conditions ---');
  console.log(`Scraped project: ${scrapedData.location_details?.project}`);

  // Project name matching - make it more specific
  if (scrapedData.location_details?.project) {
    const projectName = scrapedData.location_details.project;
    console.log(`Adding project query for: ${projectName}`);

    const normalizedProject = normalizeText(projectName);

    // Split by spaces but preserve numbers attached to words
    const projectWords = normalizedProject.split(/\s+/).filter(word => {
      // Keep words longer than 2 chars OR any word containing a number
      return word.length > 2 || /\d/.test(word);
    });

    // Build regex patterns for exact matching and ordered word matching
    const exactPattern = `^${projectName}$|^${projectName},|^${projectName} |${projectName}$|, ${projectName}$| ${projectName}$`;
    const projectConditions = [
      // Exact matches
      { building_name: { $regex: exactPattern, $options: 'i' } },
      { building_name_2: { $regex: exactPattern, $options: 'i' } },
      { building_name_en: { $regex: exactPattern, $options: 'i' } },
      { project: { $regex: exactPattern, $options: 'i' } },
      { project_lnd: { $regex: exactPattern, $options: 'i' } }
    ];

    // Create a regex pattern for ordered word matching
    if (projectWords.length >= 2) {
      let orderedWordsPattern = '';
      projectWords.forEach((word) => {
        orderedWordsPattern += `(${word}).*`;
      });

      projectConditions.push(
        { building_name: { $regex: orderedWordsPattern, $options: 'i' } },
        { building_name_2: { $regex: orderedWordsPattern, $options: 'i' } },
        { building_name_en: { $regex: orderedWordsPattern, $options: 'i' } },
        { project: { $regex: orderedWordsPattern, $options: 'i' } },
        { project_lnd: { $regex: orderedWordsPattern, $options: 'i' } }
      );

      console.log(`Added ordered words pattern: ${orderedWordsPattern}`);
    }

    queryConditions.push({ $or: projectConditions });
  }

  // Filter out specific procedure types and statuses
  // queryConditions.push({
  //   $or: [
  //     { procedure_name: { $exists: false } },
  //     { procedure_name: { $nin: ["Delayed Sell", "Complete Delayed Sell", "Mortgage Registration", "Sell - Pre registration", "Modify Mortgage", "Grant on Delayed Sell"] } }
  //   ]
  // });

  // queryConditions.push({
  //   $or: [
  //     { owner_type: { $exists: false } },
  //     { owner_type: { $nin: ["Seller"] } }
  //   ]
  // });

  // queryConditions.push({
  //   $or: [
  //     { completion_status: { $exists: false } },
  //     { completion_status: { $nin: ["off-plan"] } }
  //   ]
  // });

  console.log(`Built ${queryConditions.length} query conditions`);
  return queryConditions;
}

function formatProjectResults(matches, matchMethod) {
  return {
    matches: matches.map(match => ({
      unit: match.unit_number || null,
      building: match.building_name || match.building_name_en || null,
      project: match.project || null,
      masterProject: match.master_project || match.master_location || null,
      size: match.size || match.actual_size || null,
      owner: match.owner_name || null,
      mobile: match.mobile || match.phone || null,
      email: match.email || null,
      // registrationDate: match.registrationDate ? 
      //   new Date(match.registrationDate).toLocaleDateString() : null,
      // matchScore: match.matchScore
    })),
    // matchMethod,
    // totalMatches: matches.length,
    // uniqueUnits: matches.length
  };
}

// ==========================================
// PROJECT-BASED SEARCH FUNCTION
// ==========================================

async function findMatchingPropertiesByProject(scrapedData) {
  try {
    console.log('\n=== Starting project-based search in properties collection ===');

    // Get the properties collection directly using mongoose
    const PropertiesModel = mongoose.connection.collection('old_properties');

    const queryConditions = buildProjectQueryConditions(scrapedData);

    // Build the query - if we have conditions, use $and, otherwise search all
    let query = {};
    if (queryConditions.length > 0) {
      // For initial search, let's be less restrictive - only require project match
      const projectConditions = queryConditions.filter(condition =>
        condition.$or && condition.$or.some(or =>
          or.building_name || or.project || or.master_project
        )
      );

      if (projectConditions.length > 0) {
        query = { $or: projectConditions };
      }
    }

    console.log('MongoDB Query:', JSON.stringify(query, null, 2));

    // Find properties based on query conditions
    const potentialMatches = await PropertiesModel.find(query).toArray();

    console.log(`Found ${potentialMatches.length} potential property matches in properties collection`);

    if (potentialMatches.length > 0) {
      console.log('Sample match:', JSON.stringify(potentialMatches[0], null, 2));
    }

    // Apply size filtering if size information is available
    let filteredMatches = potentialMatches;
    const scrapedSizeSqm = scrapedData.size_numeric ? sqftToSqm(scrapedData.size_numeric) : null;

    // If we don't have size data, we can't perform proper filtering
    if (!scrapedSizeSqm) {
      console.log('No size information available, cannot perform full matching');
      filteredMatches = []; // Return empty array if size is missing
    } else {
      const sizeRange = 0.02;
      const lowerSizeLimit = scrapedSizeSqm - sizeRange;
      const upperSizeLimit = scrapedSizeSqm + sizeRange;

      console.log(`Size filtering: ${lowerSizeLimit.toFixed(2)} - ${upperSizeLimit.toFixed(2)} sqm`);

      filteredMatches = potentialMatches.filter(property => {
        const propertySize = parseSize(property.size);
        const propertyActualSize = parseSize(property.actual_size);

        // Only keep properties that have size data matching our criteria
        if (propertySize !== null && propertySize >= lowerSizeLimit && propertySize <= upperSizeLimit) {
          return true;
        }
        if (propertyActualSize !== null && propertyActualSize >= lowerSizeLimit && propertyActualSize <= upperSizeLimit) {
          return true;
        }

        // Skip properties without size data - both project and size must match
        return false;
      });

      console.log(`After size filtering: ${filteredMatches.length} matches`);
    }

    // Score each potential match
    const scoredMatches = filteredMatches.map(property => {
      const score = calculateProjectMatchScore(scrapedData, property);
      return { ...property, matchScore: score };
    });

    // Sort by match score (descending)
    scoredMatches.sort((a, b) => b.matchScore - a.matchScore);

    console.log('\n--- Top scored matches ---');
    scoredMatches.slice(0, 5).forEach((match, index) => {
      console.log(`${index + 1}. Unit: ${match.unit_number}, Project: ${match.project}, Score: ${match.matchScore}`);
    });

    // Filter to include matches with score >= 2 (lowered from 5 to include partial matches)
    const scoreThreshold = 2;
    const goodMatches = scoredMatches.filter(match => match.matchScore >= scoreThreshold);

    console.log(`Found ${goodMatches.length} matches with score >= ${scoreThreshold}`);

    return goodMatches;

  } catch (error) {
    console.error('Error searching in properties collection:', error);
    return [];
  }
}

// ==========================================
// MAIN SEARCH FUNCTION WITH FLEXIBLE SCORE FILTERING
// ==========================================

async function searchPropertiesByProjectAndSize(scrapedData, scoreThreshold = 2) {
  try {
    console.log('\n=== Starting project and size-based property search ===');
    console.log('Scraped data:', JSON.stringify(scrapedData, null, 2));
    console.log(`Using score threshold: ${scoreThreshold}`);

    // Check if we have project information
    if (!scrapedData.location_details?.project) {
      console.log('No project information found, cannot perform project-based search');
      return { matches: [], matchMethod: 'no_project_data' };
    }

    const projectMatches = await findMatchingPropertiesByProject(scrapedData);

    // Apply the score threshold filter
    const filteredMatches = projectMatches.filter(match => match.matchScore >= scoreThreshold);

    if (filteredMatches.length > 0) {
      console.log(`Found ${filteredMatches.length} matches with project-based search (score >= ${scoreThreshold})`);

      // Separate exact matches (score >= 5) from partial matches (score 2-4)
      const exactMatches = filteredMatches.filter(match => match.matchScore >= 5);
      const partialMatches = filteredMatches.filter(match => match.matchScore >= 2 && match.matchScore < 5);

      console.log(`Exact matches: ${exactMatches.length}, Partial matches: ${partialMatches.length}`);

      return formatProjectResults(filteredMatches, 'project_and_size_search_with_partial');
    }

    return { matches: [], matchMethod: 'no_project_matches_above_threshold' };

  } catch (error) {
    console.error('Error finding matching properties by project and size:', error);
    return { matches: [], matchMethod: 'error', error: error.message };
  }
}

// ==========================================
// ENHANCED SEARCH FUNCTION WITH SEPARATE EXACT AND PARTIAL RESULTS
// ==========================================

async function searchPropertiesByProjectAndSizeDetailed(scrapedData) {
  try {
    console.log('\n=== Starting detailed project and size-based property search ===');
    console.log('Scraped data:', JSON.stringify(scrapedData, null, 2));

    // Check if we have both project and size information
    if (!scrapedData.location_details?.project) {
      console.log('No project information found, cannot perform project-based search');
      return {
        exactMatches: [],
        partialMatches: [],
        matchMethod: 'no_project_data'
      };
    }

    if (!scrapedData.size_numeric) {
      console.log('No size information found, cannot perform size-based filtering');
      return {
        exactMatches: [],
        partialMatches: [],
        matchMethod: 'no_size_data'
      };
    }

    const allMatches = await findMatchingPropertiesByProject(scrapedData);

    // Separate matches by score
    const exactMatches = allMatches.filter(match => match.matchScore >= 5);
    const partialMatches = allMatches.filter(match => match.matchScore >= 2 && match.matchScore < 5);

    console.log(`Found ${exactMatches.length} exact matches (score >= 5)`);
    console.log(`Found ${partialMatches.length} partial matches (score 2-4)`);

    return {
      exactMatches: formatProjectResults(exactMatches, 'exact_project_match').matches,
      partialMatches: formatProjectResults(partialMatches, 'partial_project_match').matches,
      matchMethod: 'detailed_project_search',
      totalMatches: allMatches.length
    };

  } catch (error) {
    console.error('Error finding matching properties by project and size:', error);
    return {
      exactMatches: [],
      partialMatches: [],
      matchMethod: 'error',
      error: error.message
    };
  }
}

// ==========================================
// LOGGING FUNCTIONS
// ==========================================

function logProjectMatchingResults(propertyMatches) {
  if (propertyMatches.matches && propertyMatches.matches.length > 0) {
    console.log(`\nProject-based Matching Units Found: ${propertyMatches.matches.length}`);
    console.log(`Match Method: ${propertyMatches.matchMethod}`);

    // Group by score for better visualization
    const exactMatches = propertyMatches.matches.filter(match => match.matchScore >= 5);
    const partialMatches = propertyMatches.matches.filter(match => match.matchScore >= 2 && match.matchScore < 5);

    if (exactMatches.length > 0) {
      console.log(`\nExact Matches (Score >= 5): ${exactMatches.length}`);
      exactMatches.forEach((match, index) => {
        console.log(`${index + 1}. Unit: ${match.unit} | Building: ${match.building} | Project: ${match.project} | Size: ${match.size} | Score: ${match.matchScore}`);
      });
    }

    if (partialMatches.length > 0) {
      console.log(`\nPartial Matches (Score 2-4): ${partialMatches.length}`);
      partialMatches.forEach((match, index) => {
        console.log(`${index + 1}. Unit: ${match.unit} | Building: ${match.building} | Project: ${match.project} | Size: ${match.size} | Score: ${match.matchScore}`);
      });
    }
  } else {
    console.log('\nNo matching units found with project-based search');
    console.log(`Match Method: ${propertyMatches.matchMethod}`);
  }
  console.log('');
}

function logDetailedProjectMatchingResults(results) {
  console.log(`\n=== Detailed Project Matching Results ===`);
  console.log(`Total Matches: ${results.totalMatches || 0}`);
  console.log(`Exact Matches: ${results.exactMatches.length}`);
  console.log(`Partial Matches: ${results.partialMatches.length}`);
  console.log(`Match Method: ${results.matchMethod}`);

  if (results.exactMatches.length > 0) {
    console.log(`\nExact Matches (Score >= 5):`);
    results.exactMatches.forEach((match, index) => {
      console.log(`${index + 1}. Unit: ${match.unit} | Building: ${match.building} | Project: ${match.project} | Size: ${match.size} | Score: ${match.matchScore}`);
    });
  }

  if (results.partialMatches.length > 0) {
    console.log(`\nPartial Matches (Score 2-4):`);
    results.partialMatches.forEach((match, index) => {
      console.log(`${index + 1}. Unit: ${match.unit} | Building: ${match.building} | Project: ${match.project} | Size: ${match.size} | Score: ${match.matchScore}`);
    });
  }

  if (results.error) {
    console.log(`Error: ${results.error}`);
  }
  console.log('');
}

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  searchPropertiesByProjectAndSize,
  searchPropertiesByProjectAndSizeDetailed,
  findMatchingPropertiesByProject,
  logProjectMatchingResults,
  logDetailedProjectMatchingResults, searchPropertiesByProjectAndSizeDetailed, findMatchingPropertiesByProject, logProjectMatchingResults, logDetailedProjectMatchingResults,
  calculateProjectMatchScore,
  formatProjectResults,
  sqftToSqm,
  normalizeText,
  parseSize
};