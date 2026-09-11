const storage = require('../services/storageService');

// GET /api/incidents
exports.getIncidents = async (req, res) => {
  try {
    const incidents = await storage.getAllIncidents();
    res.json({ success: true, count: incidents.length, data: incidents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve incidents', error: error.message });
  }
};

// POST /api/incidents
exports.createIncident = async (req, res) => {
  try {
    const { type, department, severity, reportedBy, description, correctiveAction } = req.body;

    if (!type || !department || !reportedBy || !description || !correctiveAction) {
      return res.status(400).json({
        success: false,
        message: 'Type, department, reporter name, description, and corrective action are required.',
      });
    }

    const incidentId = `INC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newInc = await storage.createIncident({
      incidentId,
      type,
      department,
      severity: severity || 'Moderate',
      reportedBy: reportedBy.trim(),
      description: description.trim(),
      correctiveAction: correctiveAction.trim(),
      status: 'Resolved',
      reportedDate: new Date(),
    });

    res.status(201).json({ success: true, message: 'Safety incident logged for audit', data: newInc });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to record incident', error: error.message });
  }
};
