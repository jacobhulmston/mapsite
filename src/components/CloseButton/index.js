import React from "react";
import { Link } from "react-router-dom";
import "./style.scss";

const CloseButton = () => {
  return (
    <Link to="/">
      <div className="CloseButton">
        <div className="close">X</div>
      </div>
    </Link>
  );
};

export default CloseButton;
