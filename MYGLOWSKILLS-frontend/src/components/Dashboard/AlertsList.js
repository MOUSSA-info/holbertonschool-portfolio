import React from "react";
import { motion } from "framer-motion";

const AlertsList = ({ alerts }) => (
  <motion.div className="alerts-list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <h2>Alertes</h2>
    {alerts.length === 0 ? <p>Aucune alerte.</p> : <ul>{alerts.map((alert, i) => <li key={i}>{alert}</li>)}</ul>}
  </motion.div>
);

export default AlertsList;
