const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const crypto = require('crypto');

const outDir = path.join(__dirname, 'out');

function processHtml(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(content);
  let modified = false;

  $('script').each((i, el) => {
    const script = $(el);
    const inlineContent = script.html();

    // Only process inline scripts (those without a src attribute)
    if (inlineContent && !script.attr('src')) {
      const hash = crypto.createHash('sha256').update(inlineContent).digest('hex').slice(0, 8);
      const fileName = `inline-${hash}.js`;
      const scriptPath = path.join(path.dirname(filePath), fileName);

      // Write the inline content to a new .js file
      fs.writeFileSync(scriptPath, inlineContent);

      // Replace the inline script with a src reference
      script.attr('src', `./${fileName}`);
      script.html('');
      modified = true;
    }
  });

  if (modified) {
    let newContent = $.html();
    // After processing HTML with cheerio, we still need to apply our _next -> next fixes
    newContent = newContent.replace(/\/_next\//g, './next/');
    newContent = newContent.replace(/_next\//g, 'next/');
    newContent = newContent.replace(/__next/g, 'next');
    newContent = newContent.replace(/_next/g, 'next');
    fs.writeFileSync(filePath, newContent);
  }
}

function renameAndFixRecursive(dir) {
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
          const subFiles = fs.readdirSync(filePath);
          subFiles.forEach(subFile => {
            fs.renameSync(path.join(filePath, subFile), path.join(newFilePath, subFile));
          });
          fs.rmdirSync(filePath);
        } else {
          fs.renameSync(filePath, newFilePath);
        }
      }
      renameAndFixRecursive(newFilePath);
    } else {
      let newFilePath = filePath;
      if (file.startsWith('_')) {
        const newName = file.replace(/^_+/g, '');
        newFilePath = path.join(dir, newName);
        console.log(`Renaming file: ${filePath} -> ${newFilePath}`);
        fs.renameSync(filePath, newFilePath);
      }

      if (newFilePath.endsWith('.html')) {
        processHtml(newFilePath);
      } else if (newFilePath.endsWith('.js') || newFilePath.endsWith('.css') || newFilePath.endsWith('.txt')) {
        let content = fs.readFileSync(newFilePath, 'utf8');
        content = content.replace(/\/_next\//g, './next/');
        content = content.replace(/_next\//g, 'next/');
        content = content.replace(/__next/g, 'next');
        content = content.replace(/_next/g, 'next');
        content = content.replace(/_buildManifest\.js/g, 'buildManifest.js');
        content = content.replace(/_ssgManifest\.js/g, 'ssgManifest.js');
        fs.writeFileSync(newFilePath, content, 'utf8');
      }
    }
  });
}

console.log('Fixing Next.js output for Chrome Extension (Filenames \u0026 CSP)...');
if (fs.existsSync(outDir)) {
  renameAndFixRecursive(outDir);
  console.log('Done!');
} else {
  console.error('Error: out directory not found.');
}
