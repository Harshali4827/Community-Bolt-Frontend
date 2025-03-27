import React, { useState } from "react";
import axios from "axios";

const ImportExcel = () => {
  const [file, setFile] = useState(null);
  const [propertyId, setPropertyId] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePropertyIdChange = (e) => {
    setPropertyId(e.target.value);
  };

  const handleUpload = async () => {
    if (!file || !propertyId) {
      alert("Please select a file and enter a Property ID.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("property_id", propertyId);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/importExcel",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Upload Excel File</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Property ID:
        </label>
        <input
          type="text"
          value={propertyId}
          onChange={handlePropertyIdChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Property ID"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Upload Excel File:
        </label>
        <input
          type="file"
          accept=".xls, .xlsx"
          onChange={handleFileChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
        />
      </div>
      <button
        onClick={handleUpload}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Upload File
      </button>
    </div>
  );
};

export default ImportExcel;
