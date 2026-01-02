// src/components/StatCard.jsx
import React from "react";

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-4 rounded shadow flex items-center gap-3 hover:shadow-lg transition">
      {icon && <div className="text-2xl">{icon}</div>}
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
