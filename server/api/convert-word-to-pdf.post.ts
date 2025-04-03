import { defineEventHandler, readBody, sendError, send } from 'h3';
import { convertFile } from '../utils/fileConverter';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
    const form = formidable({ multiples: false, uploadDir: '/tmp', keepExtensions: true });

    try {
        const [fields, files] = await form.parse(event.node.req);
        const file = files.file?.[0];

        if (!file) throw new Error('Nenhum arquivo enviado.');

        const inputPath = file.filepath;
        const outputDir = path.dirname(inputPath);

        const convertedFile = await convertFile(inputPath, outputDir, 'pdf');

        const fileStream = fs.createReadStream(convertedFile);
        event.node.res.setHeader('Content-Type', 'application/pdf');
        event.node.res.setHeader('Content-Disposition', `attachment; filename="${path.basename(convertedFile)}"`);

        return send(event, fileStream);
    } catch (error) {
        return sendError(event, createError({ statusCode: 500, message: 'Erro na conversão para PDF' }));
    }
});
