import { AppState, AppStateStatus } from 'react-native';
import io, { Socket } from 'socket.io-client';
import { API_URL } from '@env';
import BackgroundService from 'react-native-background-actions';
import notifee, { AndroidImportance } from '@notifee/react-native';

interface SocketConfig {
    user_id: string;
    unique_id: string;
    role: string;
}

class SocketBackgroundService {
    private static instance: SocketBackgroundService;
    private socket: Socket | null = null;
    private isRunning: boolean = false;
    private userId: string | null = null;
    private uniqueId: string | null = null;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private listeners: Set<(data: any) => void> = new Set();

    private constructor() {
        // AppState o'zgarishlarini kuzatish
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    public static getInstance(): SocketBackgroundService {
        if (!SocketBackgroundService.instance) {
            SocketBackgroundService.instance = new SocketBackgroundService();
        }
        return SocketBackgroundService.instance;
    }

    private handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
            this.reconnectSocket();
        } else if (nextAppState === 'background') {
            // Background serviceni ishga tushirish
            this.startBackgroundService();
        }
    };

    private backgroundOptions = {
        taskName: 'SocketService',
        taskTitle: 'Socket Connection',
        taskDesc: 'Maintaining socket connection in background',
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
        },
        color: '#ffffff',
        parameters: {
            delay: 5000,
        },
    };

    private backgroundTask = async (parameters: any) => {
        await new Promise(async () => {
            while (BackgroundService.isRunning()) {
                if (!this.socket?.connected) {
                    await this.reconnectSocket();
                }
                await new Promise(resolve => setTimeout(resolve, parameters.delay));
            }
        });
    };

    private async startBackgroundService() {
        if (!this.isRunning) {
            try {
                await BackgroundService.start(this.backgroundTask, this.backgroundOptions);
                this.isRunning = true;
                console.log('Socket background service started');
            } catch (error) {
                console.error('Error starting background service:', error);
            }
        }
    }

    public initialize(userId: string, uniqueId: string) {
        this.userId = userId;
        this.uniqueId = uniqueId;
        this.connectSocket();
    }

    private connectSocket() {
        if (!this.userId || !this.uniqueId || this.socket?.connected) return;

        const socketConfig: SocketConfig = {
            user_id: this.userId,
            unique_id: this.uniqueId,
            role: 'driver'
        };

        try {
            this.socket = io(API_URL, {
                query: socketConfig,
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 1000,
                forceNew: false,
                pingTimeout: 60000,
                pingInterval: 25000
            });

            this.setupSocketListeners();
        } catch (error) {
            console.error('Socket initialization error:', error);
            this.scheduleReconnect();
        }
    }

    private setupSocketListeners() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('Socket connected in background service');
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
            }
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Socket disconnected in background:', reason);
            this.scheduleReconnect();
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error in background:', error);
            this.scheduleReconnect();
        });
    }

    private scheduleReconnect() {
        if (!this.reconnectTimer) {
            this.reconnectTimer = setTimeout(() => {
                this.reconnectSocket();
            }, 5000);
        }
    }

    private async reconnectSocket() {
        if (this.socket && !this.socket.connected) {
            try {
                await this.socket.connect();
                console.log('Socket reconnected successfully');
            } catch (error) {
                console.error('Socket reconnection failed:', error);
                this.scheduleReconnect();
            }
        }
    }

    public emitLocationUpdate(location: { latitude: number; longitude: number }, driverId: string) {
        if (this.socket?.connected) {
            this.socket.emit('locationUpdate', {
                latitude: location.latitude,
                longitude: location.longitude,
                driverId: driverId
            });
            console.log('mazil add', new Date());
        } else {
            console.warn('Socket not connected, queuing location update');
            // Location update ni queue ga qo'shish mumkin
        }
    }

    public addListener(callback: (data: any) => void) {
        this.listeners.add(callback);
    }

    public removeListener(callback: (data: any) => void) {
        this.listeners.delete(callback);
    }

    public disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        if (this.isRunning) {
            BackgroundService.stop();
            this.isRunning = false;
        }
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
    }
}

export default SocketBackgroundService;