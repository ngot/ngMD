var assert = require("assert");
var builder = require("../lib/build");

describe('build', function() {
	this.timeout(15000);

	it("t1", function() {
		var funcs = builder.build("test/t1/index.js");
		assert.deepEqual({
			'test/t1/index.js': 'var t1 = require("test/t1/t1.js");',
			'test/t1/t1.js': 'exports.a = \'a\';'
		}, funcs);
		var r = builder.wrapper();
		assert.equal(r, 'define(\'test/t1/index.js\', function(require, exports, module){var t1 = require("test/t1/t1.js");});define(\'test/t1/t1.js\', function(require, exports, module){exports.a = \'a\';});');
		r = builder.compile();
		assert.equal(r, 'define("test/t1/index.js",function(t){t("test/t1/t1.js")}),define("test/t1/t1.js",function(t,e){e.a="a"});')
		builder.clear();
	});

	it("t2", function() {
		var funcs = builder.build("test/t2/index.js");
		assert.deepEqual({
			'test/t2/index.js': 'var t1 = require( "test/t2/t1.js");\nvar t2 = require("test/t2/t2.js" );',
			'test/t2/t1.js': 'exports.a = require ("test/t2/t2.js");',
			'test/t2/t2.js': 'exports.a = \'a\';'
		}, funcs);
		var r = builder.wrapper();
		assert.equal(r, 'define(\'test/t2/index.js\', function(require, exports, module){var t1 = require( "test/t2/t1.js");\nvar t2 = require("test/t2/t2.js" );});define(\'test/t2/t1.js\', function(require, exports, module){exports.a = require ("test/t2/t2.js");});define(\'test/t2/t2.js\', function(require, exports, module){exports.a = \'a\';});');
		r = builder.compile();
		assert.equal(r, 'define("test/t2/index.js",function(t){t("test/t2/t1.js"),t("test/t2/t2.js")}),define("test/t2/t1.js",function(t,e){e.a=t("test/t2/t2.js")}),define("test/t2/t2.js",function(t,e){e.a="a"});')
		builder.clear();
	});

});