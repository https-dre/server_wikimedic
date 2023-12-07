# Usando Imagem do Node
FROM node:14

# Instalando Chromium e dependências do Bot Puppeteer
RUN apt-get update 

RUN apt-get install -y wget gnupg 

RUN  wget -q -O - https://dl-ssl.google.com/linux/linux/signing_key.pub | apt-key add - 

RUN curl -sSL https://dl-ssl.google.com/linux/linux/signing_key.pub | apt-key add -

RUN apt-get update 

RUN apt-get install -y google-chrome-stable

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
