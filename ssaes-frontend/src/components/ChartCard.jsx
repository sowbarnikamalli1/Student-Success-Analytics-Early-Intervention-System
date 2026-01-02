// src/components/ChartCard.jsx
import React from "react";

const ChartCard = ({ title, children }) => {
  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="w-full h-64">{children}</div>
    </div>
  );
};

export default ChartCard;
