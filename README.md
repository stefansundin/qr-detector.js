QrDetector is a JavaScript library for web browsers that implements the [BarcodeDetector](https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector) interface, but only for QR codes. If the browser supports it then QrDetector will use the native BarcodeDetector, otherwise it will fall back to [jsQR](https://www.npmjs.com/package/jsqr-es6).

By using the BarcodeDetector interface, it is extremely easy to swap in QrDetector. You will also be able to easily get rid of QrDetector later when BarcodeDetector becomes more widely implemented.

- Demo: https://stefansundin.github.io/qr-detector.js/
- React demo: https://github.com/stefansundin/qr-detector.js/tree/react-demo
- https://caniuse.com/mdn-api_barcodedetector
