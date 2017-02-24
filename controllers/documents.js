const winston = require('winston')
var config = require('../config');
var uuid = require('uuid');
var tj = require('@mapbox/togeojson');
var fs = require('fs');
var DOMParser = require('xmldom').DOMParser;

winston.level = config.LOG_LEVEL;

// connect to db.

// POST /v1/documents
exports.createDocument = function(req, res, next) {
  winston.debug('inside createDocument controller');
  if(req.body == null) {
    res.status(400);
    res.json({
      type: false,
      data: null
    })
  }
  exports.convertFromGpx(req.body, function(err, convertedData) {
    if(err != null) {
      res.status(500);
      res.json({
        type: false,
        data: err
      });
    } else {

      // return ID
      res.status(200);
      res.json({
          type: true,
          data: convertedData
      });

    };
  });

}



// returns json from GPX data
exports.convertFromGpx = function(gpxData,cb){
  winston.debug('inside convertFromGpx');
  winston.debug('parsing from the raw Gpx');
  // for some reason, I cannot get DOMParser to work unless I flush the output to a file and read from it.
  // this makes no sense b/c
  try {
    fs.writeFileSync("/tmp/test.gpx", gpxData);
    var loadedGpx = new DOMParser().parseFromString(fs.readFileSync("/tmp/test.gpx",'utf-8'));
    fs.unlinkSync("/tmp/test.gpx");
    // this should work, but doesnt, and is therefore commented out.
    //var loadedGpx = new DOMParser().parseFromString(gpxRawData,'text/xml');
    winston.debug('parsed raw data, about to call togeojson');
    var converted = tj.gpx(loadedGpx);
    winston.debug('after conversion, exiting convertFromGpx');
    cb(null, converted);
  } catch(ex) {
      winston.info("exception thrown during XML processing")
      cb(ex,null);
  }

}
