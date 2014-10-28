var fs = require("fs");
var UglifyJS = require("uglify-js");

var funcs = {};

function prepare(m) {
	var patt = /require\s*\(\s*((\"[^\'\"]*\")|(\'[^\'\"]*\'))\s*\)/g;

	if (funcs[m]) return;

	var result;
	var code = fs.readFileSync(m).toString();
	funcs[m] = code;

	while ((result = patt.exec(code)) != null) {
		m = result[1];
		prepare(m.substr(1, m.length - 2));
	}
}

function build(path) {
	prepare(path);
	return funcs;
}

function wrapper() {
	var res = "";
	for (var k in funcs) {
		res += "define('" + k + "', function(require, exports, module){" + funcs[k] + "});";
	}
	return res;
}

function compile() {
	return UglifyJS.minify(wrapper(), {fromString: true}).code;
}

function clear() {
	funcs = {};
}

module.exports.build = build;
module.exports.compile = compile;
module.exports.wrapper = wrapper;
module.exports.clear = clear;