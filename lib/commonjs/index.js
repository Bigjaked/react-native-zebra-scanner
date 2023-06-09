"use strict";

var _reactNative = require("react-native");
const LINKING_ERROR = 'The package "diva-mobile-zebra-scanner" doesn\'t seem to be linked. Make sure: \n\n' + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const DivaMobileZebraScanner = _reactNative.NativeModules.DivaMobileZebraScanner ? _reactNative.NativeModules.DivaMobileZebraScanner : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
let isListenerAssigned;
DivaMobileZebraScanner.startReader = handler => {
  if (!isListenerAssigned) {
    // Initialize the Zebra scanner
    return DivaMobileZebraScanner.init().then(() => {
      // Subscribe to the BARCODE_READ_SUCCESS event
      if (_reactNative.DeviceEventEmitter.addListener(DivaMobileZebraScanner.BARCODE_READ_SUCCESS,
      // Pass the event data to the specified handler function
      data => handler(data))) {
        isListenerAssigned = true;
      }
    });
  }
  return;
};
DivaMobileZebraScanner.stopReader = () => {
  if (isListenerAssigned) {
    // Finalize the Zebra scanner
    return DivaMobileZebraScanner.finalize().then(() => {
      // Unsubscribe from the event
      _reactNative.DeviceEventEmitter.removeAllListeners(DivaMobileZebraScanner.BARCODE_READ_SUCCESS);
      isListenerAssigned = false;
    });
  }
};
module.exports = DivaMobileZebraScanner;
//# sourceMappingURL=index.js.map