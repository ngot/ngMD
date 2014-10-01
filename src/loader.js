(function(w) {
	var modules = {};

	function getXHR() {
		return new XMLHttpRequest();
	}

	function httpQuery(url) {
		var xhr = getXHR();
		xhr.open("get", url, false);
		xhr.send();
		if (+xhr.responseText === 404)
			return false;
		return xhr.responseText;
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

	function _require(url) {
		var r;
		if (url.slice(-3) === ".js") {
			r = httpQuery(url);
			if (r)
				return r;
			else
				throw "module:" + url + " - not found!";
		}

		r = httpQuery(url + "/package.json");
		if (r) {
			r = JSON.parse(r).main;
			if (r) {
				var u = url + "/" + r;
				if (u.slice(-3) === ".js") {
					r = httpQuery(u);
					if (r)
						return r;
					else
						throw "module:" + u + " - not found!";
				} else {
					u += ".js";
					r = httpQuery(u);
					if (r)
						return r;
					else {
						r = httpQuery(url + "/index.js");
						if (r)
							return r;
						else {
							r = httpQuery(url + ".js");
							if (r)
								return r;
							else
								throw "module:" + url + " - not found!";
						}
					}
				}
			} else {
				r = httpQuery(url + "/index.js");
				if (r)
					return r;
				else {
					r = httpQuery(url + ".js");
					if (r)
						return r;
					else
						throw "module:" + url + " - not found!";
				}
			}
		} else {
			r = httpQuery(url + "/index.js");
			if (r)
				return r;
			else {
				r = httpQuery(url + ".js");
				if (r)
					return r;
				else
					throw "module:" + url + " - not found!";
			}
		}

	}

	function require(url) {
		if (!url) return url;
		if (!modules[url]) {
			exec(wrapper(url, _require(url)));
		}
		return modules[url];
	}

	w.bootstrap = function(url) {
		require(fixUrl(url));
	};
})(window);