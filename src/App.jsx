import React, { useState } from 'react';
import DriveAuth from './components/DriveAuth';
import PhotoGallery from './components/PhotoGallery';

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
