// decodePosition.js

const decodePosition = (mStr, mPrecision=5) => {
	const precision = mPrecision;
	const base = Math.floor(Math.sqrt(Math.pow(93, precision)));

	let result = 0;
	for (var i=0; i<precision; i++) {
		result += ( mStr.charCodeAt(i)-33 )*Math.pow(93, i);
	}

	const ry = ( ( result % base ) * Math.PI * 2 / base );
	const rx = ( (result-ry*base)/base * Math.PI ) / base;

	let y = Math.sin(rx - Math.PI/2);
	let r = Math.cos(rx - Math.PI/2);
	let x = Math.cos(ry) * r;
	let z = Math.sin(ry) * r;


	return [x, y, z];
}


export { decodePosition };