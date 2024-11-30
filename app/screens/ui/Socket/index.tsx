import { AppState, AppStateStatus, Platform } from 'react-native';
import io, { Socket } from 'socket.io-client';
import notifee, { AndroidImportance } from '@notifee/react-native';
import BackgroundService from 'react-native-background-actions';
import NetInfo from '@react-native-community/netinfo';
import { GetData } from '../../AsyncStorage/AsyncStorage';
import { API_URL } from '@env';

interface LoadMessage {
    id?: string;
    // Add other load fields as necessary
}

interface SocketConfig {
    user_id: string;
    unique_id: string;
    role: string;
}

class SocketService {
    private static instance: SocketService;
    private socket: Socket | null = null;
    private isRunning: boolean = false;
    private userId: string | null = null;
    private uniqueId: string | null = null;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private listeners: Set<(data: any) => void> = new Set();
    private locationIntervalRef: NodeJS.Timeout | null = null;

    private constructor() {
        AppState.addEventListener('change', this.handleAppStateChange);
        NetInfo.addEventListener(this.handleConnectivityChange);
    }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    private handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
            this.reconnectSocket();
        } else if (nextAppState === 'background') {
            this.startBackgroundService();
        }
    };

    private handleConnectivityChange = (state: any) => {
        if (state.isConnected) {
            console.log('Internet reconnected');
            this.reconnectSocket();
        } else {
            console.log('Internet disconnected');
            this.disconnectSocket();
        }
    };

    private backgroundOptions = {
        taskName: 'SocketService',
        taskTitle: 'Socket Connection',
        taskDesc: 'Maintaining socket connection in the background',
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
        while (BackgroundService.isRunning()) {
            if (!this.socket?.connected) {
                await this.reconnectSocket();
            }
            await new Promise(resolve => setTimeout(resolve, parameters.delay));
        }
    };

    private async startBackgroundService() {
        if (!this.isRunning) {
            try {
                await BackgroundService.start(this.backgroundTask, this.backgroundOptions);
                this.isRunning = true;
                console.log('Socket background service started');
            } catch (error) {
                console.log('Error starting background service:', error);
            }
        }
    }

    public async initialize() {
        try {
            const userId = await GetData('user_id');
            const uniqueId = await GetData('unique_id');
            if (userId && uniqueId) {
                this.userId = userId;
                this.uniqueId = uniqueId;
                this.connectSocket();
            }
        } catch (error) {
            console.log('Error fetching user data:', error);
        }
    }

    private connectSocket() {
        if (!this.userId || !this.uniqueId || this.socket?.connected) return;

        const socketConfig: SocketConfig = {
            user_id: this.userId,
            unique_id: this.uniqueId,
            role: 'driver',
        };

        try {
            this.socket = io(API_URL, {
                query: socketConfig,
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 1000,
                pingTimeout: 60000,
                pingInterval: 25000,
            });

            this.setupSocketListeners();
        } catch (error) {
            console.log('Socket initialization error:', error);
            this.scheduleReconnect();
        }
    }

    private setupSocketListeners() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('Socket connected');
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
            }
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            this.scheduleReconnect();
        });

        this.socket.on('connect_error', (error) => {
            console.log('Socket connection error:', error);
            this.scheduleReconnect();
        });

        this.socket.on('created_load', async (message: LoadMessage) => {
            console.log('New load received:', message);
            await this.showNotification();
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
                console.log('Socket reconnection failed:', error);
                this.scheduleReconnect();
            }
        }
    }

    private disconnectSocket() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    public async emitLocationUpdate(location: { latitude: number; longitude: number }, driverId: string) {
        if (this.socket?.connected) {
            this.socket.emit('locationUpdate', {
                latitude: location.latitude,
                longitude: location.longitude,
                driverId: driverId,
            });
            console.log('Location update:', location);
        } else {
            console.log('Socket not connected, location update failed');
        }
    }

    public async showNotification() {
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
                body: `Yangi yuk qo'shildi`,
                android: {
                    channelId,
                    sound: 'default',
                    importance: AndroidImportance.HIGH,
                    pressAction: {
                        id: 'default',
                    },
                },
                ios: {
                    sound: 'default',
                },
            });
        } catch (error) {
            console.log('Notification error:', error);
        }
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

export default SocketService;
