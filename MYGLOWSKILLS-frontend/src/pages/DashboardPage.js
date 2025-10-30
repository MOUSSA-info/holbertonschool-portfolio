import React, { useState } from "react";
import { motion } from "framer-motion";
import DataForm from "../components/Dashboard/DataForm";
import DataList from "../components/Dashboard/DataList";
import AlertsList from "../components/Dashboard/AlertsList";

const DashboardPage = () => {
  const [data, setData] = useState(["Exemple 1", "Exemple 2"]);
  const [alerts, setAlerts] = useState(["Alerte 1"]);

  const handleAddData = (item) => {
    setData([...data, item]);
    setAlerts([...alerts, `Nouvelle donnée ajoutée : ${item}`]);
  };

  return (
    <motion.div className="page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
      <h1>Tableau de bord 📊</h1>
      <DataForm onAdd={handleAddData} />
      <DataList data={data} />
      <AlertsList alerts={alerts} />
    </motion.div>
  );
};

export default DashboardPage;
