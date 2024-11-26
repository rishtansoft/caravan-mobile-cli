import React, { useEffect, useRef } from 'react';
import BackgroundTimer from 'react-native-background-timer';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

// Custom EventEmitter implementation
class CustomEventEmitter {
    private listeners: Map<string, Set<Function>>;

    constructor() {
        this.listeners = new Map();
    }

    addListener(eventName: string, callback: Function) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, new Set());
        }
        this.listeners.get(eventName)?.add(callback);
        return {
            remove: () => {
                this.listeners.get(eventName)?.delete(callback);
            }
        };
    }

    removeAllListeners(eventName: string) {
        this.listeners.delete(eventName);
    }

    emit(eventName: string, ...args: any[]) {
        this.listeners.get(eventName)?.forEach(callback => callback(...args));
    }
}

// Create custom event emitter instance
const customEmitter = new CustomEventEmitter();

// Background timer service
class BackgroundTimerService {
    private timerId: number | null = null;
    private eventEmitter: CustomEventEmitter;

    constructor() {
        this.eventEmitter = customEmitter;
    }

    startBackgroundTimer(callback: () => void, delay: number) {
        if (Platform.OS === 'ios') {
            BackgroundTimer.start();
            this.timerId = BackgroundTimer.setInterval(callback, delay);
        } else {
            BackgroundTimer.runBackgroundTimer(callback, delay);
        }
    }

    stopBackgroundTimer() {
        if (Platform.OS === 'ios') {
            if (this.timerId !== null) {
                BackgroundTimer.clearInterval(this.timerId);
                BackgroundTimer.stop();
            }
        } else {
            BackgroundTimer.stopBackgroundTimer();
        }
        this.timerId = null;
    }

    addListener(eventName: string, callback: Function) {
        return this.eventEmitter.addListener(eventName, callback);
    }

    removeListeners(eventName: string) {
        this.eventEmitter.removeAllListeners(eventName);
    }
}

// Hook for using background timer
export const useBackgroundTimer = (callback: () => void, delay: number) => {
    const timerService = useRef(new BackgroundTimerService());

    useEffect(() => {
        return () => {
            timerService.current.stopBackgroundTimer();
        };
    }, []);

    const startTimer = () => {
        timerService.current.startBackgroundTimer(callback, delay);
    };

    const stopTimer = () => {
        timerService.current.stopBackgroundTimer();
    };

    return { startTimer, stopTimer };
};

// Usage example in your component:
const ExampleUsage: React.FC = () => {
    const { startTimer, stopTimer } = useBackgroundTimer(() => {
        console.log('Background timer tick');
        // Your background task logic here
    }, 60000); // 60 seconds

    useEffect(() => {
        startTimer();
        return () => stopTimer();
    }, []);

    return null;
};

export default BackgroundTimerService;