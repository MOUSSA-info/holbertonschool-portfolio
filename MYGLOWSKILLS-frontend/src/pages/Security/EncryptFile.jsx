import React, { useState } from "react";
import { Link } from "react-router-dom";
import { encryptFile } from "../../services/api";

export default function EncryptFile() {
  const [result, setResult] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setDownloadUrl(null);
    try {
      const res = await encryptFile(selected);
      setResult(res.data.message);
      if (res.data.downloadUrl) {
        const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
        setDownloadUrl(baseUrl + res.data.downloadUrl);
      }
    } catch (err) {
      console.error("Encrypt error:", err);
      setError(
        err.response?.data?.message ||
          "Erreur lors du chiffrement du fichier."
      );
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        Chiffrement de fichier
      </h2>

      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4"
        disabled={loading}
      />

      {loading && (
        <p className="mt-2 text-yellow-600">Chiffrement en cours...</p>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          <p>{result}</p>
          {downloadUrl && (
            <a
              href={downloadUrl}
              download
              className="inline-block mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Telecharger le fichier chiffre
            </a>
          )}
          <Link
            to="/security/backups"
            className="inline-block mt-3 ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Voir mes fichiers
          </Link>
        </div>
      )}
    </div>
  );
}
