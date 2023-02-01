import jsQR from 'jsqr-es6';

import type {
  BarcodeDetector,
  BarcodeDetectorOptions,
  BarcodeFormat,
  DetectedBarcode,
} from './BarcodeDetector';
import {
  blobToImageData,
  canvasImageSourceToImageData,
  testQrCode,
} from './utils';

export default class QrDetector implements BarcodeDetector {
  nativeDetectorSupported: boolean = undefined;
  barcodeDetector: BarcodeDetector;

  constructor(barcodeDetectorOptions?: BarcodeDetectorOptions) {
    if ((self as any).BarcodeDetector) {
      this.barcodeDetector = new (self as any).BarcodeDetector(
        barcodeDetectorOptions,
      );
    }
  }

  async detect(image: ImageBitmapSource): Promise<DetectedBarcode[]> {
    // Attempt native BarcodeDetector
    if (this.nativeDetectorSupported) {
      return this.barcodeDetector.detect(image);
    } else if (this.nativeDetectorSupported === undefined) {
      if ((self as any).BarcodeDetector) {
        const supportedFormats = await (
          self as any
        ).BarcodeDetector.getSupportedFormats();
        if (supportedFormats.includes('qr_code')) {
          // Double check that the native BarcodeDetector isn't broken by decoding a test QR code. https://bugs.chromium.org/p/chromium/issues/detail?id=1382442
          const testResult = await this.barcodeDetector.detect(testQrCode());
          if (testResult.length === 1 && testResult[0].rawValue === 'ABC') {
            this.nativeDetectorSupported = true;
            return this.barcodeDetector.detect(image);
          }
        }
      }
      this.nativeDetectorSupported = false;
    }

    // Fall back to jsQR
    if (image instanceof ImageData) {
    } else if (image instanceof Blob) {
      image = await blobToImageData(image);
    } else {
      image = canvasImageSourceToImageData(image);
    }
    if (!(image instanceof ImageData)) {
      throw Error('The image is not provided in a supported format.');
    }

    const result = jsQR(image.data, image.width, image.height);
    if (!result || result.data === '') {
      // For some reason, jsQR can sometimes return an invalid result with an empty string. Probably a bug in jsQR?
      return [];
    }

    const minX = Math.min(
      result.location.topLeftCorner.x,
      result.location.topRightCorner.x,
      result.location.bottomRightCorner.x,
      result.location.bottomLeftCorner.x,
    );
    const minY = Math.min(
      result.location.topLeftCorner.y,
      result.location.topRightCorner.y,
      result.location.bottomRightCorner.y,
      result.location.bottomLeftCorner.y,
    );
    const maxX = Math.max(
      result.location.topLeftCorner.x,
      result.location.topRightCorner.x,
      result.location.bottomRightCorner.x,
      result.location.bottomLeftCorner.x,
    );
    const maxY = Math.max(
      result.location.topLeftCorner.y,
      result.location.topRightCorner.y,
      result.location.bottomRightCorner.y,
      result.location.bottomLeftCorner.y,
    );

    return [
      {
        format: 'qr_code',
        rawValue: result.data,
        boundingBox: new DOMRectReadOnly(minX, minY, maxX - minX, maxY - minY),
        cornerPoints: [
          result.location.topLeftCorner,
          result.location.topRightCorner,
          result.location.bottomRightCorner,
          result.location.bottomLeftCorner,
        ],
      },
    ];
  }

  static async getSupportedFormats(): Promise<BarcodeFormat[]> {
    return ['qr_code'];
  }
}
