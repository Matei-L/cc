const createHandler = require("azure-function-express").createHandler;
const app = require("../utils/expressWrapper").app();
const account = require("../utils/sensitive").storageAccountName();
const key = require("../utils/sensitive").storageAccountAccessKey();
const passport = require("../utils/expressWrapper").passport();
const prefix = "/api/files";
const multipart = require('parse-multipart');

const {
    BlobServiceClient,
    StorageSharedKeyCredential,
    newPipeline
} = require('@azure/storage-blob');
const containerName = 'images-container';
const getStream = require('into-stream');
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = {bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20};

const sharedKeyCredential = new StorageSharedKeyCredential(account, key);
const pipeline = newPipeline(sharedKeyCredential);

const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    pipeline
);

app.post(prefix + '/', /*passport.authenticate('oauth-bearer', {session: false}),*/ async (req, res) => {

    const bodyBuffer = Buffer.from(req.body);

    const boundary = multipart.getBoundary(req.headers['content-type']);

    // parse the body
    const parts = multipart.Parse(bodyBuffer, boundary);
    console.log(parts[0]);

    const blobName = parts[0].filename;
    const stream = getStream(parts[0].data);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
        await blockBlobClient.uploadStream(stream,
            uploadOptions.bufferSize, uploadOptions.maxBuffers, {blobHTTPHeaders: {blobContentType: parts[0].type}});
        res.send({
            url: `https://theboyzstorage.blob.core.windows.net/images-container/${blobName}`
        })
    } catch (err) {
        res.send({
            message: "An error occured"
        })
    }
});

// Binds the express app to an Azure Function handler
module.exports = createHandler(app);
