export const GLOBE_RADIUS = 128;
export const CAMERA_DIST = GLOBE_RADIUS + 400;
export const STATES = {
  explore: 0, // free exploring
  select: 1, // is looking at one country specifically
  animateIn: 2, // animate to look at a country
  animateOut: 3, // animate to look at the world
}