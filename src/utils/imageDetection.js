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
        const W = canvas.width;
        const H = canvas.height;

        // Step 1: transparency map per baris
        // alpha < 200 = transparan (threshold tinggi lebih agresif deteksi tepi)
        const ALPHA_THRESHOLD = 200;
        const rowRanges = [];

        for (let y = 0; y < H; y++) {
          let minX = null, maxX = null;
          for (let x = 0; x < W; x++) {
            const i = (y * W + x) * 4;
            if (data[i + 3] < ALPHA_THRESHOLD) {
              if (minX === null) minX = x;
              maxX = x;
            }
          }
          rowRanges.push(minX !== null ? { minX, maxX } : null);
        }

        // Step 2: cluster baris jadi slot groups
        // GAP_THRESHOLD besar = toleransi border tebal antar slot
        const GAP_THRESHOLD = 20;
        const slots = [];
        let slotStart = null;
        let gapCount = 0;

        for (let y = 0; y < H; y++) {
          if (rowRanges[y] !== null) {
            if (slotStart === null) slotStart = y;
            gapCount = 0;
          } else {
            if (slotStart !== null) {
              gapCount++;
              if (gapCount > GAP_THRESHOLD) {
                slots.push({ startY: slotStart, endY: y - gapCount });
                slotStart = null;
                gapCount = 0;
              }
            }
          }
        }
        if (slotStart !== null) {
          slots.push({ startY: slotStart, endY: H - 1 });
        }

        if (slots.length === 0) {
          resolve([]);
          return;
        }

        // Step 3: bounding box per slot + expand proporsional
        // EXPAND_RATIO = persen dari dimensi slot, jadi berlaku untuk semua ukuran frame
        const EXPAND_RATIO = 0.015; // 1.5%

        const areas = slots.map(slot => {
          let minX = Infinity, maxX = 0;

          for (let y = slot.startY; y <= slot.endY; y++) {
            if (rowRanges[y]) {
              minX = Math.min(minX, rowRanges[y].minX);
              maxX = Math.max(maxX, rowRanges[y].maxX);
            }
          }

          const rawW = maxX - minX;
          const rawH = slot.endY - slot.startY;

          const expandX = Math.ceil(rawW * EXPAND_RATIO) + 2;
          const expandY = Math.ceil(rawH * EXPAND_RATIO) + 2;

          return {
            x: Math.max(0, minX - expandX),
            y: Math.max(0, slot.startY - expandY),
            width: Math.min(W, rawW + expandX * 2),
            height: Math.min(H, rawH + expandY * 2),
          };
        });

        resolve(areas);
      } catch (error) {
        reject(error);
      }
    };

    img.src = imageData;
  });
};