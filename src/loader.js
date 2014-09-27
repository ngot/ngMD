(function(w) {
	var modules = {};

	function httpQuery(url) {
		url += ".js";
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open("GET", url, false);
		xmlHttpRequest.send();
		return xmlHttpRequest.responseText;
	}

	function wrapper(url, code) {
		return "define('" + url + "', function(require, exports, module){" + code + "});";
	}

	w.define = function(url, factory) {
		var module = {},
			exports = module.exports = {};
		factory.call(window, require, exports, module);
		modules[url] = module.exports;
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

	function require(url) {
		url = fixUrl(url);
		if (!modules[url])
			exec(wrapper(url, httpQuery(url)));
		return modules[url];
	}

	w.bootstrap = function(url) {
		require(fixUrl(url));
	};
})(window);