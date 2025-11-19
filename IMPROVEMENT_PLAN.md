# Plano de Execução de Melhorias - Vigia-Frontend

Este documento descreve um plano de ação para implementar as melhorias sugeridas no relatório de code review. As tarefas estão organizadas por prioridade, começando pelas que trarão maior impacto na qualidade e manutenibilidade do código.

## Fase 1: Refatoração dos Formulários (Alta Prioridade)

**Objetivo:** Substituir a implementação manual dos formulários pela utilização de `react-hook-form` e `zod`, melhorando a validação, o gerenciamento de estado e a legibilidade do código.

**Passos:**

1.  **Criar esquemas de validação com `zod`:**
    -   [ ] Definir um esquema de validação para o formulário de `Aluno` em `app/alunos/page.tsx`.
    -   [ ] Definir um esquema de validação para o formulário de `Curso` em `app/cursos/page.tsx`.
    -   [ ] Estender o mesmo padrão para os formulários de `Turmas` e `Matrículas`.

2.  **Integrar `react-hook-form` aos formulários:**
    -   [ ] Refatorar o formulário de `Alunos` para utilizar o hook `useForm`.
    -   [ ] Conectar os campos do formulário ao `react-hook-form` utilizando o método `register`.
    -   [ ] Implementar a submissão do formulário com a função `handleSubmit` do `react-hook-form`.
    -   [ ] Exibir mensagens de erro de validação para cada campo.
    -   [ ] Repetir o processo para os formulários de `Cursos`, `Turmas` e `Matrículas`.

## Fase 2: Melhoria na Estrutura dos Componentes (Média Prioridade)

**Objetivo:** Dividir os componentes monolíticos em componentes menores, mais focados e reutilizáveis.

**Passos:**

1.  **Extrair os componentes de formulário:**
    -   [ ] Criar um novo componente `AlunoForm.tsx` em `components/` e mover a lógica do formulário de `app/alunos/page.tsx` para ele.
    -   [ ] O novo componente `AlunoForm` deverá receber o `aluno` a ser editado (ou `null` para um novo aluno) e uma função `onSubmit` como propriedades.
    -   [ ] Repetir o processo para `Cursos`, criando um `CursoForm.tsx`.
    -   [ ] Estender o padrão para as demais seções (`Turmas`, `Matrículas`).

2.  **Extrair componentes da tabela (Opcional, se necessário):**
    -   [ ] Se as tabelas se tornarem muito complexas, considerar a criação de componentes como `AlunosTable.tsx`, que receberia a lista de alunos e as funções de `handleEdit` e `handleDelete`.

## Fase 3: Aprimoramento da Camada de API e Tratamento de Erros (Média Prioridade)

**Objetivo:** Centralizar a lógica de fetch de dados, melhorar o tratamento de erros e a experiência do usuário ao lidar com falhas na comunicação com a API.

**Passos:**

1.  **Criar um sistema de notificação (Toasts):**
    -   [ ] Adicionar uma biblioteca de toasts (ex: `react-hot-toast` ou similar) ao projeto.
    -   [ ] Criar um serviço ou hook para disparar toasts de sucesso e erro.

2.  **Melhorar o tratamento de erros na `fetchAPI`:**
    -   [ ] Criar uma classe de erro customizada, como `ApiError`, que estenda `Error` e armazene o status da resposta e o corpo do erro.
    -   [ ] Na função `fetchAPI` em `lib/api.ts`, em caso de erro, capturar o corpo da resposta e lançar uma instância de `ApiError`.

3.  **Implementar custom hooks para o fetch de dados:**
    -   [ ] Criar um hook `useAlunos.ts` que encapsule a lógica de `getAlunos`, gerenciando os estados de `loading`, `error` e `data`.
    -   [ ] No hook, utilizar o sistema de toasts para exibir mensagens de erro de forma amigável.
    -   [ ] Substituir a chamada direta a `getAlunos` em `app/alunos/page.tsx` pelo novo hook.
    -   [ ] Repetir o processo para `Cursos`, `Turmas` e `Matrículas`.

## Fase 4: Melhorias na Experiência do Usuário (Baixa Prioridade)

**Objetivo:** Substituir os `alerts` e `confirms` nativos por componentes da biblioteca de UI, proporcionando uma experiência mais coesa.

**Passos:**

1.  **Substituir `window.confirm` por `AlertDialog`:**
    -   [ ] Em `app/alunos/page.tsx`, na função `handleDelete`, substituir o `window.confirm` por um `AlertDialog` do `shadcn/ui`.
    -   [ ] Fazer o mesmo para a exclusão de `Cursos`, `Turmas` e `Matrículas`.

## Fase 5: Revisão e Padronização de Tipos (Baixa Prioridade)

**Objetivo:** Garantir a consistência e a segurança dos tipos em toda a aplicação.

**Passos:**

1.  **Harmonizar os tipos de `Cursos`:**
    -   [ ] Revisar os tipos `Curso` e `CursosDto` e unificá-los, se possível.
    -   [ ] Se não for possível unificar, criar uma função de mapeamento clara (ex: `mapCursosDtoToCurso`) e utilizá-la para remover a coerção de tipo com `as unknown as`.
