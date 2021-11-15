import type { BarcodeDetector, BarcodeDetectorOptions, BarcodeFormat, DetectedBarcode } from './BarcodeDetector';
export default class QrDetector implements BarcodeDetector {
    nativeDetectorSupported: boolean;
    barcodeDetector: BarcodeDetector;
    constructor(barcodeDetectorOptions?: BarcodeDetectorOptions);
    detect(image: ImageBitmapSource): Promise<DetectedBarcode[]>;
    static getSupportedFormats(): Promise<BarcodeFormat[]>;
}
//# sourceMappingURL=QrDetector.d.ts.map