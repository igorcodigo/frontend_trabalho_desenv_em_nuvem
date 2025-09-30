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

## Hospedagem em Nuvem

Esta aplicação foi hospedada na **[Vercel](https://vercel.com/)**, uma plataforma especializada em deploy de aplicações Next.js que oferece integração nativa e otimizações automáticas.

### Configuração na Vercel

A configuração do deploy na Vercel é simples e automatizada:

1. **Conexão com GitHub:**
   - Acesse [vercel.com](https://vercel.com/) e faça login
   - Conecte sua conta do GitHub à Vercel
   - Selecione o repositório do projeto para fazer o deploy

2. **Configuração Automática:**
   - A Vercel detecta automaticamente que se trata de um projeto Next.js
   - Os comandos de build são configurados automaticamente:
     - **Build Command:** `npm run build`
     - **Output Directory:** `.next`
     - **Install Command:** `npm install`

3. **Variáveis de Ambiente:**
   - Configure as variáveis de ambiente necessárias através do painel da Vercel
   - Acesse: `Project Settings > Environment Variables`
   - Adicione as variáveis conforme necessário para diferentes ambientes (Development, Preview, Production)

4. **Deploy Automático:**
   - A cada push no repositório GitHub, a Vercel automaticamente:
     - Executa o processo de build
     - Mostra logs detalhados de possíveis erros
     - Em caso de erro, basta corrigir o código e fazer novo push
     - Em caso de sucesso, a aplicação fica disponível instantaneamente

5. **URL Personalizada:**
   - A Vercel gera automaticamente uma URL customizada baseada no nome do repositório
   - Formato: `https://nome-do-repositorio.vercel.app`
   - Também é possível configurar domínios personalizados

### Benefícios da Vercel

- Deploy automático a cada commit
- Preview automático para Pull Requests
- CDN global para performance otimizada
- Integração nativa com Next.js
- Monitoramento e analytics integrados

## Agradecimentos e Metodologia

Para dar início ao projeto, foi utilizado o boilerplate **[T3 Stack](https://create.t3.gg/)**. A escolha dessa base permitiu focar na lógica da aplicação e na experiência do usuário, já que ela oferece uma excelente estrutura inicial com tecnologias de ponta pré-configuradas.
