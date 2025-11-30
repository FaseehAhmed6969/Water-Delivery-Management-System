// Request notification permission
export const requestNotificationPermission = async () => {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    return false;
};

// Show browser notification
export const showBrowserNotification = (title, options = {}) => {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, {
            icon: '/logo192.png',
            badge: '/logo192.png',
            vibrate: [200, 100, 200],
            tag: 'aquaflow-notification',
            requireInteraction: false,
            ...options
        });

        // Auto close after 5 seconds
        setTimeout(() => notification.close(), 5000);

        return notification;
    }
};

// Play notification sound
export const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLTgjMGHGS56+OcTgwOUqzj7rdlHAU7k9n0y3ksBS2AzvLMfS0GI3fI8diWRQoSYLfq6KhWFApFoOHzwHAjBzCAzvLOgi8GJHfH8N2RQQoTX7Xp7KlXFApFn+Dzwm8iBymBzvLQgi8GH2a66+OcUAwPUq3j7bdlHQU8k9j0zHotBS59zvLLgDAFJnfI8duXRgoSYrfq6qhVFApGnuHz');
    audio.play().catch(() => { });
};

// Check for new notifications
export const checkNewNotifications = async (lastCheckTime, token) => {
    try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/notifications`, {
            headers: { 'x-auth-token': token }
        });
        const notifications = await response.json();

        const newNotifs = notifications.filter(n =>
            !n.isRead && new Date(n.createdAt) > new Date(lastCheckTime)
        );

        return newNotifs;
    } catch (error) {
        console.error('Error checking notifications:', error);
        return [];
    }
};
