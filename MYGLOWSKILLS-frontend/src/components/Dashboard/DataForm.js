import React, { useState } from "react";
import { motion } from "framer-motion";

const DataForm = ({ onAdd }) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() !== "") {
      onAdd(value);
      setValue("");
    }
  };

  return (
    <motion.form className="data-form" onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <input type="text" placeholder="Nouvelle donnée" value={value} onChange={(e) => setValue(e.target.value)} />
      <motion.button type="submit" className="button-primary" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
        Ajouter
      </motion.button>
    </motion.form>
  );
};

export default DataForm;
