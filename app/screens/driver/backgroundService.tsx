import BackgroundService from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import SocketService from '../ui/Socket/index';

interface LocationData {
    latitude: number;
    longitude: number;
}

interface BackgroundServiceParams {
    driverId: string;
    initialLocation: LocationData;
}

interface TaskDataArguments {
    delay: number;
    driverId: string;
    initialLocation: LocationData;
}

const options = {
    taskName: 'LocationUpdate',
    taskTitle: 'Location Tracking',
    taskDesc: 'Tracking location in background',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#7257FF',
    linkingURI: 'yourapp://chat/jane',
    parameters: {
        delay: 60000, // 1 minute delay
    },
};

// Background task with type definition
const locationTask = async (taskDataArguments: TaskDataArguments) => {
    const { delay, driverId, initialLocation } = taskDataArguments;
    let currentLocation = initialLocation;

    await new Promise<void>(async (resolve) => {
        const backgroundTask = () => {
            Geolocation.getCurrentPosition(
                (position) => {
                    currentLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };

                    // Socket service instance
                    const socketService = SocketService.getInstance();
                    socketService.emitLocationUpdate(currentLocation, driverId);
                },
                (error) => {
                    console.error('Background location error:', error);
                    // If error occurs, use last known location
                    const socketService = SocketService.getInstance();
                    socketService.emitLocationUpdate(currentLocation, driverId);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                    distanceFilter: 50
                }
            );
        };

        // Execute immediately once
        backgroundTask();

        // Then set up the interval
        setInterval(backgroundTask, delay);
    });
};

export const startBackgroundService = async (params: BackgroundServiceParams) => {
    try {
        // Check if the service is already running
        if (!BackgroundService.isRunning()) {
            const taskOptions = {
                ...options,
                parameters: {
                    ...options.parameters,
                    driverId: params.driverId,
                    initialLocation: params.initialLocation
                }
            };

            await BackgroundService.start(locationTask, taskOptions);
            console.log('Background service started successfully');
        }
    } catch (error) {
        console.error('Error starting background service:', error);
    }
};

export const stopBackgroundService = async () => {
    try {
        await BackgroundService.stop();
        console.log('Background service stopped successfully');
    } catch (error) {
        console.error('Error stopping background service:', error);
    }
};