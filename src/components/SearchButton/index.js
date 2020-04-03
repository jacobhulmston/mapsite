import React from "react";
import "./style.scss";

const SearchButton = props => {
  return (
    <div className="SearchButton" onClick={props.openSearchOverlay}>
      <div className="search"></div>
    </div>
  );
};

export default SearchButton;
