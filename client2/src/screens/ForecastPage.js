import React, { useState } from "react";
import ForecastGraph from "../ForecastGraph";

// Utility to read CSV file as text
const readCSV = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });

const ForecastPage = () => {
  const [ordersFile, setOrdersFile] = useState(null);
  const [inventoryFile, setInventoryFile] = useState(null);
  const [ordersData, setOrdersData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Helper: CSV parsing
  function parseCSV(csv) {
    const [headerLine, ...lines] = csv.trim().split("\n");
    const headers = headerLine.split(",");
    return lines
      .map((line) => {
        const values = line.split(",");
        if (values.length !== headers.length) return null;
        const obj = {};
        headers.forEach((h, i) => {
          obj[h.trim()] = values[i].trim();
        });
        return obj;
      })
      .filter(Boolean);
  }

  // Handle file upload
  const handleFileUpload = async (e, type) => {
    setError("");
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a valid CSV file only!");
      return;
    }
    if (type === "orders" && !file.name.includes("orders")) {
      setError("Orders file must be named orders.csv or include 'orders' in the name.");
      return;
    }
    if (type === "inventory" && !file.name.includes("inventory")) {
      setError("Inventory file must be named warehouse_inventory.csv or include 'inventory' in the name.");
      return;
    }
    // Read file
    const text = await readCSV(file);
    const data = parseCSV(text);
    if (!data.length) {
      setError("CSV file is empty or invalid.");
      return;
    }
    if (type === "orders") {
      setOrdersFile(file);
      setOrdersData(data);
    }
    if (type === "inventory") {
      setInventoryFile(file);
      setInventoryData(data);
    }
  };

  // When both files are loaded, extract unique products/warehouses
  React.useEffect(() => {
    if (ordersData.length && inventoryData.length) {
      // Merge all product IDs and warehouse IDs from both
      const orderPids = ordersData.map((row) => row.sku_id).filter(Boolean);
      const invPids = inventoryData.map((row) => row.sku_id).filter(Boolean);
      const orderWids = ordersData.map((row) => row.warehouse_id).filter(Boolean);
      const invWids = inventoryData.map((row) => row.warehouse_id).filter(Boolean);
      setProducts(Array.from(new Set([...orderPids, ...invPids])));
      setWarehouses(Array.from(new Set([...orderWids, ...invWids])));
    }
  }, [ordersData, inventoryData]);

  // Prediction handler
  const handlePredict = async () => {
    setError("");
    setPrediction(null);
    if (!selectedProduct || !selectedWarehouse) {
      setError("Select both product and warehouse.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/forecast/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct,
          warehouseId: selectedWarehouse,
          ordersData,
          inventoryData,
        }),
      });
      const data = await res.json();
      setPrediction(data);
    } catch {
      setError("Prediction failed! Please try again.");
    }
    setLoading(false);
  };

  // Summary handler
  const handleShowSummary = async () => {
    setError("");
    setSummary(null);
    setLoadingSummary(true);
    try {
      // Send both files' data to backend for summary
      const res = await fetch("http://localhost:5000/api/forecast/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ordersData,
          inventoryData,
        }),
      });
      const data = await res.json();
      setSummary(data);
    } catch {
      setError("Summary fetch failed!");
    }
    setLoadingSummary(false);
  };

  // For card UI
  const cardStyle = {
    maxWidth: 480,
    margin: "70px auto 0 auto",
    padding: "36px 32px 40px 32px",
    borderRadius: "22px",
    background: "#fff",
    boxShadow: "0 8px 32px 0 rgba(0,0,0,0.13)",
    textAlign: "center",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: 0,
        margin: 0,
      }}
    >
      {/* Back Button */}
      <button
        style={{
          position: "absolute",
          left: 32,
          top: 32,
          padding: "8px 24px",
          borderRadius: "22px",
          border: "none",
          background: "#222",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          zIndex: 10,
          fontSize: "1.1rem",
          boxShadow: "0 3px 16px 0 rgba(0,0,0,0.10)",
        }}
        onClick={() => window.history.back()}
      >
        &larr; Back
      </button>
      <div style={cardStyle}>
        <h1 style={{ fontSize: "2.1rem", fontWeight: 600, marginBottom: 28 }}>
          Forecast Page
        </h1>

        {/* Orders CSV Upload */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 500 }}>Upload Orders CSV:</div>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileUpload(e, "orders")}
            style={{ margin: "10px 0" }}
          />
          {ordersFile && (
            <div style={{ color: "#0a8d5c", fontWeight: "bold", fontSize: 14 }}>
              {ordersFile.name} loaded
            </div>
          )}
        </div>
        {/* Inventory CSV Upload */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 500 }}>Upload Inventory CSV:</div>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileUpload(e, "inventory")}
            style={{ margin: "10px 0" }}
          />
          {inventoryFile && (
            <div style={{ color: "#0a8d5c", fontWeight: "bold", fontSize: 14 }}>
              {inventoryFile.name} loaded
            </div>
          )}
        </div>
        {error && (
          <div
            style={{
              color: "#fff",
              background: "#e74c3c",
              padding: "7px 14px",
              borderRadius: "7px",
              margin: "10px 0",
              fontWeight: "bold",
            }}
          >
            {error}
          </div>
        )}
        {/* Product & Warehouse selectors */}
        {products.length > 0 && warehouses.length > 0 && (
          <>
            <div style={{ marginTop: 18 }}>
              <label>
                <b>Select Product ID:</b>{" "}
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  style={{ minWidth: 120 }}
                >
                  <option value="">--Choose Product--</option>
                  {products.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div style={{ marginTop: 16 }}>
              <label>
                <b>Select Warehouse ID:</b>{" "}
                <select
                  value={selectedWarehouse}
                  onChange={(e) => setSelectedWarehouse(e.target.value)}
                  style={{ minWidth: 120 }}
                >
                  <option value="">--Choose Warehouse--</option>
                  {warehouses.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              style={{
                marginTop: 22,
                padding: "10px 24px",
                fontWeight: "bold",
                fontSize: 18,
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
              onClick={handlePredict}
              disabled={loading}
            >
              {loading ? "Predicting..." : "Predict"}
            </button>
            {/* Show All Warnings / Summary Button */}
            <button
              style={{
                marginTop: 10,
                marginBottom: 18,
                padding: "8px 18px",
                fontWeight: "bold",
                fontSize: 15,
                background: "#22b573",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
              onClick={handleShowSummary}
              disabled={loadingSummary}
            >
              {loadingSummary ? "Loading..." : "Show All Warnings"}
            </button>
          </>
        )}
        {/* Results */}
        <div style={{ marginTop: 24 }}>
          {prediction &&
            (prediction.forecast || prediction.lowStock || prediction.highStock) && (
              <div>
                {/* Demand Forecast Graph */}
                {prediction.forecast && Array.isArray(prediction.forecast) && (
                  <div>
                    <ForecastGraph data={prediction.forecast} />
                    <b>7-Day Demand Forecast:</b>
                    <table
                      style={{
                        margin: "1rem auto",
                        borderCollapse: "collapse",
                        width: "100%",
                      }}
                    >
                      <thead>
                        <tr>
                          <th style={{ padding: "8px", border: "1px solid #ccc" }}>
                            Date
                          </th>
                          <th style={{ padding: "8px", border: "1px solid #ccc" }}>
                            Predicted Sales
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {prediction.forecast.map((row) => (
                          <tr key={row.date}>
                            <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                              {row.date}
                            </td>
                            <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                              {row.predicted}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {/* Low/High Stock Info */}
                {prediction.lowStock && (
                  <div
                    style={{
                      background: "#ffe0e0",
                      color: "#c0392b",
                      borderRadius: "9px",
                      padding: "13px",
                      margin: "14px 0",
                    }}
                  >
                    <b>Low Stock Alert:</b> {prediction.lowStock}
                  </div>
                )}
                {prediction.highStock && (
                  <div
                    style={{
                      background: "#e8fce7",
                      color: "#257a15",
                      borderRadius: "9px",
                      padding: "13px",
                      margin: "14px 0",
                    }}
                  >
                    <b>High Stock Info:</b> {prediction.highStock}
                  </div>
                )}
              </div>
            )}
          {prediction && prediction.error && (
            <div style={{ color: "red", marginTop: 12 }}>
              <b>Error:</b> {prediction.error}
            </div>
          )}
        </div>
        {/* Summary Table */}
        {summary && summary.lowStockList && (
          <div style={{marginTop: 18, background: "#fff9e6", borderRadius: 9, padding: 14}}>
            <h3 style={{color: "#d35400", margin: "0 0 8px 0"}}>Low Stock & High Demand Summary</h3>
            <table style={{width: "100%", borderCollapse: "collapse", fontSize: 14}}>
              <thead>
                <tr>
                  <th style={{border: "1px solid #eee", padding: 6}}>Product</th>
                  <th style={{border: "1px solid #eee", padding: 6}}>Warehouse</th>
                  <th style={{border: "1px solid #eee", padding: 6}}>Current Inventory</th>
                  <th style={{border: "1px solid #eee", padding: 6}}>Avg Daily Sales</th>
                  <th style={{border: "1px solid #eee", padding: 6}}>Alert</th>
                </tr>
              </thead>
              <tbody>
                {summary.lowStockList.map((row, i) => (
                  <tr key={i}>
                    <td style={{border: "1px solid #eee", padding: 6}}>{row.sku_id}</td>
                    <td style={{border: "1px solid #eee", padding: 6}}>{row.warehouse_id}</td>
                    <td style={{border: "1px solid #eee", padding: 6}}>{row.current_inventory}</td>
                    <td style={{border: "1px solid #eee", padding: 6}}>{row.avg_daily_sales}</td>
                    <td style={{
                      border: "1px solid #eee",
                      padding: 6,
                      color: row.alert === "Low Stock" ? "#e74c3c" : "#22b573",
                      fontWeight: "bold"
                    }}>{row.alert}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForecastPage;

