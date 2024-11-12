// UploadForm.jsx
import React, { useState } from "react";
import { gapi } from "gapi-script";
import "./UploadForm.css";
import { IoClose } from "react-icons/io5";

const FOLDER_ID = "1z_ZdxUzh2llM3ejZeC1wExCfhv6-Vzph";

const UploadForm = ({ onUpload, userName }) => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Selecciona al menos un archivo para subir.");

    try {
      setIsUploading(true);
      const accessToken = gapi.auth.getToken().access_token;

      for (const file of files) {
        const metadata = {
          name: `${userName}_${file.name}`,
          parents: [FOLDER_ID],
        };

        const formData = new FormData();
        formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
        formData.append("file", file);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart");
        xhr.setRequestHeader("Authorization", "Bearer " + accessToken);

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

        await xhr.send(formData); // Espera a que cada archivo se suba completamente
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFiles([]);
      setUploadProgress({});
      onUpload(); // Llama a onUpload después de que todos los archivos se hayan subido
    } catch (error) {
      alert("Error al subir los archivos. Inténtalo de nuevo.");
      console.error("Error al subir archivos:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileToRemove) => {
    setFiles(files.filter((file) => file !== fileToRemove));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileToRemove.name];
      return newProgress;
    });
  };

  return (
    <form onSubmit={handleUpload} className="upload-form">
      <div className="upload-btn">
        <input
          type="file"
          id="file-input"
          onChange={(e) => setFiles(Array.from(e.target.files))}
          required
          multiple
          className="custom-file-input"
        />
        <label htmlFor="file-input" className="custom-file-label">
          Seleccione las fotos que desees subir
        </label>
        <button type="submit" disabled={isUploading} className="upload-button">
          {isUploading ? "Subiendo..." : "Subir Archivos"}
        </button>
      </div>

      <ul className="file-list">
        {files.length > 0 &&
          files.map((file, index) => (
            <li key={index} className="file-list-item">
              {file.name}
              {!isUploading && (
                <button type="button" onClick={() => removeFile(file)} className="remove-file-button">
                  <IoClose />
                </button>
              )}
              {uploadProgress[file.name] && (
                <progress value={uploadProgress[file.name]} max="100">
                  {uploadProgress[file.name]}%
                </progress>
              )}
            </li>
          ))}
      </ul>
    </form>
  );
};

export default UploadForm;
