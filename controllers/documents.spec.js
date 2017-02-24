const fs = require('fs')
const request = require('request')
const expect = require('chai').expect
var documents  = require('../controllers/documents');
const config = require('../config');
var sinon = require('sinon');

// var listDocumentIds = require('../controllers/documents').listDocumentIds;
// var returnDocument = require('../controllers/documents').returnDocument;
var createDocument = require('../controllers/documents').createDocument;
var convertFromGpx = require('../controllers/documents').convertFromGpx;
var persistDocument = require('../controllers/documents').persistDocument;

describe("document controller", function(){

  var fileData = fs.readFileSync('../test_data/gpx_test_data.gpx','utf-8');
  var convertedData = fs.readFileSync('../test_data/json_from_gpx.json','utf-8');


  var specialFunc  = function(someArg) {

  };
  var statusFunc = function(num) {

  }

  var res = {
    json : specialFunc,
    status : statusFunc
  };

  var spyStatus = sinon.spy(res,"status");
  var spyJson = sinon.spy(res,"json");

  describe("createDocument", function() {
    it("converts a GPX Document to a JSON representation", sinon.test(function() {

      var req = {
        body: fileData
      };

      createDocument(req,res,null);
      expect(spyStatus.calledWith(200)).to.equal(true);


    }));

    it("returns a 400 when GPX Document is null", sinon.test(function() {
      var req = {
        body: null
      };

      createDocument(req,res,null);
      expect(spyStatus.calledWith(400)).to.equal(true);
    }));

    it("returns a 500 when GPX document is not valid XML", sinon.test(function(){
      var req = {
        body: "!invalid%$<<"
      };

      createDocument(req,res,null);
      expect(spyStatus.calledWith(500)).to.equal(true);
    }));
  });

  describe("convertFromGpx", function(){
    it("converts a GPX document to a JSON representation", function() {
      var fileData = fs.readFileSync("../test_data/gpx_test_data.gpx",'utf-8');
      convertFromGpx(fileData, function(err, convertedData) {
        expect(err).to.equal(null);
        expect(convertedData).to.not.equal(null);
        expect(convertedData.type).to.equal("FeatureCollection");
        expect(convertedData.features.length).to.not.equal(0);
      });
    });
  });

});
