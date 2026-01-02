// src/components/TableView.jsx
import React from "react";

export default function TableView({ columns, data }) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow p-4">
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 border border-gray-200 text-left text-sm font-medium text-gray-700"
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-2 border border-gray-200 text-sm text-gray-600"
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
