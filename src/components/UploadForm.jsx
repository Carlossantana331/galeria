import React, { useState } from "react";
import { gapi } from "gapi-script";
import "./styles/UploadForm.css";
import { IoClose } from "react-icons/io5";

const FOLDER_ID = "1z_ZdxUzh2llM3ejZeC1wExCfhv6-Vzph";

const UploadForm = ({ onUpload }) => {
  const [guestName, setGuestName] = useState("");
  const [files, setFiles] = useState([]); // Cambia a un array para archivos múltiples
  const [uploadProgress, setUploadProgress] = useState({}); // Estado para el progreso
  const [isUploading, setIsUploading] = useState(false); // Estado para indicar si se está subiendo

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Selecciona al menos un archivo para subir.");

    setIsUploading(true); // Cambia el estado a 'subiendo'
    const accessToken = gapi.auth.getToken().access_token;

    // Sube cada archivo de manera individual
    for (const file of files) {
      const metadata = {
        name: `${guestName}_${file.name}`,
        parents: [FOLDER_ID],
      };

      const formData = new FormData();
      formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
      formData.append("file", file);

      // Usar XMLHttpRequest para rastrear el progreso de la subida
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart");
      xhr.setRequestHeader("Authorization", "Bearer " + accessToken);

      // Actualiza el estado del progreso
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: percentComplete,
          }));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          console.log("Archivo subido", result);
        } else {
          console.error("Error al subir el archivo", xhr.statusText);
        }
      };

      xhr.send(formData);
    }

    // Espera un tiempo para que se complete la subida
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Limpiar la selección de archivos y el nombre del invitado
    setFiles([]);
    setGuestName("");
    setUploadProgress({});
    setIsUploading(false); // Cambia el estado a 'no subiendo'

    onUpload(); // Llama a la función para actualizar las fotos después de la carga
  };

  // Función para eliminar un archivo de la lista
  const removeFile = (fileToRemove) => {
    setFiles(files.filter((file) => file !== fileToRemove));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileToRemove.name]; // Elimina el progreso del archivo eliminado
      return newProgress;
    });
  };

  return (
    <form onSubmit={handleUpload} className="upload-form">
      <div className="upload-form-input-container">
        <input
          type="text"
          placeholder="Ingrese su nombre o el de su familia"
          id="name-input"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          required
          className="upload-form-input"
        />
{/*         <label htmlFor="name-input">Ingrese su nombre o el de su familia</label> */}

      </div>

      <div className="upload-btn">
        <input
          type="file"
          id="file-input"
          onChange={(e) => setFiles(Array.from(e.target.files))} // Cambia para almacenar múltiples archivos
          required
          multiple
          className="custom-file-input"
        />
        <label htmlFor="file-input" className="custom-file-label">
          Seleccione las fotos que desees subir
        </label>
        <button type="submit" disabled={isUploading} className="upload-button">Subir Archivos</button>

      </div>

      {/* Muestra los nombres de los archivos seleccionados */}
      <ul className="file-list">
        {files.length > 0 &&
          files.map((file, index) => (
            <li key={index} className="file-list-item">
              {file.name} 
              {/* Ocultar el botón de eliminar si se está subiendo */}
              {!isUploading && (
                <button type="button" onClick={() => removeFile(file)}className="remove-file-button">
                  <IoClose />
                </button>
              )}
              {/* Barra de progreso */}
              {uploadProgress[file.name] !== undefined && (
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{
                      width: `${uploadProgress[file.name]}%`,
                      backgroundColor: "green",
                      height: "5px",
                    }}
                  />
                </div>
              )}
            </li>
          ))}
      </ul>


    </form>
  );
};

export default UploadForm;
