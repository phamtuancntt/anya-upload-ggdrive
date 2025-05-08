const express = require('express');
const { uploadFile } = require('./utils/googleDrive');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

app.use(express.json());

app.post('/upload', async (req, res) => {
    try {
        const { filename, filepath, folderName } = req.body;
        const result = await uploadFile(filename, filepath, folderName);
        res.status(200).json({ success: true, fileId: result.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
