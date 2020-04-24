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
const getRawBody = require('raw-body');
const Busboy = require('busboy');
const path = require('path');
const getStream = require('into-stream');
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
const ONE_MINUTE = 60 * 1000;

const sharedKeyCredential = new StorageSharedKeyCredential(account, key);
const pipeline = newPipeline(sharedKeyCredential);

const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    pipeline
);

const getBlobName = originalName => {
    return `${originalName}`;
};

app.post(prefix + '/', /*passport.authenticate('oauth-bearer', {session: false}),*/ async(req, res) => {

    var bodyBuffer = Buffer.from(req.body);

    var boundary = multipart.getBoundary(req.headers['content-type']);

    // parse the body
    var parts = multipart.Parse(bodyBuffer, boundary);
    console.log(parts[0]);

    const blobName = getBlobName(parts[0].filename);
    const stream = getStream(parts[0].data);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
        await blockBlobClient.uploadStream(stream,
            uploadOptions.bufferSize, uploadOptions.maxBuffers, { blobHTTPHeaders: { blobContentType: parts[0].type } });
        res.send({
            well: "ok"
        })
    } catch (err) {
        res.send({
            well: "shit"
        })
    }
});

// Binds the express app to an Azure Function handler
module.exports = createHandler(app);