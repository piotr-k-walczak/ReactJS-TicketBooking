import React, { useContext, useState, useEffect } from "react";
import { ReactComponent as TicketIcon } from "./icons/movie-tickets.svg";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "./authentication/Auth";
import Moment from "moment";
import Loading from "./Loading";
import { GetUserTicketDetails, CancelTicket } from "./CallAPI";
import { CancelledTag, InProgressTag, PastTag } from "./StatusTag";
import styled from "styled-components";
import { DetailsPageContainer } from "./DetailsPage";
import { StyledButton } from "./styled_components/StyledButtons";
import { ActivityStates, GetActivityState } from "./ActivityState";

function ButtonOrTag(props) {
  const { activityState, onClick } = props;
  return activityState === ActivityStates.acitve ? (
    <InProgressTag thick />
  ) : activityState === ActivityStates.cancelled ? (
    <CancelledTag thick />
  ) : activityState === ActivityStates.ended ? (
    <PastTag thick />
  ) : (
    <StyledButton onClick={onClick} backgroundcolor="orangered">
      Anuluj bilet
    </StyledButton>
  );
}

export function TicketPage(props) {
  const { ticketId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [ticket, setTicket] = useState(-1);
  const [ticketLoaded, setTicketLoaded] = useState(false);

  useEffect(() => {
    GetUserTicketDetails(currentUser.uid, ticketId)
      .then((res) => {
        console.log(res);
        setTicketLoaded(true);
        setTicket(res[0]);
      })
      .catch(() => {
        setTicketLoaded(true);
        setTicket([]);
      });
  }, []);

  function OnClick() {
    CancelTicket(currentUser.uid, ticketId).then((res) => {
      if (res.errno || (res.affectedRows && res.affectedRows === 0)) {
        props.history.go(0);
        window.alert("Coś poszło nie tak");
      } else props.history.push("/mytickets");
    });
  }

  const activityState = GetActivityState(ticket);

  return (
    <DetailsPageContainer>
      {ticketLoaded ? (
        <>
          <TicketIcon />
          <Link to={"/event/" + ticket.IdW} className="title">
            {ticket.NazwaW}
          </Link>
          <div>{ticket.NazwaB}</div>
          <div>
            {ticket.IloscB && <div>Ilość: {ticket.IloscB}</div>}
            {ticket.CenaZakupu && <div>Cena biletu: {ticket.CenaZakupu.toFixed(2)} zł</div>}
            {ticket.CenaZakupu && ticket.IloscB && <div>Łączny koszt: {(ticket.CenaZakupu * ticket.IloscB).toFixed(2)} zł</div>}
          </div>
          <div>
            <div>
              {ticket.Adres + ", " + ticket.Miasto + ", " + ticket.Kraj}
            </div>
            <div>
              Rozpoczęcie: {Moment(ticket.CzasRoz).format("DD.MM.YYYY, HH:mm")}
            </div>
            <div>
              Zakończenie: {Moment(ticket.CzasZak).format("DD.MM.YYYY, HH:mm")}
            </div>
          </div>
          <div className="event-details">{ticket.OpisW}</div>

          <ButtonOrTag
            activityState={activityState}
            onClick={OnClick}
            style={{ marginTop: "1em" }}
          />
        </>
      ) : (
        <Loading />
      )}
    </DetailsPageContainer>
  );
}

export default TicketPage;