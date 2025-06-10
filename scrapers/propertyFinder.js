const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Fetch page content from URL
 * @param {string} url - Property URL to scrape
 * @returns {Object} - Cheerio DOM object
 */
async function fetchPageContent(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Referer": "https://www.google.com/"
      },
      timeout: 10000 // 10 seconds timeout
    });
    return cheerio.load(data);
  } catch (error) {
    console.error(`Failed to fetch PropertyFinder page content: ${error.message}`);
    throw new Error(`Failed to fetch PropertyFinder page content: ${error.message}`);
  }
}

/**
 * Extract breadcrumbs from the page
 * @param {Object} $ - Cheerio DOM object
 * @returns {Array} - Array of breadcrumb text
 */
function extractBreadcrumbs($) {
  return $(".styles-module_breadcrumbs__list__4ToyO li a")
    .map((_, el) => $(el).text().trim())
    .get()
    .slice(1); // skip the first breadcrumb
}

/**
 * Extract property details from the page
 * @param {Object} $ - Cheerio DOM object
 * @returns {Object} - Object with property details
 */
function extractDetails($) {
  const details = {};
  $(".styles_desktop_list__item__lF_Fh").each((_, el) => {
    const label = $(el).find(".styles_desktop_list__label-text__0YJ8y").text().trim();
    const value = $(el).find(".styles_desktop_list__value__uIdMl").text().trim();

    if (label === "Property Size") {
      const match = value.match(/([\d,]+)\s*sqft/);
      if (match) {
        details["size"] = value;
        details["size_numeric"] = parseInt(match[1].replace(/,/g, ""), 10);
      }
    } else if (label && value && label !== "Service Charges") {
      if (label === "Property Type") details["property_type"] = value;
      else if (label === "Bedrooms") details["bedrooms"] = value;
      else if (label === "Bathrooms") details["bathrooms"] = value;
    }
  });
  return details;
}

/**
 * Extract regulation information from the page
 * @param {Object} $ - Cheerio DOM object
 * @returns {Object} - Object with regulation details
 */
function extractRegulation($) {
  const regulation = {};
  $(".styles_desktop_content__Z_YaU p").each((_, el) => {
    const label = $(el).text().trim();
    if (label === "DLD Permit Number:") {
      const value = $(el).parent().next().text().trim();
      if (value) regulation["listingnumber"] = value;
    }
  });
  return regulation;
}

/**
 * Extract title from the page
 * @param {Object} $ - Cheerio DOM object
 * @returns {string} - Property title
 */
function extractTitle($) {
  return $("h1").text().trim();
}

/**
 * Scrape property data from PropertyFinder URL
 * @param {string} url - Property URL to scrape
 * @param {string} username - Username of the requester
 * @returns {Object} - Scraped unit data
 */
async function scrapePropertyData(url, username = 'admin') {
  try {
    console.log(`Scraping PropertyFinder URL: ${url} requested by: ${username}`);
    
    // Scrape new data
    const $ = await fetchPageContent(url);

    const title = extractTitle($);
    const breadcrumbs = extractBreadcrumbs($);
    const details = extractDetails($);
    const regulation = extractRegulation($);

    // Map data to match ScrapedUnit schema
    const countBreadcrumbs = breadcrumbs.length;
    const unitData = {
      url,
      title,
      location_details: {
        master_project: breadcrumbs[countBreadcrumbs - 2] || null,
        project: breadcrumbs[countBreadcrumbs - 1] || null
      },
      property_type: details.property_type || null,
      bedrooms: details.bedrooms || null,
      bathrooms: details.bathrooms || null,
      size: details.size || null,
      size_numeric: details.size_numeric || null,
      permit_number: regulation.listingnumber || null,
      user: username // Add username to the result
    };

    console.log('PropertyFinder scraping completed successfully');
    return unitData;
  } catch (err) {
    console.error(`Error during PropertyFinder scraping: ${err.message}`);
    throw new Error(`PropertyFinder scraping failed: ${err.message}`);
  }
}

module.exports = {
  fetchPageContent,
  extractBreadcrumbs,
  extractDetails,
  extractRegulation,
  extractTitle,
  scrapePropertyData
};