import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateIcons() {
  const publicDir = path.resolve(__dirname, '../public');
  const iconsDir = path.join(publicDir, 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  const logoBlackPath = path.join(publicDir, 'logo_black.png');
  const logoWhitePath = path.join(publicDir, 'logo_white.png');

  console.log('Generating PWA icons from', logoBlackPath);

  // 1. Trim the logo to eliminate excessive empty margins
  const trimmedBuffer = await sharp(logoBlackPath)
    .trim()
    .toBuffer();

  // Helper to compose logo onto a colored background with padding
  async function createPwaIcon(size, paddingRatio, bg = '#FFFFFF') {
    const innerSize = Math.round(size * (1 - paddingRatio * 2));
    
    const resizedLogo = await sharp(trimmedBuffer)
      .resize(innerSize, innerSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();

    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: bg
      }
    })
    .composite([
      {
        input: resizedLogo,
        gravity: 'centre'
      }
    ])
    .png({ quality: 100 })
    .toBuffer();
  }

  // Apple touch icon (180x180, iOS requires opaque background, ~12% padding)
  const appleIcon = await createPwaIcon(180, 0.12, '#FFFFFF');
  fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), appleIcon);
  console.log('Created apple-touch-icon.png (180x180)');

  // Standard PWA icon 192 (192x192, 10% padding on white background)
  const icon192 = await createPwaIcon(192, 0.10, '#FFFFFF');
  fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), icon192);
  console.log('Created icon-192.png (192x192)');

  // Standard PWA icon 512 (512x512, 10% padding on white background)
  const icon512 = await createPwaIcon(512, 0.10, '#FFFFFF');
  fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), icon512);
  console.log('Created icon-512.png (512x512)');

  // Maskable icon 512 (512x512, safe area is inner 80%, so 18% padding on white background)
  const icon512Maskable = await createPwaIcon(512, 0.18, '#FFFFFF');
  fs.writeFileSync(path.join(iconsDir, 'icon-512-maskable.png'), icon512Maskable);
  console.log('Created icon-512-maskable.png (512x512 maskable)');

  // Favicon PNG (64x64)
  const favicon64 = await createPwaIcon(64, 0.08, '#FFFFFF');
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), favicon64);
  console.log('Created favicon.png (64x64)');

  console.log('All PWA icons successfully generated from official IEIA logo!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
