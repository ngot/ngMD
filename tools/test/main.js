var assert = require("assert");
var builder = require("../lib/build");

describe('build', function() {
	this.timeout(15000);

	describe("file", function(){
		it("t1", function() {
			var funcs = builder.build("test/file/t1/index.js");
			assert.deepEqual({
				'test/file/t1/index.js': 'var t1 = require("test/file/t1/t1.js");',
				'test/file/t1/t1.js': 'exports.a = \'a\';'
			}, funcs);
			var r = builder.wrapper();
			assert.equal(r, 'define(\'test/file/t1/index.js\', function(require, exports, module){var t1 = require("test/file/t1/t1.js");});define(\'test/file/t1/t1.js\', function(require, exports, module){exports.a = \'a\';});');
			r = builder.compile();
			assert.equal(r, 'define("test/file/t1/index.js",function(t){t("test/file/t1/t1.js")}),define("test/file/t1/t1.js",function(t,e){e.a="a"});')
			builder.clear();
		});

		it("t2", function() {
			var funcs = builder.build("test/file/t2/index.js");
			assert.deepEqual({
				'test/file/t2/index.js': 'var t1 = require( "test/file/t2/t1.js");\nvar t2 = require("test/file/t2/t2.js" );',
				'test/file/t2/t1.js': 'exports.a = require ("test/file/t2/t2.js");',
				'test/file/t2/t2.js': 'exports.a = \'a\';'
			}, funcs);
			var r = builder.wrapper();
			assert.equal(r, 'define(\'test/file/t2/index.js\', function(require, exports, module){var t1 = require( "test/file/t2/t1.js");\nvar t2 = require("test/file/t2/t2.js" );});define(\'test/file/t2/t1.js\', function(require, exports, module){exports.a = require ("test/file/t2/t2.js");});define(\'test/file/t2/t2.js\', function(require, exports, module){exports.a = \'a\';});');
			r = builder.compile();
			assert.equal(r, 'define("test/file/t2/index.js",function(t){t("test/file/t2/t1.js"),t("test/file/t2/t2.js")}),define("test/file/t2/t1.js",function(t,e){e.a=t("test/file/t2/t2.js")}),define("test/file/t2/t2.js",function(t,e){e.a="a"});')
			builder.clear();
		});
	});

});