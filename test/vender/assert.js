(function() {
	var pSlice = Array.prototype.slice;

	var assert = ok;

	assert.AssertionError = function AssertionError(options) {
		this.name = 'AssertionError';
		this.message = options.message;
		this.actual = options.actual;
		this.expected = options.expected;
		this.operator = options.operator;
		var stackStartFunction = options.stackStartFunction || fail;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, stackStartFunction);
		}
	};

	assert.AssertionError.prototype = new Error();

	function replacer(key, value) {
		if (value === undefined) {
			return '' + value;
		}
		if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
			return value.toString();
		}
		if (typeof value === 'function' || value instanceof RegExp) {
			return value.toString();
		}
		return value;
	}

	function truncate(s, n) {
		if (typeof s == 'string') {
			return s.length < n ? s : s.slice(0, n);
		} else {
			return s;
		}
	}

	assert.AssertionError.prototype.toString = function() {
		if (this.message) {
			return [this.name + ':', this.message].join(' ');
		} else {
			return [
					this.name + ':',
				truncate(JSON.stringify(this.actual, replacer), 128),
				this.operator,
				truncate(JSON.stringify(this.expected, replacer), 128)
			].join(' ');
		}
	};

	function fail(actual, expected, message, operator, stackStartFunction) {
		throw new assert.AssertionError({
			message: message,
			actual: actual,
			expected: expected,
			operator: operator,
			stackStartFunction: stackStartFunction
		});
	}

	assert.fail = fail;

	function ok(value, message) {
		if (!!!value) fail(value, true, message, '==', assert.ok);
	}
	assert.ok = ok;

	assert.equal = function equal(actual, expected, message) {
		if (actual != expected) fail(actual, expected, message, '==', assert.equal);
	};

	assert.notEqual = function notEqual(actual, expected, message) {
		if (actual == expected) {
			fail(actual, expected, message, '!=', assert.notEqual);
		}
	};

	assert.greaterThan = function greaterThan(actual, expected, message) {
		if (actual <= expected) fail(actual, expected, message, '>', assert.greaterThan);
	};

	assert.lessThan = function greaterThan(actual, expected, message) {
		if (actual >= expected) fail(actual, expected, message, '<', assert.lessThan);
	};

	assert.deepEqual = function deepEqual(actual, expected, message) {
		if (!_deepEqual(actual, expected)) {
			fail(actual, expected, message, 'deepEqual', assert.deepEqual);
		}
	};

	function _deepEqual(actual, expected) {
		// 7.1. All identical values are equivalent, as determined by ===.
		if (actual === expected) {
			return true;

		} else if (actual instanceof Date && expected instanceof Date) {
			return actual.getTime() === expected.getTime();
		} else if (actual instanceof RegExp && expected instanceof RegExp) {
			return actual.source === expected.source &&
				actual.global === expected.global &&
				actual.multiline === expected.multiline &&
				actual.lastIndex === expected.lastIndex &&
				actual.ignoreCase === expected.ignoreCase;
		} else if (typeof actual != 'object' && typeof expected != 'object') {
			return actual == expected;
		} else {
			return objEquiv(actual, expected);
		}
	}

	function isUndefinedOrNull(value) {
		return value === null || value === undefined;
	}

	function isArguments(object) {
		return Object.prototype.toString.call(object) == '[object Arguments]';
	}

	function objEquiv(a, b) {
		if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
			return false;
		if (a.prototype !== b.prototype) return false;
		if (isArguments(a)) {
			if (!isArguments(b)) {
				return false;
			}
			a = pSlice.call(a);
			b = pSlice.call(b);
			return _deepEqual(a, b);
		}
		try {
			var ka = Object.keys(a),
				kb = Object.keys(b),
				key, i;
		} catch (e) { //happens when one is a string literal and the other isn't
			return false;
		}
		if (ka.length != kb.length)
			return false;
		ka.sort();
		kb.sort();
		for (i = ka.length - 1; i >= 0; i--) {
			if (ka[i] != kb[i])
				return false;
		}
		for (i = ka.length - 1; i >= 0; i--) {
			key = ka[i];
			if (!_deepEqual(a[key], b[key])) return false;
		}
		return true;
	}

	assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
		if (_deepEqual(actual, expected)) {
			fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
		}
	};

	assert.strictEqual = function strictEqual(actual, expected, message) {
		if (actual !== expected) {
			fail(actual, expected, message, '===', assert.strictEqual);
		}
	};

	assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
		if (actual === expected) {
			fail(actual, expected, message, '!==', assert.notStrictEqual);
		}
	};

	assert.isUndefined = function isUndefined(value) {
		return value === undefined;
	}

	function expectedException(actual, expected) {
		if (!actual || !expected) {
			return false;
		}

		if (expected instanceof RegExp) {
			return expected.test(actual);
		} else if (actual instanceof expected) {
			return true;
		} else if (expected.call({}, actual) === true) {
			return true;
		}

		return false;
	}

	function _throws(shouldThrow, block, expected, message) {
		var actual;

		if (typeof expected === 'string') {
			message = expected;
			expected = null;
		}

		try {
			block();
		} catch (e) {
			actual = e;
		}

		message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
			(message ? ' ' + message : '.');

		if (shouldThrow && !actual) {
			fail(actual, expected, 'Missing expected exception' + message);
		}

		if (!shouldThrow && expectedException(actual, expected)) {
			fail(actual, expected, 'Got unwanted exception' + message);
		}

		if ((shouldThrow && actual && expected && !expectedException(actual, expected)) || (!shouldThrow && actual)) {
			throw actual;
		}
	}

	assert.throws = function(block, /*optional*/ error, /*optional*/ message) {
		_throws.apply(this, [true].concat(pSlice.call(arguments)));
	};

	assert.doesNotThrow = function(block, /*optional*/ error, /*optional*/ message) {
		_throws.apply(this, [false].concat(pSlice.call(arguments)));
	};

	assert.ifError = function(err) {
		if (err) {
			throw err;
		}
	};

	window.assert = assert;

})();