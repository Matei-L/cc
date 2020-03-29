const app = require("./expressWrapper")();
const {Storage} = require('@google-cloud/storage');
const Multer = require('multer');

// Creates a client
const storage = new Storage();

const bucket = storage.bucket("https://console.cloud.google.com/storage/browser/the-boyz-56c01.appspot.com");

const multer = Multer({
    storage: Multer.memoryStorage()
});

// save file in res.file
app.use(multer.single('file'));

app.post('/', (req, res) => {
    console.log(req.file);
    console.log(req.files);
    console.log(req.body);
    let file = req.file;
    if (file) {
        uploadImageToStorage(file).then((success) => {
            console.log(success);
            return res.status(200).send({
                status: 'success'
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

        let fileUpload = bucket.file(newFileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        blobStream.on('error', (error) => {
            reject(new Error('Something is wrong! Unable to upload at the moment.'));
        });

        blobStream.on('finish', () => {
            const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
            resolve(url);
        });

        blobStream.end(file.buffer);
    });
};

module.exports = app;
