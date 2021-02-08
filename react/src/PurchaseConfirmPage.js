import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { StyledLink } from "./styled_components/StyledButtons";
function ConfirmPage(props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <h1 style={{ color: "#5dbb63" }}>Udało się dokonać zakupu</h1>
        <StyledLink
          to="/"
          style={{ marginTop: "2em" }}
          backgroundcolor="#5dbb63"
        >
          Przejdź do strony głównej
        </StyledLink>
      </div>
    </div>
  );
}

export default ConfirmPage;
