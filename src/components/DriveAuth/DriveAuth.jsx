import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import "./DriveAuth.css";

const CLIENT_ID =
  "1090649112825-mf2qb2ssf76pspvfhf1gc4skgbedv93o.apps.googleusercontent.com";
const API_KEY = "AIzaSyCdiaGi10jCq4n9L9hKHfYxOljvoD45PCQ";
const SCOPE = "https://www.googleapis.com/auth/drive.file";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];

const DriveAuth = ({ setAuthenticated }) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    function start() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPE,
          discoveryDocs: DISCOVERY_DOCS,
        })
        .then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          authInstance.isSignedIn.listen(setAuthenticated);
          setAuthenticated(authInstance.isSignedIn.get());

          if (authInstance.isSignedIn.get()) {
            const user = authInstance.currentUser.get();
            setUserName(user.getBasicProfile().getName());
          }
        });
    }
    gapi.load("client:auth2", start);
  }, [setAuthenticated]);

  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn().then(() => {
      const user = gapi.auth2.getAuthInstance().currentUser.get();
      setUserName(user.getBasicProfile().getName());
    });
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      setUserName("");
    });
  };


  return (
    <div className="drive-auth">
      <h1>Galería de Fotos</h1>
      <div className={`drive-auth-buttons ${userName ? "column" : ""}`}>
      {userName ? <h2>Bienvenido, {userName}!</h2> : <button onClick={handleSignIn}>Iniciar sesión con Google</button>}
        <button onClick={handleSignOut}>Cerrar sesión</button>
      </div>
    </div>
  );
};

export default DriveAuth;
