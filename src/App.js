import "./App.scss";
import { HashRouter, Route, Link } from "react-router-dom";
import React, { Component } from "react";
import Overlay from "./components/Overlay";
import SearchButton from "./components/SearchButton";
import Logo from "./assets/cp-logo-wht.png";
import LogoText from "./assets/cp-text.png";
import routes from "./routes";
import slugify from "slugify";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { overlay: false, searchPage: false };
  }

  openSearchOverlay = () => {
    this.setState({ searchPage: true });
  };

  closeSearchOverlay = () => {
    this.setState({ searchPage: false });
  };

  render() {
    return (
      <HashRouter basename="/">
        <div className="logocontainer">
          <Link to="/">
            <img className="logo" src={Logo} alt="Creative Passport Logo" />
            <img
              className="logoText"
              src={LogoText}
              alt="The Creative Passport"
            />
          </Link>
        </div>
        {routes.map(route => {
          const key = slugify(route.path);
          return (
            <Route
              key={key}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          );
        })}
        <div id="countryName" />
        <Overlay />
        <Link to="/search">
          <SearchButton />
        </Link>
      </HashRouter>
    );
  }
}

export default App;
