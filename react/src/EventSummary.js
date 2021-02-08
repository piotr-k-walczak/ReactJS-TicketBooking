import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import Moment from "moment";
import { GetTicketsForEvent } from "./CallAPI";
import { SummaryLink } from "./SummaryDiv";
import TicketOption from "./TicketOption";
import Flexbox from "./styled_components/Flexbox";
import styled from "styled-components";

function Event(props) {
  const { data, host } = props;

  const [tickets, setTickets] = useState([]);
  const [ticketsLoaded, setTicketsLoaded] = useState(false);
  const [showTickets, setShowTickets] = useState(false);

  useMemo(
    () =>
      GetTicketsForEvent(data.IdW).then((res) => {
        setTicketsLoaded(true);
        res.sort((a, b) => a.Cena - b.Cena);
        setTickets(res);
      }),
    []
  );

  const noImgUrl =
    "https://dlaziemi.org/pl/wp-content/themes/garden/images/noimage.jpg";

  return (
    <SummaryLink to={host ? "/event/" + data.IdW : "#"}>
      <Flexbox onClick={() => setShowTickets(!showTickets)}>
        <Link to={"/event/" + data.IdW}>
          <img
            src={data.Grafika != "null" ? data.Grafika : noImgUrl}
            style={{ width: "200px", height: "100px", objectFit: "cover" }}
          />
        </Link>
        <EventSummaryText>
          <Link to={"/event/" + data.IdW} className="title">
            {data.NazwaW}
          </Link>
          <div className="content">
            <div>{data.Adres + ", " + data.Miasto + ", " + data.Kraj}</div>
            <div>Rozpoczęcie: {Moment(data.CzasRoz).format("DD.MM.YYYY, HH:mm")}</div>
            <div>Zakończenie: {Moment(data.CzasZak).format("DD.MM.YYYY, HH:mm")}</div>
          </div>
        </EventSummaryText>
      </Flexbox>
      {showTickets && (
        <TicketList>
          {ticketsLoaded ? (
            tickets.map((ticket) => {
              return <TicketOption data={ticket} key={ticket.IdB} />;
            })
          ) : (
            <Loading />
          )}
        </TicketList>
      )}
    </SummaryLink>
  );
}

const TicketList = styled.div`
  margin-top: 0.35em;
  padding: 0.5em;
  padding-bottom: 0;
  border-top: 1px solid #ccc;
`;

const EventSummaryText = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1em;
  padding: 0.25em;
  align-items: flex-start;
  justify-content: center;

  & a {
    color: black;
  }

  & .title:hover {
    color: #555;
  }

  & .content {
    font-size: 0.9em;
    font-weight: 400;
  }

  & div {
    text-align: left;
  }
`;

export default Event;
