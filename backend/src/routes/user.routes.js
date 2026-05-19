import express from 'express';
import { protect, verifyAdmin } from '../middleware/auth.middleware.js';
import User from '../models/user.model.js';

const router = express.Router();

// GET all registered users (Admin only)
router.get('/', protect, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({})
      .populate('companyId', 'name')
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// PUT ban/unban user account (Admin only)
router.put('/:id/status', protect, verifyAdmin, async (req, res) => {
  const { status } = req.body;

  if (!['active', 'banned'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.status = status;
    await user.save();

    res.json({ success: true, message: `User status updated to ${status}`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// DELETE deactivate/delete user account (Admin only)
router.delete('/:id', protect, verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.deleteOne();

    res.json({ success: true, message: 'User deactivated and account deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

export default router;
