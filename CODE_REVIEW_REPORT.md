# Relatório de Code Review - Vigia-Frontend

## Visão Geral

Este relatório apresenta uma análise do código-fonte do projeto Vigia-Frontend. O objetivo é identificar áreas de melhoria, potenciais bugs e sugerir boas práticas que podem ser adotadas para aprimorar a qualidade, manutenibilidade e desempenho da aplicação.

A análise foi realizada de forma estática, sem executar o projeto, e focou nos seguintes arquivos: `package.json`, `app/page.tsx`, `app/layout.tsx`, `components/navbar.tsx`, `lib/api.ts`, `app/alunos/page.tsx` e `app/cursos/page.tsx`.

## 1. Potenciais Bugs e Pontos de Atenção

### 1.1. Tratamento de Erros na API

**Observação:** As funções em `lib/api.ts` lançam um erro genérico `Error` em caso de falha na requisição.

```typescript
// lib/api.ts
if (!response.ok) {
  throw new Error(`API Error: ${response.status} ${response.statusText}`);
}
```

**Impacto:** Os componentes que consomem essas funções precisam implementar blocos `try...catch` para tratar os erros. Além disso, a mensagem de erro é genérica e não fornece detalhes sobre o que causou o problema, o que pode dificultar o debug.

**Sugestão:**

- **Criar um tipo de erro customizado:** Crie uma classe de erro customizada que possa carregar mais informações, como o status da resposta e o corpo da mensagem de erro.
- **Melhorar as mensagens de erro:** No frontend, em vez de `alert`, utilize um sistema de notificações mais amigável para o usuário (ex: toasts) para exibir as mensagens de erro.

### 1.2. Tipagem Inconsistente em `getCursos`

**Observação:** Na função `loadCursos` em `app/cursos/page.tsx`, o retorno de `getCursos()` está sendo forçado para `Curso[]` com `as unknown as Curso[]`.

```typescript
// app/cursos/page.tsx
const data = await getCursos();
setCursos(data as unknown as Curso[]);
```

**Impacto:** Isso sugere que o tipo de retorno da função `getCursos` em `lib/api.ts` (`CursosDto[]`) não corresponde ao tipo esperado pelo componente (`Curso[]`). O uso de `as unknown as` suprime os erros de tipo do TypeScript e pode levar a erros em tempo de execução se as estruturas de dados forem incompatíveis.

**Sugestão:**

- **Harmonizar os tipos:** Ajuste os tipos `CursosDto` e `Curso` para que sejam consistentes, ou crie uma função de mapeamento para converter um tipo no outro de forma segura.

### 1.3. Lógica de Exibição do Status do Curso

**Observação:** No componente `CursosPage`, a `Badge` de status exibe "ATIVO" ou "INATIVO" com base no valor de `curso.status`, mas a lógica para definir o `variant` da `Badge` usa `curso.status === "ATIVO"`.

```typescript
// app/cursos/page.tsx
<Badge
  variant={
    curso.status === "ATIVO" ? "default" : "secondary"
  }
>
  {curso.status ? "ATIVO" : "INATIVO"}
</Badge>
```

**Impacto:** A lógica de exibição do texto (`curso.status ? "ATIVO" : "INATIVO"`) é diferente da lógica de estilização (`curso.status === "ATIVO"`). Isso pode levar a inconsistências visuais se o valor de `curso.status` não for exatamente "ATIVO" ou um valor "truthy".

**Sugestão:**

- **Unificar a lógica:** Utilize a mesma condição para a estilização e para o texto, e considere o uso de um `enum` para os status para evitar erros de digitação.

## 2. Code Smells e Oportunidades de Refatoração

### 2.1. Gerenciamento de Estado e Formulários Manuais

**Observação:** Os formulários de criação e edição de alunos e cursos são controlados manualmente com o hook `useState`. Cada campo do formulário tem seu próprio `onChange` handler, o que torna o código verboso e propenso a erros.

```typescript
// app/alunos/page.tsx
<Input
  id="nome"
  value={formData.nome}
  onChange={(e) =>
    setFormData({ ...formData, nome: e.target.value })
  }
  required
/>
```

**Impacto:** O projeto já possui as dependências `react-hook-form` e `zod`, que são ferramentas poderosas para gerenciamento de formulários e validação. O não uso dessas ferramentas resulta em mais código para manter e uma experiência de desenvolvimento menos eficiente.

**Sugestão:**

- **Adotar `react-hook-form` e `zod`:** Refatore os formulários para utilizar `react-hook-form` para o gerenciamento de estado e `zod` para a validação dos dados. Isso simplificará o código, melhorará o desempenho e facilitará a implementação de validações complexas.

### 2.2. Componentes Grandes e com Múltiplas Responsabilidades

**Observação:** As páginas como `AlunosPage` e `CursosPage` são componentes monolíticos que cuidam de várias responsabilidades: buscar dados, gerenciar estado, renderizar a tabela e controlar o formulário de diálogo.

**Impacto:** Componentes grandes são mais difíceis de entender, testar e manter.

**Sugestão:**

- **Dividir os componentes:** Extraia a lógica do formulário para um componente separado (ex: `AlunoForm`, `CursoForm`). Isso tornará o código mais organizado e reutilizável.

### 2.3. Lógica de API nos Componentes

**Observação:** Os componentes chamam diretamente as funções da API e gerenciam os estados de `loading`, `data` e `error`.

**Impacto:** Essa abordagem pode levar à duplicação de código e a um gerenciamento de cache ineficiente.

**Sugestão:**

- **Criar custom hooks para o fetch de dados:** Encapsule a lógica de fetch de dados em custom hooks (ex: `useAlunos`, `useCursos`). Isso centralizará a lógica, facilitará o reuso e abrirá caminho para a implementação de um cache mais sofisticado com bibliotecas como `React Query` ou `SWR`.

## 3. Segurança

### 3.1. Confirmação de Exclusão com `window.confirm`

**Observação:** A exclusão de registros utiliza `window.confirm` para solicitar a confirmação do usuário.

```typescript
// app/alunos/page.tsx
if (confirm("Tem certeza que deseja excluir este aluno?")) {
  // ...
}
```

**Impacto:** `window.confirm` é uma abordagem funcional, mas pode ser visualmente inconsistente com o restante da UI da aplicação, que utiliza `shadcn/ui`.

**Sugestão:**

- **Utilizar um `AlertDialog`:** Substitua o `window.confirm` por um `AlertDialog` do `shadcn/ui`. Isso proporcionará uma experiência de usuário mais coesa e moderna.

## Conclusão

O projeto Vigia-Frontend está bem estruturado e utiliza tecnologias modernas. O código é consistente e legível na maior parte do tempo. As sugestões apresentadas neste relatório visam aprimorar a manutenibilidade, a robustez e a experiência do desenvolvedor, aproveitando ao máximo as ferramentas que já fazem parte do projeto.

As principais recomendações são:

1.  **Adotar `react-hook-form` e `zod`** para o gerenciamento de formulários.
2.  **Dividir os componentes monolíticos** em componentes menores e mais focados.
3.  **Melhorar o tratamento de erros** da API e a experiência do usuário.
4.  **Harmonizar a tipagem** entre o cliente e a API para evitar erros em tempo de execução.
5.  **Utilizar componentes da UI library** para todas as interações com o usuário, incluindo confirmações de exclusão.
