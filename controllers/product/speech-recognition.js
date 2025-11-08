const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const { PassThrough } = require('stream');


const upload = multer({ storage: multer.memoryStorage() }).single('file');

const speechRecognition = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
      const inputBuffer = req.file.buffer;

      // Convert WebM buffer to WAV buffer using ffmpeg
      const wavBuffer = await new Promise((resolve, reject) => {
        const inputStream = new PassThrough();
        inputStream.end(inputBuffer);

        const chunks = [];
        ffmpeg(inputStream)
          .format('wav')
          .audioChannels(1)
          .audioFrequency(16000)
          .on('error', reject)
          .on('end', () => resolve(Buffer.concat(chunks)))
          .pipe(new PassThrough(), { end: true })
          .on('data', (chunk) => chunks.push(chunk));
      });

      // Send WAV buffer to Azure
      const azureUrl = `https://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=ur-IN&format=detailed`;

      const response = await fetch(azureUrl, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.AZURE_KEY,
          'Content-Type': 'audio/wav',
        },
        body: wavBuffer,
      });

      const rawResponse = await response.json();
console.log('Raw Azure response:', rawResponse);

    
      res.status(200).json({ text: rawResponse.DisplayText });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
};

module.exports = speechRecognition;
