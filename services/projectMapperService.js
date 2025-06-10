const PropertyMapper = require('../utils/mapper');
const CleanProperty = require('../models/CleanProperty');

class ProjectMapperService {
  constructor() {
    this.propertyMapper = new PropertyMapper();
  }

  // Convert square feet to square meters
  convertSqftToSqm(sqft) {
    if (!sqft || isNaN(sqft)) return null;
    return sqft * 0.092903; // 1 sqft = 0.092903 sqm
  }

  // Extract numeric value from size string (e.g., "1,200 sqft" -> 1200)
  extractSizeNumeric(sizeString) {
    if (!sizeString) return null;
    
    // Remove commas and extract numbers
    const numericValue = sizeString.toString().replace(/,/g, '').match(/\d+\.?\d*/);
    return numericValue ? parseFloat(numericValue[0]) : null;
  }

  // Create size range query with 0.05 interval
  createSizeRangeQuery(sizeSqft) {
    if (!sizeSqft || isNaN(sizeSqft)) return {};
    
    const sizeSqm = this.convertSqftToSqm(sizeSqft);
    const tolerance = 0.02; // 5% tolerance
    
    return {
      $or: [
        {
          $and: [
            { Size: { $gte: sizeSqm - tolerance } },
            { Size: { $lte: sizeSqm + tolerance } }
          ]
        },
        {
          $and: [
            { ActualSize: { $gte: sizeSqm - tolerance } },
            { ActualSize: { $lte: sizeSqm + tolerance } }
          ]
        }
      ]
    };
  }

