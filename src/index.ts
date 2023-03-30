import { DeviceEventEmitter, NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  'The package "react-native-zebra-scanner" doesn\'t seem to be linked. Make sure: \n\n' +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ReactNativeZebraScanner = NativeModules.ReactNativeZebraScanner
  ? NativeModules.ReactNativeZebraScanner
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );
let isListenerAssigned: boolean;

ReactNativeZebraScanner.startReader = (handler: (data: any) => void) => {
  if (!isListenerAssigned) {
    // Initialize the Zebra scanner
    return ReactNativeZebraScanner.init().then(() => {
      // Subscribe to the BARCODE_READ_SUCCESS event
      if (
        DeviceEventEmitter.addListener(
          ReactNativeZebraScanner.BARCODE_READ_SUCCESS,
          // Pass the event data to the specified handler function
          (data) => handler(data)
        )
      ) {
        isListenerAssigned = true;
      }
    });
  }
  return;
};

ReactNativeZebraScanner.stopReader = () => {
  if (isListenerAssigned) {
    // Finalize the Zebra scanner
    return ReactNativeZebraScanner.finalize().then(() => {
      // Unsubscribe from the event
      DeviceEventEmitter.removeAllListeners(
        ReactNativeZebraScanner.BARCODE_READ_SUCCESS
      );
      isListenerAssigned = false;
    });
  }
};

module.exports = ReactNativeZebraScanner;
