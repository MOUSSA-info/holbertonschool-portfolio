import React from "react";

export default function Guide() {
  return (
    <div className="p-6 bg-white rounded shadow-md max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">📖 Guide d'utilisation</h2>
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        <li>Accéder à votre tableau de bord pour voir les alertes et statistiques.</li>
        <li>Analyser vos données pour détecter les vulnérabilités.</li>
        <li>Chiffrer ou sauvegarder vos fichiers importants.</li>
        <li>Gérer vos informations de compte et les rôles des utilisateurs.</li>
        <li>Consulter le support et les FAQ pour toute assistance.</li>
      </ul>
    </div>
  );
}
