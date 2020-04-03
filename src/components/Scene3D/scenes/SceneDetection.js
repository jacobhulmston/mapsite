import { Scene } from "three";
import ViewGlobeColor from "../views/ViewGlobeColor";

export default class SceneDetection extends Scene {
  init() {
    this.viewGlobeColor = new ViewGlobeColor();
    this.add(this.viewGlobeColor);
    window.addEventListener("mouseover", this.onHover);
  }

  update() {}

  unmount() {}
}
