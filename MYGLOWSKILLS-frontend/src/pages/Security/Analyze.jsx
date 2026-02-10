import React, { useState } from "react";
import { analyzeSecurity } from "../../services/api";

export default function Analyze() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await analyzeSecurity();
      setReport(res.data.data);
    } catch (err) {
      console.error(err);
      setReport(null);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">🧠 Analyse de Sécurité</h2>
      <button
        onClick={handleAnalyze}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Analyse en cours..." : "Lancer l'analyse"}
      </button>

      {report && (
        <div className="mt-4 space-y-2">
          <p>
            <strong>Statut :</strong> {report.status}
          </p>
          <p>
            <strong>Problèmes trouvés :</strong> {report.issuesFound}
          </p>
          <div className="ml-4">
            {report.details.map((d) => (
              <p key={d.id}>
                ⚠️ {d.message} (<span className="capitalize">{d.severity}</span>)
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
