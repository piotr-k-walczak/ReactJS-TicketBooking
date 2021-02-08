import React, { useContext } from "react";
import EventPage from "./EventPage";
import TicketPage from "./TicketsPage";
import HostEventsPage from "./HostEventsPage";
import { AuthContext } from "./authentication/Auth";
import styled from "styled-components";

const MainPageLayout = styled.div`
  display: grid;

  &.logged-in {
    grid-template-columns: 2fr 1fr;
    gap: 1em;
  }

  @media screen and (max-width: 1100px) {
    &.logged-in {
      grid-template-columns: 1fr;
    }
  }

  &.guest {
    grid-template-columns: 1fr;
  }
`;

function MainPage(props) {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? <LoggedInPage /> : <GuestPage />;
}

function LoggedInPage(props) {
  return (
    <MainPageLayout className="logged-in">
      <div>
        <EventPage />
      </div>
      <div id="main-page-tickets">
        <TicketPage />
      </div>
    </MainPageLayout>
  );
}

function GuestPage(props) {
  return (
    <MainPageLayout className="guest">
      <div>
        <EventPage />
      </div>
    </MainPageLayout>
  );
}

export function HostMainPage(props) {
  return (
    <MainPageLayout>
      <HostEventsPage />
    </MainPageLayout>
  );
}

export default MainPage;
