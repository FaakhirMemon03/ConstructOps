import Alert from '../models/alert.model.js';

// @desc    Get alerts list for a project
// @route   GET /api/v1/alerts
// @access  Private
export const getAlerts = async (req, res) => {
  const { projectId } = req.query;

  try {
    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Please specify projectId parameter' });
    }

    const alerts = await Alert.find({ projectId }).sort({ createdAt: -1 });
    res.json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Mark warning alert as read
// @route   PUT /api/v1/alerts/:id/read
// @access  Private
export const markAlertRead = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    alert.isRead = true;
    await alert.save();

    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};
