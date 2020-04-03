export default `
  attribute float id;
  uniform float currentId; // currentId is the id of the country we're hovering
  uniform float scale;
  uniform float size;
  uniform vec3 mousePos;

  varying vec3 vColor;
  varying float vActive;

  void main() {
    vec3 pos = position;

    float scalePoint = 1.; // this variable will move points up if you're hoevering them
    if (id == currentId) { // id is passed from the attributes
      //if it's equal to the current country we're hovering, then we will pass the varying active to 1.0
      vActive = 1.0;

      float dist = clamp(distance(mousePos, position.xyz), 0., 20.);
      scalePoint = mix(1.03, 1., dist / 20.); // push the points more as they're close to the mouse
    }


    pos.xyz *= scalePoint;
    
    vColor = color; // color is passed to the shaders via the attributes
    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
    

    gl_PointSize = size * ( scale / length( mvPosition.xyz )) ;
    gl_Position = projectionMatrix * mvPosition;

  }
`;