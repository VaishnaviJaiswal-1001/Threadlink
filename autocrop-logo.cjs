const { Jimp } = require('jimp');

async function main() {
  const imagePath = 'frontend/src/assets/threadlink-logo.png';
  const image = await Jimp.read(imagePath);
  
  console.log(`Original dimensions: ${image.bitmap.width}x${image.bitmap.height}`);
  
  // autocrop removes the border color that matches the top-left pixel
  image.autocrop();
  
  console.log(`Cropped dimensions: ${image.bitmap.width}x${image.bitmap.height}`);
  
  await image.write(imagePath);
  console.log('Autocrop complete.');
}

main().catch(console.error);
