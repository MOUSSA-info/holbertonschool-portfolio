import React, { useState } from "react";
import { Link } from "react-router-dom";
import { backupFile } from "../../services/api";

export default function Backup() {
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setMsg(null);
    setError(null);
    setLoading(true);

    try {
      const res = await backupFile(selected);
      setMsg(res.data.message + (res.data.path ? ` - Chemin: ${res.data.path}` : ""));
    } catch (err) {
      console.error("Backup error:", err);
      setError(
        err.response?.data?.message ||
          "Erreur lors de la sauvegarde du fichier."
      );
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">💾 Sauvegarde Sécurisée</h2>

      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4"
        disabled={loading}
      />

      {loading && <p className="mt-2 text-yellow-600">Sauvegarde en cours...</p>}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {msg && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          <p>{msg}</p>
          <Link
            to="/security/backups"
            className="inline-block mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Voir mes fichiers
          </Link>
        </div>
      )}
    </div>
  );
}
