import React, { useState, useEffect } from "react";
import { listBackups, downloadBackup } from "../../services/api";

export default function BackupList() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);

  const fetchBackups = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listBackups();
      setBackups(res.data.data);
    } catch (err) {
      console.error("ListBackups error:", err);
      setError(
        err.response?.data?.message || "Erreur lors de la récupération des backups."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleDownload = async (backup) => {
    setDownloading(backup.filename);
    try {
      const res = await downloadBackup(backup.filename);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", backup.originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      setError("Erreur lors du téléchargement du fichier.");
    } finally {
      setDownloading(null);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  const formatDate = (iso) => {
    return new Date(iso).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Mes Backups</h2>
        <button
          onClick={fetchBackups}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Chargement..." : "Actualiser"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {loading && backups.length === 0 && (
        <p className="text-gray-500">Chargement des backups...</p>
      )}

      {!loading && backups.length === 0 && (
        <p className="text-gray-500">Aucun backup pour le moment.</p>
      )}

      {backups.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 font-semibold">Fichier</th>
                <th className="p-3 font-semibold">Taille</th>
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((b) => (
                <tr key={b.filename} className="border-b hover:bg-gray-50">
                  <td className="p-3">{b.originalName}</td>
                  <td className="p-3 text-gray-600">{formatSize(b.size)}</td>
                  <td className="p-3 text-gray-600">{formatDate(b.createdAt)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDownload(b)}
                      disabled={downloading === b.filename}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {downloading === b.filename
                        ? "Téléchargement..."
                        : "Télécharger"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
