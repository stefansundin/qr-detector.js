// Firefox - https://bugzilla.mozilla.org/show_bug.cgi?id=1390089
if (!window.OffscreenCanvas) {
  window.OffscreenCanvas = class OffscreenCanvas {
    constructor(width, height) {
      this.canvas = document.createElement('canvas');
      this.canvas.width = width;
      this.canvas.height = height;
      this.canvas.convertToBlob = () => {
        return new Promise(resolve => {
          this.canvas.toBlob(resolve);
        });
      };
      this.canvas.transferToImageBitmap = () => {
        // This shouldn't really return a promise :(
        return createImageBitmap(this.canvas);
      };
      return this.canvas;
    }
  };
}

const drawLines = (ctx, color, lineWidth, points) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
  ctx.stroke();
};

const drawCorners = (ctx, cornerPoints, scaleX = 1, scaleY = 1, p = 0.25) => {
  const lineWidth = 5 * scaleX;
  drawLines(ctx, 'green', lineWidth, [
    [
      scaleX *
        (cornerPoints[0].x - p * (cornerPoints[0].x - cornerPoints[3].x)),
      scaleY *
        (cornerPoints[0].y - p * (cornerPoints[0].y - cornerPoints[3].y)),
    ],
    [scaleX * cornerPoints[0].x, scaleY * cornerPoints[0].y],
    [
      scaleX *
        (cornerPoints[0].x + p * (cornerPoints[1].x - cornerPoints[0].x)),
      scaleY *
        (cornerPoints[0].y + p * (cornerPoints[1].y - cornerPoints[0].y)),
    ],
  ]);
  drawLines(ctx, 'red', lineWidth, [
    [
      scaleX *
        (cornerPoints[1].x - p * (cornerPoints[1].x - cornerPoints[0].x)),
      scaleY *
        (cornerPoints[1].y - p * (cornerPoints[1].y - cornerPoints[0].y)),
    ],
    [scaleX * cornerPoints[1].x, scaleY * cornerPoints[1].y],
    [
      scaleX *
        (cornerPoints[1].x + p * (cornerPoints[2].x - cornerPoints[1].x)),
      scaleY *
        (cornerPoints[1].y + p * (cornerPoints[2].y - cornerPoints[1].y)),
    ],
  ]);
  drawLines(ctx, 'yellow', lineWidth, [
    [
      scaleX *
        (cornerPoints[2].x - p * (cornerPoints[2].x - cornerPoints[1].x)),
      scaleY *
        (cornerPoints[2].y - p * (cornerPoints[2].y - cornerPoints[1].y)),
    ],
    [scaleX * cornerPoints[2].x, scaleY * cornerPoints[2].y],
    [
      scaleX *
        (cornerPoints[2].x + p * (cornerPoints[3].x - cornerPoints[2].x)),
      scaleY *
        (cornerPoints[2].y + p * (cornerPoints[3].y - cornerPoints[2].y)),
    ],
  ]);
  drawLines(ctx, 'orange', lineWidth, [
    [
      scaleX *
        (cornerPoints[3].x - p * (cornerPoints[3].x - cornerPoints[2].x)),
      scaleY *
        (cornerPoints[3].y - p * (cornerPoints[3].y - cornerPoints[2].y)),
    ],
    [scaleX * cornerPoints[3].x, scaleY * cornerPoints[3].y],
    [
      scaleX *
        (cornerPoints[3].x + p * (cornerPoints[0].x - cornerPoints[3].x)),
      scaleY *
        (cornerPoints[3].y + p * (cornerPoints[0].y - cornerPoints[3].y)),
    ],
  ]);
};

