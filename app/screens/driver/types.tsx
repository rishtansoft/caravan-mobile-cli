import io, { Socket } from 'socket.io-client';


export interface LocationData {
    latitude: number;
    longitude: number;
    driverId: string;
}

export interface SocketConfig {
    user_id: string;
    unique_id: string;
    role: string;
}

export interface SocketConnectionReturn {
    socket: Socket | null;
    reconnect: () => void;
    disconnect: () => void;
    isConnected: boolean;
}