var http = require('http');
var svr = new http.Server(80, http.fileHandler('./'));
svr.run();