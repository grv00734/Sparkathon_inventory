// src/ForecastGraph.js
import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const ForecastGraph = ({ data }) => (
  <div style={{ width: "100%", height: 350, marginTop: 30 }}>
    <h3 style={{ textAlign: "center", marginBottom: 10 }}>7-Day Sales Forecast (Graph)</h3>
    <ResponsiveContainer width="100%" height="90%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="predicted" stroke="#1976d2" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default ForecastGraph;

