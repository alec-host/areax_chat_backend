const multer = require('multer');
const fs = require('fs');
const path = require('path');

//const uploadDirectory = '/var/www/weaiu.com/html/image-storage';

/*
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
      const fileExt = path.extname(file.originalname);
      const filename = `${file.fieldname}-${Date.now()}${fileExt}`;
      cb(null, filename);
    }
});

const uploadStorage = multer({ storage });
*/

// customStorage.js

function uploadStorage(opts) {
  const destination = opts.destination;
  return {
    _handleFile(req, file, cb) {
      // Ensure the destination directory exists
      fs.mkdirSync(destination, { recursive: true });

      // Create a custom filename
      const filename = Date.now() + '-' + file.originalname;
      const filePath = path.join(destination, filename);

      const outStream = fs.createWriteStream(filePath);

      file.stream.pipe(outStream);
      outStream.on('error', cb);
      outStream.on('finish', function () {
        cb(null, {
          path: filePath,
          size: outStream.bytesWritten,
          filename: filename,
        });
      });
    },
    _removeFile(req, file, cb) {
      fs.unlink(file.path, cb);
    },
  };
};

module.exports = uploadStorage;
