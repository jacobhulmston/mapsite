import React, { useState } from "react";
import CustomizedExpansionPanels from "../Accordion";

function Users(props) {
  const [expanded, setExpanded] = useState("panel_0");
  return (
    <div className="Users">
      {props.users.map((user, i) =>
        CustomizedExpansionPanels(user, i, expanded, setExpanded)
      )}
    </div>
  );
}

export default Users;
