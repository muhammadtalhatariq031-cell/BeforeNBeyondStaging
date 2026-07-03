const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'public', 'images');

// Read all files
let files;
try {
  files = fs.readdirSync(imgDir);
  console.log('Found ' + files.length + ' files in images dir');
} catch(e) {
  console.error('Cannot read dir:', e.message);
  process.exit(1);
}

// Only process .jpg files with long names
const jpgFiles = files.filter(f => f.endsWith('.jpg') && f.length > 30);
console.log('JPG files with long names: ' + jpgFiles.length);
jpgFiles.forEach((f,i) => console.log('  [' + i + '] ' + f.substring(0, 60) + '...'));

// Copy each to a clean name
const nameMap = {};
jpgFiles.forEach((file, idx) => {
  let cleanName;
  if (file.includes('Occupied')) cleanName = 'occupied_staging.jpg';
  else if (file.includes('Clean, calm')) cleanName = 'calm_bedroom.jpg';
  else if (file.includes('builder') && file.includes('(1)')) cleanName = 'entryway_2.jpg';
  else if (file.includes('builder')) cleanName = 'entryway_1.jpg';
  else if (file.includes('bright, inviting')) cleanName = 'bright_living.jpg';
  else if (file.includes('Warm and welcoming')) cleanName = 'warm_welcoming.jpg';
  else if (file.includes('fut') && file.includes('(1)')) cleanName = 'inspiring_2.jpg';
  else if (file.includes('fut.jpg')) cleanName = 'inspiring_1.jpg';
  else if (file.includes('Calm') && file.includes('Minimal')) cleanName = 'minimal_dining.jpg';
  else cleanName = 'img_' + idx + '.jpg';

  const srcPath = path.join(imgDir, file);
  const destPath = path.join(imgDir, cleanName);
  
  try {
    fs.copyFileSync(srcPath, destPath);
    nameMap[file] = cleanName;
    console.log('COPIED: ' + cleanName + ' (' + fs.statSync(destPath).size + ' bytes)');
  } catch(e) {
    console.error('FAILED to copy ' + file.substring(0,40) + ': ' + e.message);
  }
});

// Write mapping to JSON for reference
fs.writeFileSync(path.join(__dirname, 'image_map.json'), JSON.stringify(nameMap, null, 2));
console.log('\nMapping saved to image_map.json');
console.log('Total copied: ' + Object.keys(nameMap).length);

// Now update HTML files
const htmlFiles = ['index.html', 'services.html', 'portfolio.html'];
htmlFiles.forEach(htmlFile => {
  const filePath = path.join(__dirname, 'public', htmlFile);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;
  
  for (const [oldName, newName] of Object.entries(nameMap)) {
    const oldRef = 'images/' + oldName;
    const newRef = 'images/' + newName;
    while (content.includes(oldRef)) {
      content = content.replace(oldRef, newRef);
      changes++;
    }
  }
  
  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + htmlFile + ': ' + changes + ' replacements');
  } else {
    console.log('No changes needed in ' + htmlFile);
  }
});

console.log('\nDONE!');
