const express = require('express');
const connectDB = require('./db');
const ScrapedUnit = require('./models/ScrapedUnit');
const bayutScraper = require('./scrapers/bayut');
const propertyFinderScraper = require('./scrapers/propertyFinder');
const permitSearchService = require('./services/permitSearchService');
const projectSearchService = require('./services/projectSearchService');
const projectMapperService = require('./services/projectMapperService');
const historyService = require('./services/historyService');
const mongoose = require('mongoose');
const cors = require('cors'); // Add this line
const verifyToken = require('./auth/authMiddleware');
const authController = require('./auth/authController');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Connect to MongoDB
connectDB();

// Add CORS middleware (add this before other middleware)
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize admin user when the application starts
authController.initializeAdminUser();

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Function to detect URL source
function detectUrlSource(url) {
  if (url.includes('bayut.com')) {
    return 'bayut';
  } else if (url.includes('propertyfinder.ae')) {
    return 'propertyfinder';
  }
  return 'unknown';
}

// ==========================================
// UNIVERSAL SCRAPING FUNCTION
// ==========================================

async function scrapePropertyData(url, username = 'admin') {
  const source = detectUrlSource(url);
  
  switch (source) {
    case 'bayut':
      console.log(`Scraping Bayut property... (requested by: ${username})`);
      return await bayutScraper.scrapePropertyData(url, username);
    
    case 'propertyfinder':
      console.log(`Scraping PropertyFinder property... (requested by: ${username})`);
      return await propertyFinderScraper.scrapePropertyData(url, username);
    
    default:
      throw new Error(`Unsupported URL. Only Bayut and PropertyFinder URLs are supported. Detected source: ${source}`);
  }
}

// ==========================================
// ENHANCED PROPERTY MATCHING FUNCTION
// ==========================================

async function findAllMatchingProperties(scrapedData) {
  try {
    console.log('\n=== Starting comprehensive property search with all three services ===');
    
    let permitMatches = { matches: [] };
    let projectMapperMatches = { matches: [] };
    let projectMatches = { matches: [] };

    // First, try permit-based search if permit number exists
    if (scrapedData.permit_number) {
      console.log('\n--- Starting Permit Search (r1) ---');
      let rawPermitMatches = await permitSearchService.findMatchingPropertiesByPermit(scrapedData);
      
      // Sanitize permit matches to remove sensitive data
      permitMatches = sanitizeMatchResults(rawPermitMatches);
      
      if (permitMatches.matches.length > 0) {
        console.log(`Found ${permitMatches.matches.length} matches via permit search`);
        return {
          r1: permitMatches.matches,  // permitMatches
          r2: [],                     // projectMapperMatches (empty)
          r3: []                      // projectMatches (empty)
        };
      }
    }

    // Second, try project mapper search if project exists
    if (scrapedData.location_details?.project) {
      console.log('\n--- Starting Project Mapper Search (r2) ---');
      let rawProjectMapperMatches = await projectMapperService.searchPropertiesByProjectAndSize(scrapedData);
      
      // Sanitize project mapper matches to remove sensitive data
      projectMapperMatches = sanitizeMatchResults(rawProjectMapperMatches);
      
      if (projectMapperMatches.matches.length > 0) {
        console.log(`Found ${projectMapperMatches.matches.length} matches via project mapper search`);
        return {
          r1: [],                                // permitMatches (empty)
          r2: projectMapperMatches.matches,      // projectMapperMatches
          r3: []                                 // projectMatches (empty)
        };
      }
    }

    // Third, try original project-based search as fallback
    if (scrapedData.location_details?.project) {
      console.log('\n--- Starting Original Project Search (r3) ---');
      let rawProjectMatches = await projectSearchService.searchPropertiesByProjectAndSize(scrapedData);
      
      // Sanitize project matches to remove sensitive data
      projectMatches = sanitizeMatchResults(rawProjectMatches);
      
      if (projectMatches.matches.length > 0) {
        console.log(`Found ${projectMatches.matches.length} matches via original project search`);
        return {
          r1: [],                     // permitMatches (empty)
          r2: [],                     // projectMapperMatches (empty)
          r3: projectMatches.matches  // projectMatches
        };
      }
    }

    // Return all results even if empty
    console.log('No matches found in any search service');
    return {
      r1: [],  // permitMatches
      r2: [],  // projectMapperMatches
      r3: []   // projectMatches
    };

  } catch (error) {
    console.error('Error in comprehensive property search:', error);
    return {
      r1: [],  // permitMatches
      r2: [],  // projectMapperMatches
      r3: []   // projectMatches
    };
  }
}

