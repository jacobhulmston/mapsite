import { DirectionalLight, Scene, SphereBufferGeometry } from "three";
import ViewGlobe from "../views/ViewGlobe";
import ViewParticlesGlobe from "../views/ViewParticlesGlobe";

export default class SceneMain extends Scene {
  init() {
    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    this.add(directionalLight);

    this.tick = 0;

    this.sphere = new SphereBufferGeometry(10, 16, 8);

    this.viewParticlesGlobe = new ViewParticlesGlobe();
    this.add(this.viewParticlesGlobe);

    this.viewGlobe = new ViewGlobe();

    this.add(this.viewGlobe);
  }

  update() {}

  pushParticlesUp(intersection) {
    this.viewParticlesGlobe.pushParticlesUp(intersection);
  }

  onHoverCountry(countryId, intersection) {
    this.viewParticlesGlobe.update(countryId);
  }

  unmount() {}
}
