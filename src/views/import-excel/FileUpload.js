import React, { useState, useEffect, useRef } from "react";
import "../../css/fileUpload.css";
import axiosInstance from "src/axiosInstance";
import Swal from "sweetalert2";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [propertyId, setPropertyId] = useState("");
  const [properties, setProperties] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axiosInstance.get("/property");
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching property:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to load property",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchProperty();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePropertyIdChange = (e) => {
    setPropertyId(e.target.value);
  };

  const handleUpload = async () => {
    if (!file || !propertyId) {
      Swal.fire({
        title: "Warning!",
        text: "Please select a file and enter a Property ID.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("property_id", propertyId);

    try {
      const response = await axiosInstance.post("/import-excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      Toast.fire({
        icon: "success",
        title: response.data.message || "File uploaded successfully!",
      });
      setFile(null);
      setPropertyId("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error) {
      console.error("Error uploading file:", error);

      if (error.response && error.response.status === 400) {
        Swal.fire({
          title: "Error!",
          text: error.response.data.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <div className="import-container">
      <div className="import-group">
        <label className="import-label">Property ID:</label>
        <select
          className="import-input"
          name="property_id"
          value={propertyId}
          onChange={handlePropertyIdChange}
        >
          <option value="">-Select Property-</option>
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.property_name} (ID: {property.id})
            </option>
          ))}
        </select>
      </div>

      <div className="import-group">
        <label className="import-label">Upload Excel File:</label>
        <input
          type="file"
          accept=".xls, .xlsx"
          onChange={handleFileChange}
          className="import-input import-file-input"
          ref={fileInputRef}
        />
      </div>

      <button onClick={handleUpload} className="import-button">
        Import Data
      </button>
    </div>
  );
};

export default FileUpload;
 