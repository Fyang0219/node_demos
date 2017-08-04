exports.fibonacci = function fibonacci(n) {
	if (n ===0) {
		return 0;
	}
	if (n === 1) {
		return 1;
	}

	if( typeof n !== 'number') {
		throw new Error('n should be a Number');
	}

	if(n < 0) {
		throw new Error('n should >= 0');
	}

	if (n > 10) {
		throw new Error('n should <= 10');
	}

	return fibonacci(n-1) + fibonacci(n-2);
};


// true only when file run directly and not by require('./asdfaef')
if ( require.main === module) {
	var n = Number(process.argv[2]);
	console.log('fibonacci( ' + n + ')  is ', fibonacci(n));
}

