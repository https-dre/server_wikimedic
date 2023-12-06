# Usando Imagem do Node
FROM node:14

# Instalando Chromium, dependências do Bot Puppeteer

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -0 - https://dl-ssl.google.com/linux/linux/signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable

# Instalação

RUN npm install

# Config diretório de trabalho do Servidor

WORKDIR /usr/src/app

# Copia o código para a pasta de trabalho do Servidor

COPY . .

# Instalando dependências Node e Transpilando projeto para o JavaScript
RUN npm install && npm run build

# Start da aplicação
CMD ["npm", "start"]