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
