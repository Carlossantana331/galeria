import React, { useState } from 'react';
import DriveAuth from './components/DriveAuth/DriveAuth';
import PhotoGallery from './components/PhotoGallery/PhotoGallery';

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);

  return (
    <div>
      <DriveAuth setAuthenticated={setAuthenticated} />
      {isAuthenticated && (
        <>
          <PhotoGallery />
        </>
      )}
    </div>
  );
}

export default App;
