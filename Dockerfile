# Usa a imagem oficial do Node.js com suporte a Alpine (mais leve)
FROM node:18-alpine

# Instala pacotes necessários para LibreOffice
RUN apk add --no-cache libreoffice libreoffice-common libreoffice-writer bash

# Cria um diretório de trabalho no container
WORKDIR /app

# Copia os arquivos do projeto para o container
COPY . .

# Instala as dependências do Nuxt
RUN npm install

# Compila o Nuxt
RUN npm run build

# Expõe a porta 3000 para o Nuxt
EXPOSE 3000

# Comando para rodar o servidor Nuxt
CMD ["npm", "run", "start"]
