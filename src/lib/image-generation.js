function renderGradientToCanvas(positions, colors, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');

  const x1 = positions.x1 - positions.radios * Math.cos(positions.angle * (Math.PI / 180))/2;
  const y1 = positions.y1 - positions.radios * Math.sin(positions.angle * (Math.PI / 180))/2;
  const x2 = positions.x1 + positions.radios * Math.cos(positions.angle * (Math.PI / 180))/2;
  const y2 = positions.y1 + positions.radios * Math.sin(positions.angle * (Math.PI / 180))/2;

  const gradient = context.createLinearGradient(
    x1 * width,
    y1 * height,
    x2 * width,
    y2 * height
  );

  colors.forEach(color => {
    const rgbaColor = `rgba(${color.color[0]}, ${color.color[1]}, ${color.color[2]}, ${color.color[3] / 255})`;
    gradient.addColorStop(color.position / 100, rgbaColor);
  });

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  return canvas;
}

function renderRadialGradientToCanvas(positions, colors, width, height) {

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');


  const gradient = context.createRadialGradient(
    positions.x1 * width,
    positions.y1 * height,
    0,
    positions.x1 * width,
    positions.y1 * height,
    positions.radios * Math.max(height, width)
  );

  colors.forEach(color => {
      const rgbaColor = `rgba(${color.color[0]}, ${color.color[1]}, ${color.color[2]}, ${color.color[3] / 255})`;
      gradient.addColorStop(color.position / 100, rgbaColor);
  });

  context.fillStyle = gradient;

  context.fillRect(0, 0, width, height);

  return canvas;
}


function createThumbnail(img, size) {


    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let targetWidth = size.width;
    let targetHeight = size.height;

    const aspectRatio = img.width / img.height;

    if (img.width > img.height) {
      targetHeight = Math.round(targetWidth / aspectRatio);
    } else {
      targetWidth = Math.round(targetHeight * aspectRatio);
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    const thumbnailDataURL = canvas.toDataURL('image/png');
    return thumbnailDataURL
}

function renderColorToCanvas(color, width, height) {
  width = Number(width)
  height = Number(height)
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');

  context.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]/255})`;

  context.fillRect(0, 0, width, height);

  document.body.appendChild(canvas);

  return canvas;
}


function createBlackImageAsync(width, height) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);

        const img = new Image();
        img.onload = () => resolve(img);
        img.src = canvas.toDataURL();
    });
}
function copyCanvas(sourceCanvas, targetCanvas) {

  const width = Math.max(sourceCanvas.width, 1)
  const height = Math.max(sourceCanvas.height, 1)

  const targetContext = targetCanvas.getContext('2d');
  
  targetCanvas.width = width;
  targetCanvas.height = height;
  
  targetContext.drawImage(sourceCanvas, 0, 0);
}


export { createBlackImageAsync, createThumbnail, renderColorToCanvas, renderGradientToCanvas,renderRadialGradientToCanvas, copyCanvas }