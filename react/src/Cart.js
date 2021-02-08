import React, { useMemo, useState } from "react";
import { GetTicketDetails } from "./CallAPI";

export const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const defaultTicket = (id) => {
    return {
      ticketId: id,
      amount: 1,
    };
  };

  const [tickets, setTickets] = useState([...LoadCart()]);
  const [metadata, setMetadata] = useState({});

  useMemo(() => SaveCart(tickets), [tickets]);

  useMemo(() => {
    tickets.forEach((ticket) => {
      GetTicketDetails(ticket.ticketId).then((res) => {
        SetMetadata(ticket.ticketId, res[0]);
      });
    });
  }, [tickets]);

  function AddTicket(ticketId) {
    const foundIndex = tickets.findIndex((t) => t.ticketId == ticketId);
    if (foundIndex >= 0) {
      IncreaseAmount(ticketId);
    } else {
      setTickets([...tickets, defaultTicket(ticketId)]);
    }
  }

  function RemoveTicket(ticketId) {
    setTickets(tickets.filter((t) => t.ticketId != ticketId));
  }

  function SetTicketAmount(ticketId, amount) {
    const foundIndex = tickets.findIndex((t) => t.ticketId == ticketId);
    if (foundIndex >= 0) {
      const copiedTickets = [...tickets];
      copiedTickets[foundIndex].amount = amount;
      setTickets(copiedTickets);
    }
  }

  function IncreaseAmount(ticketId) {
    const foundIndex = tickets.findIndex((t) => t.ticketId == ticketId);
    if (foundIndex >= 0) {
      const copiedTickets = [...tickets];
      copiedTickets[foundIndex].amount += 1;
      if (
        copiedTickets[foundIndex].amount >
        (metadata[ticketId].MaksIlosc ? metadata[ticketId].MaksIlosc : Infinity)
      ) {
        copiedTickets[foundIndex].amount = metadata[ticketId].MaksIlosc;
      }
      setTickets(copiedTickets);
    }
  }

  function DecreaseAmount(ticketId) {
    const foundIndex = tickets.findIndex((t) => t.ticketId == ticketId);
    if (foundIndex >= 0) {
      if (tickets[foundIndex].amount == 1) {
        RemoveTicket(ticketId);
      } else {
        const copiedTickets = [...tickets];
        copiedTickets[foundIndex].amount -= 1;
        setTickets(copiedTickets);
      }
    }
  }

  function SetMetadata(ticketId, meta) {
    const newMetadata = metadata;
    newMetadata[ticketId] = meta;
    setMetadata(newMetadata);
  }

  return (
    <CartContext.Provider
      value={{
        tickets,
        metadata,
        setTickets,
        AddTicket,
        RemoveTicket,
        IncreaseAmount,
        DecreaseAmount,
        SetMetadata,
        SetTicketAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function SaveCart(content) {
  localStorage.setItem("cart", JSON.stringify(content));
}

export function LoadCart() {
  const loaded = localStorage.getItem("cart");
  if (loaded) return JSON.parse(loaded);
  else return [];
}

export function CalcTotal(tickets, metadata) {
  return tickets.reduce(
    (a, b) =>
      a +
      (metadata
        ? metadata[b.ticketId]
          ? metadata[b.ticketId].Cena
            ? metadata[b.ticketId].Cena
            : 0
          : 0
        : 0) *
        b.amount,
    0
  );
}

export default CartProvider;
