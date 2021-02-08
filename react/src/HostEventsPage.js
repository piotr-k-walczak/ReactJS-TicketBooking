import React, { useState, useContext, useEffect } from "react";
import EventSummary from "./EventSummary";
import Loading from "./Loading";
import { AuthContext } from "./authentication/Auth";
import { GetHostsActiveEvents } from "./CallAPI";
import { EventList, Searchbar } from "./EventPage";

function HostEventsPage(props) {
  const { onlyActive } = props;
  const { currentUser } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [eventsLoaded, setEventsLoaded] = useState(false);
  const [searchedPhrase, setSearchedPhrase] = useState("");

  useEffect(() => {
    if (currentUser) {
      GetHostsActiveEvents(currentUser.uid)
        .then((res) => {
          setEvents(res);
          setEventsLoaded(true);
        })
        .catch(() => {
          setEvents([]);
          setEventsLoaded(true);
        });
    } else {
      setEvents([]);
      setEventsLoaded(true);
    }
  }, [currentUser]);

  const activeEvents = events.filter(
    (event) =>
      !event.Zakonczone &&
      event.NazwaW.toLowerCase().includes(searchedPhrase.toLowerCase())
  );
  const inactiveEvents = events.filter(
    (event) =>
      event.Zakonczone &&
      event.NazwaW.toLowerCase().includes(searchedPhrase.toLowerCase())
  );

  return (
    <div>
      {eventsLoaded ? (
        onlyActive ? (
          <>
            {activeEvents.length > 0 ? (
              <>
                <h1>Twoje wydarzenia</h1>
                <EventList>
                  {activeEvents.map((event) => (
                    <EventSummary data={event} host />
                  ))}
                </EventList>
              </>
            ) : (
              <h1>Nie masz zadnych aktywnych wydarzeń</h1>
            )}
          </>
        ) : (
          <>
            {activeEvents.length > 0 ? (
              <>
                <h1>Twoje wydarzenia</h1>
                <Searchbar
                  searchPhrase={searchedPhrase}
                  setSearchPhrase={setSearchedPhrase}
                />
                <EventList>
                  {activeEvents.map((event) => (
                    <EventSummary data={event} host />
                  ))}
                </EventList>
              </>
            ) : (
              inactiveEvents.length == 0 && (
                <>
                  <Searchbar
                    searchPhrase={searchedPhrase}
                    setSearchPhrase={setSearchedPhrase}
                  />
                  <h1>Nie masz zadnych aktywnych wydarzeń</h1>
                </>
              )
            )}
            {inactiveEvents.length > 0 && (
              <>
                <h1>Zakończone wydarzenia</h1>
                {activeEvents.length == 0 && (
                  <Searchbar
                  searchPhrase={searchedPhrase}
                    setSearchPhrase={setSearchedPhrase}
                  />
                )}
                <EventList style={{ opacity: "0.7" }}>
                  {inactiveEvents.map((event) => (
                    <EventSummary data={event} host />
                  ))}
                </EventList>
              </>
            )}
          </>
        )
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default HostEventsPage;
