import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import io, { Socket } from 'socket.io-client';
import { SocketConfig, SocketConnectionReturn } from './types';
import { API_URL } from '@env';

export const useSocketConnection = (
    userId: string | null,
    uniqueId: string | null
): SocketConnectionReturn => {
    const socketRef = useRef<Socket | null>(null);
    const appState = useRef<AppStateStatus>(AppState.currentState);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const initializeSocket = (): void => {
        if (socketRef.current?.connected || !userId || !uniqueId) return;

        const socketConfig: SocketConfig = {
            user_id: userId,
            unique_id: uniqueId,
            role: 'driver'
        };

        try {
            socketRef.current = io(API_URL, {
                query: socketConfig,
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 1000,
                forceNew: false,
                pingTimeout: 60000,
                pingInterval: 25000
            });

            setupSocketListeners();
        } catch (error) {
            console.error('Socket initialization error:', error);
        }
    };

    const setupSocketListeners = (): void => {
        if (!socketRef.current) return;

        socketRef.current.on('connect', () => {
            console.log('Socket connected');
            setIsConnected(true);
        });

        socketRef.current.on('disconnect', (reason: string) => {
            console.log('Socket disconnected:', reason);
            setIsConnected(false);
            if (reason !== 'io server disconnect') {
                reconnectSocket();
            }
        });

        socketRef.current.on('connect_error', (error: Error) => {
            console.error('Socket connection error:', error);
            setIsConnected(false);
            reconnectSocket();
        });
    };

    const reconnectSocket = (): void => {
        if (socketRef.current && !socketRef.current.connected) {
            console.log('Attempting to reconnect...');
            socketRef.current.connect();
        }
    };

    const disconnectSocket = (): void => {
        if (socketRef.current?.connected) {
            console.log('Disconnecting socket...');
            socketRef.current.disconnect();
            setIsConnected(false);
        }
    };

    const handleAppStateChange = (nextAppState: AppStateStatus): void => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            reconnectSocket();
        } else if (nextAppState.match(/inactive|background/)) {
            disconnectSocket();
        }
        appState.current = nextAppState;
    };

    useEffect(() => {
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        if (userId && uniqueId) {
            initializeSocket();
        }

        return () => {
            subscription.remove();
            disconnectSocket();
        };
    }, [userId, uniqueId]);

    return {
        socket: socketRef.current,
        reconnect: reconnectSocket,
        disconnect: disconnectSocket,
        isConnected
    };
};