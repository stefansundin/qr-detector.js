// Web workers must be served from the same origin, which is why you can't load QrDetector from jsdelivr in this case.
// Some documentation suggests that importScripts should work cross-origin, but it doesn't!

self.importScripts('QrDetector.min.js');

const detector = new QrDetector({ formats: ['qr_code'] });

self.onmessage = async e => {
  const [nonce, image] = e.data;
  const results = await detector.detect(image);
  self.postMessage([nonce, results]);
};
