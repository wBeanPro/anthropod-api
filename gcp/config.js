const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

const serviceKey = path.join(__dirname, '../cryptic-tower-356203-4d64f8c8923f.json'); 

const storage = new Storage({
    keyFilename: serviceKey,
    projectId: process.env.GCP_PROJECT_ID
})


module.exports = storage;