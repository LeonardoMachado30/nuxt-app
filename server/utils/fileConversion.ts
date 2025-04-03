import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

/**
 * Converte arquivos utilizando o LibreOffice
 * @param inputPath Caminho do arquivo de entrada (DOCX ou PDF)
 * @param outputDir Diretório onde o arquivo convertido será salvo
 * @param format Formato de saída ("pdf" para PDF, "docx" para Word)
 * @returns Caminho do arquivo convertido
 */
export async function convertFile(inputPath: string, outputDir: string, format: 'pdf' | 'docx'): Promise<string> {
    if (!fs.existsSync(inputPath)) throw new Error('Arquivo de entrada não encontrado.');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputFilePath = path.join(outputDir, `${path.basename(inputPath, path.extname(inputPath))}.${format}`);

    try {
        const command = `libreoffice --headless --convert-to ${format} --outdir ${outputDir} ${inputPath}`;
        await execAsync(command);

        if (!fs.existsSync(outputFilePath)) throw new Error(`Falha ao converter para .${format}`);

        return outputFilePath;
    } catch (error) {
        throw new Error(`Erro ao converter arquivo: ${error}`);
    }
}
