import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';
import { GetData } from '../../AsyncStorage/AsyncStorage';
import { API_URL } from '@env';

interface LoadMessage {
    id?: string;
    // boshqa kerakli load field'larini qo'shing
}

export const useSocketLoadListener = () => {
    const socketRef = useRef<any>(null);
    const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [newLoad, setNewLoad] = useState<LoadMessage | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const initializeSocket = (userId: string, uniqueId: string) => {
        socketRef.current = io(API_URL, {
            query: {
                user_id: userId,
                unique_id: uniqueId,
                role: 'driver'
            },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        // Asosiy socket events
        socketRef.current.on('connect', () => {
            console.log('Connected to Socket.IO server');
            setIsConnected(true);
        });

        socketRef.current.on('connect_error', (error: any) => {
            console.error('Socket connection error:', error);
            setIsConnected(false);
        });

        socketRef.current.on('error', (error: any) => {
            console.error('Socket.IO error:', error);
        });

        socketRef.current.on('disconnect', (reason: string) => {
            console.log('Disconnected from Socket.IO server:', reason);
            setIsConnected(false);
        });

        // Yangi yuk uchun tinglovchi
        socketRef.current.on('created_load', async (message: LoadMessage) => {
            console.log('Yangi yuk keldi:', message);
            setNewLoad(message);
            await showLoadNotification(message);
        });
    };

    // Notification ko'rsatish
    const showLoadNotification = async (message: LoadMessage) => {
        try {
            const channelId = 'new-loads';

            if (Platform.OS === 'android') {
                await notifee.createChannel({
                    id: channelId,
                    name: 'New Loads',
                    sound: 'default',
                    importance: AndroidImportance.HIGH,
                    vibration: true,
                });
            }

            await notifee.displayNotification({
                title: 'Yangi yuk',
                body: `Yangi yuk ma'lumotlari: ${message.id || 'Yangi buyurtma keldi'}`,
                android: {
                    channelId,
                    sound: 'default',
                    pressAction: {
                        id: 'default',
                    },
                    importance: AndroidImportance.HIGH,
                },
                ios: {
                    sound: 'default'
                }
            });
        } catch (error) {
            console.error('Notification xatosi:', error);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = await GetData('user_id');
                const uniqueId = await GetData('unique_id');
                if (userId && uniqueId) {
                    initializeSocket(userId, uniqueId);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();

        return () => {
            if (socketRef.current) {
                // socketRef.current.off('created_load'); // created_load tinglovchisini o'chirish
                // socketRef.current.disconnect();
            }
            if (locationIntervalRef.current) {
                clearInterval(locationIntervalRef.current);
            }
        };
    }, []);

    // Yangi yukni qabul qilish metodi
    const acceptLoad = async (loadId: string) => {
        try {
            if (socketRef.current && socketRef.current.connected) {
                socketRef.current.emit('accept_load', { loadId });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Load qabul qilishda xatolik:', error);
            return false;
        }
    };

    // Yukni rad etish metodi
    const rejectLoad = async (loadId: string) => {
        try {
            if (socketRef.current && socketRef.current.connected) {
                socketRef.current.emit('reject_load', { loadId });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Load rad etishda xatolik:', error);
            return false;
        }
    };

    return {
        newLoad,
        isConnected,
        acceptLoad,
        rejectLoad,
        socket: socketRef.current
    };
};