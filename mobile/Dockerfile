FROM node:20-alpine

WORKDIR /app

# Dependências primeiro (cache)
COPY package*.json ./
RUN npm install

# Código fonte
COPY . .

# Metro
EXPOSE 8081

CMD ["npx", "expo", "start", "--port", "8081"]
