import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  ShaderMaterial,
  Vector3,
  VertexColors
} from "three";
import { checkPixelColor, checkPixelVisible, parseGlobe } from "../utils";

import CountriesManager from "../CountriesManager";
import { GLOBE_RADIUS } from "../consts";
import { assets } from "../loader";
import frag from "../shaders/dots.frag";
import { points } from "../data/data-points";
import vert from "../shaders/dots.vert";

/**
 * * How it works
 * There is a data file with some positions generated from a 3d software and encoded for space optimisations (data/data-countries)
 * This file is actually a sphere with equidistant points.
 *
 * * Where did the problem (points tacking up) come from
 * There are different ways to create a sphere dynamically:
 * - creating a sphere (points will stack up)
 * - creating an icosphere with more precision (faces are equidistants, but more points are generated depending of the precision)
 * -> you can see an example here (http://2.bp.blogspot.com/_-FeuT9Vh6rk/Sj1EerQc9tI/AAAAAAAAABY/cGFYhe8u1Y0/s320/spheretypes.png)
 * I chose to get a 3d file exported in 3d because we can control the precision of it:
 * - dynamic sphere: ~30k vertices final
 * - dynamic ico: ~50k vertices final
 * - 3d data exported: ~6k vertices final!
 *
 * The important thing that changed now is when creating the sphere, we now check if the particles is in the middle of ocean,
 * by checking if it's equivalent UV on the map (earthtemplate.jpg) is white or black:
 * - less geometry
 * - no check in the shader if we should display it or not
 * - better performances
 */

export default class ViewParticlesGlobe extends Points {
  constructor() {
    const dots = {
      uniforms: {
        shape: { value: assets["assets/circle.png"] },
        size: { value: 6.5 },
        scale: { value: window.innerHeight / 2 },
        currentId: { value: 999999 }, // country id, by default 999999 so it doesn't match anything
        mousePos: { value: new Vector3() } // country id, by default 999999 so it doesn't match anything
      },
      vertexShader: vert,
      fragmentShader: frag,
      vertexColors: VertexColors, // not sure what this does
      transparent: true, // transparency stuff
      alphaTest: 0.1 // transparency stuff
    };

    const { centers } = parseGlobe(points); // parse the 3d points data and get the faces centers

    let texture = assets["assets/earthtemplate.jpg"]; // this image is to check if the particles should be created or not (if it's on earth or not)
    let textureColor = assets["assets/worldmap.gif"]; // this image is to check the country color and assign it as an id in the shader

    const ids = [];
    const colors = [];
    const color = new Color();
    // const q = ["#EDF062", "#76458A", "#30929A", "#95438C", "#E5BFB1", "red"];
    const q = [
      "#ff00b4",
      "#ff6bd3",
      "#FF73FF",
      "#B5E7FF",
      "#BFF1FF",
      "#82b4dc",
      "#00ffcc",
      "#73FFFF",
      "#40FFFF"
    ];

    const positions = [];
    let ind = 0;
    for (let i = 0; i < centers.length; i++) {
      const c = centers[i];
      const isVisible = checkPixelVisible(c, texture.image);

      if (isVisible) {
        // particles is on earth
        const colorPixel = checkPixelColor(c, textureColor.image).toUpperCase(); // check its color
        const country = CountriesManager.getCountry(colorPixel); // get the country for the color
        // (1) depending of the texture precision, some particles won't get any country ref, I decide to not add them if that's the case
        if (country) {
          ids.push(country.id);
          color.set(q[Math.floor(Math.random() * q.length)]);
          color.toArray(colors, ind * 3);
          ind++;
          positions.push(
            c[0] * (GLOBE_RADIUS + 1),
            c[1] * (GLOBE_RADIUS + 1),
            c[2] * (GLOBE_RADIUS + 1)
          );
        } else {
          // (2) but if you want to add them anyway, uncomment the follwing line
          // ids.push(10000000)
        }

        // (3) and add the particle here instead of the condition above
        // color.set(q[Math.floor(Math.random() * q.length)]);
        // color.toArray(colors, ind * 3);
        // ind++;
        // positions.push(c[0] * (GLOBE_RADIUS + 1), c[1] * (GLOBE_RADIUS + 1), c[2] * (GLOBE_RADIUS + 1))
      }
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(positions), 3)
    );
    geometry.setAttribute(
      "color",
      new BufferAttribute(new Float32Array(colors), 3)
    );
    geometry.setAttribute("id", new BufferAttribute(new Float32Array(ids), 1));

    super(geometry, new ShaderMaterial(dots));
  }

  pushParticlesUp(intersection) {
    const { x, y, z } = intersection.point;
    this.material.uniforms.mousePos.value.x = x;
    this.material.uniforms.mousePos.value.y = y;
    this.material.uniforms.mousePos.value.z = z;
  }

  update(idCountry, intersection) {
    this.material.uniforms.currentId.value = idCountry;
  }
}
