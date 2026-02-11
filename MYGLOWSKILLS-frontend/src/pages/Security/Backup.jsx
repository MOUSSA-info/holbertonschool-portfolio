import React, { useState } from "react";
import { backupFile } from "../../services/api";

export default function Backup() {
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setMsg(null);
    setLoading(true);

    try {
      const res = await backupFile(selected);
      setMsg(res.data.message + (res.data.path ? ` - Chemin: ${res.data.path}` : ""));
    } catch (err) {
      console.error(err);
      setMsg("Erreur lors de la sauvegarde du fichier.");
    }
    setLoading(false);
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
      {msg && <p className="mt-4 text-green-700">{msg}</p>}
    </div>
  );
}
