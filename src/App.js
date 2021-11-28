import './App.css';

import React, { useMemo, useState } from 'react';

import QrDetector from 'qr-detector';

function App() {
  const detector = useMemo(() => new QrDetector({ formats: ['qr_code'] }), []);
  const [nativeDetectorSupported, setNativeDetectorSupported] =
    useState(undefined);
  const [values, setValues] = useState([]);

  const selectFile = async e => {
    for (const file of e.target.files) {
      console.log(file);
      const bitmap = await createImageBitmap(file);
      const results = await detector.detect(bitmap);
      if (nativeDetectorSupported === undefined) {
        setNativeDetectorSupported(detector.nativeDetectorSupported);
      }
      if (results.length === 0) {
        setValues(old => ['No QR code detected in the image.', ...old]);
        return;
      }
      console.log(results);
      console.log(results.map(r => r.rawValue));
      setValues(old => [...results.map(r => r.rawValue), ...old]);
    }
  };

  return (
    <div className="App">
      <h1>
        React Demo for{' '}
        <a
          href="https://www.npmjs.com/package/qr-detector"
          target="_blank"
          rel="noopener noreferrer"
        >
          QrDetector
        </a>
      </h1>
      <p>
        Select an image file containing a QR code to test it out. All detection
        is done in the browser.
      </p>
      <p>
        {nativeDetectorSupported === undefined
          ? 'Perform a detection to find out if your browser has native support.'
          : nativeDetectorSupported
          ? 'Your browser supports BarcodeDetector.'
          : 'jsQR fallback is used.'}
      </p>
      <div>
        <input type="file" accept="image/*" onChange={selectFile} />
      </div>
      <h3>Detections</h3>
      <div>
        {values.length === 0 && 'Results will appear here.'}
        {values.map((v, i) => (
          <code key={i}>{v}</code>
        ))}
      </div>
    </div>
  );
}

export default App;
