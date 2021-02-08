import React, { useContext } from "react";
import { AuthContext } from "./authentication/Auth";
import BubbleLink from "./BubbleButton";

function AddEventButton(props) {
  const { currentUser } = useContext(AuthContext);
  return (
    currentUser && (
      <BubbleLink
        to="/addEvent"
        style={{
          backgroundcolor: "green",
          border: "2px solid",
          bordercolor: "aquamarine",
        }}
      >
        Nowe
      </BubbleLink>
    )
  );
}

export default AddEventButton;
