var node_static = require("node-static");
var fileServer = new node_static.Server('./');
var PORT = 8080;

require('http').createServer(function(request, response) {

	response.setHeader("Cache-Control", "no-cache, must-revalidate");
	request.addListener('end', function() {
		fileServer.serve(request, response, function(e, res) {
			if (e && (e.status === 404)) {
				fileServer.serveFile('/404.json', 200, {}, request, response);
			}
		});
	}).resume();
}).listen(PORT, function() {
	console.log("Server listening on PORT: " + PORT + "... ");
});