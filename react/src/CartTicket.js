import React, { useContext, useMemo } from "react";
import { ReactComponent as TicketIcon } from "./icons/movie-tickets.svg";
import { Link } from "react-router-dom";
import Moment from "moment";
import styled from "styled-components";
import { CartContext } from "./Cart";
import Flexbox from "./styled_components/Flexbox";
import { CleanButton } from "./styled_components/StyledButtons";

const StyledTicket = styled.div`
  display: flex;
  padding: 1em;
  background-color: #fefefe;
  border-radius: 10px;
  color: black;
  font-weight: 500;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  border: 3px solid grey;
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

const FlexboxSpaceBetween = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
`;

export function CartTicket(props) {
  const { data, metadata } = props;
  const {
    RemoveTicket,
    DecreaseAmount,
    IncreaseAmount,
    SetTicketAmount,
  } = useContext(CartContext);

  useMemo(() => {
    if (data && metadata) {
      if (data.amount > metadata.PozostaleBilety) {
        SetTicketAmount(data.ticketId, metadata.PozostaleBilety);
      }
    }
  }, [data, metadata]);

  return (
    <StyledTicket>
      {!metadata ? (
        <div>Nie udało się pobrać danych biletu. Spróbuj ponownie.</div>
      ) : (
        <FlexboxSpaceBetween>
          <div style={{ display: "flex" }}>
            <TicketIcon />
            <div className="ticket-summary">
              <Link to={"/event/" + metadata.IdW} className="title">
                <Flexbox>
                  <span>{metadata.NazwaW}</span>{" "}
                </Flexbox>
              </Link>
              <div className="content">
                <div>{metadata.NazwaB}</div>
                <div>
                  {metadata.Adres +
                    ", " +
                    metadata.Miasto +
                    ", " +
                    metadata.Kraj}
                </div>
                <div>
                  Rozpoczęcie: {Moment(metadata.CzasRoz).format("DD.MM.YYYY")}
                </div>
                <div>
                  Rozpoczęcie: {Moment(metadata.CzasZak).format("DD.MM.YYYY")}
                </div>
                <div>Cena: {metadata.Cena.toFixed(2)} zł</div>
                <div>
                  <Flexbox>
                    <div>Ilość: </div>
                    {data.amount > 1 ? (
                      <CleanButton onClick={() => DecreaseAmount(metadata.IdB)}>
                        -
                      </CleanButton>
                    ) : (
                      <CleanButton />
                    )}
                    <div>{data.amount}</div>
                    {data.amount < metadata.PozostaleBilety && (
                      <CleanButton onClick={() => IncreaseAmount(metadata.IdB)}>
                        +
                      </CleanButton>
                    )}
                  </Flexbox>
                </div>
                <div>
                  Łączna cena: {(data.amount * metadata.Cena).toFixed(2)} zł
                </div>
              </div>
            </div>
          </div>
          <div onClick={(e) => RemoveTicket(metadata.IdB)}>
            <CleanButton
              style={{ fontSize: "1.2em", fontWeight: "600", color: "grey" }}
            >
              X
            </CleanButton>
          </div>
        </FlexboxSpaceBetween>
      )}
    </StyledTicket>
  );
}

export default CartTicket;
