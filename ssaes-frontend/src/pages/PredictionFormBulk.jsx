// src/pages/PredictionFormBulk.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { predictStudentRisk } from "../api/predictApi";
import Papa from "papaparse";
import { List } from "react-window";

const ROW_HEIGHT = 50;
const TABLE_HEIGHT = 600;
const CHUNK_SIZE = 100; // send 100 students at a time to backend

const PredictionFormBulk = () => {
  const [file, setFile] = useState(null);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  // Handle CSV file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStudents([]);
    setResults([]);
    setError("");
    setProgress(0);
  };

  // Parse CSV file
  const handleUpload = () => {
    if (!file) return setError("Please select a CSV file.");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data.map((row) => ({
          name: row.name || "",
          attendance: Number(row.attendance),
          studyHours: Number(row.studyHours),
          marks: Number(row.marks),
        }));
        setStudents(parsedData);
      },
      error: (err) => setError(`CSV parsing error: ${err.message}`),
    });
  };

  // Predict in chunks
  const handlePredictAll = async () => {
    if (students.length === 0) return setError("No student data to predict.");

    setLoading(true);
    setError("");
    setResults([]);
    setProgress(0);

    try {
      const totalChunks = Math.ceil(students.length / CHUNK_SIZE);
      const allResults = [];

      for (let i = 0; i < totalChunks; i++) {
        const chunk = students.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);

        // Send chunk to backend for prediction
        const chunkResult = await predictStudentRisk({ students: chunk });

        allResults.push(...chunkResult);

        setResults([...allResults]);
        setProgress(Math.round(((i + 1) / totalChunks) * 100));
      }
    } catch (err) {
      setError("Prediction failed for some students.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Download CSV
  const handleDownloadCSV = () => {
    if (results.length === 0) return;

    const csv = Papa.unparse(
      results.map((r) => ({
        name: r.name,
        attendance: r.attendance,
        studyHours: r.studyHours,
        marks: r.marks,
        predictedScore: r.predictedScore,
        riskLevel: r.riskLevel,
        probability: r.probability,
      }))
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "predictions.csv";
    link.click();
  };

  // Table row renderer for react-window
  const Row = ({ index, style }) => {
    const s = results[index];
    return (
      <div
        style={{ ...style, display: "flex", borderBottom: "1px solid #e5e7eb" }}
        className="hover:bg-gray-100"
      >
        <div className="flex-1 px-4 py-2">{s.name}</div>
        <div className="w-28 px-4 py-2 text-center">{s.attendance}%</div>
        <div className="w-28 px-4 py-2 text-center">{s.studyHours}</div>
        <div className="w-28 px-4 py-2 text-center">{s.marks}</div>
        <div className="w-32 px-4 py-2 text-center">{s.predictedScore ?? "-"}</div>
        <div
          className={`w-28 px-4 py-2 text-center font-semibold ${
            s.riskLevel === "High"
              ? "text-red-600"
              : s.riskLevel === "Medium"
              ? "text-yellow-600"
              : s.riskLevel === "Low"
              ? "text-green-600"
              : ""
          }`}
        >
          {s.riskLevel ?? "-"}
        </div>
        <div className="w-32 px-4 py-2 text-center">
          {s.probability ? `${(s.probability * 100).toFixed(2)}%` : "-"}
        </div>
      </div>
    );
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <Topbar title="Bulk Prediction" />
        <main className="p-6 max-w-6xl">
          <h2 className="text-2xl font-bold mb-4">Bulk Student Risk Prediction</h2>

          {/* Upload CSV */}
          <div className="bg-white p-6 rounded shadow-md mb-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="border p-2 rounded mb-2"
            />
            <button
              onClick={handleUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition ml-2"
            >
              Load CSV
            </button>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>

          {/* Buttons */}
          {students.length > 0 && (
            <div className="mb-4 flex gap-2">
              <button
                onClick={handlePredictAll}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                {loading ? `Predicting... (${progress}%)` : "Predict All"}
              </button>
              {results.length > 0 && (
                <button
                  onClick={handleDownloadCSV}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Download Results CSV
                </button>
              )}
            </div>
          )}

          {/* Progress Bar */}
          {loading && (
            <div className="w-full bg-gray-300 rounded h-4 mb-4">
              <div
                className="bg-blue-600 h-4 rounded"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {/* Results Table */}
          {results.length > 0 && (
            <div className="bg-white rounded shadow-md overflow-hidden">
              {/* Table header */}
              <div className="flex bg-gray-200 font-semibold">
                <div className="flex-1 px-4 py-2">Name</div>
                <div className="w-28 px-4 py-2 text-center">Attendance</div>
                <div className="w-28 px-4 py-2 text-center">Study Hours</div>
                <div className="w-28 px-4 py-2 text-center">Marks</div>
                <div className="w-32 px-4 py-2 text-center">Predicted Score</div>
                <div className="w-28 px-4 py-2 text-center">Risk Level</div>
                <div className="w-32 px-4 py-2 text-center">Probability</div>
              </div>
              <List
                height={TABLE_HEIGHT}
                itemCount={results.length}
                itemSize={ROW_HEIGHT}
                width="100%"
              >
                {Row}
              </List>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PredictionFormBulk;
