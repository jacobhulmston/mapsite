import Scene3D from "./components/Scene3D";
import Search from "./components/Search";

const routes = [
  {
    path: "/",
    exact: true,
    component: Scene3D
  },

  {
    path: "/search",
    component: Search
  }
];

export default routes;
