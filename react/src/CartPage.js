import React, { useContext, useState } from "react";
import { CartTicket } from "./CartTicket";
import { useHistory } from "react-router-dom";
import { CartContext, CalcTotal } from "./Cart";
import { StyledButton } from "./styled_components/StyledButtons";
import { PurchaseTickets } from "./CallAPI";
import { AuthContext } from "./authentication/Auth";

export function CartPage(props) {
  const { tickets, setTickets } = useContext(CartContext);

  return (
    <div>
      <h1>Koszyk</h1>
      {tickets && tickets.length > 0 ? <FullCart /> : <EmptyCart />}
    </div>
  );
}

function FullCart(props) {
  const { tickets, setTickets, metadata } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();
  const [error, setError] = useState(false);

  function RequestPurchase(uid, tickets) {
    PurchaseTickets(uid, tickets).then((res) => {
      if (res.errno) {
        setError(true);
      } else {
        setTickets([]);
        history.push("/purchase");
      }
    });
  }

  function PaymentError(props) {
    <h1 style={{ color: "red" }}>Nie udalo sie dokonac zakupu.</h1>;
  }

  function Total(props) {
    const { tickets, metadata } = props;
    return (
      <h1>Kwota do zapłaty: {CalcTotal(tickets, metadata).toFixed(2)} zł</h1>
    );
  }

  return (
    <>
      <Tickets />
      <Total tickets={tickets} metadata={metadata} />
      {error && <PaymentError />}
      <StyledButton
        backgroundcolor="#5dbb63"
        onClick={() => RequestPurchase(currentUser.uid, tickets)}
      >
        Zapłać
      </StyledButton>
    </>
  );
}

function EmptyCart(props) {
  return <h1>Jest Pusty</h1>;
}

function Tickets(props) {
  const { tickets, metadata } = useContext(CartContext);

  var index = -1;
  return (
    <div>
      {tickets.map((t) => {
        index++;
        return (
          <CartTicket
            data={t}
            metadata={metadata[t.ticketId]}
            id={index}
            key={t.ticketId}
          />
        );
      })}
    </div>
  );
}

export default CartPage;
