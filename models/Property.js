const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    pNumber: String,
    unit: String,
    fileName: String,
    sheetName: String,
    
    owner: {
        name: String,
        email: String
    },
    
    phone: mongoose.Schema.Types.Mixed,
    
    property: {
        bedrooms: String,
        size: String
    },
    
    additionalData: {
        BUILDING: String
    }
}, {
    timestamps: true,
    strict: false,
    collection: 'records'
});

module.exports = mongoose.model('Property', propertySchema);