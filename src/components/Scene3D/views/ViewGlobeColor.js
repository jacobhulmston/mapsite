import { Mesh, MeshBasicMaterial, SphereBufferGeometry, } from 'three';

import { GLOBE_RADIUS } from '../consts';
import { assets } from '../loader';

export default class ViewGlobe extends Mesh {
  constructor () {
    const sphereGeometry = new SphereBufferGeometry(GLOBE_RADIUS, 28, 28);

    super(sphereGeometry, new MeshBasicMaterial({ map: assets['assets/worldmap.gif'] }));

    this.rotation.y = -90 * Math.PI / 180;
  }
}