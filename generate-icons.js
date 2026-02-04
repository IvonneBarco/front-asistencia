import sharp from 'sharp';
import { readFileSync } from 'fs';

const inputFile = './src/assets/logo-emaus-mujeres.png';

const sizes = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 16, name: 'favicon-16x16.png' },
];

async function generateIcons() {
  console.log('Generating PWA icons from logo...');
  
  for (const { size, name } of sizes) {
    try {
      await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 250, g: 249, b: 247, alpha: 1 }
        })
        .toFile(`./public/${name}`);
      console.log(`✓ Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`✗ Error generating ${name}:`, error.message);
    }
  }
  
  console.log('\n✓ All icons generated successfully!');
}

generateIcons().catch(console.error);