window.addEventListener('DOMContentLoaded', () => {
  const detector = new QrDetector({ formats: ['qr_code'] });
  const input_file = document.getElementById('input-file');
  const btn_file = document.getElementById('btn-file');
  const btn_webcam = document.getElementById('btn-webcam');
  const btn_screen_capture = document.getElementById('btn-screen-capture');
  const btn_clear = document.getElementById('btn-clear');
  const video = document.getElementById('video');
  const video_container = document.getElementById('video-container');
  const video_overlay = document.getElementById('video-overlay');
  const video_overlay_ctx = video_overlay.getContext('bitmaprenderer');
  const images = document.getElementById('images');
  const output = document.getElementById('output');
  const alert = document.getElementById('alert-native-support');
  const dropzone = document.getElementById('dropzone');
  const outputMap = {};
  let nativeDetectorSupported;

  const detect = async image => {
    const results = await detector.detect(image);
    if (nativeDetectorSupported === undefined) {
      nativeDetectorSupported = detector.nativeDetectorSupported;
      alert.classList.remove('alert-info');
      if (nativeDetectorSupported) {
        alert.classList.add('alert-success');
        alert.textContent = 'Native BarcodeDetector is used.';
      } else {
        alert.classList.add('alert-danger');
        alert.textContent =
          'jsQR fallback is used. Only one QR code can be detected per frame.';
      }
    }
    return results;
  };

  const detectImage = async f => {
    const results = await detect(f);
    if (results.length === 0) {
      console.warn('No QR codes detected in image.');
      return;
    }
    createOutput(results);

    const container = document.createElement('div');
    container.className = 'mb-3';
    const canvas = document.createElement('canvas');
    canvas.width = f.width;
    canvas.height = f.height;
    const ctx = canvas.getContext('2d', { alpha: false });
    const bitmap_ctx = canvas.getContext('bitmaprenderer', { alpha: false });
    if (bitmap_ctx) {
      bitmap_ctx.transferFromImageBitmap(f);
    } else {
      ctx.drawImage(f, 0, 0);
    }
    results.forEach(r => drawCorners(ctx, r.cornerPoints));
    container.appendChild(canvas);
    images.prepend(container);
  };

  const handleFile = async file => {
    if (file.type.startsWith('image/')) {
      detectImage(await createImageBitmap(file));
    } else if (file.type.startsWith('video/')) {
      stopCamera();
      video.src = URL.createObjectURL(file);
      video.focus();
    } else {
      console.log(file);
      console.warn(`Unsupported file type: ${file.type}`);
    }
  };

  const videoChange = async e => {
    video_container.classList.remove('d-none');
    if (!video.srcObject) {
      btn_webcam.textContent = 'Start webcam';
      btn_screen_capture.textContent = 'Start screen capture';
    }
    // Clear the video overlay
    const canvas = new OffscreenCanvas(video.clientWidth, video.clientHeight);
    canvas.getContext('2d');
    video_overlay_ctx.transferFromImageBitmap(
      await canvas.transferToImageBitmap(),
    );
  };

  const stopCamera = () => {
    if (!video.srcObject) {
      return;
    }
    video.srcObject.getTracks().forEach(function (track) {
      track.stop();
    });
    video.srcObject = null;
  };

  const updateVideoOverlay = () => {
    const rect = video.getBoundingClientRect();
    video_overlay.width = rect.width;
    video_overlay.height = rect.height;
  };

  const processVideoFrame = () => {
    requestAnimationFrame(async () => {
      if (video.readyState <= 1) {
        processVideoFrame();
        return;
      }

      const results = await detect(video);
      if (results.length > 0) {
        createOutput(results);

        const canvas = new OffscreenCanvas(
          video.clientWidth,
          video.clientHeight,
        );
        const ctx = canvas.getContext('2d');
        ctx.font = '24px';

        const scaleX = video.clientWidth / video.videoWidth;
        const scaleY = video.clientHeight / video.videoHeight;

        results.forEach(r => drawCorners(ctx, r.cornerPoints, scaleX, scaleY));
        results.forEach(r => {
          const textSize = ctx.measureText(r.rawValue);
          ctx.fillStyle = 'white';
          ctx.fillRect(
            scaleX * (r.boundingBox.x - 2),
            scaleY * (r.boundingBox.y + r.boundingBox.height + 5),
            textSize.width + 4,
            textSize.actualBoundingBoxAscent + 5,
          );
          ctx.fillStyle = 'black';
          ctx.fillText(
            r.rawValue,
            scaleX * r.boundingBox.x,
            scaleY * (r.boundingBox.y + r.boundingBox.height + 8) +
              textSize.actualBoundingBoxAscent,
          );
        });

        video_overlay_ctx.transferFromImageBitmap(
          await canvas.transferToImageBitmap(),
        );
      }

      if (!video.paused && !video.ended) {
        processVideoFrame();
      }
    });
  };

  const createOutput = data => {
    for (const item of data) {
      let container = outputMap[item.rawValue];
      if (container) {
        const input_group_text = container.querySelector(
          'span[class="input-group-text"]',
        );
        const num = parseInt(input_group_text.dataset.num, 10) + 1;
        input_group_text.dataset.num = num;
        input_group_text.textContent = `Detected ${num} times`;
        output.prepend(container);
      } else {
        container = document.createElement('div');
        container.className = 'input-group mt-2 mb-2';
        const input = document.createElement('input');
        input.type = 'text';
        input.readonly = true;
        input.className = 'form-control';
        input.value = item.rawValue;
        container.appendChild(input);
        const input_group = document.createElement('span');
        input_group.className = 'input-group-append';
        const input_group_text = document.createElement('span');
        input_group_text.className = 'input-group-text';
        input_group_text.dataset.num = '1';
        input_group_text.textContent = 'Detected 1 time';
        input_group.appendChild(input_group_text);
        container.appendChild(input_group);
        output.prepend(container);
        outputMap[item.rawValue] = container;
      }
    }
  };

  input_file.addEventListener('change', async e => {
    for (const file of e.target.files) {
      handleFile(file);
    }
  });
  btn_file.addEventListener('click', () => input_file.click());

  video.addEventListener('loadedmetadata', videoChange);
  video.addEventListener('resize', updateVideoOverlay);
  video.addEventListener('play', () => {
    updateVideoOverlay();
    processVideoFrame();
  });
  video.addEventListener('seeked', processVideoFrame);

  btn_webcam.addEventListener('click', async () => {
    if (video.srcObject === null) {
      video.pause();
      video.removeAttribute('src');
      btn_webcam.disabled = true;
      try {
        video.srcObject = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
      } finally {
        btn_webcam.disabled = false;
      }
      btn_webcam.textContent = 'Stop webcam';
    } else {
      stopCamera();
      videoChange();
    }
  });

  btn_screen_capture.addEventListener('click', async () => {
    if (video.srcObject === null) {
      video.pause();
      video.removeAttribute('src');
      btn_screen_capture.disabled = true;
      try {
        video.srcObject = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: 'always',
          },
          audio: false,
        });
      } finally {
        btn_screen_capture.disabled = false;
      }
      btn_screen_capture.textContent = 'Stop screen capture';
    } else {
      stopCamera();
      videoChange();
    }
  });

  btn_clear.addEventListener('click', async () => {
    for (const m in outputMap) {
      delete outputMap[m];
    }
    while (images.firstChild) {
      images.removeChild(images.lastChild);
    }
    while (output.firstChild) {
      output.removeChild(output.lastChild);
    }
  });

  window.addEventListener('dragover', e => {
    e.preventDefault();
    dropzone.classList.remove('d-none');
  });

  window.addEventListener('dragleave', e => {
    if (e.relatedTarget) {
      return;
    }
    e.preventDefault();
    dropzone.classList.add('d-none');
  });

  window.addEventListener('drop', async e => {
    e.preventDefault();
    dropzone.classList.add('d-none');

    if (e.dataTransfer.items) {
      for (const item of e.dataTransfer.items) {
        if (item.kind !== 'file') {
          continue;
        }
        handleFile(item.getAsFile());
      }
    }
  });
});
