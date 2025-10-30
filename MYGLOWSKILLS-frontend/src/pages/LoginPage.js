import React from "react";
import { motion } from "framer-motion";
import Login from "../components/Auth/Login";

const LoginPage = () => (
  <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.5 }}>
    <Login />
  </motion.div>
);

export default LoginPage;
