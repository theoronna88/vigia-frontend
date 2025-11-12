# Sistema Vigia - Frontend

Frontend completo em Next.js 14 com shadcn/ui para o Sistema Vigia de Gestão Escolar.

## Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes de UI
- **Lucide React** - Ícones

## Funcionalidades

O sistema oferece gestão completa para:

### 1. Alunos
- Listagem de alunos cadastrados
- Cadastro de novos alunos com dados completos (nome, CPF, email, telefone, endereço, etc.)
- Edição de dados de alunos existentes
- Exclusão lógica de alunos
- Busca por nome, CPF ou email

### 2. Cursos
- Listagem de cursos disponíveis
- Cadastro de novos cursos (nome, descrição, carga horária, valor)
- Edição de cursos existentes
- Exclusão de cursos
- Controle de status (ativo/inativo)
- Busca por nome

### 3. Turmas
- Listagem de turmas cadastradas
- Criação de turmas vinculadas a cursos
- Definição de datas de início e término
- Configuração de horários e número de vagas
- Edição de turmas existentes
- Exclusão de turmas
- Controle de status (ativa/inativa)
- Busca por nome

### 4. Matrículas
- Vinculação de alunos a turmas
- Consulta de matrículas por turma (ver todos os alunos de uma turma)
- Consulta de matrículas por aluno (ver todas as turmas de um aluno)
- Registro da data de matrícula

## Estrutura do Projeto

```
vigia-frontend/
├── app/
│   ├── alunos/
│   │   └── page.tsx          # Página de gestão de alunos
│   ├── cursos/
│   │   └── page.tsx          # Página de gestão de cursos
│   ├── turmas/
│   │   └── page.tsx          # Página de gestão de turmas
│   ├── matriculas/
│   │   └── page.tsx          # Página de gestão de matrículas
│   ├── layout.tsx            # Layout principal com navbar
│   ├── page.tsx              # Dashboard inicial
│   └── globals.css           # Estilos globais
├── components/
│   ├── ui/                   # Componentes shadcn/ui
│   └── navbar.tsx            # Componente de navegação
├── lib/
│   ├── api.ts                # Funções de comunicação com a API
│   └── utils.ts              # Funções utilitárias
├── types/
│   └── index.ts              # Definições de tipos TypeScript
└── .env.local                # Variáveis de ambiente
```

## Instalação e Execução

### Pré-requisitos

- Node.js 18+ instalado
- Backend Spring Boot rodando na porta 8080

### Passos

1. **Instalar as dependências:**

```bash
npm install
```

2. **Configurar a URL da API:**

Edite o arquivo `.env.local` se necessário para apontar para o endereço correto do backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

3. **Executar em modo de desenvolvimento:**

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

4. **Build para produção:**

```bash
npm run build
npm start
```

## Integração com o Backend

O frontend se comunica com o backend Spring Boot através dos seguintes endpoints:

### Alunos (`/api/alunos`)
- `GET /api/alunos` - Lista todos os alunos ativos
- `GET /api/alunos/all` - Lista todos os alunos (incluindo deletados)
- `POST /api/alunos/search` - Busca alunos por filtro
- `GET /api/alunos/{id}` - Busca aluno por ID
- `GET /api/alunos/lead` - Retorna alunos lead
- `POST /api/alunos` - Cria novo aluno
- `PUT /api/alunos/{id}` - Atualiza aluno
- `DELETE /api/alunos/{id}` - Deleta aluno (exclusão lógica)

### Cursos (`/api/cursos`)
- `GET /api/cursos` - Lista todos os cursos
- `GET /api/cursos/{id}` - Busca curso por ID
- `GET /api/cursos/lead` - Retorna cursos lead
- `POST /api/cursos` - Cria novo curso
- `PUT /api/cursos/{id}` - Atualiza curso
- `DELETE /api/cursos/{id}` - Deleta curso

### Turmas (`/api/turmas`)
- `GET /api/turmas` - Lista todas as turmas
- `GET /api/turmas/{id}` - Busca turma por ID
- `POST /api/turmas` - Cria nova turma
- `PUT /api/turmas/{id}` - Atualiza turma
- `PATCH /api/turmas/{turmaId}/aluno/{alunoId}/lead` - Atualiza exibição no lead
- `DELETE /api/turmas/{id}` - Deleta turma

### Matrículas (`/api/matriculas`)
- `POST /api/matriculas` - Cria nova matrícula
- `GET /api/matriculas/aluno/{alunoId}` - Lista matrículas por aluno
- `GET /api/matriculas/turma/{turmaId}` - Lista matrículas por turma

## Navegação

O sistema possui uma navbar fixa no topo com os seguintes itens:

- **Início** - Dashboard com estatísticas gerais
- **Alunos** - Gestão de alunos
- **Cursos** - Gestão de cursos
- **Turmas** - Gestão de turmas
- **Matrículas** - Gestão de matrículas

## Características Técnicas

- **Client-Side Rendering** - Todas as páginas utilizam "use client" para interatividade
- **Tipagem Forte** - TypeScript em todo o projeto
- **Componentização** - Componentes reutilizáveis do shadcn/ui
- **Responsividade** - Interface adaptável a diferentes tamanhos de tela
- **Tratamento de Erros** - Feedback visual para operações com a API
- **Validação de Formulários** - Campos obrigatórios e validação de tipos

## Próximos Passos (Sugestões)

- Implementar paginação nas listagens
- Adicionar filtros avançados
- Implementar autenticação e autorização
- Adicionar relatórios e dashboards mais detalhados
- Implementar notificações em tempo real
- Adicionar exportação de dados (PDF, Excel)

## Suporte

Para dúvidas ou problemas, consulte a documentação do Next.js e shadcn/ui:

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

