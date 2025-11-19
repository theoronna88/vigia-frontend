# Documentação do Projeto Vigia-Frontend

## Visão Geral

O Vigia-Frontend é uma aplicação web moderna para gestão escolar, desenvolvida com o objetivo de fornecer uma interface intuitiva e eficiente para administrar alunos, cursos, turmas e matrículas. A aplicação foi construída utilizando as tecnologias mais recentes do ecossistema JavaScript, com foco em desempenho, escalabilidade e manutenibilidade.

Este documento serve como um guia para desenvolvedores que desejam contribuir com o projeto, fornecendo uma visão detalhada da arquitetura, tecnologias utilizadas, estrutura de pastas e boas práticas a serem seguidas.

## Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias:

- **Framework:** [Next.js](https://nextjs.org/) 14 (com App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes de UI:** [shadcn/ui](https://ui.shadcn.com/)
- **Gerenciamento de Formulários:** [React Hook Form](https://react-hook-form.com/)
- **Validação de Esquemas:** [Zod](https://zod.dev/)
- **Ícones:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Cliente HTTP:** `fetch` nativo do navegador (encapsulado em `lib/api.ts`)

## Arquitetura

A aplicação segue a arquitetura recomendada pelo Next.js, utilizando o **App Router**. Isso significa que a estrutura de rotas da aplicação é definida pela organização das pastas dentro do diretório `app`.

### Estrutura de Pastas

A estrutura de pastas do projeto é a seguinte:

```
vigia-frontend/
├── app/                  # Contém todas as rotas da aplicação
│   ├── alunos/           # Rota para a seção de alunos
│   ├── cursos/           # Rota para a seção de cursos
│   ├── matriculas/       # Rota para a seção de matrículas
│   ├── turmas/           # Rota para a seção de turmas
│   ├── layout.tsx        # Layout principal da aplicação
│   └── page.tsx          # Página inicial (Dashboard)
├── components/           # Componentes React reutilizáveis
│   ├── ui/               # Componentes de UI do shadcn/ui
│   └── navbar.tsx        # Barra de navegação principal
├── lib/                  # Funções e utilitários
│   ├── api.ts            # Funções para comunicação com a API backend
│   └── utils.ts          # Funções utilitárias (ex: cn do shadcn)
├── public/               # Arquivos estáticos (imagens, fontes, etc.)
├── styles/               # Arquivos de estilização global
└── types/                # Definições de tipos TypeScript
```

### Fluxo de Dados

O fluxo de dados da aplicação é unidirecional e segue o padrão "Cliente-Servidor". Os componentes da UI (localizados em `app` e `components`) são responsáveis por renderizar a interface e capturar as interações do usuário.

Quando é necessário buscar ou enviar dados para o backend, os componentes chamam as funções apropriadas do módulo `lib/api.ts`. Este módulo é responsável por fazer as requisições HTTP para a API Spring Boot (backend) e retornar os dados para os componentes.

## Como Começar

Para executar o projeto em seu ambiente de desenvolvimento local, siga os passos abaixo:

1. **Clone o repositório:**

   ```bash
   git clone <url-do-repositorio>
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**

   Crie um arquivo `.env.local` na raiz do projeto e adicione a seguinte variável:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

   *Observação: Altere a URL da API se o seu backend estiver rodando em uma porta ou endereço diferente.*

4. **Execute o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

   A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## Scripts Disponíveis

Os seguintes scripts estão disponíveis no `package.json`:

- `npm run dev`: Inicia o servidor de desenvolvimento do Next.js.
- `npm run build`: Gera a versão de produção da aplicação.
- `npm run start`: Inicia um servidor de produção do Next.js (requer `npm run build` antes).
- `npm run lint`: Executa o linter (ESLint) para verificar a qualidade do código.

## Boas Práticas

Para manter a qualidade e a consistência do código, siga as seguintes boas práticas ao contribuir com o projeto:

- **Siga as convenções de nomenclatura:** Utilize `camelCase` para variáveis e funções, e `PascalCase` para componentes React e tipos TypeScript.
- **Mantenha os componentes pequenos e focados:** Cada componente deve ter uma única responsabilidade.
- **Utilize os tipos do TypeScript:** Sempre que possível, utilize tipos para garantir a segurança e a clareza do código.
- **Escreva um código limpo e legível:** Utilize nomes de variáveis e funções descritivos e adicione comentários quando necessário para explicar lógicas complexas.
- **Utilize o ESLint e o Prettier:** Certifique-se de que o seu código está formatado corretamente e sem erros de lint antes de submeter um pull request.

## Contribuindo

Se você deseja contribuir com o projeto, siga os seguintes passos:

1. Crie um fork do repositório.
2. Crie uma nova branch para a sua feature ou correção de bug.
3. Faça as suas alterações e certifique-se de que o código está funcionando corretamente.
4. Submeta um pull request para a branch `main` do repositório original.
