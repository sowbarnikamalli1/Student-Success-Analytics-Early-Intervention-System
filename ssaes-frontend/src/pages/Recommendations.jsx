import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getRecommendations } from "../api/recommendationsApi";
import axiosClient from "../api/axiosClient";

const Recommendations = () => {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  /* ---------------- FETCH ---------------- */
  const fetchRecommendations = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getRecommendations();
      setRecs(data);
      setLastUpdated(new Date());
    } catch {
      setError("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    const interval = setInterval(fetchRecommendations, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  /* ---------------- ACTIONS ---------------- */
  const updateStatus = async (id, status) => {
    try {
      await axiosClient.post(`/recommendations/${id}/status`, {
        status,
      });
      fetchRecommendations();
    } catch {
      alert("Failed to update recommendation status");
    }
  };

  /* ---------------- UI HELPERS ---------------- */
  const badge = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-yellow-400 text-white";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const icon = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case "high":
        return "🚨";
      case "medium":
        return "⚠️";
      case "low":
        return "✅";
      default:
        return "ℹ️";
    }
  };

  const filteredRecs =
    statusFilter === "ALL"
      ? recs
      : recs.filter((r) => r.status === statusFilter);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Topbar title="Recommendations" />

        <main className="mt-16 p-6 max-w-7xl">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              Personalized Recommendations
            </h2>

            <div className="flex gap-3">
              <select
                className="border px-3 py-2 rounded"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="PENDING">Pending</option>
                <option value="APPLIED">Applied</option>
                <option value="IGNORED">Ignored</option>
              </select>

              <button
                onClick={fetchRecommendations}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>
          </div>

          {lastUpdated && (
            <p className="text-sm text-gray-500 mb-4">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}

          {/* ERROR */}
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          {/* CONTENT */}
          {loading ? (
            <p>Loading recommendations...</p>
          ) : filteredRecs.length === 0 ? (
            <p>No recommendations found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRecs.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white rounded shadow p-5 hover:shadow-lg transition"
                >
                  {/* TOP */}
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <span className="text-xl">{icon(rec.urgency)}</span>
                      <div>
                        <p className="font-medium">{rec.text}</p>
                        <p className="text-sm text-gray-500">
                          Student: {rec.student_name} ({rec.reg_no})
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-1 rounded text-sm ${badge(
                        rec.urgency
                      )}`}
                    >
                      {rec.urgency}
                    </span>
                  </div>

                  {/* CONFIDENCE */}
                  <div className="mt-2 text-sm text-gray-600">
                    ML Confidence:{" "}
                    <span className="font-semibold">
                      {Math.round(rec.confidence * 100)}%
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => updateStatus(rec.id, "APPLIED")}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Mark Applied
                    </button>
                    <button
                      onClick={() => updateStatus(rec.id, "IGNORED")}
                      className="bg-gray-400 text-white px-3 py-1 rounded text-sm"
                    >
                      Ignore
                    </button>
                  </div>

                  {/* EXPLANATION */}
                  {rec.explanation && (
                    <button
                      onClick={() =>
                        setExpandedId(
                          expandedId === rec.id ? null : rec.id
                        )
                      }
                      className="text-blue-600 text-sm mt-3 hover:underline"
                    >
                      {expandedId === rec.id
                        ? "Hide AI Explanation"
                        : "Why this recommendation?"}
                    </button>
                  )}

                  {expandedId === rec.id && (
                    <div className="mt-2 bg-gray-50 border-l-4 border-blue-500 p-3 text-sm">
                      <ul className="list-disc list-inside space-y-1">
                        {Object.entries(rec.explanation).map(
                          ([k, v]) => (
                            <li key={k}>
                              <span className="capitalize">
                                {k.replace("_", " ")}:
                              </span>{" "}
                              {v}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {/* STATUS */}
                  <p className="mt-3 text-xs text-gray-500">
                    Status:{" "}
                    <span className="font-semibold">
                      {rec.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Recommendations;
