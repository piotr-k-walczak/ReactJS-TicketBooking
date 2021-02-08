import React, { useContext, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "./authentication/Auth";
import { AddNewEventWithTickets } from "./CallAPI";
import { DetailsFormContainer } from "./DetailsPage";
import { StyledInput } from "./styled_components/StyledInputs";
import { StyledButton } from "./styled_components/StyledButtons";

export function AddEventPage(props) {
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();
  const [numberOfTickets, setNumberOfTickets] = useState(1);

  const emptyRowData = {
    name: "",
    price: null,
    maxAmount: null,
  };

  const [ticketData, setTicketData] = useState([emptyRowData]);

  useMemo(() => {
    if (ticketData.length < numberOfTickets) {
      setTicketData([...ticketData, emptyRowData]);
    } else if (ticketData.length > numberOfTickets) {
      setTicketData(ticketData.slice(0, numberOfTickets - 1));
    }
  }, [numberOfTickets]);

  function SingleTicketRow(props) {
    const { index } = props;
    const [name, setName] = useState(
      ticketData.length > index ? ticketData[index].name : ""
    );
    const [price, setPrice] = useState(
      ticketData.length > index ? ticketData[index].price : null
    );
    const [maxAmount, setMaxAmount] = useState(
      ticketData.length > index ? ticketData[index].maxAmount : null
    );

    useMemo(() => {
      if (ticketData[index]) ticketData[index].name = name;
    }, [name]);

    useMemo(() => {
      if (ticketData[index]) ticketData[index].price = price;
    }, [price]);

    useMemo(() => {
      if (ticketData[index]) ticketData[index].maxAmount = maxAmount;
    }, [maxAmount]);

    return (
      <tr>
        <td>
          <StyledInput
            type="text"
            placeholder="Nazwa biletu*"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </td>
        <td>
          <StyledInput
            type="number"
            placeholder="Cena*"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </td>
        <td>
          <StyledInput
            type="number"
            placeholder="Nakład"
            min="0"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />
        </td>
      </tr>
    );
  }

  function TicketTable(props) {
    const { number } = props;

    var rows = [];
    for (var i = 0; i < number; i++) {
      rows.push(<SingleTicketRow index={i} />);
    }

    return <table>{rows.map((r) => r)}</table>;
  }

  const [incorrectDataAlert, setIncorrectDataAlert] = useState(false);

  function IsCompleted() {
    return (
      name && description && startDate && endDate && address && city && country
    );
  }

  function AreTicketsComplete() {
    return ticketData.every((ticket) => ticket.name && ticket.price > 0);
  }

  function AreTickets() {
    return ticketData.length > 0;
  }

  function AreDatesOK() {
    return now <= startDate <= endDate <= maxDate;
  }

  function OnSubmit(e) {
    e.preventDefault();
    if (!IsCompleted()) {
      setIncorrectDataAlert("Nie wszystkie wymagane pola zostały wypełnione");
    } else if (!AreTickets()) {
      setIncorrectDataAlert("Nie stworzono żadnych biletów");
    } else if (!AreTicketsComplete()) {
      setIncorrectDataAlert("Dane biletów są niekompletne");
    } else if (!AreDatesOK()) {
      setIncorrectDataAlert("Podane daty są niewłaściwe");
    } else {
      console.log(ticketData)
      AddNewEventWithTickets(
        currentUser.uid,
        name,
        description,
        imgUrl,
        startDate,
        endDate,
        address,
        city,
        country,
        ticketData
      )
        .then((res) => {
          console.log(res)
          if (res[0] && res[0].affectedRows > 0) {
            history.push("/");
          }
          else {
            setIncorrectDataAlert("Coś poszło nie tak");
          }
        })
        .catch((err) => console.log(err));
      setIncorrectDataAlert(null);
    }
  }

  const noImgUrl =
    "https://dlaziemi.org/pl/wp-content/themes/garden/images/noimage.jpg";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateAlert, setDateAlert] = useState(null);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const now = new Date();
  const maxDate = new Date(now.getFullYear() + 5, now.getMonth(), now.getDay());

  const setEndDateWithCheck = (date) => {
    if (new Date(date) < now)
      setEndDate(now.toISOString().slice(0, now.toISOString().length - 8));
    else if (new Date(date) > maxDate)
      setEndDate(maxDate.toISOString().slice(0, now.toISOString().length - 8));
    else setEndDate(date);
    checkDates();
  };

  const setStartDateWithCheck = (date) => {
    if (new Date(date) < now)
      setStartDate(now.toISOString().slice(0, now.toISOString().length - 8));
    else if (new Date(date) > maxDate)
      setStartDate(
        maxDate.toISOString().slice(0, now.toISOString().length - 8)
      );
    else setStartDate(date);
    checkDates();
  };

  function checkDates() {
    if (startDate >= endDate)
      setDateAlert("Data zakończenia musi być późniejsza niż data rozpoczęcia");
    else setDateAlert(null);
  }

  return (
    <DetailsFormContainer onSubmit={(e) => OnSubmit(e)}>
      <div>
        <img
          src={imgUrl ? imgUrl : noImgUrl}
          style={{ width: "400px", height: "200px", objectFit: "cover" }}
        />
      </div>
      <div>
        <StyledInput
          type="url"
          placeholder="Url Obrazka"
          onChange={(e) => {
            setImgUrl(e.target.value);
          }}
        />
      </div>
      <div>
        <StyledInput
          type="text"
          className="title"
          style={{ margin: ".5em 0 0" }}
          placeholder="Nazwa wydarzenia*"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className="ticket-details">
        <div>
          Rozpoczęcie:*{" "}
          <StyledInput
            type="datetime-local"
            min={now.toISOString().slice(0, now.toISOString().length - 8)}
            max={maxDate.toISOString().slice(0, now.toISOString().length - 8)}
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
            onSubmit={() => setStartDateWithCheck(startDate)}
            onBlur={() => setStartDateWithCheck(startDate)}
          />
        </div>
        <div>
          Zakończenie:*{" "}
          <StyledInput
            type="datetime-local"
            min={now.toISOString().slice(0, now.toISOString().length - 8)}
            max={maxDate.toISOString().slice(0, now.toISOString().length - 8)}
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
            onSubmit={() => setEndDateWithCheck(endDate)}
            onBlur={() => setEndDateWithCheck(endDate)}
          />
        </div>
        {dateAlert != "" && (
          <span style={{ color: "red", margin: ".5em 0" }}>{dateAlert}</span>
        )}
      </div>
      <div className="ticket-details">
        <div>
          <StyledInput
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            placeholder="Adres*"
          />
        </div>
        <div>
          <StyledInput
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
            placeholder="Miasto*"
          />
        </div>
        <div>
          <StyledInput
            type="text"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
            }}
            placeholder="Państwo*"
          />
        </div>
      </div>
      <div>
        <div>Opis</div>
        <textarea
          className="event-details"
          style={{ width: "50em", height: "8em" }}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
      </div>
      <div>
        Ilość biletów:{" "}
        <StyledInput
          type="number"
          min="1"
          placeholder="1"
          value={numberOfTickets}
          onChange={(e) => {
            setNumberOfTickets(e.target.value);
          }}
          onBlur={() => setNumberOfTickets(Math.max(numberOfTickets, 1))}
        />
      </div>
      <TicketTable number={numberOfTickets} />
      {incorrectDataAlert && (
        <div>
          <span style={{ color: "red" }}>{incorrectDataAlert}</span>
        </div>
      )}
      <div>
        <StyledButton type="submit">Dodaj wydarzenie</StyledButton>
      </div>
      <span style={{ fontSize: "0.8", color: "grey" }}>* Pola wymagane</span>
    </DetailsFormContainer>
  );
}

export default AddEventPage;
