// https://wicg.github.io/shape-detection-api/#barcode-detection-api
// https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API

export declare class Point2D {
  x: number;
  y: number;
  constructor(x: number, y: number);
}

declare enum BarcodeFormatEnum {
  aztec,
  code_128,
  code_39,
  code_93,
  codabar,
  data_matrix,
  ean_13,
  ean_8,
  itf,
  pdf417,
  qr_code,
  upc_a,
  upc_e,
  unknown,
}

export type BarcodeFormat = keyof typeof BarcodeFormatEnum;

export interface BarcodeDetectorOptions {
  formats: BarcodeFormat[];
}

export interface DetectedBarcode {
  boundingBox: DOMRectReadOnly;
  rawValue: string;
  format: BarcodeFormat;
  cornerPoints: Array<Point2D>;
}

export class BarcodeDetector {
  constructor(barcodeDetectorOptions?: BarcodeDetectorOptions);
  detect(image: ImageBitmapSource): Promise<DetectedBarcode[]>;

  static getSupportedFormats(): Promise<BarcodeFormat[]>;
}
