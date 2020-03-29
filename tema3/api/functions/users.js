const app = require("./expressWrapper")();


app.post('/', async (req, res) => {

    // The name of the audio file to transcribe
    const body = req.body;
    console.log(body);

    res.status(200)
        .end();
});

app.put('/', async (req, res) => {

    // The name of the audio file to transcribe
    const body = req.body;
    console.log(body);

    res.status(200)
        .end();
});


module.exports = app;
