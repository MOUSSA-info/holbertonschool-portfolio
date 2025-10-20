const Alert = require("../models/Alert");

exports.createAlert = async (req, res) => {
  try {
    const alert = new Alert({ ...req.body, user: req.user.id });
    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user.id });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.markAlertAsSeen = async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { seen: true },
      { new: true }
    );
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
