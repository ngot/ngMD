(function() {

	var modules = window.m = {};

	function httpQuery(url) {
		url += ".js";
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open("GET", url, false);
		xmlHttpRequest.send();
		return xmlHttpRequest.responseText;
	}

	function wrapper(url, code) {
		return "define('" + url + "', function(exports){" + code + "});";
	}

	var define = window.define = function (url, factory) {
		var res = factory(exports);
		if (res) modules[url] = res;
		else modules[url] = "loaded";
	};

	function fixUrl(url) {
		if (!url) return url;
		if (url.slice(-3) === ".js") return url.slice(0, -3);
		return url;
	}

	function exec(code) {
		var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
		var c = document.createElement("script");
		c.type = "text/javascript";
		c.text = code;
		head.appendChild(c);
		head.removeChild(c);
	}

	var require = window.require = function(url) {
		url = fixUrl(url);
		if (modules[url]) {
			if (modules[url] === "loaded")
				return undefined;
			return modules[url];
		}
		var code = httpQuery(url);
		code = wrapper(url, code);
		exec(code);
		if (modules[url]) {
			if (modules[url] === "loaded")
				return undefined;
			return modules[url];
		}
	};

})();