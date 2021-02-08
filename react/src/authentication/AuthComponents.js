import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const AuthInput = styled.input`
  background: transparent;
  border-radius: 0;
  border: none;
  border-bottom: 2px solid grey;
  color: black;
  font-weight: 500;
  font-size: 1em;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  text-align: center;
  margin: 8px;
  padding: 5px;
  text-align: center;
  &::placeholder {
    text-align: center;
  }
  &:focus,
  &:active,
  &:hover {
    outline: none;
  }
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 280px;
  text-align: center;
  padding: 20px;
  border-radius: 20px;
  background-color: #fefefe;
  border: 3px solid grey;
`;
