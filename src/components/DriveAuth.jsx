import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import "./styles/DriveAuth.css";

const CLIENT_ID =
  "1090649112825-mf2qb2ssf76pspvfhf1gc4skgbedv93o.apps.googleusercontent.com";
const API_KEY = "AIzaSyCdiaGi10jCq4n9L9hKHfYxOljvoD45PCQ";
const SCOPE = "https://www.googleapis.com/auth/drive.file";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];

const DriveAuth = ({ setAuthenticated }) => {
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
        });
    }
    gapi.load("client:auth2", start);
  }, [setAuthenticated]);

  const [click, setClick] = useState(false);
  const handleSignIn = () => gapi.auth2.getAuthInstance().signIn();
  const handleSignOut = () => gapi.auth2.getAuthInstance().signOut();

  const handleAuthClick = () => {
    setClick(!click);
  }


  return (
    <div className="drive-auth">
      <h1>Galería de Fotos</h1>
      <div className="drive-auth-buttons">
        {!click && <button onClick={() => {handleSignIn(); handleAuthClick()}}>Iniciar sesión con Google</button>}
        <button onClick={() => {handleSignOut(); handleAuthClick()}}>Cerrar sesión</button>
      </div>
    </div>
  );
};

export default DriveAuth;
