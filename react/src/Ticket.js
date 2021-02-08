import React from "react";
import { ReactComponent as TicketIcon } from "./icons/movie-tickets.svg";
import { Link } from "react-router-dom";
import Moment from "moment";
import { CancelledTag, InProgressTag, PastTag } from "./StatusTag";
import styled from "styled-components";
import Flexbox from "./styled_components/Flexbox";
import { ActivityStates, GetActivityState } from "./ActivityState";

const StyledTicket = styled(Link)`
  display: flex;
  padding: 1em;
  background-color: #fefefe;
  border: 3px solid grey;
  border-radius: 10px;
  color: black;
  font-weight: 500;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  margin: auto;
  cursor: pointer;

  &:nth-child(n + 2) {
    margin-top: 1em;
  }

  & .ticket-summary {
    display: flex;
    flex-direction: column;
    margin-left: 1em;
    padding: 0.25em;
    align-items: flex-start;
    text-align: left;
  }

  & .ticket-summary a {
    color: black;
  }

  & svg {
    width: 4em;
    height: 4em;
    flex-grow: 0;
  }

  & .ticket-summary .title:hover {
    color: #555;
  }

  & .ticket-summary .content {
    font-size: 0.9em;
    font-weight: 400;
  }
`;

export function Ticket(props) {
  const { data } = props;
  const activityState = GetActivityState(data);

  return (
    <StyledTicket to={"/ticket/" + data.IdT}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <TicketIcon />
        <div className="ticket-summary">
          <Link to={"/event/" + data.IdW} className="title">
            <Flexbox>
              <span>{data.NazwaW}</span>{" "}
              <TagOrNothing
                activityState={activityState}
                style={{ marginLeft: ".5em" }}
              />
            </Flexbox>
          </Link>
          <div className="content">
            <div>{data.NazwaB}</div>
            <div>{data.Adres + ", " + data.Miasto + ", " + data.Kraj}</div>
            <div>Rozpoczęcie: {Moment(data.CzasRoz).format("DD.MM.YYYY, HH:mm")}</div>
            <div>Rozpoczęcie: {Moment(data.CzasZak).format("DD.MM.YYYY, HH:mm")}</div>
            <div>Ilość: {data.IloscB}</div>
          </div>
        </div>
      </div>
    </StyledTicket>
  );
}

function TagOrNothing(props) {
  const { activityState } = props;
  return (
    <div {...props}>
      {activityState === ActivityStates.acitve ? (
        <InProgressTag />
      ) : activityState === ActivityStates.cancelled ? (
        <CancelledTag />
      ) : activityState === ActivityStates.ended ? (
        <PastTag />
      ) : (
        <></>
      )}
    </div>
  );
}

export default Ticket;
