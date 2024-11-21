import { Platform } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';

class SystemNotificationPlayer {
    // Android bildirishnomasini ko'rsatish va ovozni chalish
    async playNotification(title: string, body: string): Promise<void> {
        try {
            // Bildirishnoma kanali yaratish
            const channelId = await notifee.createChannel({
                id: 'default',
                name: 'Default Channel',
                sound: 'default', // Sistemaning default ovozini ishlatish
                importance: AndroidImportance.HIGH,
                vibration: true,
            });

            // Bildirishnamani ko'rsatish
            await notifee.displayNotification({
                title,
                body,
                android: {
                    channelId,
                    sound: 'default',
                    importance: AndroidImportance.HIGH,
                    // Vibratsiya
                    vibrationPattern: [300, 500],
                },
                ios: {
                    sound: 'default'
                }
            });
        } catch (error) {
            console.error('Notification error:', error);
            throw error;
        }
    }

    // Barcha bildirishnomalarni o'chirish
    async cancelAllNotifications(): Promise<void> {
        try {
            await notifee.cancelAllNotifications();
        } catch (error) {
            console.error('Cancel notifications error:', error);
            throw error;
        }
    }
}

export default SystemNotificationPlayer;