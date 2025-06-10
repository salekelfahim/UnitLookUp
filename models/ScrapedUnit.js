const mongoose = require('mongoose');

const ScrapedUnitSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true
  },
  location_details: {
    project: String,
    master_project: String
  },
  property_type: String,
  permit_number: String,
  bedrooms: String,
  bathrooms: String,
  size: String,
  size_numeric: {
    type: Number,
    default: null
  },
  user: {
    type: String,
    required: true,
  },
  scrapedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ScrapedUnit', ScrapedUnitSchema);