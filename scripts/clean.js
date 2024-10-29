// clean.js
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '../dist');

// dist 폴더 삭제 함수
function cleanDist() {
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
    console.log("✅ Cleaned dist folder");
  } else {
    console.log("ℹ️ No dist folder found");
  }
}

cleanDist();