// Helper function to sanitize sensitive data from responses
function sanitizeMatchResults(matchResults) {
  // If it's not an object or has no matches, just return as is
  if (!matchResults || !matchResults.matches) return { matches: [] };
  
  // Create a clean copy with just the matches
  return {
    matches: matchResults.matches.map(match => {
      // Remove pNumber field
      const { pNumber, ...cleanMatch } = match;
      return cleanMatch;
    })
  };
}

// Helper function to sanitize scraped data
function sanitizeScrapedData(data) {
  if (!data) return data;
  
  // Create a clean copy by excluding sensitive fields
  const {
    _id,
    __v,
    size_numeric,
    scrapedAt,
    ...cleanData
  } = data;
  
  // Return the cleaned object
  return cleanData;
}

// ==========================================
// LOGGING FUNCTIONS
// ==========================================

function logScrapedData(propertyData) {
  console.log('\n=== SCRAPED PROPERTY DATA ===');
  console.log('Source URL:', propertyData.url);
  if (propertyData.location_details?.project) console.log('Project:', propertyData.location_details.project);
  if (propertyData.location_details?.master_project) console.log('Master Project:', propertyData.location_details.master_project);
  if (propertyData.property_type) console.log('Property Type:', propertyData.property_type);
  if (propertyData.permit_number) console.log('Permit Number:', propertyData.permit_number);
  if (propertyData.size) console.log('Area:', propertyData.size);
  if (propertyData.bedrooms) console.log('Bedrooms:', propertyData.bedrooms);
  if (propertyData.bathrooms) console.log('Bathrooms:', propertyData.bathrooms);
  console.log('=============================');
}

function logAllMatchingResults(searchResults) {
  console.log('\n=== MATCHING PROPERTY DATA ===');
  
  // Create a Set to track unique unit numbers we've already displayed
  const uniqueUnits = new Set();
  let matchesToDisplay = [];
  
  // Process permit-based matches (r1) if they exist
  if (searchResults.r1 && searchResults.r1.length > 0) {
    console.log('--- Results from Permit Search (r1) ---');
    searchResults.r1.forEach(match => {
      if (!uniqueUnits.has(match.unit)) {
        uniqueUnits.add(match.unit);
        matchesToDisplay.push({ ...match, source: 'Permit Search' });
      }
    });
  }
  
  // Process project mapper matches (r2) if they exist
  if (searchResults.r2 && searchResults.r2.length > 0) {
    console.log('--- Results from Project Mapper Search (r2) ---');
    searchResults.r2.forEach(match => {
      if (!uniqueUnits.has(match.unit)) {
        uniqueUnits.add(match.unit);
        matchesToDisplay.push({ ...match, source: 'Project Mapper Search' });
      }
    });
  }
  
  // Process original project-based matches (r3) if they exist
  if (searchResults.r3 && searchResults.r3.length > 0) {
    console.log('--- Results from Original Project Search (r3) ---');
    searchResults.r3.forEach(match => {
      if (!uniqueUnits.has(match.unit)) {
        uniqueUnits.add(match.unit);
        matchesToDisplay.push({ ...match, source: 'Original Project Search' });
      }
    });
  }
  
  // Display the unique matches
  if (matchesToDisplay.length > 0) {
    matchesToDisplay.forEach((match, index) => {
      if (index > 0) console.log('-----------------------------');
      console.log('Search Source:', match.source);
      if (match.unit) console.log('Unit Number:', match.unit);
      if (match.building) console.log('Project:', match.building);
      if (match.masterProject) console.log('Master Project:', match.masterProject);
      if (match.size) console.log('Area:', match.size);
      if (match.owner) console.log('Owner:', match.owner);
      
      // Check if any contact info exists and display it
      const hasContactInfo = match.mobile || match.phone || match.email;
      if (hasContactInfo) {
        console.log('Contact Infos:');
        if (match.mobile) console.log('  Mobile:', match.mobile);
        if (match.phone) console.log('  Phone:', match.phone);
        if (match.email) console.log('  Email:', match.email);
      }
      
      // if (match.registrationDate) console.log('Registration Date:', match.registrationDate);
    });
  } else {
    console.log('No Unit Number Found For This Property');
  }
  console.log('=============================');
}

