(function() {

	function run() {
		mocha.setup('bdd');
		mocha.reporter("html");

		describe("ngMD", function() {

			it("bootstrap", function() {
				bootstrap("bootstrap1");
				assert.ok(window.bootstraped);
				delete window.bootstraped;
			});

			it("bootstrap.js", function() {
				bootstrap("bootstrap2.js");
				assert.ok(window.bootstraped);
				delete window.bootstraped;
			});

			bootstrap("tests/main");

		});

		if (window.mochaPhantomJS)
			mochaPhantomJS.run();
		else
			mocha.run();
	}

	window.onload = run;
})();