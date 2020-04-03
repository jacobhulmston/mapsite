// this file is the component that only initialise the scene!
import App from "./App";
import { onCountryClick } from "./AppSignals";
import { useEffect } from "react";

/**
 * TODO: gloom ?
 * TODO: lightning on the globe is pretty bad
 * TODO: add lighting on particles
 * TODO: fadein / fadeout of the hover
 * TODO: see about coordinates / translate latitude longitude into 3d coordinates
 * TODO: add a countries overlay on top, but very discreet (maybe with a mouse effect to show / hide only a part of it)
 * TODO: move this overlay when moving the sphere
 * TODO: on mobile, make the orbital control zoom related to the screen size
 */

export default function Scene3D() {
  useEffect(() => {
    const app = new App();
    let onCountrySignal = onCountryClick.add((country, users) => {});
    app.init();

    return function cleanup() {
      app.unmount();
      onCountrySignal.detach();
    };
  }, []);

  return null;
}
