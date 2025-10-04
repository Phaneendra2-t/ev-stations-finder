// Simple script to create placeholder SVG icons for PWA
// Run with: node create-icons.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'public', 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icon for each size
sizes.forEach(size => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.1}"/>
  
  <!-- Battery body -->
  <rect x="${size * 0.25}" y="${size * 0.35}" width="${size * 0.4}" height="${size * 0.35}" fill="white" rx="${size * 0.02}"/>
  
  <!-- Battery terminal -->
  <rect x="${size * 0.4}" y="${size * 0.25}" width="${size * 0.1}" height="${size * 0.1}" fill="white" rx="${size * 0.01}"/>
  
  <!-- Lightning bolt -->
  <path d="M ${size * 0.45} ${size * 0.4} L ${size * 0.38} ${size * 0.525} L ${size * 0.43} ${size * 0.525} L ${size * 0.35} ${size * 0.65} L ${size * 0.43} ${size * 0.575} L ${size * 0.38} ${size * 0.575} Z" fill="#10b981"/>
</svg>`;

  const filename = path.join(iconsDir, `icon-${size}x${size}.png`);
  const svgFilename = path.join(iconsDir, `icon-${size}x${size}.svg`);
  
  // Save SVG version
  fs.writeFileSync(svgFilename, svg);
  console.log(`Created ${svgFilename}`);
});

console.log('\n✅ SVG icons created successfully!');
console.log('\nNote: For production, convert SVG to PNG using:');
console.log('- Online tools like CloudConvert');
console.log('- ImageMagick: convert icon.svg -resize 192x192 icon-192x192.png');
console.log('- Or use the generate-icons.html file in your browser\n');
