const app = require("./expressWrapper")();
const speech = require('@google-cloud/speech');
const path = require('path');
const speechClient = new speech.SpeechClient({
    keyFilename: path.join(__dirname, 'the-boyz-56c01-a8ba3771ec10.json'),
    projectId: 'the-boyz-56c01'
});

app.post('/', async (req, res) => {

    // The name of the audio file to transcribe
    const blob = req.body;
    const buffer = Buffer.from(blob);
    const audioBytes = buffer.toString('base64');

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
        content: audioBytes,
    };
    const config = {
        languageCode: 'en-US',
    };
    const request = {
        audio: audio,
        config: config,
    };

    // Detects speech in the audio file
    const [response] = await speechClient.recognize(request);
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    console.log(`Transcription: ${transcription}`);

    res.status(200)
        .json({"transcription": transcription})
        .end();
});

module.exports = app;
