import React from "react";
import styled from "styled-components";
import { StyledTag } from "./styled_components/StyledButtons";

const Tag = styled.div`
  padding: ${(props) => (props.thick ? ".4em 1em" : ".2em .7em")};
  font-size: ${(props) => (props.thick ? "1em" : ".7em")};
  border-radius: 10px;
  color: ${(props) => props.secondaryColor || "white"};
  background-color: ${(props) => props.backgroundcolor || "blue"};
`;

function StatusTag(props) {
  if (props.thick) {
    return <StyledTag {...props}>{props.message}</StyledTag>;
  } else {
    return <Tag {...props}>{props.message}</Tag>;
  }
}

export function CancelledTag(props) {
  return (
    <StatusTag {...props} message={"Anulowano"} backgroundcolor="#d14e45" />
  );
}

export function InProgressTag(props) {
  return (
    <StatusTag {...props} message={"W trakcie"} backgroundcolor="#47d435" />
  );
}

export function PastTag(props) {
  return (
    <StatusTag {...props} message={"Zakończono"} backgroundcolor="#4d9dd6" />
  );
}

export default StatusTag;
