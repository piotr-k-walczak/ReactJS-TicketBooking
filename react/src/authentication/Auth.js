import React, { useState, useEffect } from "react";
import app from "./base";
import { IsHost } from "../CallAPI";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [isHost, setIsHost] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        IsHost(user.uid).then((res) => {
          setIsHost(res[0].isHost);
          setPending(false);
        });
      } else {
        setIsHost(false);
        setPending(false);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, pending, isHost }}>
      {children}
    </AuthContext.Provider>
  );
};
