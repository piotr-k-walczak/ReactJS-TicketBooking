import React, { useCallback, useContext, useState } from "react";
import { withRouter, Redirect } from "react-router-dom";
import app from "./base";
import { AuthContext } from "./Auth";
import { AuthInput, AuthButton, AuthForm } from "./AuthComponents";
import Loading from "../Loading";
import { StyledButton } from "../styled_components/StyledButtons";

const Login = ({ history }) => {
  const [error, setError] = useState("");
  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      if (!email.value || !password.value) {
        setError("Nie wszystkie pola zostały wypełnione.");
        return;
      }
      try {
        await app
          .auth()
          .signInWithEmailAndPassword(email.value, password.value)
          .then(() => history.push("/"))
          .catch((error) => {
            setError("Nieprawidłowy login lub hasło.");
          });
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  const { currentUser, pending } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  if (pending) {
    return <Loading />;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <AuthForm onSubmit={handleLogin}>
        <AuthInput name="email" type="email" placeholder="Email" />
        <AuthInput name="password" type="password" placeholder="Hasło" />
        {error != "" && (
          <span style={{ color: "red", margin: ".5em 0" }}>{error}</span>
        )}
        <StyledButton type="submit" backgroundcolor="darkcyan">
          Zaloguj się
        </StyledButton>
      </AuthForm>
    </div>
  );
};

export default withRouter(Login);