// ==========================================
// API ENDPOINTS
// ==========================================

app.post('/auth/login', authController.login);

// Protect your routes with the authentication middleware
// For example, protect your scraper endpoint:
app.post('/scrape', verifyToken, async (req, res) => {
  try {
    const { url } = req.body;
    // Get username from the JWT token
    const username = req.user.username;

    if (!url) {
      return res.status(400).json({ error: 'Please provide a URL' });
    }

    // Detect URL source
    const urlSource = detectUrlSource(url);
    
    // Validate supported URLs
    if (urlSource === 'unknown') {
      return res.status(400).json({ 
        error: 'Unsupported URL. Only Bayut and PropertyFinder URLs are supported.',
        supportedSites: ['bayut.com', 'propertyfinder.ae']
      });
    }

    // Check if URL already exists in database
    const existingUnit = await ScrapedUnit.findOne({ url });
    if (existingUnit) {
      const searchResults = await findAllMatchingProperties(existingUnit);
      logScrapedData(existingUnit);
      logAllMatchingResults(searchResults);
      
      // Sanitize the data before sending
      const sanitizedData = sanitizeScrapedData(existingUnit.toObject());
      
      return res.json({
        success: true,
        data: sanitizedData,
        searchResults,
        urlSource
      });
    }

    // Pass the username to the scraper
    const propertyData = await scrapePropertyData(url, username);
    
    // Ensure size_numeric is calculated if not already set
    if (!propertyData.size_numeric && propertyData.size) {
      propertyData.size_numeric = bayutScraper.extractSizeNumeric(propertyData.size);
    }

    // Save to database
    const newScrapedUnit = new ScrapedUnit(propertyData);
    await newScrapedUnit.save();

    // Find matching properties using all three search services
    const searchResults = await findAllMatchingProperties(propertyData);

    // Log results
    logScrapedData(propertyData);
    logAllMatchingResults(searchResults);

    // Sanitize the data before sending
    const sanitizedData = sanitizeScrapedData(newScrapedUnit.toObject());

    return res.json({
        success: true,
        data: sanitizedData,
        searchResults,
        urlSource
    });
  } catch (error) {
    console.error('Scraping failed:', error.message);
    return res.status(500).json({ 
      error: 'Failed to scrape the property data', 
      details: error.message 
    });
  }
});

// New endpoint for permit-only search
app.post('/search/permit', verifyToken, async (req, res) => {
  try {
    const { scrapedData } = req.body;

    if (!scrapedData) {
      return res.status(400).json({ error: 'Please provide scraped data' });
    }

    const permitMatches = await permitSearchService.findMatchingPropertiesByPermit(scrapedData);
    permitSearchService.logPermitMatchingResults(permitMatches);

    return res.json({
      success: true,
      matches: permitMatches,
      searchType: 'permit_only'
    });
  } catch (error) {
    console.error('Permit search failed:', error.message);
    return res.status(500).json({ 
      error: 'Failed to search by permit', 
      details: error.message 
    });
  }
});

