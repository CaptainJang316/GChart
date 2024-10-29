// deploy.js
const { exec } = require('child_process');

// 서버 업로드 명령어 예시
const command = 'scp -r dist/ user@your-server:/path/to/deploy';

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Deploy failed: ${error}`);
    return;
  }
  console.log("✅ Deploy successful!");
});
