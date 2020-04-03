import { Mesh, MeshBasicMaterial, SphereBufferGeometry } from "three";

import { GLOBE_RADIUS } from "../consts";

export default class ViewGlobe extends Mesh {
  constructor() {
    const sphereGeometry = new SphereBufferGeometry(GLOBE_RADIUS, 28, 28);

    super(
      sphereGeometry,
      new MeshBasicMaterial({ color: 0x00000, opacity: 0.5, transparent: true })
    );
  }
}
