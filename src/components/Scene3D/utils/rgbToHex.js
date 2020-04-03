// getColor.js

const colorToHex = (rgb) => {
  var hex = Number(rgb).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
}

const rgbToHex = (r,g,b) => {
if(r.length !== undefined) {	//	array
  g = r[1];
  b = r[2];
  r = r[0];
}

const maxValue = Math.max(r, g, b);
if(maxValue <= 1) {
  r = Math.floor(r * 255);
  g = Math.floor(g * 255);
  b = Math.floor(b * 255);
}

  var red = colorToHex(r);
  var green = colorToHex(g);
  var blue = colorToHex(b);

  return red+green+blue;
}

export { rgbToHex };