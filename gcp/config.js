const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

// const serviceKey = path.join(__dirname, '../earnest-beacon-358103-c65ec311e6e3.json'); 

const storage = new Storage({
//     keyFilename: serviceKey,
    projectId: process.env.GCP_PROJECT_ID
})


module.exports = storage;
