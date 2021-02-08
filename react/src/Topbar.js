import React, { useContext, useState, useMemo } from "react";
import app from "./authentication/base";
import { AuthContext } from "./authentication/Auth";
import { TopbarDiv, TopbarContainer, TopbarLogo } from "./TopbarComponents";
import { StyledButton, StyledLink } from "./styled_components/StyledButtons";
import Flexbox from "./styled_components/Flexbox";
import { useHistory } from "react-router";
import { GetUserDetails } from "./CallAPI";
import Loading from "./Loading";

function Topbar(props) {
  const { currentUser, isHost } = useContext(AuthContext);
  return (
    <TopbarDiv>
      <TopbarContainer>
        <Flexbox>
          <TopbarLogo />
          {currentUser && <UpcomingEventsButtons />}
        </Flexbox>
        {currentUser ? (
          <Flexbox>
            <MyTicketsButton />
            <SignOutButton />
            <UserName />
          </Flexbox>
        ) : (
          <Flexbox>
            <SignUpButton />
            <SignInButton />
          </Flexbox>
        )}
      </TopbarContainer>
    </TopbarDiv>
  );
}

export function UserName(props) {
  const { currentUser } = useContext(AuthContext);
  const [details, setDetails] = useState(null);
  const [detailsLoaded, setDetailsLoaded] = useState(false);

  useMemo(
    () =>
      GetUserDetails(currentUser.uid).then((res) => {
        setDetails(res[0]);
        setDetailsLoaded(true);
      }),
    []
  );

  return (
    <span
      style={{
        padding: "0 1em",
        borderLeft: "solid 2px lightgrey",
        marginLeft: "1em",
      }}
    >
      {detailsLoaded ? (
        details.NazwaF ? (
          details.NazwaF
        ) : (
          details.Imie
        )
      ) : (
        <Loading />
      )}
    </span>
  );
}

function SignOutButton(props) {
  const history = useHistory();
  const { setIsHost, setPending } = useContext(AuthContext);

  return (
    <StyledButton
      onClick={() => app.auth().signOut()}
      backgroundcolor="aquamarine"
      style={{ marginLeft: "1em" }}
    >
      Wyloguj
    </StyledButton>
  );
}

function SignInButton(props) {
  return (
    <StyledLink
      to="/login"
      backgroundcolor="darkcyan"
      style={{ marginLeft: "1em" }}
    >
      Zaloguj
    </StyledLink>
  );
}

function MyTicketsButton(props) {
  return (
    <StyledLink
      to="/mytickets"
      backgroundcolor="hotpink"
      style={{ marginLeft: "1em" }}
    >
      Moje Bilety
    </StyledLink>
  );
}

function SignUpButton(props) {
  return (
    <StyledLink
      to="/signup"
      backgroundcolor="slateblue"
      style={{ marginLeft: "1em" }}
    >
      Zarejestruj
    </StyledLink>
  );
}

function UpcomingEventsButtons(props) {
  return (
    <StyledLink
      to="/event"
      backgroundcolor="orangered"
      style={{ marginLeft: "1em" }}
    >
      Wydarzenia
    </StyledLink>
  );
}

export default Topbar;
