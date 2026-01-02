// src/pages/History.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getHistoryData } from "../api/analyticsApi"; // Replace with your API

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await getHistoryData({ page, pageSize });
        setHistory(res);
      } catch (err) {
        console.error("History fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [page]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar title="History" />
        <main className="mt-16 p-6">
          <h2 className="text-2xl font-bold mb-4">Activity History</h2>

          {loading ? (
            <p>Loading history...</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded shadow p-4">
              <table className="w-full table-auto border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">User</th>
                    <th className="border px-4 py-2">Action</th>
                    <th className="border px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-100">
                      <td className="border px-4 py-2">{item.id}</td>
                      <td className="border px-4 py-2">{item.user}</td>
                      <td className="border px-4 py-2">{item.action}</td>
                      <td className="border px-4 py-2">
                        {new Date(item.date).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="mt-4 flex justify-between items-center">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span className="text-gray-700">Page {page}</span>
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={history.length < pageSize}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default History;
