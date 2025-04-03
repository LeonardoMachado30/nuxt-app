import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import { createError } from 'h3';

const libreOfficePath = process.platform === 'win32'
    ? '"C:\\Program Files\\LibreOffice\\program\\soffice.exe"'
    : 'libreoffice';

const pdfToWordTool = 'pdftotext'; // Alternativa: "pdf2docx" (instalar via pip)

// Função genérica para conversão
export const convertFile = async (inputBuffer: Buffer, inputFilename: string, outputExt: string, conversionCommand: string) => {
    try {
        const tempDir = tmpdir();
        const inputPath = path.join(tempDir, inputFilename);
        const outputPath = path.join(tempDir, `${path.parse(inputFilename).name}.${outputExt}`);

        // Salvar o arquivo temporário
        fs.writeFileSync(inputPath, inputBuffer);

        // Executar o comando de conversão
        await new Promise<void>((resolve, reject) => {
            exec(conversionCommand.replace('{input}', inputPath).replace('{output}', outputPath), (error, stdout, stderr) => {
                if (error) {
                    console.error('Erro na conversão:', stderr);
                    reject(createError({ statusCode: 500, statusMessage: `Erro na conversão para .${outputExt}`, data: stderr }));
                    return;
                }
                resolve();
            });
        });

        // Ler o arquivo convertido
        if (!fs.existsSync(outputPath)) throw createError({ statusCode: 500, statusMessage: `Erro ao gerar .${outputExt}` });

        const outputBuffer = fs.readFileSync(outputPath);

        // Limpeza dos arquivos temporários
        setTimeout(() => {
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        }, 5000);

        return outputBuffer;
    } catch (error) {
        console.error(`Erro ao converter para .${outputExt}:`, error);
        throw createError({ statusCode: 500, statusMessage: `Falha ao converter para .${outputExt}` });
    }
};
