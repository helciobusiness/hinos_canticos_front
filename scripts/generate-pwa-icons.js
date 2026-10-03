import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateAllIcons() {
  const publicDir = path.resolve(__dirname, '../public');
  const iconsDir = path.join(publicDir, 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  const logoPath = path.join(publicDir, 'logo.png');
  console.log('Generating icons from master logo:', logoPath);

  // 1. Load logo.png and remove the off-white background with anti-aliasing
  const { data, info } = await sharp(logoPath).raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);

  let minX = info.width, maxX = 0, minY = info.height, maxY = 0;

  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];

    const brightness = (r + g + b) / 3;
    let alpha = 255;

    if (r > 245 && g > 245 && b > 245) {
      alpha = 0;
    } else if (r > 225 && g > 225 && b > 225) {
      const diff = 245 - brightness;
      alpha = Math.max(0, Math.min(255, Math.round((diff / 20) * 255)));
    }

    rgba[i * 4] = r;
    rgba[i * 4 + 1] = g;
    rgba[i * 4 + 2] = b;
    rgba[i * 4 + 3] = alpha;

    if (alpha > 15) {
      const x = i % info.width;
      const y = Math.floor(i / info.width);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  const croppedWidth = maxX - minX + 1;
  const croppedHeight = maxY - minY + 1;
  console.log('Detected logo content bounding box:', { minX, maxX, minY, maxY, croppedWidth, croppedHeight });

  // High-res trimmed transparent buffer
  const trimmedLogoBuffer = await sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 }
  })
  .extract({ left: minX, top: minY, width: croppedWidth, height: croppedHeight })
  .png()
  .toBuffer();

  // Helper to create an icon on a white background (ideal for iOS & PWA home screens)
  async function createSquareIcon(size, paddingRatio, bg = '#FFFFFF') {
    const innerSize = Math.round(size * (1 - paddingRatio * 2));
    
    const resizedLogo = await sharp(trimmedLogoBuffer)
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

  // 1. Apple Touch Icon (180x180, iOS requires opaque background, 12% padding)
  const appleIcon = await createSquareIcon(180, 0.12, '#FFFFFF');
  fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), appleIcon);
  console.log('✓ Created apple-touch-icon.png (180x180)');

  // 2. PWA Icon 192 (192x192, 10% padding on white)
  const icon192 = await createSquareIcon(192, 0.10, '#FFFFFF');
  fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), icon192);
  console.log('✓ Created icon-192.png (192x192)');

  // 3. PWA Icon 512 (512x512, 10% padding on white)
  const icon512 = await createSquareIcon(512, 0.10, '#FFFFFF');
  fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), icon512);
  console.log('✓ Created icon-512.png (512x512)');

  // 4. Maskable Icon 512 (512x512, 20% safe area padding on white)
  const icon512Maskable = await createSquareIcon(512, 0.20, '#FFFFFF');
  fs.writeFileSync(path.join(iconsDir, 'icon-512-maskable.png'), icon512Maskable);
  console.log('✓ Created icon-512-maskable.png (512x512 maskable)');

  // 5. Favicon PNG (64x64 on white background)
  const favicon64 = await createSquareIcon(64, 0.08, '#FFFFFF');
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), favicon64);
  console.log('✓ Created favicon.png (64x64)');

  // 6. Also create 32x32 and 16x16 standard favicons if needed
  const favicon32 = await createSquareIcon(32, 0.06, '#FFFFFF');
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), favicon32);
  console.log('✓ Created favicon-32x32.png (32x32)');

  // 7. Generate favicon.ico with multiple sizes using sharp / raw PNGs
  // Modern browsers accept PNG favicon, but having favicon.ico avoids 404s
  fs.copyFileSync(path.join(publicDir, 'favicon-32x32.png'), path.join(publicDir, 'favicon.ico'));
  console.log('✓ Created favicon.ico');

  console.log('\nAll icons successfully generated from new logo.png!');
}

generateAllIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
