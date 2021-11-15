"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsqr_es6_1 = require("jsqr-es6");
const utils_1 = require("./utils");
class QrDetector {
    constructor(barcodeDetectorOptions) {
        this.nativeDetectorSupported = undefined;
        if (window.BarcodeDetector) {
            this.barcodeDetector = new window.BarcodeDetector(barcodeDetectorOptions);
        }
    }
    async detect(image) {
        if (this.nativeDetectorSupported) {
            return this.barcodeDetector.detect(image);
        }
        else if (this.nativeDetectorSupported === undefined) {
            if (window.BarcodeDetector) {
                const supportedFormats = await window.BarcodeDetector.getSupportedFormats();
                if (supportedFormats.includes('qr_code')) {
                    console.log('using native BarcodeDetector');
                    this.nativeDetectorSupported = true;
                    return this.barcodeDetector.detect(image);
                }
            }
            this.nativeDetectorSupported = false;
        }
        if (image instanceof ImageData) {
        }
        else if (image instanceof Blob) {
            image = await (0, utils_1.blobToImageData)(image);
        }
        else {
            image = (0, utils_1.canvasImageSourceToImageData)(image);
        }
        if (!(image instanceof ImageData)) {
            throw Error('The image is not provided in a supported format.');
        }
        const result = (0, jsqr_es6_1.default)(image.data, image.width, image.height);
        if (!result) {
            return [];
        }
        const { x, y } = result.location.topLeftCorner;
        const bottomRight = result.location.bottomRightCorner;
        const boundingBox = new DOMRectReadOnly(x, y, bottomRight.x - x, bottomRight.y - y);
        const cornerPoints = [
            result.location.topLeftCorner,
            result.location.topRightCorner,
            result.location.bottomRightCorner,
            result.location.bottomLeftCorner,
        ];
        return [
            {
                format: 'qr_code',
                rawValue: result.data,
                boundingBox,
                cornerPoints,
            },
        ];
    }
    static async getSupportedFormats() {
        return ['qr_code'];
    }
}
exports.default = QrDetector;
//# sourceMappingURL=QrDetector.js.map