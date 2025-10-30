import React from "react";
import { motion } from "framer-motion";

const DataList = ({ data }) => (
  <motion.div className="data-list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <h2>Liste des données</h2>
    {data.length === 0 ? <p>Aucune donnée disponible.</p> : <ul>{data.map((item, i) => <li key={i}>{item}</li>)}</ul>}
  </motion.div>
);

export default DataList;
