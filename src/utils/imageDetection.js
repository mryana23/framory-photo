export const detectTransparentAreas = (imageData) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onerror = () => reject(new Error('Failed to load image'));
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageDataObj.data;
        
        const transparentPixels = [];
        
        for (let y = 0; y < canvas.height; y += 5) {
          for (let x = 0; x < canvas.width; x += 5) {
            const i = (y * canvas.width + x) * 4;
            if (data[i + 3] < 50) {
              transparentPixels.push({ x, y });
            }
          }
        }
        
        const areas = findTransparentRectangles(transparentPixels, canvas.width, canvas.height);
        resolve(areas);
      } catch (error) {
        reject(error);
      }
    };
    
    img.src = imageData;
  });
};

const findTransparentRectangles = (pixels, width, height) => {
  if (pixels.length === 0) return [];

  let minX = Infinity, maxX = 0, minY = Infinity, maxY = 0;

  pixels.forEach(p => {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  });

  const totalWidth = maxX - minX;
  const totalHeight = maxY - minY;

  if (totalWidth > 100 && totalHeight > 400) {
    const slotHeight = Math.floor(totalHeight / 4);
    const areas = [];

    for (let i = 0; i < 4; i++) {
      areas.push({
        x: Math.floor(minX),
        y: Math.floor(minY + (i * slotHeight)),
        width: Math.floor(totalWidth),
        height: slotHeight
      });
    }

    return areas;
  }

  return [];
};