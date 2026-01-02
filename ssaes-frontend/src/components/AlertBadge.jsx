// src/components/AlertBadge.jsx
import React from "react";

export default function AlertBadge({ text, type }) {
  let colorClass = "bg-gray-400";
  if (type === "low") colorClass = "bg-green-500";
  if (type === "medium") colorClass = "bg-yellow-500";
  if (type === "high") colorClass = "bg-red-500";

  return (
    <span
      className={`${colorClass} text-white text-xs font-semibold px-2 py-1 rounded-full`}
    >
      {text}
    </span>
  );
}

