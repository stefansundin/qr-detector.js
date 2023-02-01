export function blobToImageData(blob: Blob): Promise<ImageData> {
  const blobUrl = URL.createObjectURL(blob);
  const img = new Image();

  return new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = err => reject(err);
    img.src = blobUrl;
  }).then(() => {
    URL.revokeObjectURL(blobUrl);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  });
}

export function canvasImageSourceToImageData(
  img: CanvasImageSource,
): ImageData {
  const canvas = document.createElement('canvas');
  if (img instanceof HTMLVideoElement) {
    canvas.width = img.videoWidth;
    canvas.height = img.videoHeight;
  } else if (img instanceof SVGImageElement) {
    canvas.width = img.width.baseVal.value;
    canvas.height = img.height.baseVal.value;
  } else {
    canvas.width = img.width;
    canvas.height = img.height;
  }
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// This QR code is used to check if the built-in BarcodeDetector is functioning properly. This QR code is 23x23 and decodes to "ABC".
// Google Chrome on macOS on the M1 processor is broken. https://bugs.chromium.org/p/chromium/issues/detail?id=1382442
export function testQrCode(): ImageData {
  const data =
    '0000000000000000000000001111111001101011111110010000010100010100000100101110100011001011101001011101001111010111010010111010110010101110100100000100010101000001001111111010101011111110000000000000110000000000101010100111000010010001001000111100010010000011010011111010001101000010011011100001001010000000101000101010101100000000000111101010100000111111100101011100100001000001000111101110000010111010110101110010100101110100000001000110001011101011101000100010010000010001000100011100111111101000101010101000000000000000000000000';
  const byteArray = new Uint8ClampedArray(2116); // 23*23*4
  for (let i = 0; i < data.length; i++) {
    const value = data[i] === '1' ? 0 : 255;
    byteArray[4 * i + 0] = value;
    byteArray[4 * i + 1] = value;
    byteArray[4 * i + 2] = value;
    byteArray[4 * i + 3] = 255;
  }
  return new ImageData(byteArray, 23, 23);
}