  // Search properties using mapper for exact name matching
  async searchPropertiesByProjectAndSize(scrapedData) {
    try {
      console.log('\n=== PROJECT MAPPER SEARCH ===');
      console.log('Searching with mapper for exact matches...');
      
      const { location_details, size } = scrapedData;
      
      if (!location_details?.project) {
        console.log('No project name provided for mapper search');
        return { matches: [] };
      }

      const projectName = location_details.project;
      const masterProjectName = location_details.master_project;
      
      console.log(`Project: ${projectName}`);
      if (masterProjectName) {
        console.log(`Master Project: ${masterProjectName}`);
      }

      // Use mapper to get all possible variants for the project names
      const searchResult = this.propertyMapper.searchProperty(
        projectName, 
        masterProjectName
      );

      console.log('Mapper search result:', JSON.stringify(searchResult, null, 2));

      // Use canonical names from the mapper if found, otherwise fallback to input
      let projectVariants = [];
      let masterProjectVariants = [];

      if (searchResult.project.found && searchResult.project.canonical) {
        projectVariants = this.propertyMapper.getAllVariants(
          searchResult.project.canonical, 
          'project'
        );
      } else {
        projectVariants = [projectName];
      }

      if (searchResult.masterProject.found && searchResult.masterProject.canonical) {
        masterProjectVariants = this.propertyMapper.getAllVariants(
          searchResult.masterProject.canonical, 
          'masterProject'
        );
      } else if (searchResult.masterProject.canonical) {
        masterProjectVariants = [searchResult.masterProject.canonical];
      } else if (masterProjectName) {
        masterProjectVariants = [masterProjectName];
      }

      console.log('Project variants to search:', projectVariants);
      console.log('Master project variants to search:', masterProjectVariants);

      // Create case-insensitive regex patterns for exact matching
      const createCaseInsensitiveRegex = (variants) => {
        return variants.map(variant => new RegExp(`^${variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'));
      };

      // Build the query using an array of conditions
      let andConditions = [
        {
          $or: [
            { Project: { $in: createCaseInsensitiveRegex(projectVariants) } },
            { BuildingName: { $in: createCaseInsensitiveRegex(projectVariants) } }
          ]
        }
      ];

      // Add master project condition if available
      if (masterProjectVariants.length > 0) {
        andConditions.push({
          $or: [
            { MasterProject: { $in: createCaseInsensitiveRegex(masterProjectVariants) } },
            { AreaName: { $in: createCaseInsensitiveRegex(masterProjectVariants) } }
          ]
        });
      }

      // Add size condition if available
      if (size) {
        const sizeNumeric = this.extractSizeNumeric(size);
        if (sizeNumeric) {
          const sizeQuery = this.createSizeRangeQuery(sizeNumeric);
          if (Object.keys(sizeQuery).length > 0) {
            andConditions.push(sizeQuery);
          }
        }
      }

      let query = andConditions.length > 1 ? { $and: andConditions } : andConditions[0];

      console.log('Final MongoDB query:');
      console.dir(query, { depth: null });

      // Execute the search
      const properties = await CleanProperty.find(query).limit(50);

      console.log(`Found ${properties.length} properties using mapper`);

      // Format results
      const matches = properties.map(property => ({
        unit: property.UnitNumber || 'N/A',
        building: property.Project || property.BuildingName || 'N/A',
        masterProject: property.MasterProject || property.AreaName || 'N/A',
        size: property.Size ? `${property.Size.toFixed(2)} sqm` : 'N/A',
        owner: property.Owner || 'N/A',
        mobile: property.Phone || 'N/A',
        phone: property['Phone 1'] || property['Phone 2'] || 'N/A',
        email: property.Email || 'N/A',
        registrationDate: property.Date ? property.Date.toDateString() : 'N/A',
        propertyType: property.PropertyType || 'N/A',
        procedureType: property.ProcedureType || 'N/A',
        procedureName: property.ProcedureName || 'N/A'
      }));

      return { matches };

    } catch (error) {
      console.error('Error in project mapper search:', error);
      return { matches: [] };
    }
  }

  // Search by project name only (without size constraint)
  async searchPropertiesByProjectOnly(scrapedData) {
    try {
      console.log('\n=== PROJECT MAPPER SEARCH (NO SIZE) ===');
      
      const { location_details } = scrapedData;
      
      if (!location_details?.project) {
        console.log('No project name provided for mapper search');
        return { matches: [] };
      }

      // Create a copy of scraped data without size
      const dataWithoutSize = { ...scrapedData };
      delete dataWithoutSize.size;

      return await this.searchPropertiesByProjectAndSize(dataWithoutSize);

    } catch (error) {
      console.error('Error in project-only mapper search:', error);
      return { matches: [] };
    }
  }

  // Log search results
  logProjectMatchingResults(results) {
    console.log('\n=== PROJECT MAPPER SEARCH RESULTS ===');
    
    if (!results || !results.matches || results.matches.length === 0) {
      console.log('No matches found using project mapper');
      return;
    }

    console.log(`Total matches found: ${results.matches.length}`);
    
    results.matches.forEach((match, index) => {
      if (index > 0) console.log('-----------------------------');
      console.log(`Match ${index + 1}:`);
      console.log(`Unit: ${match.unit}`);
      console.log(`Building: ${match.building}`);
      console.log(`Master Project: ${match.masterProject}`);
      console.log(`Size: ${match.size}`);
      console.log(`Owner: ${match.owner}`);
      console.log(`Mobile: ${match.mobile}`);
      console.log(`Phone: ${match.phone}`);
      console.log(`Email: ${match.email}`);
      console.log(`Registration Date: ${match.registrationDate}`);
      console.log(`Property Type: ${match.propertyType}`);
      console.log(`Procedure: ${match.procedureName}`);
    });
    
    console.log('=====================================');
  }

  // Test the mapper functionality
  async testMapper(projectName, masterProjectName = null) {
    try {
      console.log('\n=== TESTING MAPPER ===');
      console.log(`Testing with project: ${projectName}`);
      if (masterProjectName) {
        console.log(`Testing with master project: ${masterProjectName}`);
      }

      const searchResult = this.propertyMapper.searchProperty(projectName, masterProjectName);
      console.log('Mapper result:', JSON.stringify(searchResult, null, 2));

      if (searchResult.project.found) {
        const variants = this.propertyMapper.getAllVariants(searchResult.project.canonical, 'project');
        console.log('Project variants:', variants);
      }

      if (searchResult.masterProject.found) {
        const variants = this.propertyMapper.getAllVariants(searchResult.masterProject.canonical, 'masterProject');
        console.log('Master project variants:', variants);
      }

      return searchResult;
    } catch (error) {
      console.error('Error testing mapper:', error);
      return null;
    }
  }
}

module.exports = new ProjectMapperService();