
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
    scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

async function ensureFolderExists(folderName, parentFolderId) {
    const res = await drive.files.list({
        q: `'${parentFolderId}' in parents and name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)',
    });
    if (res.data.files.length > 0) {
        return res.data.files[0].id;
    } else {
        const folderMetadata = {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentFolderId],
        };
        const folder = await drive.files.create({
            resource: folderMetadata,
            fields: 'id',
        });
        return folder.data.id;
    }
}

async function uploadFile(filename, filepath, folderName) {
    const parentFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const folderId = await ensureFolderExists(folderName, parentFolderId);

    const fileMetadata = {
        name: filename,
        parents: [folderId],
    };
    const media = {
        body: fs.createReadStream(filepath),
    };
    const file = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
    });
    return file.data;
}

module.exports = { uploadFile };
