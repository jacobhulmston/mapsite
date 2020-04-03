// parseGlobe.js

import { decodePosition } from "./";

const radix = 32;
const precision = 5;

const getCenter = vertices => {
  let x = 0,
    y = 0,
    z = 0;

  vertices.map(v => {
    x += v[0];
    y += v[1];
    z += v[2];

    return v;
  });

  return [x / vertices.length, y / vertices.length, z / vertices.length];
};

const parseGlobe = data => {
  const { faces, positions } = data;
  const filterEmptyString = s => s.length > 0;

  //	extract position
  let positionExported = positions.split(" ");
  positionExported = positionExported.filter(filterEmptyString);
  positionExported = positionExported.map(s => decodePosition(s, precision));

  let centers = [];
  let facesExported = faces.split("\n");
  facesExported = facesExported.filter(filterEmptyString);

  facesExported = facesExported.map((s, i) => {
    let ary = s.split(",");
    ary = ary.filter(filterEmptyString);
    ary = ary.map(v => parseInt(v, radix));
    ary = ary.map(index => positionExported[index - 1]);

    let center = getCenter(ary);
    // faces.push(_vertices);
    centers.push(center);

    return ary;
  });

  return {
    faces: facesExported,
    centers
  };
};

export { parseGlobe };
