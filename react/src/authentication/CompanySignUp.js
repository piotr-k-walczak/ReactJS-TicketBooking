import React, { useCallback, useContext, useState } from "react";
import { withRouter, Redirect } from "react-router-dom";
import app from "./base";
import { AuthContext } from "./Auth";
import { CreateNewCorporateUser } from "../CallAPI";
import { AuthInput, AuthButton, AuthLink, AuthForm } from "./AuthComponents";
import Loading from "../Loading";
import { StyledText } from "../styled_components/StyledHeaders";
import { StyledButton, StyledLink } from "../styled_components/StyledButtons";

const CompanySignUp = ({ history }) => {
  const { currentUser, pending } = useContext(AuthContext);
  const [error, setError] = useState("");

  const now = new Date();
  const minBirthday = new Date(
    now.getFullYear() - 18,
    now.getMonth(),
    now.getDay()
  );

  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      const {
        name,
        surname,
        email,
        password,
        repassword,
        birthdate,
        companyName,
      } = event.target.elements;
      try {
        if (password.value != repassword.value) {
          setError("Hasła muszą być takie same.");
          return;
        }
        if (
          !name.value ||
          !surname.value ||
          !companyName.value ||
          !email.value ||
          !password.value ||
          !repassword.value ||
          !birthdate.value
        ) {
          setError("Nie wszystkie pola zostały wypełnione.");
          return;
        }

        app
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value)
          .then((user) => {
            CreateNewCorporateUser(
              user.user.uid,
              name.value,
              surname.value,
              birthdate.value,
              companyName.value
            );
          })
          .then(() => history.push("/"))
          .catch((error) => {
            switch (error.code) {
              case "auth/email-already-in-use":
                setError("Email jest juz uzywany.");
                break;
              case "auth/invalid-email":
                setError("Niewłaściwy email.");
                break;
              case "auth/operation-not-allowed":
                setError("Coś poszło nie tak, spróbuj ponownie.");
                break;
              case "auth/weak-password":
                setError(
                  "Hasło jest za słabe. Dodaj dodatkowe znaki, w tym cyfry i znaki specjalne."
                );
                break;
              default:
                setError("Coś poszło nie tak, spróbuj ponownie.");
                break;
            }
          });
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

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
        <AuthInput name="name" type="text" placeholder="Imię" />
        <AuthInput name="surname" type="text" placeholder="Nazwisko" />
        <AuthInput name="companyName" type="text" placeholder="Nazwa Firmy" />
        <AuthInput name="email" type="email" placeholder="Email" />
        <AuthInput name="password" type="password" placeholder="Hasło" />
        <AuthInput
          name="repassword"
          type="password"
          placeholder="Powtórz Hasło"
        />
        <div
          style={{
            border: "2px solid #999",
            borderRadius: "10px",
            padding: "1em .5em .5em .5em",
            margin: ".3em",
          }}
        >
          <StyledText>Data urodzenia</StyledText>
          <AuthInput
            type="date"
            name="birthdate"
            min="1900-01-01"
            max={minBirthday.toISOString().split("T")[0]}
          />
        </div>
        {error != "" && (
          <span style={{ color: "red", margin: ".5em 0" }}>{error}</span>
        )}
        <StyledButton type="submit" backgroundcolor="slateblue">
          Zarejestruj się
        </StyledButton>
        <StyledLink to="/signup">Jesteś gościem?</StyledLink>
      </AuthForm>
    </div>
  );
};

export default withRouter(CompanySignUp);
