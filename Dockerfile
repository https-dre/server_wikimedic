# Usando Imagem do Node
FROM node:latest

WORKDIR /puppeteer

# Instale as dependências necessárias para o Puppeteer e o Headless Chrome
RUN apt-get update \
    && apt-get install -y \
        fonts-liberation \
        gconf-service \
        libappindicator1 \
        libasound2 \
        libatk1.0-0 \
        libcairo2 \
        libcups2 \
        libfontconfig1 \
        libgbm-dev \
        libgdk-pixbuf2.0-0 \
        libgtk-3-0 \
        libicu-dev \
        libjpeg-dev \
        libnspr4 \
        libnss3 \
        libpango-1.0-0 \
        libpangocairo-1.0-0 \
        libpng-dev \
        libx11-6 \
        libx11-xcb1 \
        libxcb1 \
        libxcomposite1 \
        libxcursor1 \
        libxdamage1 \
        libxext6 \
        libxfixes3 \
        libxi6 \
        libxrandr2 \
        libxrender1 \
        libxss1 \
        libxtst6 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
# Instalando Chromium e dependências do Bot Puppeteer

# Instalação
RUN npm install

# Configuração do diretório de trabalho do servidor
WORKDIR /usr/src/app

# Copia o código para o diretório de trabalho do servidor
COPY . .

# Instalação de dependências Node e transpilação do projeto para JavaScript
RUN npm install && npm run build

# Início da aplicação
CMD ["npm", "start"]
