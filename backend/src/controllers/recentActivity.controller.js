import RecentActivity from '../models/RecentActivity.js';

/**
 * Fetch recent activities for the authenticated user.
 */
export const getRecentActivitiesByUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const activities = await RecentActivity.find({ userId }).sort({ activityTime: -1 });
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST: Create a new recent activity for the authenticated user
export const createRecentActivity = async (req, res) => {
    try {
        const userId = req.user._id;
        const activity = new RecentActivity({
            ...req.body,
            userId,
        });
        const savedActivity = await activity.save();
        res.status(201).json(savedActivity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT: Update a recent activity (only if it belongs to the authenticated user)
export const updateRecentActivity = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        const updated = await RecentActivity.findOneAndUpdate(
            { _id: id, userId },
            req.body,
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ message: 'Activity not found or unauthorized' });
        }
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE: Delete a recent activity (only if it belongs to the authenticated user)
export const deleteRecentActivity = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        const deleted = await RecentActivity.findOneAndDelete({ _id: id, userId });
        if (!deleted) {
            return res.status(404).json({ message: 'Activity not found or unauthorized' });
        }
        res.json({ message: 'Activity deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

