# Trabalho da Faculdade: Front-end da Aplicação de Lista de Tarefas

Este repositório contém o código-fonte referente **exclusivamente ao front-end** de um sistema de Lista de Tarefas (To-Do List), desenvolvido como um trabalho acadêmico.

## Visão Geral

O objetivo foi construir a interface de usuário (front-end) de uma aplicação web moderna para gerenciamento de tarefas. O código foi desenvolvido com Next.js, aproveitando seus recursos de performance e renderização do lado do cliente.

## Tecnologias Utilizadas

- **Framework:** [Next.js](https://nextjs.org)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com)

## Rotas da Aplicação

A aplicação possui as seguintes rotas disponíveis:

- **Página Inicial:** `/` - Página principal da aplicação
- **Login:** `/auth/login` - Página para autenticação de usuários
- **Registro:** `/auth/register` - Página para cadastro de novos usuários
- **Perfil do Usuário:** `/dashboard/profile` - Página de perfil e configurações do usuário
- **Lista de Tarefas:** `/todolist` - Página principal para gerenciamento de tarefas

## Configuração e Execução

### Pré-requisitos

Antes de executar a aplicação, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **npm** ou **yarn** (gerenciador de pacotes)

### Instalação

1. Clone o repositório ou navegue até a pasta do projeto:
   ```bash
   cd nextjs_template
   ```

2. Instale as dependências do projeto:
   ```bash
   npm install
   ```
   ou
   ```bash
   yarn install
   ```

### Execução em Desenvolvimento

Para executar a aplicação em modo de desenvolvimento:

```bash
npm run dev
```
ou
```bash
yarn dev
```

A aplicação estará disponível em: [http://localhost:3000](http://localhost:3000)

### Build para Produção

Para gerar a build de produção:

```bash
npm run build
```

Para executar a versão de produção:

```bash
npm start
```

## Agradecimentos e Metodologia

Para dar início ao projeto, foi utilizado o boilerplate **[T3 Stack](https://create.t3.gg/)**. A escolha dessa base permitiu focar na lógica da aplicação e na experiência do usuário, já que ela oferece uma excelente estrutura inicial com tecnologias de ponta pré-configuradas.
