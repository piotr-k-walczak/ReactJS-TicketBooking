import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import ReactPDF, { PDFDownloadLink } from "@react-pdf/renderer";

const DefaultButtonStyle = `
    border-radius: 8px;
    border: 2px solid #fefefe;
    padding: 0.55em 2em;
    font-size: 0.9em;
    text-align: center;
    outline: none;
    cursor: pointer;
    font-variant: small-caps;
    font-weight: 500;
    color: white;
    transition: border-radius 0.2s;

    &:hover {
    opacity: 0.8;
    border-radius: 30px;
    }
`;

export const StyledLink = styled(Link)`
  background-color: ${(props) => props.backgroundcolor || "green"};
  ${DefaultButtonStyle}
`;

export const StyledButton = styled.button`
  background-color: ${(props) => props.backgroundcolor || "green"};
  ${DefaultButtonStyle}
`;

export const StyledTag = styled.div`
  background-color: ${(props) => props.backgroundcolor || "green"};
  ${DefaultButtonStyle}
`;

export const StyledPdfLink = styled(PDFDownloadLink)`
  background-color: ${(props) => props.backgroundcolor || "green"};
  ${DefaultButtonStyle}
`;

export const CleanButton = styled.button`
  border: none;
  background-color: transparent;
  outline: none;
  padding: 0.2em 0.5em;
  border-radius: 2px;
  font-size: 0.8em;
  cursor: pointer;

  &:hover {
    opacity: 0.4;
  }
`;
