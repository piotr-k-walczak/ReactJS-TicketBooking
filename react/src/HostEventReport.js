import React, { useContext, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import Moment from "moment";
import {
  GetSalesSummaryForEvent,
  GetHostsEventDetails,
  GetSalesForEvent,
} from "./CallAPI";
import { AuthContext } from "./authentication/Auth";
import { TicketSummary } from "./TicketOption";
import { DetailsPageContainer } from "./DetailsPage";
import { FlexboxSpaceBetween } from "./styled_components/Flexbox";
import { StyledButton } from "./styled_components/StyledButtons";
import GeneratePDF from "./GeneratePDF";

export function HostEventReport(props) {
  const { currentUser } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [ticketsLoaded, setTicketsLoaded] = useState(false);

  const [sales, setSales] = useState([]);
  const [salesLoaded, setSalesLoaded] = useState(false);

  const [event, setEvent] = useState([]);
  const [eventLoaded, setEventLoaded] = useState(false);

  const { eventId } = useParams();

  useMemo(
    () =>
      GetSalesSummaryForEvent(currentUser.uid, eventId).then((res) => {
        res.sort((a, b) => a.Cena - b.Cena);
        setTicketsLoaded(true);
        setTickets(res);
      }),
    []
  );

  useMemo(
    () =>
      GetSalesForEvent(currentUser.uid, eventId).then((res) => {
        setSalesLoaded(true);
        setSales(res);
      }),
    []
  );

  useMemo(
    () =>
      GetHostsEventDetails(eventId).then((res) => {
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
          <div>{event.NazwaW}</div>
          <div>
            <div>{event.Adres + ", " + event.Miasto + ", " + event.Kraj}</div>
            <div>
              Rozpoczęcie: {Moment(event.CzasRoz).format("DD.MM.YYYY, HH:mm")}
            </div>
            <div>
              Zakończenie: {Moment(event.CzasZak).format("DD.MM.YYYY, HH:mm")}
            </div>
          </div>
          <div>{event.OpisW}</div>
          <div style={{ border: "none", width: "70%", marginTop: "1em" }}>
            {ticketsLoaded ? (
              <table style={{ borderCollapse: "collapse" }}>
                {tickets.map((ticket) => (
                  <TicketSummary data={ticket} />
                ))}
              </table>
            ) : (
              <Loading />
            )}
          </div>
          <FlexboxSpaceBetween
            style={{ width: "70%", padding: 0, margin: 0, marginTop: "1em" }}
          >
            <div>Sprzedane bilety: </div>
            <div>{tickets.reduce((a, b) => a + b.Sprzedane, 0)}</div>
          </FlexboxSpaceBetween>
          <FlexboxSpaceBetween style={{ width: "70%", padding: 0, margin: 0 }}>
            <div>Dochód z biletów: </div>
            <div>{tickets.reduce((a, b) => a + b.Przychod, 0)}zł</div>
          </FlexboxSpaceBetween>
          {salesLoaded ? (
            <StyledButton
              onClick={() => GeneratePDF(event.NazwaW, sales, tickets)}
            >
              Wygeneruj raport sprzedażowy
            </StyledButton>
          ) : (
            <Loading/>
          )}
        </>
      ) : (
        <h1>Nic nie znaleziono.</h1>
      )}
    </DetailsPageContainer>
  );
}

export default HostEventReport;
