[![CI](https://github.com/ThomasDixini/AplicativoEsteticaDemonstracao/actions/workflows/dotnet-ci.yml/badge.svg)](https://github.com/ThomasDixini/AplicativoEsteticaDemonstracao/actions/workflows/ci.yml)

🌍 **Languages:** [Português](README.md) | [English](README.en.md)


## 📑 Sumário

- [🏗️ Arquitetura do Projeto](#️-arquitetura-do-projeto)
  - [📱 Mobile App](#-mobile-app)
  - [🔔 Expo Notifications](#-expo-notifications)
  - [⚖️ NGINX – Load Balancer](#️-nginx--load-balancer)
  - [🧩 Backend (Arquitetura em Camadas)](#-backend-arquitetura-em-camadas)
  - [🔐 Autenticação – JWT (JSON Web Token)](#-autenticação--jwt-json-web-token)
  - [🧠 API Layer (Camada de API / Controllers)](#-api-layer-camada-de-api--controllers)
  - [⚙️ Service Layer (Camada de Serviços / Regras de Negócio)](#️-service-layer-camada-de-serviços--regras-de-negócio)
  - [🗄️ Data Access Layer (Camada de Acesso a Dados)](#️-data-access-layer-camada-de-acesso-a-dados)
  - [🗃️ Banco de Dados](#️-banco-de-dados)
  - [✅ Benefícios da Arquitetura](#-benefícios-da-arquitetura)
- [🎥 Demonstração](#-demonstração)
  - [Screenshots](#screenshots)
- [⚙️ Pré-requisitos](#️-pré-requisitos)
- [🐳 Configuração com Docker (Recomendado)](#-configuração-com-docker-recomendado)
- [🛠️ Configuração sem Docker](#️-configuração-sem-docker)
  - [Backend (.NET)](#backend-net)
  - [Mobile (React Native/Expo)](#mobile-react-nativeexpo)
- [🔐 Variáveis de Ambiente](#-variáveis-de-ambiente)

---

# Estética App

Aplicação **full stack** para gerenciamento de consultas de estética, desenvolvida com **backend em .NET** e **aplicativo mobile em React Native/Expo**.

O projeto foi criado com foco em **arquitetura limpa**, **separação de responsabilidades**, **segurança** e **escalabilidade**, utilizando práticas e tecnologias comumente aplicadas em ambientes reais de produção, como **JWT**, **Docker** e **NGINX** como load balancer.

Este repositório tem como objetivo **demonstrar conhecimentos técnicos e decisões arquiteturais**, simulando um cenário próximo ao de um sistema real.

> ⚠️ Este é um projeto demonstrativo inspirado em um sistema real desenvolvido para um cliente. Nenhum dado, regra de negócio sensível ou código proprietário foi exposto.

## 👨‍💻 O que eu desenvolvi neste projeto
- Arquitetura completa do backend em .NET
- Implementação de autenticação JWT
- Modelagem do banco de dados
- Integração entre mobile e API
- Configuração de Docker e NGINX como load balancer
- Integração com Expo Notifications


---

# 🏗️ Arquitetura do Projeto

Este projeto utiliza uma arquitetura moderna, escalável e bem definida, focada em separação de responsabilidades, segurança e performance.

<img width="1536" height="1024" alt="Image" src="https://github.com/user-attachments/assets/dc295a44-54e9-41e6-acf8-6037c7c46de8" />

---

## 📱 Mobile App

Aplicação mobile desenvolvida com **Expo / React Native**.

### Responsabilidades
- Interface do usuário
- Consumo da API via HTTP/HTTPS
- Armazenamento e envio do token **JWT** nas requisições
- Recebimento de notificações push via **Expo Notifications**

---

## 🔔 Expo Notifications

Serviço responsável pelo envio de notificações push para os dispositivos móveis.

### Fluxo
- O backend envia notificações utilizando o **Expo Push Service**
- O Mobile App recebe e exibe as notificações ao usuário

---

## ⚖️ NGINX – Load Balancer

O **NGINX** atua como balanceador de carga e ponto de entrada da aplicação.

### Responsabilidades
- Receber todas as requisições vindas do Mobile App
- Distribuir as requisições entre as instâncias do backend
- Melhorar performance e disponibilidade
- Possibilitar escalabilidade horizontal
- Centralizar configurações de segurança (SSL, headers, etc.)

---

## 🧩 Backend (Arquitetura em Camadas)

O backend segue uma **arquitetura em camadas**, garantindo organização, manutenibilidade e facilidade de evolução.

---

## 🔐 Autenticação – JWT (JSON Web Token)

A autenticação é baseada em **JWT**.

### Funcionamento
- O usuário realiza login
- O backend gera um token JWT
- O Mobile App envia o token em cada requisição
- O backend valida o token antes de processar a requisição

---

## 🧠 API Layer (Camada de API / Controllers)

Camada responsável por expor os endpoints da aplicação.

### Responsabilidades
- Receber requisições HTTP
- Validar dados de entrada
- Validar autenticação (JWT)
- Encaminhar as requisições para a Service Layer
- Retornar respostas ao cliente

> Não contém regras de negócio complexas.

---

## ⚙️ Service Layer (Camada de Serviços / Regras de Negócio)

Camada central da aplicação, onde ficam as regras de negócio.

### Responsabilidades
- Implementar a lógica da aplicação
- Orquestrar operações
- Validar regras de negócio
- Chamar a Data Access Layer quando necessário
- Integrar com serviços externos (ex: Expo Notifications)

---

## 🗄️ Data Access Layer (Camada de Acesso a Dados)

Camada responsável pela comunicação com o banco de dados.

### Responsabilidades
- Executar queries
- Persistir e recuperar dados
- Isolar o banco de dados do restante da aplicação
- Facilitar manutenção e troca de tecnologia de banco, se necessário

---

## 🗃️ Banco de Dados

A aplicação utiliza **apenas um banco de dados**, centralizando todas as informações do sistema.

### Características
- Fonte única de dados
- Acessado exclusivamente pela Data Access Layer
- Garante integridade e consistência das informações

---

## ✅ Benefícios da Arquitetura

- Alta organização e legibilidade do código
- Facilidade de manutenção e testes
- Segurança com JWT
- Escalabilidade com NGINX
- Separação clara de responsabilidades
- Preparada para crescimento do projeto

---

## Demonstração
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

## ⚙️ Pré-requisitos

- **Docker e Docker Compose** (versão 3.8 ou superior)
- **.NET 9.0 SDK** (para desenvolvimento sem Docker)
- **Entity Framework Core 9.0.2**: Para consultas no DB
- **Node.js** (versão 18 ou superior) e **Expo CLI** (para mobile)
- **SQL Server** (para backend sem Docker) ou Docker para SQL Server

>  Para rodar o projeto no celular, você precisará de configurações além do **DOCKER**, que está logo abaixo o passo a passo.

## 🐳 Configuração com Docker (Recomendado)

1. Clone o repositório:
   ```bash
   git clone https://github.com/ThomasDixini/AplicativoEsteticaDemonstracao.git
   cd <pasta-do-projeto>
   ```

2. Renomeie o arquivo **.env.example** para **.env**. (adicione seu IP local, caso for testar pelo celular

3. (Opcional) Edite o arquivo `.env` se precisar personalizar senhas ou URLs.

4. Execute os containers:
   ```bash
   docker compose up --build
   ```

   O backend estará disponível em `http://localhost`
   O mobile estará disponível em `http://localhost:8081` (Para Web)

5. O projeto já está preparado para escalabilidade horizontal do backend utilizando o NGINX como Load Balancer.

  Ao subir os containers, você pode escalar múltiplas instâncias do backend usando a flag --scale:
  ```
  docker compose up --build --scale backend=3
  ```

## 🛠️ Configuração sem Docker

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

3. Crie um arquivo `.env` em `mobile/.env` e Configure variáveis de ambiente nele com os valores do `.env.example` global (ex.: EXPO_PUBLIC_API_APP_URL).
   **Atenção**: Se estiver rodando no celular, mas com o BACKEND no docker-compose, os IPS devem apontar para a porta 80, se não para a porta 5056.
   
5. Execute o app:
   ```bash
   cd ./mobile
   npm run start
   ```
   
## 🔐 Variáveis de Ambiente

O projeto usa um arquivo `.env` na raiz para configurações. Renomeie `.env.example` para `.env` para usar valores padrão.

### Variáveis e onde são usadas:

- **DB_PASSWORD**: Senha do banco de dados SQL Server.
  - Usado em: `docker-compose.yaml` (para container db), e em `appsettings.Development.json` (renomeie `appsettings.Development.example` e edite para desenvolvimento sem Docker).
  
- **EXPO_PUBLIC_API_APP_URL**: URL da API para o app mobile. (Ex: http://192.168.1.168:80/api ou http://192.168.1.168:5056/api)
  - Usado em: `mobile/.env` e `./.env`  (configure manualmente no mobile para desenvolvimento sem Docker).
  - **Nota**: Deve ser o IP Local da sua máquina. Caso estiver usando com docker-compose deve-se usar a porta 80, caso contrário porta 5056. 

- **EXPO_PUBLIC_API_WEB_URL**: URL da API para web (se aplicável). (Ex: http://localhost:80/api ou http://localhost:5056/api)
  - Usado em: `mobile/.env` e `./.env`.
  - **Nota**: Deve ser o **localhost** da sua máquina. Caso estiver usando com docker-compose deve-se usar a porta 80, caso contrário porta 5056. 

- **EXPO_PUBLIC_WHATSAPP**: Link do WhatsApp.
  - Usado em: Mobile app.

- **EXPO_PUBLIC_FACEBOOK_URL**: Link do Facebook.
  - Usado em: Mobile app.

- **EXPO_PUBLIC_INSTAGRAM_URL**: Link do Instagram.
  - Usado em: Mobile app.

Para desenvolvimento sem Docker:
- Backend: Edite `backend/EsteticaAPI/appsettings.Development.json` com `DB_PASSWORD` do `.env`.
- Mobile: Crie `mobile/.env` com as variáveis `EXPO_PUBLIC_*` do `.env` global.
