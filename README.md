QrDetector is a JavaScript library that implements the [BarcodeDetector](https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector) interface, but only for QR codes. If the web browser supports it then QrDetector will use the native BarcodeDetector, otherwise it will fall back to [jsQR](https://www.npmjs.com/package/jsqr-es6).

By using the BarcodeDetector interface, it is extremely easy to swap in QrDetector. You will also be able to easily get rid of QrDetector later when BarcodeDetector becomes more widely implemented.

The library works around [a Google Chrome bug](https://bugs.chromium.org/p/chromium/issues/detail?id=1382442) by doing a test detection on a hard-coded QR code.

You can get this package from npm, or load the code directly in a `<script>` tag (see demo page).

- Demo: https://stefansundin.github.io/qr-detector.js/
- React demo: https://github.com/stefansundin/qr-detector.js/tree/react-demo
- https://caniuse.com/mdn-api_barcodedetector
