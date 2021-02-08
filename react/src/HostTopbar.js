import React, { useContext, useState } from "react";
import app from "./authentication/base";
import { AuthContext } from "./authentication/Auth";
import { TopbarDiv, TopbarContainer, TopbarLogo } from "./TopbarComponents";
import { StyledButton, StyledLink } from "./styled_components/StyledButtons";
import Flexbox from "./styled_components/Flexbox";
import { UserName } from "./Topbar";

function HostTopbar(props) {
  const { currentUser } = useContext(AuthContext);
  return (
    <TopbarDiv>
      <TopbarContainer>
        <TopbarLogo />
        {currentUser && (
          <Flexbox>
            <MyEventsButton />
            <SignOutButton />
            <UserName />
          </Flexbox>
        )}
      </TopbarContainer>
    </TopbarDiv>
  );
}

function SignOutButton(props) {
  return (
    <StyledButton
      onClick={() => app.auth().signOut()}
      backgroundcolor="darkcyan"
      style={{ marginLeft: "1em" }}
    >
      Wyloguj
    </StyledButton>
  );
}

function MyEventsButton(props) {
  return (
    <StyledLink
      to="/event"
      backgroundcolor="purple"
      style={{ marginLeft: "1em" }}
    >
      Moje Wydarzenia
    </StyledLink>
  );
}

export default HostTopbar;
