const gcp = require('../gcp/config.js');
const bucket = gcp.bucket(process.env.GCP_BUCKET_NAME);

const uploadFile = (file) => new Promise ((resolve, reject) => {
    const { originalname, buffer } = file;

    const blob = bucket.file(originalname.replace(/ /g, '_'));
    const blobStream = blob.createWriteStream({
        resumable: false
    })
   .on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        
        resolve(publicUrl);
    })
    .on('error', () => {
        reject(`Unable to upload file, something went wrong!`)
    })
    .end(buffer)
})
// TODO: add visual banner on frontend on error.

module.exports = {uploadFile}