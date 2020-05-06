import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

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

// Silence Enzyme DOM rendering warning messages
const originalConsoleError = console.error;
console.error = (message) => {
  if (message.startsWith('Warning:')) {
    return;
  }

  originalConsoleError(message);
};
