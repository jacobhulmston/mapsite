import { CAMERA_DIST, GLOBE_RADIUS, STATES } from "./consts";
// Main entry point of the visualisation
import { PerspectiveCamera, Raycaster, WebGLRenderer } from "three";

import CountriesManager from "./CountriesManager";
import HitDetector from "./HitDetector";
import Loader from "./loader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import SceneDetection from "./scenes/SceneDetection";
import SceneMain from "./scenes/SceneMain";
import UsersManager from "./UsersManager";
import { getMouse } from "./utils";
import { onCountryClick } from "./AppSignals";

export default class SceneApp {
  init() {
    this.loadAssets(); // FIRST THING -> load assets
  }

  loadAssets() {
    const loader = new Loader();

    loader.load(
      ["assets/earthtemplate.jpg", "assets/circle.png", "assets/worldmap.gif"],
      this.onLoadingComplete
    );
  }

  // only initialise scene when the assets are all loaded
  onLoadingComplete = () => {
    this.countryText = document.getElementById("countryName");
    this.renderer = new WebGLRenderer({
      antialias: true
    });
    document.body.appendChild(this.renderer.domElement);

    UsersManager.init(); // ideally we won't have to do that when it's linked to a proper db
    CountriesManager.init(); // will link the countries colors to their name / id

    this.currentState = STATES.explore;
    this.easing = 0.2; // is camera animating around the globe?
    this.animating = false; // is camera animating around the globe?
    this._down = false; // is mouse down
    this._hover = false; // is mouse hovering over the globe
    this._downAndMove = false; // is mouse down and moving at the same time?
    this._mouse = { x: 0, y: 0 }; // could probably be in a class specific for Interaction
    this._target = { x: 0, y: 0, z: 0 }; // the position for the camera to rotate around the globe
    this.scene = new SceneMain(); // main Scene with all the visual things in it
    this.scene.init();

    this.sceneDetection = new SceneDetection(); // this scene will only be used as a render texture to know which country we're hovering
    this.sceneDetection.init(); // it will only contain the colored globe

    const ratio = window.innerWidth / window.innerHeight;
    this.camera = new PerspectiveCamera(45, ratio, 1, 3000);
    this.camera.position.set(0, 20, CAMERA_DIST);
    this.camera.lookAt(this.scene.position);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.controls.enableDamping = true;
    this.controls.enablePan = false;

    this.hitDetector = new HitDetector(
      this.sceneDetection,
      this.renderer,
      this.camera
    ); // hit detector will check what color we're hovering

    this.raycaster = new Raycaster();
    this.addEvents();
    this.update(); // starts the RAF loop
  };

  addEvents() {
    window.addEventListener("resize", this.resize);
    window.addEventListener("mousedown", this.onDown);
    window.addEventListener("mouseup", this.onUp);
    window.addEventListener("mousemove", this.onMove);
    window.addEventListener("mouseover", this.onHover);
    window.addEventListener("click", this.onClick);
    window.addEventListener("touchstart", this.mobileMove);
    window.addEventListener("touchmove", this.onDown);
    window.addEventListener("touchend", this.onUp);

    this.resize();
  }

  removeEvents() {
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("mousedown", this.onDown);
    window.removeEventListener("mouseup", this.onUp);
    window.removeEventListener("mousemove", this.onMove);
    window.removeEventListener("click", this.onClick);
    window.addEventListener("touchstart", this.onDown);
    window.addEventListener("touchmove", this.mobileMove);
    window.addEventListener("touchend", this.onUp);
  }

  mobileMove = e => {
    getMouse(e, this._mouse); // get the mouse position

    if (this.currentState !== STATES.explore) {
      // if we are focusing on a country, no white overlays on other countries
      if (this._down && this.currentState === STATES.select)
        this.currentState = STATES.animateOut; // if we're moving while having the mousepressing down, get out of the zoom

      return;
    }

    // if (this._down) this._downAndMove = true; // we're moving while pressing down
    const color = this.hitDetector.update(this._mouse.x, this._mouse.y); // get the color from the hit detector
    const country = CountriesManager.getCountry(color); // get the country depending of the color

    if (country && country !== this.lastCountry) {
      // if that's a different country that we're hovering
      this.lastCountry = country;
      this.countryText.innerText = country.name;
      this.scene.onHoverCountry(country.id); // this will call a change of uniform in the shaders
    } else if (color === "ffffff".toUpperCase()) {
      this.lastCountry = null;

      this.scene.onHoverCountry(999999); // this will call a change of uniform in the shaders
    }
  };

