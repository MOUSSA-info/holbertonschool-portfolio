import React, { useState } from "react";
import { encryptFile } from "../../services/api";

export default function EncryptFile() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEncrypt = async () => {
    if (!file) {
      alert("Veuillez choisir un fichier !");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await encryptFile(formData);
      setResult(res.data.message + (res.data.download ? ` - Téléchargez ici: ${res.data.download}` : ""));
    } catch (err) {
      console.error(err);
      setResult("Erreur lors du chiffrement du fichier.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">🔐 Chiffrement de fichier</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={handleEncrypt}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        {loading ? "Chiffrement en cours..." : "Chiffrer"}
      </button>

      {result && <p className="mt-4 text-green-700">{result}</p>}
    </div>
  );
}
