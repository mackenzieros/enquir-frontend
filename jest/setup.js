import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);
jest.mock('@react-native-community/push-notification-ios', () => {
    return {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        openURL: jest.fn(),
        canOpenURL: jest.fn(),
        getInitialURL: jest.fn(),
        requestPermissions: jest.fn(() => Promise.resolve()),
        getInitialNotification: jest.fn(() => Promise.resolve()),
    }
});