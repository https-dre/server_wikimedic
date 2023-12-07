# Usando Imagem do Node
FROM node:14

# Instalando Chromium e dependências do Bot Puppeteer
RUN apt-get update 

RUN apt-get install -y wget gnupg 

RUN gpg --batch --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 9DC858229FC7DD38854AE2D88D81803C0EBFCD88 || \
    gpg --batch --keyserver hkp://ipv4.pool.sks-keyservers.net --recv-keys 9DC858229FC7DD38854AE2D88D81803C0EBFCD88 || \
    gpg --batch --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 9DC858229FC7DD38854AE2D88D81803C0EBFCD88

# Adicionar a chave ao sistema
RUN gpg --export --armor 9DC858229FC7DD38854AE2D88D81803C0EBFCD88 | apt-key add -

RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' 

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
