# Usando a imagem mais recente do Node
FROM node:latest

# WORKDIR /puppeteer

WORKDIR /usr/src/app

COPY . .

# Instalação de dependências Node e transpilação do projeto para JavaScript
RUN npm install && npm run build

# Início da aplicação
CMD ["npm", "start"]
