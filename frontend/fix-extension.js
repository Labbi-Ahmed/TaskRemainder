const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'out');

function renameRecursive(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      let newFilePath = filePath;
      if (file.startsWith('_')) {
        const newName = file.replace(/^_/, '');
        newFilePath = path.join(dir, newName);
        console.log(`Renaming directory: ${filePath} -> ${newFilePath}`);
        if (fs.existsSync(newFilePath)) {
            // If target exists, move contents instead of renaming directory
            const subFiles = fs.readdirSync(filePath);
            subFiles.forEach(subFile => {
                fs.renameSync(path.join(filePath, subFile), path.join(newFilePath, subFile));
            });
            fs.rmdirSync(filePath);
        } else {
            fs.renameSync(filePath, newFilePath);
        }
      }
      renameRecursive(newFilePath);
    } else {
      let newFilePath = filePath;
      if (file.startsWith('_')) {
        const newName = file.replace(/^_+/g, ''); // Remove all leading underscores
        newFilePath = path.join(dir, newName);
        console.log(`Renaming file: ${filePath} -> ${newFilePath}`);
        fs.renameSync(filePath, newFilePath);
      }

      // After potentially renaming, check if we need to fix content
      if (newFilePath.endsWith('.html') || newFilePath.endsWith('.js') || newFilePath.endsWith('.css') || newFilePath.endsWith('.txt')) {
        let content = fs.readFileSync(newFilePath, 'utf8');
        
        // Replace /_next/ with /next/
        content = content.replace(/\/_next\//g, '/next/');
        content = content.replace(/_next\//g, 'next/');
        
        // Handle files starting with double underscore __next and single _next in paths
        content = content.replace(/__next/g, 'next');
        content = content.replace(/_next/g, 'next');
        
        // Handle other common underscore-prefixed files
        content = content.replace(/_buildManifest\.js/g, 'buildManifest.js');
        content = content.replace(/_ssgManifest\.js/g, 'ssgManifest.js');
        
        fs.writeFileSync(newFilePath, content, 'utf8');
      }
    }
  });
}

console.log('Fixing Next.js output for Chrome Extension...');
if (fs.existsSync(outDir)) {
    renameRecursive(outDir);
    console.log('Done!');
} else {
    console.error('Error: out directory not found.');
}
