const puppeteer = require('puppeteer');

/**
 * Create browser instance with optimized settings
 * @returns {Object} - Puppeteer browser instance
 */
async function createBrowserInstance() {
  const options = {
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-features=site-per-process',
      '--single-process'
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null
  };
  
  return await puppeteer.launch(options);
}

/**
 * Setup page with proper user agent and viewport
 * @param {Object} browser - Puppeteer browser instance
 * @returns {Object} - Puppeteer page instance
 */
async function setupPage(browser) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1366, height: 768 });
  return page;
}

/**
 * Extract property data from Bayut page
 * This function runs in the browser context
 * @returns {Object} - Extracted property data
 */
function extractPageData() {
  function extractText(selectors) {
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        const text = elements[0].textContent.trim();
        if (text) return text;
      }
    }
    return "";
  }

  const location = extractText([
    '[aria-label="Property header"]',
    '.e4fd45f0[aria-label="Property header"]',
    '._7afabd',
    '.property-location',
    'h1'
  ]);

  const propertyType = extractText([
    '[aria-label="Type"]',
    'span[aria-label="Type"]',
    'li span[aria-label="Type"]',
    '._2fdf7fc5[aria-label="Type"]',
    '.property-type'
  ]);

  let permitNumber = "";
  const permitElements = document.querySelectorAll('[aria-label="Permit Number"], span[aria-label="Permit Number"]');
  if (permitElements.length > 0) {
    permitNumber = permitElements[0].textContent.trim();
  }

  if (!permitNumber) {
    const allText = document.body.textContent;
    const permitMatch = allText.match(/Permit Number[:\s]*([A-Z0-9\-\/]+)/i);
    if (permitMatch) {
      permitNumber = permitMatch[1].trim();
    }
  }

  if (!permitNumber) {
    const spans = document.querySelectorAll('span');
    for (const span of spans) {
      const text = span.textContent.trim();
      if (/^[A-Z0-9]{3,}[\-\/]?[A-Z0-9]*$/.test(text) && text.length >= 4 && text.length <= 20) {
        const parentText = span.parentElement?.textContent?.toLowerCase() || '';
        if (parentText.includes('permit') || parentText.includes('regulatory')) {
          permitNumber = text;
          break;
        }
      }
    }
  }

  function extractAreaInfo() {
    const areaSection = document.querySelector('[aria-label="Area"]');
    if (!areaSection) return {};

    let builtUp = null, plot = null, allSizes = [];
    const spans = areaSection.querySelectorAll('span');
    let lastLabel = null;
    
    spans.forEach(span => {
      const text = span.textContent.trim();
      if (/built[-\s]?up:?/i.test(text)) {
        lastLabel = 'builtUp';
      } else if (/plot:?/i.test(text)) {
        lastLabel = 'plot';
      } else if (/\d[\d,\.]*\s*sqft/i.test(text)) {
        if (lastLabel === 'builtUp') {
          builtUp = text;
          allSizes.push({ type: 'builtUp', value: text });
          lastLabel = null;
        } else if (lastLabel === 'plot') {
          plot = text;
          allSizes.push({ type: 'plot', value: text });
          lastLabel = null;
        } else {
          allSizes.push({ type: 'unknown', value: text });
        }
      }
    });

    if (!builtUp && !plot && allSizes.length === 0) {
      const matches = areaSection.textContent.match(/[\d,\.]+\s*sqft/gi);
      if (matches) {
        matches.forEach(val => allSizes.push({ type: 'unknown', value: val.trim() }));
      }
    }

    return { builtUp, plot, allSizes };
  }

  const areaInfo = extractAreaInfo();

  const bedrooms = extractText([
    '[aria-label="Beds"]',
    '[aria-label="Beds"] ._140e6903',
    '._14f36d85 ._10fef2e8:nth-child(1) ._140e6903',
    '.beds-text'
  ]);

  const bathrooms = extractText([
    '[aria-label="Baths"]',
    '[aria-label="Baths"] ._140e6903',
    '._14f36d85 ._10fef2e8:nth-child(2) ._140e6903',
    '.baths-text'
  ]);

  return {
    location,
    propertyType,
    permitNumber,
    sizeText: areaInfo.builtUp || areaInfo.plot || (areaInfo.allSizes[0]?.value ?? ""),
    sizeDetails: areaInfo,
    bedrooms,
    bathrooms
  };
}

/**
 * Process location details from scraped location string
 * @param {string} location - Raw location string
 * @returns {Object} - Processed location details
 */
function processLocationDetails(location) {
  const locationDetails = {};
  if (location) {
    const locationParts = location.split(',').map(part => part.trim());
    if (locationParts.length >= 2) locationDetails.project = locationParts[0];
    if (locationParts.length >= 3) locationDetails.master_project = locationParts[1];
  }
  return locationDetails;
}

/**
 * Extract numeric size from size string
 * @param {string} sizeStr - Size string (e.g., "1,200 sqft")
 * @returns {number|null} - Numeric size value
 */
function extractSizeNumeric(sizeStr) {
  if (!sizeStr) return null;
  const matches = sizeStr.match(/[\d,\.]+/);
  if (matches && matches.length > 0) {
    return parseFloat(matches[0].replace(/,/g, ''));
  }
  return null;
}

/**
 * Scrape property data from Bayut URL
 * @param {string} url - Bayut property URL
 * @param {string} username - Username of the requester
 * @returns {Object} - Scraped property data
 */
async function scrapePropertyData(url, username = 'admin') {
  let browser;

  try {
    console.log(`Scraping Bayut URL: ${url} requested by: ${username}`);
    
    browser = await createBrowserInstance();
    const page = await setupPage(browser);
    
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('body', { timeout: 10000 });
    await page.waitForTimeout(5000);

    const propertyData = await page.evaluate(extractPageData);
    const locationDetails = processLocationDetails(propertyData.location);

    // Extract numeric size
    const sizeNumeric = extractSizeNumeric(propertyData.sizeText);

    const result = {
      url,
      location_details: locationDetails,
      property_type: propertyData.propertyType,
      permit_number: propertyData.permitNumber,
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      size: propertyData.sizeText,
      size_numeric: sizeNumeric,
      user: username // Add username to the result
    };

    console.log('Bayut scraping completed successfully');
    return result;

  } catch (error) {
    console.error('Bayut scraping error:', error.message);
    throw new Error(`Bayut scraping failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = {
  createBrowserInstance,
  setupPage,
  extractPageData,
  processLocationDetails,
  extractSizeNumeric,
  scrapePropertyData
};