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

   O backend estará disponível em `http://localhost:5056` e o mobile pode ser executado separadamente em `http://localhost:8081` (Para Web) ou lendo o QR Code do Expo com seu celular (Para Android).

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
   npm run start
   ```

   Use o Expo Go no seu dispositivo ou simulador para testar.

## Variáveis de Ambiente

O projeto usa um arquivo `.env` na raiz para configurações. Renomeie `.env.example` para `.env` para usar valores padrão.

### Variáveis e onde são usadas:

- **DB_PASSWORD**: Senha do banco de dados SQL Server.
  - Usado em: `docker-compose.yaml` (para container db), e em `appsettings.Development.json` (renomeie `appsettings.Development.example` e edite para desenvolvimento sem Docker).
  
- **EXPO_PUBLIC_API_APP_URL**: URL da API para o app mobile.
  - Usado em: `mobile/.env` (configure manualmente no mobile para desenvolvimento sem Docker).

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

- ![Tela de Login](screenshots/login.png)
- ![Dashboard](screenshots/dashboard.png)

### Gifs

- ![Registro de Usuário](gifs/registro.gif)
- ![Agendamento de Consulta](gifs/consulta.gif)

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