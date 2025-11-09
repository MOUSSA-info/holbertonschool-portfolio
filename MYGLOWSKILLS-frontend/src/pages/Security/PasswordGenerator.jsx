import React, { useState } from "react";
import { generatePassword } from "../../services/api";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generatePassword();
      setPassword(res.data.password);
    } catch (err) {
      console.error(err);
      setPassword("Erreur lors de la génération du mot de passe.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">🔑 Générateur de mot de passe</h2>

      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        {loading ? "Génération en cours..." : "Générer"}
      </button>

      {password && (
        <p className="mt-4 text-gray-800 font-mono text-lg">
          <strong>{password}</strong>
        </p>
      )}
    </div>
  );
}
