import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const DefaultSummary = `
  display: flex;
  padding: 1em;
  background-color: #fefefe;
  border-radius: 10px;
  color: black;
  font-weight: 500;
  border: 3px solid grey;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;

  &:nth-child(n + 2) {
    margin-top: 1em;
  }
`;

const SummaryDiv = styled.div`
  ${DefaultSummary}
`;

export const SummaryLink = styled(Link)`
  ${DefaultSummary}
`;

export default SummaryDiv;
