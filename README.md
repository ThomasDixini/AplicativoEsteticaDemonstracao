# Estética App

Um aplicativo de estética com backend em .NET e mobile em React Native/Expo, para gerenciamento de usuários, consultas e produtos.

## Pré-requisitos

- **Docker e Docker Compose** (versão 3.8 ou superior)
- **.NET 9.0 SDK** (para desenvolvimento sem Docker)
- **Node.js** (versão 18 ou superior) e **Expo CLI** (para mobile)
- **SQL Server** (para backend sem Docker) ou Docker para SQL Server

## Configuração com Docker (Recomendado)

1. Clone o repositório:
   ```bash
   git clone https://github.com/ThomasDixini/AplicativoEsteticaDemonstracao.git
   cd <pasta-do-projeto>
   ```

2. Renomeie o arquivo **.env.example** para **.env**

3. (Opcional) Edite o arquivo `.env` se precisar personalizar senhas ou URLs.

4. Execute os containers:
   ```bash
   docker compose up --build
   ```

   O backend estará disponível em `http://localhost:5056`
   O mobile estará disponível em `http://localhost:8081` (Para Web) ou você pode iniciar um outro terminal, executando o comando `npm run start` para gerar o QR Code do Expo para usar com seu celular (Para Android).

## Configuração sem Docker

### Backend (.NET)

1. Instale o .NET 9.0 SDK.

2. Configure um banco de dados SQL Server (local ou remoto).

3. Renomeie `backend/EsteticaAPI/appsettings.Development.example` para `appsettings.Development.json` e edite a senha do banco com o valor de `DB_PASSWORD` do `.env`.

4. Execute as migrações:
   ```bash
   cd backend
   dotnet ef database update --startup-project EsteticaAPI --project EsteticaRepositorio
   ```

5. Execute o backend:
   ```bash
   dotnet watch run
   ```

   O backend estará disponível em `http://localhost:5056`.

### Mobile (React Native/Expo)

O mobile deve ser executado localmente para gerar o QR Code corretamente.

1. Instale Node.js e Expo CLI:
   ```bash
   npm install -g @expo/cli
   ```

2. No diretório `mobile`, instale as dependências:
   ```bash
   npm install
   ```

3. Configure variáveis de ambiente no `mobile/.env` com os valores do `.env` global (ex.: EXPO_PUBLIC_API_APP_URL).

4. Execute o app:
   ```bash
   expo start
   ```

   Para acessar de dispositivos fora da rede local (ex.: celular não conectado à mesma Wi-Fi), use túnel para o backend:
   - Instale a extensão "Dev Tunnels" no VS Code.
   - Abra o painel de Dev Tunnels (View > Command Palette > Dev Tunnels: Create Tunnel).
   - Selecione porta 5056, crie o túnel e copie a URL pública (ex.: https://abc123.devtunnels.ms:5056).
   - Atualize `EXPO_PUBLIC_API_APP_URL` no `mobile/.env` para essa URL (ex.: https://abc123.devtunnels.ms:5056).
   - Para o QR Code do Expo, use `expo start --tunnel` se necessário.

   **Nota para Android**: As imagens e API só funcionarão se o backend for acessível. Use o túnel do VS Code para expor a porta 5056 publicamente, evitando problemas de rede local.

## Variáveis de Ambiente

O projeto usa um arquivo `.env` na raiz para configurações. Renomeie `.env.example` para `.env` para usar valores padrão.

### Variáveis e onde são usadas:

- **DB_PASSWORD**: Senha do banco de dados SQL Server.
  - Usado em: `docker-compose.yaml` (para container db), e em `appsettings.Development.json` (renomeie `appsettings.Development.example` e edite para desenvolvimento sem Docker).
  
- **EXPO_PUBLIC_API_APP_URL**: URL da API para o app mobile.
  - Usado em: `mobile/.env` (configure manualmente no mobile para desenvolvimento sem Docker).
  - **Nota**: Use o URL do Dev Tunnel do VS Code para acesso remoto. (ex.: http://abc123.devtunnel/) 

- **EXPO_PUBLIC_API_WEB_URL**: URL da API para web (se aplicável).
  - Usado em: `mobile/.env`.

- **EXPO_PUBLIC_WHATSAPP**: Link do WhatsApp.
  - Usado em: Mobile app.

- **EXPO_PUBLIC_FACEBOOK_URL**: Link do Facebook.
  - Usado em: Mobile app.

- **EXPO_PUBLIC_INSTAGRAM_URL**: Link do Instagram.
  - Usado em: Mobile app.

Para desenvolvimento sem Docker:
- Backend: Edite `backend/EsteticaAPI/appsettings.Development.json` com `DB_PASSWORD` do `.env`.
- Mobile: Crie `mobile/.env` com as variáveis `EXPO_PUBLIC_*` do `.env` global.

## Demonstração

<!-- Adicione gifs ou fotos aqui -->

### Screenshots

<img width="387" height="834" alt="Image" src="https://github.com/user-attachments/assets/c0de1cc6-910a-4bb8-bc0e-2e798454ec5a" />
<img width="390" height="835" alt="Image" src="https://github.com/user-attachments/assets/1fe5ab4c-b80a-413b-9c79-2a459cf9965e" />
<img width="388" height="832" alt="Image" src="https://github.com/user-attachments/assets/62e74c71-b167-4a2e-afda-16e175e54601" />
<img width="389" height="837" alt="Image" src="https://github.com/user-attachments/assets/c04e524c-4a7a-438c-85b0-1d2d2f8d9ea5" />
<img width="389" height="836" alt="Image" src="https://github.com/user-attachments/assets/6fc50fc7-a487-4b84-9488-60a782fc3d4e" />
<img width="386" height="841" alt="Image" src="https://github.com/user-attachments/assets/42618e4e-092e-494d-95d8-a078d915f654" />
<img width="387" height="839" alt="Image" src="https://github.com/user-attachments/assets/24227f2e-0b19-414a-bd63-1015b1e60095" />
<img width="389" height="844" alt="Image" src="https://github.com/user-attachments/assets/bfc9d160-de90-4415-bf26-f72d261cdc06" />
<img width="390" height="840" alt="Image" src="https://github.com/user-attachments/assets/cccac681-2cb4-4ead-a926-7846a7f561d1" />
<img width="387" height="838" alt="Image" src="https://github.com/user-attachments/assets/1d32af81-d0ff-46be-b06a-408d3c88e4aa" />

## Estrutura do Projeto

- `backend/`: Código do backend em .NET.
- `mobile/`: Código do app mobile em React Native.
- `docker-compose.yaml`: Orquestração dos serviços.

## Contribuição

1. Fork o projeto.
2. Crie uma branch para sua feature.
3. Faça commit e push.
4. Abra um PR.

## Licença

Este projeto está sob a licença MIT.