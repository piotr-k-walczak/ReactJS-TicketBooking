import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import Moment from "moment";
import { GetEventDetails, GetTicketsForEvent } from "./CallAPI";
import { DetailsPageContainer } from "./DetailsPage";
import TicketOption from "./TicketOption";

export function EventDetailsPage(props) {
  const [tickets, setTickets] = useState([]);
  const [ticketsLoaded, setTicketsLoaded] = useState(false);

  const [event, setEvent] = useState([]);
  const [eventLoaded, setEventLoaded] = useState(false);

  const { eventId } = useParams();

  useMemo(
    () =>
      GetTicketsForEvent(eventId).then((res) => {
        res.sort((a, b) => a.Cena - b.Cena);
        console.log(res);
        setTicketsLoaded(true);
        setTickets(res);
      }),
    []
  );

  useMemo(
    () =>
      GetEventDetails(eventId).then((res) => {
        console.log(res);
        setEventLoaded(true);
        setEvent(res[0]);
      }),
    []
  );

  const noImgUrl =
    "https://dlaziemi.org/pl/wp-content/themes/garden/images/noimage.jpg";

  return (
    <DetailsPageContainer>
      {eventLoaded ? (
        <>
          <img
            src={event.Grafika != "null" ? event.Grafika : noImgUrl}
            style={{ width: "400px", height: "200px", objectFit: "cover" }}
          />
          <div className="title">{event.NazwaW}</div>
          <div>
            <div>{event.Adres + ", " + event.Miasto + ", " + event.Kraj}</div>
            <div>Rozpoczęcie: {Moment(event.CzasRoz).format("DD.MM.YYYY, HH:mm")}</div>
            <div>Zakończenie: {Moment(event.CzasZak).format("DD.MM.YYYY, HH:mm")}</div>
          </div>
          <div className="event-details">{event.OpisW}</div>
          <div class="ticket-list" style={{ border: "none", width: "70%" }}>
            {ticketsLoaded ? (
              tickets.map((ticket) => <TicketOption data={ticket} />)
            ) : (
              <Loading />
            )}
          </div>
        </>
      ) : (
        <h1>Nic nie znaleziono.</h1>
      )}
    </DetailsPageContainer>
  );
}

export default EventDetailsPage;
