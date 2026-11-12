// Deterministic social-card layout. Original M5 images are embedded, not redrawn.
// Run with: node scripts/generate-social-card.mjs
import { readFile } from 'node:fs/promises';
import { createElement as h } from 'react';
import { ImageResponse } from 'next/og.js';
import sharp from 'sharp';

const imageData = async (path) => `data:image/png;base64,${(await sharp(path).png().toBuffer()).toString('base64')}`;
const [logo, photo, headingFont, bodyFont] = await Promise.all([
  imageData('public/images/logo.webp'),
  imageData('public/images/project-door.webp'),
  readFile('design/schibsted-grotesk-bold.ttf'),
  readFile('design/public-sans-regular.ttf'),
]);
const text = (value, style) => h('div', { style: { display: 'flex', ...style } }, value);
const card = h('div', {
  style: { display: 'flex', width: '100%', height: '100%', background: '#000000', color: '#ffffff', fontFamily: 'M5 Text' },
},
  h('div', { style: { display: 'flex', flexDirection: 'column', width: 630, height: 630, padding: '32px 48px 40px', position: 'relative' } },
    h('img', { src: logo, alt: 'M5 Painting', width: 166, height: 166, style: { objectFit: 'contain' } }),
    h('div', { style: { display: 'flex', flexDirection: 'column', marginTop: 44, fontFamily: 'M5 Display', fontWeight: 700, fontSize: 76, letterSpacing: '-3.8px', lineHeight: 1.04 } },
      text('Painting'), text('done right.'),
    ),
    text('Family-owned. Central Valley.', { marginTop: 24, fontSize: 25, letterSpacing: '-0.6px', color: '#e8e9e8' }),
    text('m5painting.com', { position: 'absolute', bottom: 40, left: 48, fontSize: 25, color: '#ffffff' }),
  ),
  h('div', { style: { display: 'flex', width: 570, height: 630, borderLeft: '8px solid #145fd1' } },
    h('img', { src: photo, alt: 'M5 Painting finished black front door with white trim', width: 562, height: 630, style: { objectFit: 'cover', objectPosition: 'center' } }),
  ),
);
const response = new ImageResponse(card, { width: 1200, height: 630, fonts: [
  { name: 'M5 Display', data: headingFont, weight: 700, style: 'normal' },
  { name: 'M5 Text', data: bodyFont, weight: 400, style: 'normal' },
] });
const png = Buffer.from(await response.arrayBuffer());
await sharp(png).jpeg({ quality: 92, mozjpeg: true }).toFile('public/images/m5-social-card-v2.jpg');
console.log('Generated public/images/m5-social-card-v2.jpg (1200 × 630).');
