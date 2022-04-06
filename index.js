const PDFDocument = require('pdfkit');
const doc = new PDFDocument({compress:false, size: 'A7'});
const fs = require('fs')
const express = require('express')
const app = express()
const port = 3000
// const {Storage} = require('@google-cloud/storage');
// process.env.GOOGLE_APPLICATION_CREDENTIALS = "/Users/gabrielford/Documents/callsim/pdfkit-test/neural-quarter-319704-de3bd3985aa5.json"

// const storage = new Storage();

// // The ID of your GCS bucket
// const bucketName = 'test-bucket-pdfs';

// // The path to your file to upload
// const filePath = 'test.pdf';

// // The new ID for your GCS file
// const destFileName = 'testpdf.pdf';

// async function uploadFile() {
//   await storage.bucket(bucketName).upload(filePath, {
//     destination: destFileName,
//   });

//   console.log(`${filePath} uploaded to ${bucketName}`);
// }

// uploadFile().catch(console.error);
app.use(express.json());
app.post('/', (req, res) => {
    const title = req.body.title
    const body = req.body.body
    console.log(title)
    doc.pipe(fs.createWriteStream('./test.pdf'));
    doc.text(title)
    doc.text(body)
    doc.end();
    res.send("done")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})