(function() {

	function run() {
		mocha.setup('bdd');
		mocha.reporter("html");

		describe("ngMD", function() {

			it("bootstrap", function() {
				bootstrap("bootstrap");
				assert.ok(window.bootstraped);
				delete window.bootstraped;
			});

			bootstrap("tests/bootstrap");

		});

		if (window.mochaPhantomJS)
			mochaPhantomJS.run();
		else
			mocha.run();
	}

	window.onload = run;
})();