// New endpoint for project mapper search only
app.post('/search/project-mapper', verifyToken, async (req, res) => {
  try {
    const { scrapedData } = req.body;

    if (!scrapedData) {
      return res.status(400).json({ error: 'Please provide scraped data' });
    }

    const projectMapperMatches = await projectMapperService.searchPropertiesByProjectAndSize(scrapedData);
    projectMapperService.logProjectMatchingResults(projectMapperMatches);

    return res.json({
      success: true,
      matches: projectMapperMatches,
      searchType: 'project_mapper_only'
    });
  } catch (error) {
    console.error('Project mapper search failed:', error.message);
    return res.status(500).json({ 
      error: 'Failed to search by project mapper', 
      details: error.message 
    });
  }
});

// New endpoint for original project-only search
app.post('/search/project', verifyToken, async (req, res) => {
  try {
    const { scrapedData } = req.body;

    if (!scrapedData) {
      return res.status(400).json({ error: 'Please provide scraped data' });
    }

    const projectMatches = await projectSearchService.searchPropertiesByProjectAndSize(scrapedData);
    projectSearchService.logProjectMatchingResults(projectMatches);

    return res.json({
      success: true,
      matches: projectMatches,
      searchType: 'project_only'
    });
  } catch (error) {
    console.error('Project search failed:', error.message);
    return res.status(500).json({ 
      error: 'Failed to search by project', 
      details: error.message 
    });
  }
});

// ==========================================
// HISTORY ENDPOINTS
// ==========================================

// Get user's scraping history
app.get('/history', verifyToken, async (req, res) => {
  try {
    // Get username from the JWT token
    const username = req.user.username;
    
    // Get query parameters for pagination
    const limit = parseInt(req.query.limit) || 10
    
    // Get user's scraping history
    const history = await historyService.getUserScrapingHistory(username, limit);
    
    // Sanitize history data (remove sensitive fields)
    const sanitizedHistory = history.map(item => {
      // Create a clean copy by excluding sensitive fields
      const {
        _id,
        __v,
        ...cleanData
      } = item;
      
      return cleanData;
    });
    
    return res.json({
      success: true,
      username: username,
      count: history.length,
      history: sanitizedHistory
    });
  } catch (error) {
    console.error('Failed to retrieve history:', error.message);
    return res.status(500).json({ 
      error: 'Failed to retrieve scraping history', 
      details: error.message 
    });
  }
});

// Get user's scraping history summary
app.get('/history/summary', verifyToken, async (req, res) => {
  try {
    // Get username from the JWT token
    const username = req.user.username;
    
    // Get user's history summary
    const summary = await historyService.getUserHistorySummary(username);
    
    return res.json({
      success: true,
      username: username,
      summary: summary
    });
  } catch (error) {
    console.error('Failed to retrieve history summary:', error.message);
    return res.status(500).json({ 
      error: 'Failed to retrieve scraping history summary', 
      details: error.message 
    });
  }
});

// Delete a specific unit from history
app.delete('/history/:url', verifyToken, async (req, res) => {
  try {
    // Get username from the JWT token
    const username = req.user.username;
    
    // Get URL from params (need to decode it)
    const url = decodeURIComponent(req.params.url);
    
    // Delete the unit from history (only if it belongs to this user)
    const result = await ScrapedUnit.deleteOne({ 
      url: url,
      user: username 
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Unit not found or you don't have permission to delete it"
      });
    }
    
    return res.json({
      success: true,
      message: "Unit deleted from history"
    });
  } catch (error) {
    console.error('Failed to delete from history:', error.message);
    return res.status(500).json({ 
      error: 'Failed to delete from history', 
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  const healthData = {
    status: 'healthy',
    supportedSites: ['bayut.com', 'propertyfinder.ae'],
    searchServices: ['permit-based', 'project-mapper-based', 'original-project-based'],
    dbConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    serverPort: PORT
  };
  
  res.json(healthData);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});