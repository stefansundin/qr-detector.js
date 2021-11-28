import jsQR from 'jsqr-es6';

import type {
  BarcodeDetector,
  BarcodeDetectorOptions,
  BarcodeFormat,
  DetectedBarcode,
} from './BarcodeDetector';
import { blobToImageData, canvasImageSourceToImageData } from './utils';

export default class QrDetector implements BarcodeDetector {
  nativeDetectorSupported: boolean = undefined;
  barcodeDetector: BarcodeDetector;

  constructor(barcodeDetectorOptions?: BarcodeDetectorOptions) {
    if ((window as any).BarcodeDetector) {
      this.barcodeDetector = new (window as any).BarcodeDetector(
        barcodeDetectorOptions,
      );
    }
  }

  async detect(image: ImageBitmapSource): Promise<DetectedBarcode[]> {
    // Attempt native BarcodeDetector
    if (this.nativeDetectorSupported) {
      return this.barcodeDetector.detect(image);
    } else if (this.nativeDetectorSupported === undefined) {
      if ((window as any).BarcodeDetector) {
        const supportedFormats = await (
          window as any
        ).BarcodeDetector.getSupportedFormats();
        if (supportedFormats.includes('qr_code')) {
          console.log('using native BarcodeDetector');
          this.nativeDetectorSupported = true;
          return this.barcodeDetector.detect(image);
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
    if (!result) {
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
