@echo off

echo Necessario Node js instalado na maquina

echo Instalando Dependencias e Realizando build

npm install && npm run build

echo Iniciando Servidor

node dist/Server.js
