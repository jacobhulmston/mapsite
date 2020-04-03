import { WebGLRenderTarget } from "three";
import { rgbToHex } from "./utils";

export default class HitDetector {
  constructor(scene, renderer, camera) {
    this.scene = scene;
    this.renderer = renderer;
    this.gl = this.renderer.getContext();
    this.camera = camera;

    const date = new Date();
    this.lastTime = date.getTime();
    this.pixels = new Uint8Array(4); // the array of pixels we will update with the color we're hovering

    this.bufferTexture = new WebGLRenderTarget(512, 512); // create a render texture we will render the color globe into!
  }

  update(x, y) {
    // check if we didn't do the whole operation not too early ago (onMousemove gets called a lot!)
    const date = new Date();
    const elapsed = date.getTime() - this.lastTime;

    if (elapsed < 20) return; // 20ms is an arbitrary value...

    this.lastTime = date.getTime();

    // get called when mousemove
    this.renderer.setRenderTarget(this.bufferTexture); // tell the renderer that we will render into a special texture
    this.renderer.render(this.scene, this.camera);

    // get the color
    this.gl.readPixels(
      (x / window.innerWidth) * 512,
      (Math.abs(y - window.innerHeight) / window.innerHeight) * 512,
      1,
      1,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      this.pixels
    );
    this._color = rgbToHex(this.pixels).toUpperCase();
    this.renderer.setRenderTarget(null); // tell the renderer to render into the default framebuffer again next time (in App.js)!

    return this._color;
  }
}
