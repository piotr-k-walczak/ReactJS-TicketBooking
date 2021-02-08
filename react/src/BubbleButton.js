import { Link } from "react-router-dom";
import styled from "styled-components";

const DefaultBubbleLink = styled(Link)`
  height: 80px;
  width: 80px;
  border-radius: 10px;
  border: ${(props) => props.border || "3px solid white"};
  border-color: ${(props) => props.bordercolor || "white"};
  position: fixed;
  bottom: 40px;
  right: 40px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.backgroundcolor || "grey"};
  color: ${(props) => props.color || "white"};
  font-size: ${(props) => props.fontSize || "1em"};
  font-variant: small-caps;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  z-index: 100;
  transition: border-radius 0.2s;

  &:hover {
    opacity: 0.8;
    border-radius: 30px;
  }
`;

export default DefaultBubbleLink;
