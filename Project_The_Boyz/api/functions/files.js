const {checkToken} = require("./expressWrapper");
const app = require("./expressWrapper").app();
const {Storage} = require('@google-cloud/storage');
const getRawBody = require('raw-body');
const Busboy = require('busboy');
const path = require('path');
const sensitive = require('./sensitive');

// Creates a client
const storage = new Storage({
    keyFilename: path.join(__dirname, sensitive.keyFilename()),
    projectId: sensitive.projectId()
});

const bucket = storage.bucket(sensitive.bucket_name());

app.use(checkToken);

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
                    return next();
                });
            return console.log('first layer finished');
        } else {
            return next();
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

            req.files = [];

            busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                let fileBuffer = new Buffer('');
                file.on('data', data => {
                    fileBuffer = Buffer.concat([fileBuffer, data])
                });

                file.on('end', () => {
                    req.files.push({
                        fieldname,
                        originalname: filename,
                        encoding,
                        mimetype,
                        buffer: fileBuffer,
                    });
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
            return console.log('second layer finished');
        } else {
            return next();
        }
    },

    async (req, res, next) => {
        // request handler
        const files = req.files;

        let urls = [];
        let promises = [];

        for (const file of files) {
            if (file) {
                promises.push(uploadImageToStorage(file));
            }
        }
        await Promise.all(promises).then((values) => {
            urls = values;
        }).catch((error) => {
            console.error(error);
        });
        if (urls.length === 1) {
            res.status(201).json({url: urls[0]}).end();
        } else {
            res.status(201).json({urls: urls}).end();
        }
    });

const uploadImageToStorage = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No image file'));
        }
        let newFileName = `${file.originalname}`;

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
            // const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
            const url = `https://storage.cloud.google.com/${bucket.name}/${fileUpload.name}`;
            resolve(url);
        });

        return blobStream.end(file.buffer);
    });
};

module.exports = app;
