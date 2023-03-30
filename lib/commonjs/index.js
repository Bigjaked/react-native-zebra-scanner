"use strict";

var _reactNative = require("react-native");
const LINKING_ERROR = 'The package "react-native-zebra-scanner" doesn\'t seem to be linked. Make sure: \n\n' + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const ReactNativeZebraScanner = _reactNative.NativeModules.ReactNativeZebraScanner ? _reactNative.NativeModules.ReactNativeZebraScanner : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
let isListenerAssigned;
ReactNativeZebraScanner.startReader = handler => {
  if (!isListenerAssigned) {
    // Initialize the Zebra scanner
    return ReactNativeZebraScanner.init().then(() => {
      // Subscribe to the BARCODE_READ_SUCCESS event
      if (_reactNative.DeviceEventEmitter.addListener(ReactNativeZebraScanner.BARCODE_READ_SUCCESS,
      // Pass the event data to the specified handler function
      data => handler(data))) {
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
      _reactNative.DeviceEventEmitter.removeAllListeners(ReactNativeZebraScanner.BARCODE_READ_SUCCESS);
      isListenerAssigned = false;
    });
  }
};
module.exports = ReactNativeZebraScanner;
//# sourceMappingURL=index.js.map