
const chokidar = require('chokidar');
const axios = require('axios');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

const watchDir = process.env.WATCH_DIR || './watched_files';
const uploadEndpoint = process.env.UPLOAD_ENDPOINT || 'http://localhost:3000/upload';

if (!fs.existsSync(watchDir)) {
    fs.mkdirSync(watchDir, { recursive: true });
}

const watcher = chokidar.watch(watchDir, {
    ignored: /^\./,
    persistent: true
});

watcher
  .on('add', async function(filePath) {
    console.log('Đã phát hiện file mới:', filePath);
    const fileName = path.basename(filePath);
    const folderName = process.env.DEFAULT_FOLDER_NAME || 'Anya_Uploads';

    try {
      const res = await axios.post(uploadEndpoint, {
          filename: fileName,
          filepath: filePath,
          folderName: folderName
      });
      console.log('Upload thành công:', res.data);
    } catch (error) {
      console.error('Lỗi upload:', error.message);
    }
  })
  .on('error', function(error) {
    console.error('Lỗi watcher:', error);
  });

console.log(`Đang theo dõi thư mục: ${watchDir}`);

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Để Render thấy server đang chạy
app.get('/', (req, res) => {
  res.send('Anya Watcher Service is running...');
});

app.listen(PORT, () => {
  console.log(`HTTP Server started on port ${PORT}`);
});
