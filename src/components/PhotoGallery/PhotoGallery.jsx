import React, { useEffect, useState } from "react";
import UploadForm from "../UploadForm/UploadForm";
import "./PhotoGallery.css";

function PhotoGallery({ userName }) {
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
      setMedia(Array.isArray(data.files) ? data.files : []);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  const images = media.filter((item) => !item.mimeType.startsWith("video/"));
  const videos = media.filter((item) => item.mimeType.startsWith("video/"));

  return (
    <div className="media-gallery">
      <UploadForm onUpload={fetchMedia} userName={userName} />
      <div className="media-container">
        {media.length > 0 ? (
          <>
            {images.map((item) => (
              <div key={item.id} className="media-item">
                <img src={item.thumbnailLink} alt={item.name} className="gallery-image" />
                <p>{item.name}</p>
              </div>
            ))}
            {videos.map((item) => (
              <div key={item.id} className="media-item">
                <iframe
                  src={`https://drive.google.com/file/d/${item.id}/preview`}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title={item.name}
                />
                <p>{item.name}</p>
              </div>
            ))}
          </>
        ) : (
          <p>No se encontraron archivos en la galería.</p>
        )}
      </div>
    </div>
  );
}

export default PhotoGallery;
