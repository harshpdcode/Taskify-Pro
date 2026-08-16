const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(width, height) {
  // Generate RGBA buffer
  const rawData = Buffer.alloc(height * (1 + width * 4));
  
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4);
    rawData[rowOffset] = 0; // Filter byte (0 = none)
    
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      
      // Normalized coordinates [0, 1]
      const nx = x / width;
      const ny = y / height;
      
      // Border thickness
      const border = 0.04;
      const isBorder = nx < border || nx > (1 - border) || ny < border || ny > (1 - border);
      
      // Center icon: Lightning Bolt shape
      // Diagonal polygon test
      const cx = nx - 0.5;
      const cy = ny - 0.5;
      
      // Lightning polygon approximation
      let inLightning = false;
      if (ny >= 0.2 && ny <= 0.55 && (nx >= 0.45 - (ny - 0.2) * 0.4 && nx <= 0.65 - (ny - 0.2) * 0.2)) {
        inLightning = true;
      }
      if (ny >= 0.45 && ny <= 0.8 && (nx >= 0.35 - (ny - 0.45) * 0.1 && nx <= 0.55 + (ny - 0.45) * 0.3)) {
        inLightning = true;
      }

      if (isBorder) {
        // Black comic border
        rawData[pxOffset] = 0;     // R
        rawData[pxOffset + 1] = 0; // G
        rawData[pxOffset + 2] = 0; // B
        rawData[pxOffset + 3] = 255; // A
      } else if (inLightning) {
        // Hot Pink lightning
        rawData[pxOffset] = 255;   // R
        rawData[pxOffset + 1] = 0; // G
        rawData[pxOffset + 2] = 122; // B
        rawData[pxOffset + 3] = 255;
      } else {
        // Cyber Yellow background #ffe600
        rawData[pxOffset] = 255;   // R
        rawData[pxOffset + 1] = 230; // G
        rawData[pxOffset + 2] = 0;   // B
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  // Deflate rawData
  const compressed = zlib.deflateSync(rawData);

  // Helper to calculate CRC32
  function crc32(buf) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }

  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[i] = c;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const chunkDataForCrc = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(chunkDataForCrc), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // Color type: RGBA
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const outDir = path.resolve('frontend', 'public');
fs.writeFileSync(path.join(outDir, 'icon-192.png'), createPng(192, 192));
fs.writeFileSync(path.join(outDir, 'icon-512.png'), createPng(512, 512));
fs.writeFileSync(path.join(outDir, 'icon-512-maskable.png'), createPng(512, 512));

console.log('✅ Generated PWA Icons in frontend/public: icon-192.png, icon-512.png, icon-512-maskable.png');
