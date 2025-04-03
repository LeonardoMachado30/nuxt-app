import { defineEventHandler, readMultipartFormData, sendStream, createError } from 'h3';
import { convertFile } from '../utils/fileConversion';

export default defineEventHandler(async (event) => {
    try {
        const formData = await readMultipartFormData(event);
        if (!formData) throw createError({ statusCode: 400, statusMessage: 'Nenhum arquivo enviado' });

        const file = formData.find(f => f.name === 'file');
        if (!file) throw createError({ statusCode: 400, statusMessage: 'Arquivo não encontrado no formulário' });

        const docxBuffer = await convertFile(
            file.data,
            file.filename,
            'docx',
            'pdftotext "{input}" "{output}"' // Alternativa: pdf2docx
        );

        event.node.res.setHeader('Content-Disposition', `attachment; filename="${file.filename.replace('.pdf', '.docx')}"`);
        event.node.res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        sendStream(event, docxBuffer);
    } catch (err) {
        console.error('Erro na conversão PDF → Word:', err);
        throw createError({ statusCode: 500, statusMessage: 'Erro ao converter PDF para Word', data: err });
    }
});
