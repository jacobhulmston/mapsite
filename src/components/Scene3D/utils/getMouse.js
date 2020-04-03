// getMouse.js

const getMouse = (e, target) => {
	let x, 
		y;

	if(e.touches) {
		x = e.touches[0].pageX;
		y = e.touches[0].pageY;
	} else {
		x = e.clientX;
		y = e.clientY;
	}

  if (target) {
    target.x = x;
    target.y = y;

    return target;
  }

  return {
    x, y
  };
}

export { getMouse };