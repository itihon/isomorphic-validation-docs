import express from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { bucketName, endpoint, accessKeyId, secretAccessKey } from "./config.js";
import uploadValidation from './public/validation.js';
import * as repository from './repository.js';

const s3client = new S3Client({
    region: 'REGION', endpoint, credentials: { accessKeyId, secretAccessKey },
});

const app = express();

app.use(express.static('public'));

uploadValidation.server.dataMapper((req, form) => {
    Object.assign(form.file.files[0], req.query);
});

app.get('/get-signed-url', uploadValidation, async (req, res, next) => {
    if (req.validationResult.isValid) {
        const { type, size } = req.query;
        
        // create a file record in the database
        const id = await repository.create({ type, size, uploaded: false });

        const putObjCmd = new PutObjectCommand({
            Bucket: bucketName,
            Key: id,
            ContentType: type,
            ContentLength: size,
        });

        res.json({
            url: await getSignedUrl(s3client, putObjCmd, { expiresIn: 60 }),
            id,
        });

    }
    else {
        res.json({ error: 'The file is inappropriate.' });
    }

});

app.get('/image-uploaded/:id', async (req, res) => {
    // mark the file record as permanent (successfully uploaded to the s3 storage)
    const { id } = req.params;
    const ok = await repository.update(id, { uploaded: true });
    res.json(ok);
});

app.listen(8080, () => { console.log('listening port 8080...')});