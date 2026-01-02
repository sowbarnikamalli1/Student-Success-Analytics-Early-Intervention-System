// src/pages/CSVUpload.jsx
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import axiosClient from "../api/axiosClient";

const CSVUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setErrorMsg("Please select a CSV/XLSX file first.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosClient.post("/students/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMsg(response.data.message || "CSV uploaded successfully!");
      setFile(null);
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || "CSV upload failed.");
      console.error("CSV Upload Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <Topbar title="CSV Upload" />

        <main className="p-6 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Bulk Student Upload</h2>

          {errorMsg && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
              {successMsg}
            </div>
          )}

          <div className="bg-white p-6 rounded shadow grid gap-4">
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={(e) => setFile(e.target.files[0])}
              className="border p-2 rounded"
            />
            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {file && (
            <div className="mt-4 p-4 bg-gray-50 border rounded">
              Selected File: {file.name}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CSVUpload;
