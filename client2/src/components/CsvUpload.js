import React, { useState } from "react";
import Papa from "papaparse";

export default function CsvUpload({ onExtract }) {
  const [csvData, setCsvData] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setCsvData(results.data);
        // Call parent handler to process data in App.js
        onExtract(results.data);
      },
    });
  };

  return (
    <div className="p-4">
      <label className="block mb-2 font-bold">Upload CSV:</label>
      <input type="file" accept=".csv" onChange={handleFileChange} />
    </div>
  );
}