  onUp = e => {
    this._down = false;
    // if we were moving, means we're exploring so don't continue further more
    if (this._downAndMove) {
      this._downAndMove = false;

      return;
    }

    if (this.currentState === STATES.explore && this.lastCountry) {
      const int = this.getIntersection(this._mouse);
      if (int) {
        // zoom on the country
        const { x, y, z } = int.point;
        let scale =
          (GLOBE_RADIUS + (CAMERA_DIST - GLOBE_RADIUS) / 1.5) / GLOBE_RADIUS;

        this.animating = true;
        this._target.x = x * scale;
        this._target.y = y * scale;
        this._target.z = z * scale;
        // see update function
      }

      // dispatch country / users
      const users = UsersManager.getUsersPerCountry(this.lastCountry.name);

      if (users) {
        onCountryClick.dispatch(this.lastCountry.name, users);
        this.currentState = STATES.animateIn;
      }

      this.countryText.innerText = "";
    }
  };

  onDown = e => {
    this._down = true;
  };

  onHover = e => {
    this._hover = true;
  };

  onMove = e => {
    getMouse(e, this._mouse); // get the mouse position

    // move particles up when moving the mouse on the sphere
    const int = this.getIntersection(this._mouse);
    if (int) this.scene.pushParticlesUp(int);

    if (this.currentState !== STATES.explore) {
      // if we are focusing on a country, no white overlays on other countries
      if (this._down && this.currentState === STATES.select)
        this.currentState = STATES.animateOut; // if we're moving while having the mousepressing down, get out of the zoom

      return;
    }

    if (this._down) this._downAndMove = true; // we're moving while pressing down
    const color = this.hitDetector.update(this._mouse.x, this._mouse.y); // get the color from the hit detector
    const country = CountriesManager.getCountry(color); // get the country depending of the color

    if (country && country !== this.lastCountry) {
      // if that's a different country that we're hovering
      // this.sceneDetection.viewGlobeColor.rotation.y = 0;
      // this.scene.viewParticlesGlobe.rotation.y = 0;
      this.lastCountry = country;
      this.countryText.innerText = country.name;
      this.scene.onHoverCountry(country.id); // this will call a change of uniform in the shaders
    } else if (color === "ffffff".toUpperCase()) {
      this.lastCountry = null;
      this.countryText.innerText = "";
      this.scene.onHoverCountry(999999); // this will call a change of uniform in the shaders
    }
  };

  getIntersection(pos) {
    const x = (pos.x / window.innerWidth) * 2 - 1; // get the mouse coordinates between -1 and 1 (clipspace coordinates)
    const y = -(pos.y / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera({ x, y }, this.camera); // raycast
    let intersects = this.raycaster.intersectObjects(
      this.sceneDetection.children
    ); // should only be one sphere
    return intersects[0]; // get first intersection
  }

  handleRotation() {
    if (this.currentState === STATES.explore) {
      this.sceneDetection.viewGlobeColor.rotation.y += 0.0015;
      this.scene.viewParticlesGlobe.rotation.y += 0.0015;
    }
  }

  update() {
    this.renderer.render(this.scene, this.camera);

    this.handleRotation();
    this.controls.update();

    // depending of the state of the globe (see consts file) we need to zoom in / out, etc.
    if (this.currentState === STATES.animateOut) {
      // in animate out of the selected view, need the camera to zoom back
      const dist = this.camera.position.length();
      const diff = CAMERA_DIST - dist;

      if (diff < 1) {
        // change the state if the camera is far enough
        this.currentState = STATES.explore;
      } else {
        const scale = CAMERA_DIST / dist;
        const newX = this.camera.position.x * scale;
        const newY = this.camera.position.y * scale;
        const newZ = this.camera.position.z * scale;

        this.camera.position.x += (newX - this.camera.position.x) * this.easing;
        this.camera.position.y += (newY - this.camera.position.y) * this.easing;
        this.camera.position.z += (newZ - this.camera.position.z) * this.easing;
      }
    } else if (this.currentState === STATES.animateIn) {
      // if animateIn, ease to the camera!
      const diffX = (this._target.x - this.camera.position.x) * this.easing;
      const diffY = (this._target.y - this.camera.position.y) * this.easing;
      const diffZ = (this._target.z - this.camera.position.z) * this.easing;
      this.camera.position.x += diffX;
      this.camera.position.y += diffY;
      this.camera.position.z += diffZ;

      // if we're close enough from the target, change state
      if (Math.abs(diffX * diffY * diffZ) < 0.01)
        this.currentState = STATES.select;
    } else if (this.currentState === STATES.explore && !this._down) {
      this.sceneDetection.update();
      this.scene.update();
    }

    this.raf = requestAnimationFrame(this.update.bind(this));
  }

  resize = () => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  };

  unmount() {
    this.removeEvents();

    this.renderer.domElement.remove();
    cancelAnimationFrame(this.raf);
  }
}
