/**
 * @format
 */

import {NativeModules, Platform, AppState, Alert} from 'react-native';
import React from 'react';
import App from './App';
import {render, cleanup, fireEvent} from '@testing-library/react-native';

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native'); // use original implementation, which comes with mocks out of the box

  // mock modules/components created by assigning to NativeModules
  RN.NativeModules.ScreenShot = {
    start: jest.fn(() => Promise.resolve('1.0')),
    stop: jest.fn(() => Promise.resolve('1.0')),
  };
  RN.NativeModules.RNCNetInfo = {
    getCurrentConnectivity: jest.fn(),
    isConnectionMetered: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  };

  return RN;
});
//, {ValidationErrors}
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),

  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));
// jest.mock('NativeModules', () => {
//   return {
//     addEventListener: jest.fn(),
//     removeEventListener: jest.fn(),
//     inFocusDisplaying: jest.fn(),
//     ScreenShot: jest.fn(),
//   };
// });
jest.mock('react-native-device-info', () => {
  return {
    getMacAddress: jest.fn(() => Promise.resolve('1.0')),
    getSystemName: jest.fn(() => Promise.resolve('My App')),
    getVersion: () => 4,
  };
});

describe('Screenshot Toggler', () => {
  let wrapper;
  beforeEach(() => {
    Platform.OS = 'android';

    AppState.currentState = 'active';
    wrapper = render(<App />);
  });

  afterEach(() => {
    cleanup();
    wrapper = null;
    Platform.OS = 'android';
  });

  it('User is able to see Logo and Activate Button', () => {
    expect(wrapper).toMatchSnapshot();
    const {getByTestId} = wrapper;
    const submitButton = getByTestId('submit-button');
    expect(submitButton).toBeEnabled();
  });

  it('user Pressed activate button', () => {
    const {getByTestId} = wrapper;
    const submitButton = getByTestId('submit-button');
    fireEvent(submitButton, 'onPress');
    //const validationError = getByTestId('text-error');

    // expect(validationError).toBeTruthy();
    // expect(validationError.props.children).toBe(ValidationErrors.Activated);
  });

  it('user Pressed deactivate button', () => {
    const {getByTestId} = wrapper;
    const submitButton = getByTestId('submit-button');
    const submitButton2 = getByTestId('submit-button');
    fireEvent(submitButton, 'onPress');
    fireEvent(submitButton2, 'onPress');
    //const validationError = getByTestId('text-error');

    // expect(validationError).toBeTruthy();
    // expect(validationError.props.children).toBe(ValidationErrors.Deactivated);
  });
});
