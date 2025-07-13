import React, { useState } from "react";
import CsvUpload from "../components/CsvUpload";
import ForecastGraph from "../ForecastGraph"; // <-- import the graph

const ForecastPage = () => {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExtract = (data) => {
    const uniqueProducts = Array.from(new Set(data.map(row => row.sku_id)));
    const uniqueWarehouses = Array.from(new Set(data.map(row => row.warehouse_id)));
    setProducts(uniqueProducts.filter(Boolean));
    setWarehouses(uniqueWarehouses.filter(Boolean));
    setCsvData(data);
    setSelectedProduct("");
    setSelectedWarehouse("");
  };

  const handlePredict = async () => {
    setLoading(true);
    setPrediction(null);
    try {
      const res = await fetch("http://localhost:5000/api/forecast/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct,
          warehouseId: selectedWarehouse,
        }),
      });
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      setPrediction({ error: "Prediction failed!" });
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 30 }}>
      <h1>Forecast Page</h1>
      <CsvUpload onExtract={handleExtract} />

      {products.length > 0 && warehouses.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <div>
            <label>
              <b>Select Product ID:</b>{" "}
              <select
                value={selectedProduct}
                onChange={e => setSelectedProduct(e.target.value)}
              >
                <option value="">--Choose Product--</option>
                {products.map(id => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            </label>
          </div>
          <div style={{ marginTop: 20 }}>
            <label>
              <b>Select Warehouse ID:</b>{" "}
              <select
                value={selectedWarehouse}
                onChange={e => setSelectedWarehouse(e.target.value)}
              >
                <option value="">--Choose Warehouse--</option>
                {warehouses.map(id => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}

      {(selectedProduct && selectedWarehouse) && (
        <div style={{ marginTop: 30 }}>
          <p>
            <b>Selected Product:</b> {selectedProduct} <br />
            <b>Selected Warehouse:</b> {selectedWarehouse}
          </p>
          <button
            style={{
              marginTop: 16,
              padding: "10px 20px",
              fontWeight: "bold",
              fontSize: 18,
              background: "#1477e7",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
            onClick={handlePredict}
            disabled={loading}
          >
            {loading ? "Predicting..." : "Predict"}
          </button>

          <div style={{ marginTop: 20 }}>
            {/* Render forecast graph and table if forecast exists */}
            {prediction && prediction.forecast && Array.isArray(prediction.forecast) ? (
              <div className="result-box">
                {/* Forecast Graph */}
                <ForecastGraph data={prediction.forecast} />
                {/* Forecast Table */}
                <b>7-Day Forecast:</b>
                <table style={{ margin: "1rem auto", borderCollapse: "collapse", width: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "8px", border: "1px solid #ccc" }}>Date</th>
                      <th style={{ padding: "8px", border: "1px solid #ccc" }}>Predicted Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prediction.forecast.map((row) => (
                      <tr key={row.date}>
                        <td style={{ padding: "8px", border: "1px solid #ccc" }}>{row.date}</td>
                        <td style={{ padding: "8px", border: "1px solid #ccc" }}>{row.predicted}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : prediction && prediction.error ? (
              <div className="result-box" style={{ color: "red" }}>
                <b>Error:</b> {prediction.error}
              </div>
            ) : prediction ? (
              <div className="result-box">
                <b>Prediction Result:</b>
                <pre style={{ fontSize: 16 }}>{JSON.stringify(prediction, null, 2)}</pre>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastPage;

