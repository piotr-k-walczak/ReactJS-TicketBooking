import React, { useContext, useState } from "react";
import { AuthContext } from "./authentication/Auth";
import { CartContext } from "./Cart";
import BubbleLink from "./BubbleButton";

function CartButton(props) {
  const { currentUser } = useContext(AuthContext);
  const { tickets } = useContext(CartContext);

  return (
    currentUser && (
      <BubbleLink
        to="/cart"
        border="3px solid"
        backgroundcolor="orange"
        fontSize={tickets.length > 0 ? "1.6em" : "1em"}
      >
        {tickets.length > 0
          ? tickets.reduce((a, b) => a + b.amount, 0)
          : "Koszyk"}
      </BubbleLink>
    )
  );
}

export default CartButton;
