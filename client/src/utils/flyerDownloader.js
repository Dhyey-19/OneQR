/**
 * Helper to download a beautifully styled PNG flyer containing the QR code.
 * It overlays the QR code on the pre-designed template "All In One 6x4.png"
 * situated inside the public assets directory.
 * 
 * @param {string} qrUrl - The destination URL for the QR code
 * @param {string|number} qrId - The ID of the QR code
 * @returns {Promise<void>}
 */
export const downloadFlyer = (qrUrl, qrId, businessName) => {
  return new Promise((resolve, reject) => {
    const bgImageSrc = '/assets/All In One 6x4.png';
    const cleanColor = '000000';
    const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&color=${cleanColor}&data=${encodeURIComponent(qrUrl)}`;
    
    // Load the background template image first
    const bgImg = new Image();
    bgImg.onload = () => {
      // Then load the dynamic QR code image from the API
      const qrImg = new Image();
      qrImg.crossOrigin = "anonymous";
      qrImg.onload = () => {
        // Create canvas matching the original dimensions of All In One 6x4.png (1024x1536)
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1536;
        const ctx = canvas.getContext('2d');
        
        // 1. Draw the pre-designed background template
        ctx.drawImage(bgImg, 0, 0, 1024, 1536);
        
        // 2. Draw the QR code inside the detected white square box:
        // Left (X): 320, Top (Y): 680, Size: 383
        // We use 20px padding for a beautiful, balanced border spacing inside the box.
        const padding = 20;
        const qrBoxSize = 383;
        
        const qx = 320 + padding;
        const qy = 680 + padding;
        const qSize = qrBoxSize - 2 * padding; // 343x343 px
        const radius = 24; // Sleek modern rounded corners for the QR code
        
        ctx.save();
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(qx, qy, qSize, qSize, radius);
        } else {
          ctx.moveTo(qx + radius, qy);
          ctx.arcTo(qx + qSize, qy, qx + qSize, qy + qSize, radius);
          ctx.arcTo(qx + qSize, qy + qSize, qx, qy + qSize, radius);
          ctx.arcTo(qx, qy + qSize, qx, qy, radius);
          ctx.arcTo(qx, qy, qx + qSize, qy, radius);
        }
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(qrImg, qx, qy, qSize, qSize);
        ctx.restore();
        
        // 3. Trigger premium PNG high-res image download
        try {
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to generate final flyer image blob.'));
              return;
            }
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            
            let filename = 'oneqr_qr';
            if (businessName && businessName.trim()) {
              filename = businessName.trim().replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '_');
            } else if (qrId) {
              filename = qrId;
            }
            link.download = `${filename}.png`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            resolve();
          }, 'image/png');
        } catch (err) {
          reject(err);
        }
      };
      qrImg.onerror = (err) => reject(new Error('Failed to load dynamic QR code image.'));
      qrImg.src = qrImageSrc;
    };
    bgImg.onerror = (err) => reject(new Error('Failed to load background template image.'));
    bgImg.src = bgImageSrc;
  });
};
