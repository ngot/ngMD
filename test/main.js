(function() {

	function run() {
		mocha.setup('bdd');
		mocha.reporter("html");

		describe("ngMD", function() {

			it("bootstrap", function() {
				bootstrap("bootstrap1");
				assert.ok(window.bootstraped);
				try{
					delete window.bootstraped;
				}catch (e){
					window.bootstraped = null;
				}
			});

			it("bootstrap.js", function() {
				bootstrap("bootstrap2.js");
				assert.ok(window.bootstraped);
				try{
					delete window.bootstraped;
				}catch (e){
					window.bootstraped = null;
				}
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