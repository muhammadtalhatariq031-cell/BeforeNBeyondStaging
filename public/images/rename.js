const fs = require('fs');

const files = fs.readdirSync('.');

files.forEach(f => {
  if (f.includes('Occupied Home')) fs.renameSync(f, 'occupied_home_staging.jpg');
  if (f.includes('Clean, calm')) fs.renameSync(f, 'clean_calm_bedroom.jpg');
  if (f.includes('luxury builder  (1)')) fs.renameSync(f, 'luxury_entryway_2.jpg');
  else if (f.includes('luxury builder')) fs.renameSync(f, 'luxury_entryway_1.jpg');
  if (f.includes('bright, inviting')) fs.renameSync(f, 'bright_inviting_living.jpg');
  if (f.includes('Warm and welcoming')) fs.renameSync(f, 'warm_welcoming.jpg');
  if (f.includes('see their fut (1)')) fs.renameSync(f, 'inspiring_living_2.jpg');
  else if (f.includes('see their fut')) fs.renameSync(f, 'inspiring_living_1.jpg');
  if (f.includes('Calm. Clean. Minimal')) fs.renameSync(f, 'calm_clean_minimal.jpg');
});
console.log("Renamed files.");
