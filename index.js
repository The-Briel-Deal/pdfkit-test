const PDFDocument = require('pdfkit');
const doc = new PDFDocument({compress:false, size: 'A7'});
const fs = require('fs')
doc.pipe(fs.createWriteStream('./test.pdf'));
doc.text('Hello World')
doc.end;