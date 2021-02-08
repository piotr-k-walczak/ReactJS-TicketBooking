import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./authentication/Auth";
import { GetUserTickets } from "./CallAPI";
import Ticket from "./Ticket";
import Loading from "./Loading";
import { ActivityStates, GetActivityState } from "./ActivityState";
import { Searchbar } from "./EventPage";

function TicketsPage(props) {
  const [tickets, setTickets] = useState([]);
  const [ticketsLoaded, setTicketsLoaded] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [searchedPhrase, setSearchPhrase] = useState("");

  useEffect(() => {
    GetUserTickets(currentUser.uid)
      .then((res) => {
        setTicketsLoaded(true);
        setTickets(res);
      })
      .catch(() => {
        setTicketsLoaded(true);
        setTickets([]);
      });
  }, [currentUser]);

  const activeTickets = tickets.filter(
    (ticket) => GetActivityState(ticket) <= ActivityStates.acitve
  );
  const inactiveTickets = tickets.filter(
    (ticket) => GetActivityState(ticket) >= ActivityStates.cancelled
  );

  return !ticketsLoaded ? (
    <Loading />
  ) : (
    <div>
      {(inactiveTickets.length == 0 && activeTickets.length == 0) ||
      (activeTickets.length == 0 && !props.showPast) ? (
        <h1>Nie posiadasz zadnych biletów</h1>
      ) : (
        <>
          <h1>Moje bilety</h1>
          <Searchbar searchedPhrase={searchedPhrase} setSearchPhrase={setSearchPhrase} placeholder="Znajdź bilet"/>
          <TicketList>
            {activeTickets.filter(ticket => ticket.NazwaW.toLowerCase().includes(searchedPhrase.toLowerCase())).map((ticket) => (
              <Ticket data={ticket} />
            ))}
          </TicketList>
        </>
      )}
      {props.showPast && inactiveTickets.length > 0 && (
        <>
          <h1>Nieaktualne bilety</h1>
          <TicketList past>
            {inactiveTickets.filter(ticket => ticket.NazwaW.toLowerCase().includes(searchedPhrase.toLowerCase())).map((ticket) => (
              <Ticket data={ticket} />
            ))}
          </TicketList>
        </>
      )}
    </div>
  );
}

export function TicketList(props) {
  return <div style={props.past && { opacity: "60%" }}>{props.children}</div>;
}

export default TicketsPage;
