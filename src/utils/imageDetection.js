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

        function maybeSplitSlot(slot) {
          const slotH = slot.endY - slot.startY;
          const widths = rowRanges.slice(slot.startY, slot.endY)
            .filter(Boolean).map(r => r.maxX - r.minX);
          if (widths.length === 0) return [slot];
          const slotW = Math.max(...widths);

          if (slotH < slotW * 1.3) return [slot];

          let minWidth = Infinity, splitY = -1;
          for (let y = slot.startY + 10; y < slot.endY - 10; y++) {
            const w = rowRanges[y] ? rowRanges[y].maxX - rowRanges[y].minX : 0;
            if (w < minWidth) {
              minWidth = w;
              splitY = y;
            }
          }

          if (splitY === -1 || minWidth > slotW * 0.5) return [slot];

          return [
            { startY: slot.startY, endY: splitY },
            { startY: splitY + 1, endY: slot.endY }
          ];
        }

        const splitSlots = slots.flatMap(maybeSplitSlot);

        const EXPAND_RATIO = 0.015;

        const areas = splitSlots.map(slot => {
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