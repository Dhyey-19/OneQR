const fs = require('fs');
const path = require('path');

const targetDirs = [
  'src/components/dashboard',
  'src/pages'
];

// Target specific dashboard files
const specificFiles = [
  'src/pages/DashboardPage.jsx'
];

function processFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  // 1. Remove all dark: classes (like dark:bg-[#02050f], dark:text-white, dark:hover:text-blue-500, etc.)
  code = code.replace(/dark:[^\s"']+/g, '');
  
  // 2. Fix multiple spaces caused by the removal, but do NOT replace newlines
  // Wait, replacing / +/g might ruin indentation. We can use positive lookbehind or just format it with Prettier later.
  // Actually, keeping spaces is harmless in className. Let's just remove the dark classes.
  
  // 3. Replace specific harsh backgrounds often found in modals
  code = code.replace(/bg-\[#0b0f19\]/g, 'bg-white');
  code = code.replace(/bg-\[#02050f\]\/80/g, 'bg-slate-900/40');
  code = code.replace(/bg-\[#02050f\]\/95/g, 'bg-white/95');
  
  fs.writeFileSync(filePath, code);
  console.log(`Processed ${filePath}`);
}

targetDirs[0] = path.join(__dirname, 'src', 'components', 'dashboard');
const dashboardFiles = fs.readdirSync(targetDirs[0]).filter(f => f.endsWith('.jsx')).map(f => path.join(targetDirs[0], f));

const allFilesToProcess = [...dashboardFiles, path.join(__dirname, 'src', 'pages', 'DashboardPage.jsx')];

allFilesToProcess.forEach(processFile);
console.log('Done stripping dark mode classes.');
