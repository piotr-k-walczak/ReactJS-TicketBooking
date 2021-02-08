import { Link } from "react-router-dom";
import styled from "styled-components";

const DetailsPageStyle = `
display: flex;
padding: 3em;
background-color: #fefefe;
border: 3px solid grey;
border-radius: 15px;
color: black;
font-weight: 500;
justify-content: stretch;
align-items: center;
max-width: 1000px;
margin: auto;
flex-direction: column;

& a {
  color: black;
}

& a:hover {
  color: #555;
}

& > div {
  margin: 8px;
}

& .title {
  font-size: 2em;
  margin-top: 1em;
}

& .event-details {
  margin: 1em 0;
  overflow-wrap: break-word;
  word-break: break-all;
}

& svg {
  width: 6em;
  height: 6em;
  margin-bottom: 1em;
}
`;

export const DetailsPageContainer = styled.div`
  ${DetailsPageStyle}
`;

export const DetailsFormContainer = styled.form`
  ${DetailsPageStyle}
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-variant: small-caps;
`;

export const Title = styled(Link)`
  font-size: 2em;
`;

export const Details = styled.div``;

export const SvgImage = styled.svg`
  width: 6em;
  height: 6em;
  margin-bottom: 1em;
`;

export const Description = styled.div`
  margin: 1em 0;
  overflow-wrap: break-word;
  word-break: break-all;
`;

export default DetailsPageContainer;
