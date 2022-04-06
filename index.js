const PDFDocument = require('pdfkit');
const doc = new PDFDocument({compress:false, size: 'A7'});
const fs = require('fs')
const express = require('express')
const app = express()
const port = 3000
const bucketName = 'test-bucket-pdfs';
const {Storage} = require('@google-cloud/storage');
process.env.GOOGLE_APPLICATION_CREDENTIALS = "/Users/gabrielford/Documents/callsim/pdfkit-test/neural-quarter-319704-de3bd3985aa5.json"

const storage = new Storage();
// Function for uploading to GCP
async function uploadFile(randId) {
    await storage.bucket(bucketName).upload(`./${randId}.pdf`, {
        destination: `${randId}.pdf`,
    });
    // Deletes local copy of file once upload is complete
    fs.unlink(`${randId}.pdf`, ()=>{
        console.log(`./${randId}.pdf uploaded to ${bucketName} and unlinked locally`)
    })
}

function buildDoc(data, writeStream) {
    const title = data.title
    const body = data.body
    doc.pipe(writeStream);
    doc.text(title)
    doc.text(body)
    doc.end();
}

app.use(express.json());
app.post('/', (req, res) => {
    // Generating random lowercase string to identify document. TODO: Check id against files stored so ID cannot collide.
    randId = Math.random().toString(36).replace(/[^a-z]+/g, '')
    // Creating writeStream to write to File System
    const writeStream = fs.createWriteStream(`${randId}.pdf`)
    buildDoc(req.body, writeStream)
    // Whien done creating document upload file to GCP and send user the path
    writeStream.on('finish', ()=>{
        console.log("hit")
        uploadFile(randId)
        res.send(`https://storage.cloud.google.com/${bucketName}/${randId}.pdf`)
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})