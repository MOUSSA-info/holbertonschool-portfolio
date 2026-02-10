import React, { useEffect, useState } from "react";
import { getOverview } from "../../services/api";

export default function Overview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOverview()
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-red-500">Impossible de récupérer les données.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">🔒 Aperçu de la Sécurité</h2>
      <div className="space-y-2">
        <p>
          <span className="font-semibold">Données sauvegardées :</span>{" "}
          {(data.savedDataBytes / 1024 / 1024).toFixed(2)} MB
        </p>
        <p>
          <span className="font-semibold">Alertes détectées :</span>{" "}
          {data.alertsCount}
        </p>
        <p>
          <span className="font-semibold">Dernière vérification :</span>{" "}
          {new Date(data.lastCheck).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
