describe("Tests", function() {

	describe("require", function() {

		it("exports", function() {
			assert.equal(require("tests/require/m1").a, "a");
			assert.equal(require("tests/require/m5.js").a, "a");

			assert.throws(require("tests/require/m4"));
		});

		it("module.exports", function() {
			assert.equal(require("tests/require/m2").a, "a");
			assert.equal(require("tests/require/m3.js")(), "a");
		});

		it("cache", function() {
			window.a = 1;
			require("tests/require/m6");
			assert.equal(window.a, 2);
			require("tests/require/m6");
			assert.equal(window.a, 2);
			delete window.a;
		});

		it("requiredir", function() {
			assert.equal(require("tests/requiredir/t1").a, "a");
			assert.equal(require("tests/requiredir/t2").a, "a");
			assert.equal(require("tests/requiredir/t3").a, "a");
			assert.throws(function() {
				require("tests/requiredir/t4")
			});
			assert.equal(require("tests/requiredir/t5").a, "a");
		});

	});

});