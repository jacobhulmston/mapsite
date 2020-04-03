import React, { Component } from "react";
import { onCountryClick } from "../Scene3D/AppSignals";
import OutsideClickHandler from "react-outside-click-handler";
import Users from "../Users";

import "./style.scss";

class Overlay extends Component {
  constructor(props) {
    super(props);
    this.state = { overlay: false, users: [], country: [] };
    this.openOverlay = this.openOverlay.bind(this);
    this.closeOverlay = this.closeOverlay.bind(this);
  }

  openOverlay() {
    this.setState({ overlay: true });
  }

  closeOverlay() {
    this.setState({ overlay: false });
  }

  onCountryClick = (country, users) => {
    this.openOverlay();
    this.setState({ users: [...users.users], country });
  };

  componentDidMount() {
    this.onCountrySignal = onCountryClick.add(this.onCountryClick);
  }

  componentWillUnmount() {
    this.onCountrySignal.detach();
  }

  render() {
    const country = this.state.country;
    const users = this.state.users;

    return (
      <OutsideClickHandler
        onOutsideClick={() => {
          this.closeOverlay();
        }}
      >
        <div className="users-container">
          {this.state.overlay && (
            <>
              <button
                className="close-button-mobile"
                onClick={() => {
                  this.closeOverlay();
                }}
              >
                x
              </button>
              <h1>{country}</h1>
              <Users users={users} />
            </>
          )}
        </div>
      </OutsideClickHandler>
    );
  }
}

export default Overlay;
