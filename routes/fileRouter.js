var express = require('express');
var config = require('../config');
var fileRouter = express.Router();

/* GET users listing. */
fileRouter.post('/', function(req, res, next) {
  var imageFile, fileName, uploadPath, urlPath;

  console.log('start fileRouter.post.');
  if (!req.files) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  // append a random number to make it unique
  imageFile = req.files.imageFile;
  fileName = imageFile.name.split('.')[0] + '_' + Math.floor((Math.random() * 100) + 1) + '.' + imageFile.name.split('.')[1];
  uploadPath = __dirname + '/../public/uploadedfiles/' + fileName;
  console.log('uploadPath: ' + uploadPath);

  imageFile.mv(uploadPath, function(err) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else {
      urlPath = config.baseURL + 'uploadedfiles/' + fileName;
      res.send(urlPath);
    }
  });
});

module.exports = fileRouter;
