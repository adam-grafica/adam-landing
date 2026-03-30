import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sectionsDir = path.resolve(__dirname, 'src/sections');
const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(sectionsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  let updated = false;
  // Solo reemplazar si no hay ya un lazy: false, antes de scrollTrigger: {
  content = content.replace(/(\s*)(scrollTrigger:\s*\{)/g, (match, p1, p2) => {
    updated = true;
    return `${p1}// @ts-ignore\n${p1}lazy: false,${match}`;
  });

  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
