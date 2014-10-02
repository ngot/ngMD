(function(w) {
	var modules = {};

	var msXmlhttp = ["Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
	var j;
	var getXHR = (function() {
		if ('XMLHttpRequest' in w) {
			return function() {
				return new XMLHttpRequest();
			};
		} else if ('ActiveXObject' in w) {
			for (var i = 0; i < msXmlhttp.length; i++) {
				try {
					new ActiveXObject(msXmlhttp[i]);
					j = i;
					return function() {
						return new ActiveXObject(msXmlhttp[j]);
					};
				} catch (e) {
				}
			}
		} else {
			throw "Your browser does not support Ajax!";
		}
	})();

	function httpQuery(url) {
		var xhr = getXHR();
		xhr.open("get", url, false);
		xhr.send();
		if (+xhr.responseText === 404)
			return false;
		return xhr.responseText;
	}

	function wrapperJS(url, js) {
		return "define('" + url + "', function(require, exports, module){" + js + "});";
	}

	function wrapperJSON(url, json) {
		return "define('" + url + "', function(require, exports, module) {module.exports = JSON.parse(JSON.stringify(" + json + "));});";
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
		if (url.slice(-3) === ".js" || url.slice(-5) === ".json") {
			r = httpQuery(url);
			if (r)
				return r;
			throw "module:" + url + " - not found!";
		}

		r = httpQuery(url + "/package.json");
		if (r) {
			var main;
			try {
				main = JSON.parse(r).main;
			} catch (e) {
			}

			if (main) {
				var u = url + "/" + main;
				if (u.slice(-3) === ".js") {
					r = httpQuery(u);
					if (r)
						return r;
				} else {
					u += ".js";
					r = httpQuery(u);
					if (r)
						return r;
				}
			}
		}

		r = httpQuery(url + "/index.js");
		if (r)
			return r;

		r = httpQuery(url + ".js");
		if (r)
			return r;

		throw "module:" + url + " - not found!";
	}

	function require(url) {
		if (!url) return url;
		if (!modules[url]) {
			if(url.slice(-5) === '.json'){
				exec(wrapperJSON(url, _require(url)));
			}else
				exec(wrapperJS(url, _require(url)));
		}
		return modules[url];
	}

	w.bootstrap = function(url) {
		require(fixUrl(url));
	};
})(window);