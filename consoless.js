function* foo(x = 3) {
	let y = 2 * (yield x + 1);
	let z = yield y / 3;
	return x + y + z;
}

let a = foo(5);
let b = foo(10);

let result1 = a.next(1);
console.log("Result 1", result1);
//generator every time call next, call the next yield

let result2 = a.next(6);
console.log("Result 2", result2);

let result3 = a.next(1);
console.log("Result 2", result3);
