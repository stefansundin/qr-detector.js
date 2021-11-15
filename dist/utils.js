"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canvasImageSourceToImageData = exports.blobToImageData = void 0;
function blobToImageData(blob) {
    const blobUrl = URL.createObjectURL(blob);
    const img = new Image();
    return new Promise((resolve, reject) => {
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
exports.blobToImageData = blobToImageData;
function canvasImageSourceToImageData(img) {
    const canvas = document.createElement('canvas');
    if (img instanceof HTMLVideoElement) {
        canvas.width = img.videoWidth;
        canvas.height = img.videoHeight;
    }
    else if (img instanceof SVGImageElement) {
        canvas.width = img.width.baseVal.value;
        canvas.height = img.height.baseVal.value;
    }
    else {
        canvas.width = img.width;
        canvas.height = img.height;
    }
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
exports.canvasImageSourceToImageData = canvasImageSourceToImageData;
//# sourceMappingURL=utils.js.map