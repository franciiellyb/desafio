FROM node:22-alpine
WORKDIR /app

# Copia apenas os arquivos de configuração de pacotes primeiro
COPY package*.json ./

# Instala as dependências dentro do contêiner
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]