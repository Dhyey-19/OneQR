/**
 * Helper to download a beautifully styled PDF flyer containing the QR code.
 * @param {string} qrUrl - The destination URL for the QR code
 * @param {string|number} qrId - The ID of the QR code
 * @returns {Promise<void>}
 */
export const downloadFlyer = (qrUrl, qrId) => {
  return new Promise((resolve, reject) => {
    const cleanColor = '000000';
    const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&color=${cleanColor}&data=${encodeURIComponent(qrUrl)}`;
    
    const qrImg = new Image();
    qrImg.crossOrigin = "anonymous";
    qrImg.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      
      // Background: White
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1200, 1200);

      // --- 1. Top Left Wave Accents ---
      // Light blue shadow wave
      ctx.fillStyle = 'rgba(37, 99, 235, 0.08)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(450, 0);
      ctx.quadraticCurveTo(220, 220, 0, 450);
      ctx.closePath();
      ctx.fill();

      // Primary royal blue wave
      const waveGrad1 = ctx.createLinearGradient(0, 0, 300, 300);
      waveGrad1.addColorStop(0, '#0252cc');
      waveGrad1.addColorStop(1, '#0084ff');
      ctx.fillStyle = waveGrad1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(340, 0);
      ctx.bezierCurveTo(180, 80, 80, 180, 0, 340);
      ctx.closePath();
      ctx.fill();

      // Deep navy accent at top-left edge
      ctx.fillStyle = '#0a2540';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(160, 0);
      ctx.bezierCurveTo(90, 40, 40, 90, 0, 160);
      ctx.closePath();
      ctx.fill();

      // --- 2. Bottom Right Wave Accents ---
      // Light blue shadow wave
      ctx.fillStyle = 'rgba(37, 99, 235, 0.08)';
      ctx.beginPath();
      ctx.moveTo(1200, 1200);
      ctx.lineTo(750, 1200);
      ctx.quadraticCurveTo(980, 980, 1200, 750);
      ctx.closePath();
      ctx.fill();

      // Royal blue gradient wave
      const waveGrad2 = ctx.createLinearGradient(850, 850, 1200, 1200);
      waveGrad2.addColorStop(0, '#0252cc');
      waveGrad2.addColorStop(1, '#007dfc');
      ctx.fillStyle = waveGrad2;
      ctx.beginPath();
      ctx.moveTo(1200, 1200);
      ctx.lineTo(860, 1200);
      ctx.bezierCurveTo(1020, 1120, 1120, 1020, 1200, 860);
      ctx.closePath();
      ctx.fill();

      // --- 3. Dot Grid Patterns ---
      // Top Right Grid
      ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          ctx.beginPath();
          ctx.arc(1040 + i * 22, 60 + j * 22, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Bottom Left Grid
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          ctx.beginPath();
          ctx.arc(50 + i * 22, 940 + j * 22, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- 4. Header Section (OneQR Branding) ---
      // Bracket logo
      ctx.save();
      ctx.strokeStyle = '#0052cc';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const logoX = 405;
      const logoY = 75;
      const logoSize = 56;
      const r = 12;
      
      // Top-Left bracket
      ctx.beginPath(); ctx.moveTo(logoX + r, logoY); ctx.lineTo(logoX, logoY); ctx.lineTo(logoX, logoY + r); ctx.stroke();
      // Top-Right bracket
      ctx.beginPath(); ctx.moveTo(logoX + logoSize - r, logoY); ctx.lineTo(logoX + logoSize, logoY); ctx.lineTo(logoX + logoSize, logoY + r); ctx.stroke();
      // Bottom-Left bracket
      ctx.beginPath(); ctx.moveTo(logoX + r, logoY + logoSize); ctx.lineTo(logoX, logoY + logoSize); ctx.lineTo(logoX, logoY + logoSize - r); ctx.stroke();
      // Bottom-Right bracket
      ctx.beginPath(); ctx.moveTo(logoX + logoSize - r, logoY + logoSize); ctx.lineTo(logoX + logoSize, logoY + logoSize); ctx.lineTo(logoX + logoSize, logoY + logoSize - r); ctx.stroke();
      
      // Scanner inner squares
      ctx.fillStyle = '#0052cc';
      ctx.fillRect(logoX + 13, logoY + 13, 11, 11);
      ctx.fillRect(logoX + 32, logoY + 13, 11, 11);
      ctx.fillRect(logoX + 13, logoY + 32, 11, 11);
      ctx.fillRect(logoX + 32, logoY + 32, 11, 11);
      ctx.restore();

      // Brand Text: OneQR
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 74px "Inter", "Helvetica Neue", sans-serif';
      ctx.fillStyle = '#0a2540';
      ctx.fillText('One', 478, 105);
      ctx.fillStyle = '#0052cc';
      ctx.fillText('QR', 612, 105);

      // Subtitle
      ctx.textAlign = 'center';
      ctx.font = 'bold 22px "Inter", sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('Scan • Connect • Discover', 600, 168);

      // Headline Text: SCAN TO CONNECT WITH US
      ctx.textAlign = 'center';
      ctx.font = '900 82px "Inter", sans-serif';
      ctx.fillStyle = '#0a2540';
      ctx.fillText('SCAN TO CONNECT', 600, 265);
      ctx.fillStyle = '#0052cc';
      ctx.fillText('— WITH US! —', 600, 350);

      // Banner Pill: One Scan. Unlimited Connections.
      ctx.save();
      ctx.fillStyle = '#093c8f';
      ctx.beginPath();
      ctx.roundRect(280, 400, 640, 64, 32);
      ctx.fill();
      ctx.restore();

      ctx.textAlign = 'center';
      ctx.font = 'bold 28px "Inter", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('One Scan. Unlimited Connections.', 600, 442);

      // --- 5. Centered QR Code Card with Shadow ---
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.16)';
      ctx.shadowBlur = 32;
      ctx.shadowOffsetY = 12;
      
      // White Board
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(355, 500, 490, 490, 42);
      ctx.fill();
      ctx.restore();

      // Outer blue border
      ctx.strokeStyle = '#0052cc';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(362, 507, 476, 476, 36);
      ctx.stroke();

      // Draw QR Image
      ctx.drawImage(qrImg, 395, 540, 410, 410);

      // Center Scan badge inside QR code
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(560, 705, 80, 80, 16);
      ctx.fill();
      // Little blue scanner icon
      ctx.strokeStyle = '#0052cc';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      const cX = 575;
      const cY = 720;
      const cSize = 50;
      const cRad = 10;
      ctx.beginPath(); ctx.moveTo(cX + cRad, cY); ctx.lineTo(cX, cY); ctx.lineTo(cX, cY + cRad); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cX + cSize - cRad, cY); ctx.lineTo(cX + cSize, cY); ctx.lineTo(cX + cSize, cY + cRad); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cX + cRad, cY + cSize); ctx.lineTo(cX, cY + cSize); ctx.lineTo(cX, cY + cSize - cRad); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cX + cSize - cRad, cY + cSize); ctx.lineTo(cX + cSize, cY + cSize); ctx.lineTo(cX + cSize, cY + cSize - cRad); ctx.stroke();
      ctx.fillStyle = '#0052cc';
      ctx.fillRect(cX + 12, cY + 12, 8, 8);
      ctx.fillRect(cX + 30, cY + 12, 8, 8);
      ctx.fillRect(cX + 12, cY + 30, 8, 8);
      ctx.fillRect(cX + 30, cY + 30, 8, 8);
      ctx.restore();

      // --- 6. Hand-Drawn Accent Arrows & Sparkles ---
      ctx.strokeStyle = '#0052cc';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      
      // Top Left sparkle
      ctx.beginPath();
      ctx.moveTo(330, 495); ctx.lineTo(345, 510);
      ctx.moveTo(345, 485); ctx.lineTo(355, 500);
      ctx.stroke();
      
      // Top Right sparkle
      ctx.beginPath();
      ctx.moveTo(870, 495); ctx.lineTo(855, 510);
      ctx.moveTo(855, 485); ctx.lineTo(845, 500);
      ctx.stroke();

      // Left curved pointing arrow
      ctx.beginPath();
      ctx.arc(230, 660, 80, -Math.PI * 0.15, Math.PI * 0.12);
      ctx.stroke();
      ctx.fillStyle = '#0052cc';
      ctx.beginPath();
      ctx.moveTo(315, 692); ctx.lineTo(294, 686); ctx.lineTo(307, 705);
      ctx.closePath();
      ctx.fill();

      // Right curved pointing arrow
      ctx.beginPath();
      ctx.arc(970, 660, 80, Math.PI * 1.15, Math.PI * 0.88, true);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(885, 692); ctx.lineTo(906, 686); ctx.lineTo(893, 705);
      ctx.closePath();
      ctx.fill();

      // --- 7. Left Column: Circular Blue Icons with Labels ---
      const drawLeftIcon = (key, x, y) => {
        const radius = 25;
        ctx.save();
        ctx.translate(x, y);
        
        ctx.fillStyle = '#093c8f';
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (key === 'whatsapp') {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, -1, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-8, 4); ctx.lineTo(-11, 11); ctx.lineTo(-4, 8);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#093c8f';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(1.5, 1.5, 5.5, -Math.PI * 0.4, Math.PI * 0.9);
          ctx.stroke();
        } 
        else if (key === 'instagram') {
          ctx.beginPath();
          ctx.roundRect(-11, -11, 22, 22, 6);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, 5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(5.5, -5.5, 1.5, 0, Math.PI * 2);
          ctx.fill();
        } 
        else if (key === 'website') {
          ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(-11, 0); ctx.lineTo(11, 0); ctx.stroke();
          ctx.beginPath(); ctx.ellipse(0, 0, 5, 11, 0, 0, Math.PI * 2); ctx.stroke();
        } 
        else if (key === 'email') {
          ctx.beginPath();
          ctx.roundRect(-11, -7, 22, 14, 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-11, -7); ctx.lineTo(0, 1); ctx.lineTo(11, -7);
          ctx.stroke();
        } 
        else if (key === 'location') {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, -3, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-6, -3);
          ctx.quadraticCurveTo(-6, 3, 0, 10);
          ctx.quadraticCurveTo(6, 3, 6, -3);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#093c8f';
          ctx.beginPath(); ctx.arc(0, -3, 2.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      };

      const leftX = 135;
      const leftItems = [
        { key: 'whatsapp', label: 'WhatsApp', y: 550 },
        { key: 'instagram', label: 'Instagram', y: 645 },
        { key: 'website', label: 'Website', y: 740 },
        { key: 'email', label: 'Email', y: 835 },
        { key: 'location', label: 'Location', y: 930 }
      ];

      leftItems.forEach(item => {
        drawLeftIcon(item.key, leftX, item.y);
        ctx.fillStyle = '#0a2540';
        ctx.font = 'bold 16px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, leftX, item.y + 40);
      });

      // --- 8. Right Column: Value Props Stack ---
      const drawRightIcon = (key, x, y) => {
        ctx.save();
        ctx.translate(x, y);
        if (key === 'lightning') {
          ctx.fillStyle = '#0052cc';
          ctx.beginPath();
          ctx.moveTo(0, -18); ctx.lineTo(10, -3); ctx.lineTo(2, -3); ctx.lineTo(5, 18); ctx.lineTo(-10, 3); ctx.lineTo(-2, 3);
          ctx.closePath();
          ctx.fill();
        } 
        else if (key === 'shield') {
          ctx.fillStyle = '#0052cc';
          ctx.beginPath();
          ctx.moveTo(0, -16);
          ctx.quadraticCurveTo(12, -16, 12, -4);
          ctx.quadraticCurveTo(12, 8, 0, 16);
          ctx.quadraticCurveTo(-12, 8, -12, -4);
          ctx.quadraticCurveTo(-12, -16, 0, -16);
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2.8;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(-5, 0); ctx.lineTo(-1, 4); ctx.lineTo(5, -3);
          ctx.stroke();
        } 
        else if (key === 'link') {
          ctx.strokeStyle = '#0052cc';
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(4, -4); ctx.lineTo(-3, 3); ctx.stroke();
          ctx.beginPath(); ctx.arc(3.5, 3.5, 6, -Math.PI * 0.25, Math.PI * 0.75); ctx.stroke();
          ctx.beginPath(); ctx.arc(-3.5, -3.5, 6, Math.PI * 0.75, Math.PI * 1.75); ctx.stroke();
        } 
        else if (key === 'user') {
          ctx.fillStyle = '#0052cc';
          ctx.beginPath(); ctx.arc(0, -7, 6.5, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(0, 12, 13, Math.PI, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      };

      const rightX = 1065;
      const rightItems = [
        { key: 'lightning', lines: ['INSTANT', 'ACCESS'], y: 550 },
        { key: 'shield', lines: ['SAFE &', 'SECURE'], y: 645 },
        { key: 'link', lines: ['ALL LINKS', 'IN ONE PLACE'], y: 740 },
        { key: 'user', lines: ['TRUSTED', 'BY YOU'], y: 835 }
      ];

      rightItems.forEach((item, index) => {
        drawRightIcon(item.key, rightX, item.y);
        ctx.fillStyle = '#0a2540';
        ctx.font = 'bold 15px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.lines[0], rightX, item.y + 36);
        ctx.fillText(item.lines[1], rightX, item.y + 52);

        // Separator line below value prop (except last one)
        if (index < rightItems.length - 1) {
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(990, item.y + 70);
          ctx.lineTo(1140, item.y + 70);
          ctx.stroke();
        }
      });

      // --- 9. Thank You & Appreciation Bottom Text ---
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0052cc';
      ctx.font = 'italic bold 44px Georgia, serif';
      ctx.fillText('Thank You! ♡', 600, 1032);
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 24px "Inter", sans-serif';
      ctx.fillText('We appreciate your support.', 600, 1072);

      // --- 10. Footer Section (Branded Signature & Scan banner) ---
      // Developed by DTech signature line
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 16px "Inter", sans-serif';
      ctx.fillText('Developed by DTech', 600, 1108);

      // Dark Blue Banner
      ctx.fillStyle = '#093c8f';
      ctx.fillRect(0, 1125, 1200, 75);

      // Mobile phone icon circle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(280, 1162, 22, 0, Math.PI * 2);
      ctx.fill();
      
      // Phone graphic path
      ctx.strokeStyle = '#093c8f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(271, 1149, 18, 26, 4);
      ctx.stroke();
      ctx.fillStyle = '#093c8f';
      ctx.beginPath();
      ctx.arc(280, 1171, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#093c8f';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(273, 1152); ctx.lineTo(287, 1152);
      ctx.moveTo(273, 1168); ctx.lineTo(287, 1168);
      ctx.stroke();

      // Scan connect grow banner texts
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px "Inter", sans-serif';
      ctx.fillText('SCAN • CONNECT • GROW', 320, 1172);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = 'bold 20px "Inter", sans-serif';
      ctx.fillText('— Stay connected. Stay ahead.', 675, 1171);

      // Trigger high-res image download
      try {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `oneqr_flyer_${qrId}_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        resolve();
      } catch (err) {
        reject(err);
      }
    };
    qrImg.onerror = (err) => reject(err);
    qrImg.src = qrImageSrc;
  });
};
