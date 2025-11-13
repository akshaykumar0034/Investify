import React, { useState, useEffect, useCallback } from 'react';
import { downloadReport } from '../api/reportService.js';
import { FaFileAlt } from 'react-icons/fa';

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getReports();
      setReports(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError("Could not load your reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold text-green-400 mb-8">Generated Reports</h1>
      
      {loading && <p className="text-gray-400">Loading reports...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && reports.length === 0 && (
        <div className="text-center text-gray-400 p-8 bg-gray-800 rounded-lg">
          <p>You have no generated reports.</p>
          <p className="text-sm mt-2">The system will automatically generate a new report for you every 2 minutes (for testing).</p>
        </div>
      )}

      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold flex items-center mb-2">
              <FaFileAlt className="mr-2 text-green-400" />
              {report.title}
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Generated on: {new Date(report.generatedAt).toLocaleString()}
            </p>
            {/* This renders the newlines correctly */}
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
              {report.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReportsPage;