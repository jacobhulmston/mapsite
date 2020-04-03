// checkPixelColor.js
import { Vector2 } from 'three';
import { rgbToHex } from './';

const imageCache = {}

const getUV = (dir) => {
	const { PI, atan2 } = Math;
	let d = new Vector2( dir[0], dir[2] );
	let r = d.length();
	let v = atan2(dir[1], r) + PI * 0.5;
	v /= PI;
	v = 1.0 - v;
	// vec2.normalize(d, d);
	d.normalize();
	let a = atan2(d.x, d.y);
	
	let u = (a + PI) / PI * 0.5;

	// console.log(u, v);
	return [u, v];
}

const getColorIndicesForCoord = (x, y, width) => {
  var red = y * (width * 4) + x * 4;
  return red;
}

const getPixel = (imgData, uv, width, height) => {
	const x = Math.floor(uv[0] * width);
	const y = Math.floor(uv[1] * height);
	const index = getColorIndicesForCoord(x, y, width);
	const r = imgData[index];
	const g = imgData[index + 1];
	const b = imgData[index + 2];
	const a = imgData[index + 3];
	return [r, g, b, a];
}

const checkPixelColor = (v, img, uv) => {
	let tmp = img.src.split('/');
	let id = tmp.pop().split('.')[0];

	let canvas, ctx, data;
	if(!imageCache[id]) {
		canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);

		const imageData = ctx.getImageData(0, 0, img.width, img.height);
		data = imageData.data;

		document.body.appendChild(canvas);
		canvas.style.position = 'fixed';
		canvas.style.zIndex = 99999;
		canvas.style.visibility = 'hidden';

		imageCache[id] = {
			canvas,
			ctx,
			data:imageData.data
		}

	} else {
		canvas = imageCache[id].canvas;
		ctx = imageCache[id].ctx;
		data = imageCache[id].data;
	}

	// console.log(v);
	uv = uv ||  getUV(v);
	
	let pixel = getPixel(data, uv, img.width, img.height);
	const color = rgbToHex(pixel)

	return color;
	
}


export { checkPixelColor };