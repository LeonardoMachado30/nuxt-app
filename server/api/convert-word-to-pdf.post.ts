import { defineEventHandler, readMultipartFormData, sendStream, createError } from 'h3';
import { convertFile } from '../utils/fileConversion';

export default defineEventHandler(async (event) => {
    try {
        const formData = await readMultipartFormData(event);
        if (!formData) throw createError({ statusCode: 400, statusMessage: 'Nenhum arquivo enviado' });

        const file = formData.find(f => f.name === 'file');
        if (!file) throw createError({ statusCode: 400, statusMessage: 'Arquivo não encontrado no formulário' });

        const pdfBuffer = await convertFile(
            file.data,
            file.filename,
            'pdf',
            'libreoffice --headless --convert-to pdf "{input}" --outdir "{output}"'
        );

        event.node.res.setHeader('Content-Disposition', `attachment; filename="${file.filename.replace('.docx', '.pdf')}"`);
        event.node.res.setHeader('Content-Type', 'application/pdf');
        sendStream(event, pdfBuffer);
    } catch (err) {
        console.error('Erro na conversão Word → PDF:', err);
        throw createError({ statusCode: 500, statusMessage: 'Erro ao converter Word para PDF', data: err });
    }
});
