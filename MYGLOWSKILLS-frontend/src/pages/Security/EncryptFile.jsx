import React, { useState } from "react";
import { encryptFile, decryptFile } from "../../services/api";

export default function EncryptFile() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("encrypt");

  const handleAction = async () => {
    if (!file) {
      alert("Veuillez choisir un fichier !");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      let res;
      if (mode === "encrypt") {
        res = await encryptFile(file);
      } else {
        res = await decryptFile(file);
      }
      setResult(
        res.data.message +
          (res.data.downloadUrl
            ? ` — Téléchargez ici: ${res.data.downloadUrl}`
            : "")
      );
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          `Erreur lors du ${mode === "encrypt" ? "chiffrement" : "déchiffrement"} du fichier.`
      );
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        🔐 Chiffrement / Déchiffrement de fichier
      </h2>

      <div className="mb-4">
        <label className="mr-4">
          <input
            type="radio"
            value="encrypt"
            checked={mode === "encrypt"}
            onChange={(e) => setMode(e.target.value)}
          />
          Chiffrer
        </label>
        <label>
          <input
            type="radio"
            value="decrypt"
            checked={mode === "decrypt"}
            onChange={(e) => setMode(e.target.value)}
          />
          Déchiffrer
        </label>
      </div>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={handleAction}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        {loading
          ? `${mode === "encrypt" ? "Chiffrement" : "Déchiffrement"} en cours...`
          : mode === "encrypt"
            ? "Chiffrer"
            : "Déchiffrer"}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          {result}
        </div>
      )}
    </div>
  );
}
