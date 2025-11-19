# Plano de Execução de Melhorias - Vigia-Frontend (Versionado por Commits)

Este documento detalha o plano de ação para implementar as melhorias sugeridas, com as tarefas divididas em commits atômicos para um histórico de versionamento limpo e rastreável.

---

## Fase 1: Refatoração dos Formulários com `react-hook-form` e `zod`

**Objetivo:** Substituir a implementação manual dos formulários para melhorar a validação, o gerenciamento de estado e a legibilidade do código.

### 1.1. Módulo de Alunos

1.  **`feat(alunos): adiciona esquema de validação com zod`**
    -   **Arquivo a ser criado:** `app/alunos/schema.ts`
    -   **Tarefa:** Definir e exportar o esquema de validação `zod` para o formulário de aluno.

2.  **`refactor(alunos): migra formulário para react-hook-form`**
    -   **Arquivo a ser modificado:** `app/alunos/page.tsx`
    -   **Tarefa:** Substituir o `useState` do formulário pelo hook `useForm`, utilizando o `zodResolver` para integração com o esquema de validação.

3.  **`refactor(alunos): conecta campos de input ao react-hook-form`**
    -   **Arquivo a ser modificado:** `app/alunos/page.tsx`
    -   **Tarefa:** Atualizar todos os componentes `<Input>` do formulário de alunos para usar a função `register` do `react-hook-form` em vez de `value` e `onChange`.

4.  **`feat(alunos): exibe mensagens de erro de validação`**
    -   **Arquivo a ser modificado:** `app/alunos/page.tsx`
    -   **Tarefa:** Adicionar pequenos componentes de texto abaixo de cada campo do formulário para exibir as mensagens de erro provenientes do `formState.errors`.

### 1.2. Módulo de Cursos

1.  **`feat(cursos): adiciona esquema de validação com zod`**
    -   **Arquivo a ser criado:** `app/cursos/schema.ts`
    -   **Tarefa:** Definir e exportar o esquema de validação `zod` para o formulário de curso.

2.  **`refactor(cursos): migra formulário para react-hook-form`**
    -   **Arquivo a ser modificado:** `app/cursos/page.tsx`
    -   **Tarefa:** Repetir o processo de refatoração, substituindo o `useState` do formulário pelo `useForm` com `zodResolver`.

3.  **`refactor(cursos): conecta campos de input ao react-hook-form`**
    -   **Arquivo a ser modificado:** `app/cursos/page.tsx`
    -   **Tarefa:** Atualizar os componentes `<Input>` e `<Textarea>` do formulário de cursos para usar a função `register`.

4.  **`feat(cursos): exibe mensagens de erro de validação`**
    -   **Arquivo a ser modificado:** `app/cursos/page.tsx`
    -   **Tarefa:** Implementar a exibição de mensagens de erro para o formulário de cursos.

---

## Fase 2: Modularização de Componentes

**Objetivo:** Dividir os componentes monolíticos em componentes menores e reutilizáveis.

1.  **`refactor(alunos): extrai AlunoForm para componente reutilizável`**
    -   **Arquivo a ser criado:** `app/alunos/components/aluno-form.tsx`
    -   **Arquivo a ser modificado:** `app/alunos/page.tsx`
    -   **Tarefa:** Mover toda a lógica e JSX do formulário de aluno para o novo componente `AlunoForm`. A página `AlunosPage` passará a controlar apenas a abertura do diálogo e o aluno em edição.

2.  **`refactor(cursos): extrai CursoForm para componente reutilizável`**
    -   **Arquivo a ser criado:** `app/cursos/components/curso-form.tsx`
    -   **Arquivo a ser modificado:** `app/cursos/page.tsx`
    -   **Tarefa:** Repetir o mesmo processo para o formulário de cursos, criando o componente `CursoForm`.

---

## Fase 3: Aprimoramento da Camada de Dados e Erros

**Objetivo:** Centralizar a lógica de fetch, melhorar o tratamento de erros e a experiência do usuário.

1.  **`feat(ui): adiciona sistema de notificações (toast)`**
    -   **Tarefa:** Instalar a biblioteca `react-hot-toast` (`npm install react-hot-toast`).
    -   **Arquivo a ser modificado:** `app/layout.tsx`
    -   **Tarefa:** Adicionar o componente `Toaster` ao layout global da aplicação.

2.  **`refactor(api): melhora tratamento de erros com ApiError`**
    -   **Arquivo a ser modificado:** `lib/api.ts`
    -   **Tarefa:** Criar uma classe `ApiError` que estenda `Error`. Atualizar a função `fetchAPI` para capturar o corpo da resposta em caso de erro e lançar uma `ApiError`.

3.  **`feat(alunos): cria hook useAlunos para fetch de dados`**
    -   **Arquivo a ser criado:** `app/alunos/hooks/use-alunos.ts`
    -   **Tarefa:** Criar um hook customizado que encapsule a lógica de fetch, cache e revalidação dos dados de alunos. O hook deve usar o `toast` para exibir mensagens de erro.

4.  **`refactor(alunos): substitui fetch manual pelo hook useAlunos`**
    -   **Arquivo a ser modificado:** `app/alunos/page.tsx`
    -   **Tarefa:** Remover o `useState` e `useEffect` para `getAlunos` e substituí-los pelo novo hook `useAlunos`.

---

## Fase 4: Melhorias na Experiência do Usuário (UX)

**Objetivo:** Padronizar os diálogos de confirmação com a UI da aplicação.

1.  **`feat(ui): cria componente de diálogo de confirmação reutilizável`**
    -   **Arquivo a ser criado:** `components/ui/confirmation-dialog.tsx`
    -   **Tarefa:** Criar um `AlertDialog` genérico que possa ser reutilizado para diferentes ações de confirmação (ex: exclusão).

2.  **`refactor(alunos): substitui window.confirm por ConfirmationDialog`**
    -   **Arquivo a ser modificado:** `app/alunos/page.tsx`
    -   **Tarefa:** Na função `handleDelete`, substituir o `window.confirm` pelo novo `ConfirmationDialog`.

3.  **`refactor(cursos): substitui window.confirm por ConfirmationDialog`**
    -   **Arquivo a ser modificado:** `app/cursos/page.tsx`
    -   **Tarefa:** Fazer a mesma substituição na página de cursos.

---

## Fase 5: Padronização de Tipos

**Objetivo:** Garantir a consistência e a segurança dos tipos.

1.  **`fix(types): harmoniza tipos Curso e CursosDto`**
    -   **Arquivos a ser modificados:** `types/index.ts`, `lib/api.ts`, `app/cursos/page.tsx`
    -   **Tarefa:** Revisar e unificar os tipos `Curso` e `CursosDto`. Se a unificação não for possível, criar uma função de mapeamento explícita para remover a coerção com `as unknown as` e garantir a segurança de tipos.