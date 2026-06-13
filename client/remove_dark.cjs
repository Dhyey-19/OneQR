const fs = require('fs');
const file = 'src/components/shared/AuthModal.jsx';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(/dark:[^\s"']+/g, '');
code = code.replace(/ +/g, ' ');
code = code.replace(/bg-\[#02050f\]\/80/g, 'bg-slate-900/40');
code = code.replace(/glass/g, 'bg-white');
fs.writeFileSync(file, code);
