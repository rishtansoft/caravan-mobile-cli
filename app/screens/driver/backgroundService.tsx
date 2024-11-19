import BackgroundService from 'react-native-background-actions';

interface BackgroundTaskOptions {
    taskName: string;
    taskTitle: string;
    taskDesc: string;
    taskIcon: {
        name: string;
        type: string;
    };
    color: string;
    linkingURI?: string;
    parameters?: {
        delay: number;
    };
}

export class BackgroundLocationService {
    private static instance: BackgroundLocationService;
    private isRunning: boolean = false;

    private constructor() { }

    public static getInstance(): BackgroundLocationService {
        if (!BackgroundLocationService.instance) {
            BackgroundLocationService.instance = new BackgroundLocationService();
        }
        return BackgroundLocationService.instance;
    }

    private options: BackgroundTaskOptions = {
        taskName: 'LocationTracker',
        taskTitle: 'Location Tracking',
        taskDesc: 'Tracking your location in background',
        taskIcon: {
            name: 'location',
            type: 'material',
        },
        color: '#ff0000',
        parameters: {
            delay: 60000, // 1 minute delay
        },
    };

    private backgroundTask = async (parameters: any) => {
        const { delay } = parameters;

        await new Promise(async () => {
            while (BackgroundService.isRunning()) {
                // Your background task logic here
                console.log('Background location service running');
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        });
    };

    public async startService(): Promise<void> {
        if (!this.isRunning) {
            try {
                await BackgroundService.start(this.backgroundTask, this.options);
                this.isRunning = true;
                console.log('Background service started');
            } catch (error) {
                console.error('Error starting background service:', error);
            }
        }
    }

    public async stopService(): Promise<void> {
        if (this.isRunning) {
            try {
                await BackgroundService.stop();
                this.isRunning = false;
                console.log('Background service stopped');
            } catch (error) {
                console.error('Error stopping background service:', error);
            }
        }
    }
}