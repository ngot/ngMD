describe("Tests", function() {

	describe("require", function() {

		it("exports", function() {
			assert.equal(require("tests/require/m1").a, "a");
		});

	});

});