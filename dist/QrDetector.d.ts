import type { BarcodeDetector, BarcodeDetectorOptions, BarcodeFormat, DetectedBarcode } from './BarcodeDetector';
export default class QrDetector implements BarcodeDetector {
    _nativeDetectorSupported: boolean | undefined;
    barcodeDetector: BarcodeDetector | undefined;
    constructor(barcodeDetectorOptions?: BarcodeDetectorOptions);
    detect(image: ImageBitmapSource): Promise<DetectedBarcode[]>;
    static getSupportedFormats(): Promise<BarcodeFormat[]>;
    nativeDetectorSupported(): Promise<boolean>;
}
//# sourceMappingURL=QrDetector.d.ts.map