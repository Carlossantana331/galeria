import React, { useState } from 'react';
import DriveAuth from './components/DriveAuth/DriveAuth';
import PhotoGallery from './components/PhotoGallery/PhotoGallery';

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [userName, setUserName] = useState(""); // Agrega un estado para el nombre del usuario

  return (
    <div>
      <DriveAuth setAuthenticated={setAuthenticated} setUserName={setUserName} />
      {isAuthenticated && (
        <>
          <PhotoGallery userName={userName} />
        </>
      )}
    </div>
  );
}

export default App;
