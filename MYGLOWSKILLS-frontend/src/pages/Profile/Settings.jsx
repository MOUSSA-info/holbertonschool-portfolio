import React, { useState } from "react";

export default function Settings() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Appel API ici pour sauvegarder email/password
      // ex: await updateUserSettings({ email, password });

      setMessage("✅ Informations mises à jour avec succès !");
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur lors de la mise à jour.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-md">
      <h2 className="text-2xl font-bold mb-4">⚙️ Paramètres du compte</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Email :</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Mot de passe :</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Enregistrement..." : "Enregistrer"}
      </button>

      {message && <p className="mt-4 text-green-700">{message}</p>}
    </div>
  );
}
