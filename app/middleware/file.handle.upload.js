const multer = require('multer');
const customStorage = require("../middleware/upload.storage");

const STORAGE_FILE_PATH = '/var/www/projectw.ai/html/image-storage/';

module.exports.upload = multer({
  storage: customStorage({ destination: STORAGE_FILE_PATH }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: function (req, file, cb) {
     const allowedTypes = [  
        'image/jpeg',
        'image/png',
        'image/gif',
	'image/webp',     
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
     ];	  
     if(allowedTypes.includes(file.mimetype)){	  
        cb(null, true);
     }else{
        cb(new Error('Invalid file type. Only images and documents are allowed.'), false);	     
     }
  },
});
