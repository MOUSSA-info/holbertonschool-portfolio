import React, { useState } from "react";
import { backupFile } from "../../services/api";

export default function Backup() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBackup = async () => {
    if (!file) {
      alert("Veuillez choisir un fichier !");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await backupFile(formData);
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
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={handleBackup}
        className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
      >
        {loading ? "Sauvegarde en cours..." : "Sauvegarder"}
      </button>

      {msg && <p className="mt-4 text-green-700">{msg}</p>}
    </div>
  );
}
