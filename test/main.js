(function() {

	function run() {
		mocha.setup('bdd');

		describe("ngMD", function() {

			it("one", function() {

			});

		});

		mocha.reporter("html");
		if (window.mochaPhantomJS)
			mochaPhantomJS.run();
		else
			mocha.run();

	}

	window.onload = run;
})();