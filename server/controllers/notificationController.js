import { Notification } from '../models/index.js';

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 30
    });
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    return res.json({ success: true, notifications, unreadCount });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOne({ where: { id, userId: req.user.id } });
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    await notification.update({ isRead: true });
    return res.json({ success: true, notification });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update notification', error: error.message });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.update({ isRead: true }, { where: { userId: req.user.id, isRead: false } });
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update notifications', error: error.message });
  }
};

// Helper used internally by other controllers (applications, leads, etc.) to raise an in-app notification
export const notifyUser = async (userId, { title, message, type = 'system', link = null }) => {
  try {
    await Notification.create({ userId, title, message, type, link });
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};
