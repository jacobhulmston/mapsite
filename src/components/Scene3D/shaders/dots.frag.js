export default `
  uniform sampler2D shape; // the particle sprite (circle.png)

  varying vec3 vColor;
  varying float vActive;

  void main() {
    // get the pixel data from the circle.png, will only be useful for the transparency
    vec4 shapeData = texture2D( shape, gl_PointCoord );
    
    // a trick to make a perfect circle without any image, added to avoid some transparency issues when points are drawn in the wrong order
    if(distance(gl_PointCoord, vec2(.5)) > .5) discard;

    vec3 color = mix(vColor, vec3(1.), vActive); // get the color: normal or white if the country is hovered
    
    gl_FragColor = vec4(color, shapeData.a);
  }
`;