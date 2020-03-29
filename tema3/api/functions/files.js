const app = require("./expressWrapper")();
const {Storage} = require('@google-cloud/storage');
const getRawBody = require('raw-body');
const Busboy = require('busboy');
const fs = require('fs');
const path = require('path');
// Creates a client
const storage = new Storage({
    keyFilename: path.join(__dirname, 'the-boyz-56c01-a8ba3771ec10.json'),
    projectId: 'the-boyz-56c01'
});

const bucket = storage.bucket('the_boyz_static_storage');

app.post('/', (req, res, next) => {
        if (
            req.rawBody === undefined &&
            req.method === 'POST' &&
            req.headers['content-type'].startsWith('multipart/form-data')
        ) {
            getRawBody(
                req,
                {
                    length: req.headers['content-length'],
                    limit: '10mb',
                    encoding: contentType.parse(req).parameters.charset,
                },
                (err, string) => {
                    if (err) return next(err);
                    req.rawBody = string;
                    next();
                });
        } else {
            next();
        }
    },

    (req, res, next) => {
        if (
            req.method === 'POST' &&
            req.headers['content-type'].startsWith('multipart/form-data')
        ) {
            const busboy = new Busboy({
                headers: req.headers,
            });

            var fileBuffer = new Buffer('');

            busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                file.on('data', data => {
                    fileBuffer = Buffer.concat([fileBuffer, data])
                });

                file.on('end', () => {
                    req.file = {
                        fieldname,
                        originalname: filename,
                        encoding,
                        mimetype,
                        buffer: fileBuffer,
                    };
                })
            });

            req.data = {};

            busboy.on('field', (
                fieldname,
                val
                // fieldnameTruncated
                // valTruncated
                // encoding
                // mimetype
            ) => {
                req.data[fieldname] = val
            });

            busboy.on('finish', () => {
                console.log('Done parsing form!');

                next();
            });
            busboy.end(req.rawBody);
        } else {
            next();
        }
    },

    (req, res, next) => {
        // request handler
        const file = req.file;

        console.log(file);
        if (file) {
            uploadImageToStorage(file).then((success) => {
                console.log(success);
                return res.status(201).send({
                    url: success
                });
            }).catch((error) => {
                console.error(error);
            });
        }
    });

const uploadImageToStorage = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No image file'));
        }
        let newFileName = `${file.originalname}`;
        let newFilePath = './' + newFileName;

        fs.closeSync(fs.openSync(newFilePath, 'w'));

        uploadFile(newFilePath).catch(console.error);

        fs.unlinkSync(newFilePath);

        let fileUpload = bucket.file(newFileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        blobStream.on('error', (error) => {
            reject(new Error(`Something is wrong! Unable to upload at the moment.\n ${error}`));
        });

        blobStream.on('finish', () => {
            const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
            resolve(url);
        });

        blobStream.end(file.buffer);
    });
};

async function uploadFile(filePath) {
    // Uploads a local file to the bucket
    await bucket.upload(filePath, {
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        gzip: true,
        // By setting the option `destination`, you can change the name of the
        // object you are uploading to a bucket.
        metadata: {
            // Enable long-lived HTTP caching headers
            // Use only if the contents of the file will never change
            // (If the contents will change, use cacheControl: 'no-cache')
            cacheControl: 'public, max-age=31536000',
        },
    });

    console.log(`${filePath} uploaded to bucket.`);
}

module.exports = app;
