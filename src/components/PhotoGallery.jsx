import React, { useEffect, useState } from 'react';
import UploadForm from './UploadForm';
import './styles/PhotoGallery.css';

function PhotoGallery() {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='1z_ZdxUzh2llM3ejZeC1wExCfhv6-Vzph'+in+parents&fields=files(id,name,webContentLink,thumbnailLink,mimeType)&key=AIzaSyCdiaGi10jCq4n9L9hKHfYxOljvoD45PCQ&pageSize=100`
      );
      const data = await response.json();
      console.log(data.files); // Verifica el MIME type aquí
      setMedia(Array.isArray(data.files) ? data.files : []);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  const getVideoUrl = (fileId) => {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  };

  const getImageUrl = (fileId) => {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  };

  return (
    <div className="media-gallery">
      <UploadForm onUpload={fetchMedia} />
      <div className="media-container">
        {media.length > 0 ? (
          media.map((item) => (
            <div key={item.id} className="media-item">
              {item.mimeType.startsWith('video/') ? (
                <iframe
                  src={getVideoUrl(item.id)}
                  width="640"
                  height="480"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title={item.name}
                >
                  Tu navegador no soporta la etiqueta de video.
                </iframe>
              ) : (
                <img
                  src={getImageUrl(item.id)}
                  alt={item.name}
                  className="gallery-image"
                />
              )}
              <p>{item.name}</p>
            </div>
          ))
        ) : (
          <p>No se encontraron archivos en la galería.</p>
        )}
      </div>
    </div>
  );
}

export default PhotoGallery;