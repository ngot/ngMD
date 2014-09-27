var http = require('http');
var svr = new http.Server(8080, http.fileHandler('./'));
svr.run();