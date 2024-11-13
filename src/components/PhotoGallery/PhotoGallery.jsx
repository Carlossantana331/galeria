import React, { useEffect, useState } from "react";
import UploadForm from "../UploadForm/UploadForm";
import "./PhotoGallery.css";
import MyLoader from "../MyLoader/MyLoader";

function PhotoGallery({ userName }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching media:", error);
      setLoading(false);
    }
  };

  return (
    <div className="media-gallery">
      <UploadForm onUpload={fetchMedia} userName={userName} />
      <div className="media-container">
        {loading ? (
          // Mostrar 6 cargadores arbitrarios mientras se está cargando
          [...Array(6)].map((_, index) => (
            <div key={index} className="media-item">
              <MyLoader /> {/* Mostrar el cargador */}
            </div>
          ))
        ) : (
          media.length > 0 ? (
            media.map((item) => (
              <div key={item.id} className="media-item">
                <img
                  src={item.thumbnailLink}
                  alt={item.name}
                  className="gallery-image"
                />
                <p>{item.name}</p>
              </div>
            ))
          ) : (
            <p>No se encontraron archivos en la galería.</p>
          )
        )}
      </div>
    </div>
  );
}

export default PhotoGallery;
