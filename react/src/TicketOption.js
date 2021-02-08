import React, { useContext } from "react";
import { AuthContext } from "./authentication/Auth";
import { CartContext } from "./Cart";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

export const TicketOptionDiv = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
  padding: 0.1em;

  & button {
    border-radius: 100px;
    background-color: rgb(74, 74, 216);
    color: white;
    border: none;
    padding: 0.3em 0.7em;
    margin-left: 0.8em;
    font-size: 0.9em;
  }

  & button:hover {
    background-color: rgb(56, 56, 184);
    cursor: pointer;
  }
`;

export const TicketSummaryRow = styled.tr`
  font-size: 0.9em;
  padding: 0.1em;
`;

function TicketOption(props) {
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);
  const { AddTicket } = useContext(CartContext);
  const { data } = props;

  return (
    <TicketOptionDiv {...props}>
      <div>{data.NazwaB}</div>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        {data.MaksIlosc && data.PozostaleBilety > 0 && (
          <div style={{ color: "orangered", marginRight: ".8em" }}>
            {"Pozostało " + data.PozostaleBilety + " sztuk"}
          </div>
        )}
        <div>{data.Cena.toFixed(2)} zł</div>
        {data.PozostaleBilety > 0 ? (
          <button
            onClick={() =>
              currentUser ? AddTicket(data.IdB) : history.push("/login")
            }
          >
            Dodaj do koszyka
          </button>
        ) : (
          <button style={{ backgroundColor: "grey" }}>Wyprzedano</button>
        )}
      </div>
    </TicketOptionDiv>
  );
}

export function TicketSummary(props) {
  const { data } = props;

  const TableField = styled.td`
    padding: 0.1em 1em;
    border-right: 1px solid grey;
    font-size: 0.9em;
    &:last-child {
      border: none;
      padding: 0;
      padding-left: 1em;
    }
    &:first-child {
      padding: 0;
      padding-right: 1em;
    }
  `;

  return (
    <tr style={{ padding: "0.1em", textAlign: "right" }} {...props}>
      <TableField style={{ textAlign: "left", width: "50%" }}>
        {data.NazwaB}
      </TableField>
      <TableField style={{ whiteSpace: "nowrap" }}>
        {data.Cena.toFixed(2)} zł
      </TableField>
      <TableField style={{ width: "50%" }}>
        Sprzedano:{" "}
        {data.Sprzedane ||
          0 +
            (data.MaksIlosc &&
              " na " +
                data.MaksIlosc +
                " (" +
                ((data.Sprzedane / data.MaksIlosc) * 100).toFixed(2) +
                "%)")}
      </TableField>
    </tr>
  );
}

export default TicketOption;
