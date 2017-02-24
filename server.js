var restify = require('restify');
var config = require('./config');
var fs = require('fs');
var winston = require('winston');
winston.level = config.LOG_LEVEL;


var server = restify.createServer({name:'kml-to-gpx'});
var controllers_path = process.cwd() + '/controllers'
var controllers = {};

// set up controllers
fs.readdirSync(controllers_path).forEach(function (file) {
   if (file.indexOf('.js') != -1 && file.indexOf('.spec.js') == -1) {
       controllers[file.split('.')[0]] = require(controllers_path + '/' + file)
   }
})



server.use(restify.fullResponse());
server.use(restify.bodyParser());
server.use(restify.queryParser());

// paths

server.post('/v1/documents',controllers.documents.createDocument);

// launch
server.listen(config.port, function() {
	console.log('server listening on port number', config.port);

});
