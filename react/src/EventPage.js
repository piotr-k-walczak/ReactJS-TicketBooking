import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import Event from "./EventSummary";
import { GetActiveEvents } from "./CallAPI";
import styled from "styled-components";

export const EventList = styled.div`
  width: 80%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  margin: auto;
`;

function EventPage(props) {
  const [events, setEvents] = useState([]);
  const [eventsLoaded, setEventsLoaded] = useState(false);

  const [searchPhrase, setSearchPhrase] = useState("");

  useEffect(() => {
    GetActiveEvents()
      .then((res) => {
        setEventsLoaded(true);
        setEvents(res || []);
      })
      .catch(() => {
        setEvents([]);
        setEventsLoaded(true);
      });
  }, []);

  return (
    <div>
      <h1>Nadchodzące wydarzenia</h1>
      <Searchbar searchPhrase={searchPhrase} setSearchPhrase={setSearchPhrase}/>
      <EventList>
        {eventsLoaded ? (
          events.filter(e => e.NazwaW.toLowerCase().includes(searchPhrase.toLowerCase())).map((event) => {
            return <Event data={event} key={event.IdW} />;
          })
        ) : (
          <Loading />
        )}
      </EventList>
    </div>
  );
}

const StyledSearchInput = styled.input`
  border: 0;
  border-bottom: 2px solid grey;
  color: white;
  background: transparent;
  text-align: center;
  font-size: 1em;
  margin-bottom: 1em;

  &:focus, &:active {
    outline: none;
    border: 0;
    border-bottom: 2px solid grey;
  }
`

export function Searchbar(props){
  const {searchPhrase, setSearchPhrase, placeholder} = props;

  return <StyledSearchInput type="text" placeholder={placeholder || "Znajdź wydarzenie"} value={searchPhrase} onChange={e => setSearchPhrase(e.target.value)}/>
}

export default EventPage;
