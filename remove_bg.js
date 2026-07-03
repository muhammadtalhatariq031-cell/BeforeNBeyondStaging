const Jimp = require('jimp');

async function removeBg() {
  try {
    const image = await Jimp.read('C:\\Users\\TECH ZONE\\.gemini\\antigravity-ide\\brain\\0a53c485-8e16-4c25-8ad4-b0234a723726\\media__1782501371039.jpg');
    
    // The background color is likely cream. We can just check for bright pixels.
    // Or we can just sample the pixel at 5,5 (to avoid any pure white corners if any)
    const bgColor = image.getPixelColor(5, 5);
    const bgR = Jimp.intToRGBA(bgColor).r;
    const bgG = Jimp.intToRGBA(bgColor).g;
    const bgB = Jimp.intToRGBA(bgColor).b;

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      // Distance from background color
      const dist = Math.sqrt(Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2));
      
      // We also make white pixels transparent (in case the corners are white)
      const distWhite = Math.sqrt(Math.pow(r - 255, 2) + Math.pow(g - 255, 2) + Math.pow(b - 255, 2));

      if (dist < 40 || distWhite < 40) {
        this.bitmap.data[idx + 3] = 0; // transparent
      }
    });

    await image.writeAsync('public/images/logo.png');
    console.log('Background removed and saved to public/images/logo.png');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

removeBg();
