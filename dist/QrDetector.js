"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsqr_es6_1 = require("jsqr-es6");
const utils_1 = require("./utils");
class QrDetector {
    constructor(barcodeDetectorOptions) {
        this._nativeDetectorSupported = undefined;
        this.barcodeDetector = undefined;
        if (self.BarcodeDetector) {
            this.barcodeDetector = new self.BarcodeDetector(barcodeDetectorOptions);
        }
    }
    async detect(image) {
        if (this._nativeDetectorSupported ||
            (await this.nativeDetectorSupported())) {
            return this.barcodeDetector.detect(image);
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
        if (!result || result.data === '') {
            return [];
        }
        const minX = Math.min(result.location.topLeftCorner.x, result.location.topRightCorner.x, result.location.bottomRightCorner.x, result.location.bottomLeftCorner.x);
        const minY = Math.min(result.location.topLeftCorner.y, result.location.topRightCorner.y, result.location.bottomRightCorner.y, result.location.bottomLeftCorner.y);
        const maxX = Math.max(result.location.topLeftCorner.x, result.location.topRightCorner.x, result.location.bottomRightCorner.x, result.location.bottomLeftCorner.x);
        const maxY = Math.max(result.location.topLeftCorner.y, result.location.topRightCorner.y, result.location.bottomRightCorner.y, result.location.bottomLeftCorner.y);
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
    static async getSupportedFormats() {
        return ['qr_code'];
    }
    async nativeDetectorSupported() {
        if (this._nativeDetectorSupported === undefined) {
            if (self.BarcodeDetector) {
                const supportedFormats = await self.BarcodeDetector.getSupportedFormats();
                if (supportedFormats.includes('qr_code')) {
                    const testResult = await this.barcodeDetector.detect((0, utils_1.testQrCode)());
                    if (testResult.length === 1 && testResult[0].rawValue === 'ABC') {
                        this._nativeDetectorSupported = true;
                        return true;
                    }
                }
            }
            this._nativeDetectorSupported = false;
        }
        return this._nativeDetectorSupported;
    }
}
exports.default = QrDetector;
//# sourceMappingURL=QrDetector.js.map