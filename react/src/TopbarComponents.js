import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const TopbarDiv = styled.div`
  width: 100%;
  padding: 0.8em 0;
  background: rgb(76, 70, 104);
  border-bottom: 1px solid #aaa;
  position: sticky;
  top: 0;
  font-variant: small-caps;
  font-weight: 500;
  color: white;
  z-index: 5000;
`;

export const TopbarContainer = styled.div`
  display: flex;
  margin: auto 2em;
  align-items: center;
  justify-content: space-between;
`;

const StyledLogo = styled(Link)`
  font-weight: 600;
  font-size: 1.2em;
  &:hover {
    opacity: 0.8;
  }
`;

export function TopbarLogo(props) {
  return (
    <StyledLogo to="/" style={{ marginRight: "1em" }}>
      Bilety.PL
    </StyledLogo>
  );
}
