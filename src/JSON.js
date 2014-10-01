(function(w) {
	if (!w.JSON || !w.JSON.parse) {
		w.JSON = {};
		var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
		JSON.parse = function(text) {
			if (!text) return text;
			text = "" + text;
			if (text.search(cx) !== -1)
				text = text.replace(cx, function(a) {
					return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				});
			if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '')))
				return eval('(' + text + ')');
			throw new SyntaxError('JSON.parse');
		};
	}
})(window);
