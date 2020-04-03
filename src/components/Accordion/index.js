import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Logo from "../../assets/cp-logo-wht.png";
import "./style.scss";

const ExpansionPanel = withStyles({
  root: {
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0
    },
    "&:before": {
      display: "none"
    },
    "&$expanded": {
      margin: "auto"
    }
  },
  expanded: {}
})(MuiExpansionPanel);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: "25px 0",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
}))(MuiExpansionPanelDetails);

const ExpansionPanelSummary = withStyles({
  root: {
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56
    }
  },
  content: {
    "&$expanded": {
      margin: "12px 0"
    }
  },
  expanded: {}
})(MuiExpansionPanelSummary);

export default function CustomizedExpansionPanels(
  user,
  id,
  expanded,
  setExpanded
) {
  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const props = user;

  return (
    <div className="Accordion">
      <ExpansionPanel
        square
        expanded={expanded === `panel_${id}`}
        onChange={handleChange(`panel_${id}`)}
      >
        <ExpansionPanelSummary
          aria-controls={`panel_${id}d-content`}
          id={`panel_${id}d-header`}
        >
          <h2>{props.name}</h2>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className="image-container">
            <img
              src={props.image ? props.image : Logo}
              alt="Imogen Heap Profile"
            />
          </div>
          <div className="name-container">
            <h2 className="user_name">{props.name}</h2>
          </div>
          <div className="info-container">
          {props.skills}
            <p className="quote">"{props.favouriteQuote}"</p>
            <p className="email">{props.email}</p>
            <p className="website">{props.website}</p>
            <a href={props.publicURL} className="viewfull">
              {props.publicURL ? "View Full Passport" : ""}
            </a>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}
