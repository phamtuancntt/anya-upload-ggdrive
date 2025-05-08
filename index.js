
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { uploadFile } = require('./utils/googleDrive');

const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình multer
const upload = multer({ dest: 'uploads/' });

// Route kiểm tra server
app.get('/', (req, res) => {
  res.send('Anya Watcher Service is running...');
});

// Route upload file trực tiếp
app.post('/upload-file-direct', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const folderName = process.env.DEFAULT_FOLDER_NAME || 'Anya_Uploads';

    const result = await uploadFile(fileName, filePath, folderName);
    
    // Xoá file tạm sau khi upload
    fs.unlinkSync(filePath);

    res.status(200).json({ success: true, fileId: result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`HTTP Server started on port ${PORT}`);
});
