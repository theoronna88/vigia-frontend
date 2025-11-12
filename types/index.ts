// Tipos e interfaces baseados nos DTOs do backend Spring

export interface Aluno {
  id: string;
  nome: string;
  cpf: string;
  rg: string;
  orgaoEmissor: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  nacionalidade?: string;
  naturalidade?: string;
  nomeMae: string;
  nomePai?: string;
  estadoCivil?: string;
  escolaridade?: string;
  profissao?: string;
  sexo: string;
  optin: boolean;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlunosDto {
  id: string;
  nome: string;
  cpf: string;
  rg: string;
  orgaoEmissor: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  sexo: string;
  nacionalidade?: string;
  naturalidade?: string;
  nomeMae: string;
  nomePai?: string;
  estadoCivil?: string;
  escolaridade?: string;
  profissao?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  optin: boolean;
}

export interface Curso {
  id: string;
  nome: string;
  descricao?: string;
  cargaHoraria: number;
  valor?: number;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
  status: string;
  inicioVigencia?: string;
}

export interface CursosDto {
  id: string;
  nome: string;
  descricao?: string;
  cargaHoraria: number;
  valor?: number;
  ativo: boolean;
  status: string;
  cursoValor?: CursoValoresDto;
  inicioVigencia?: string;
}

export interface CursoValor {
  id: string;
  cursoId: string;
  valor: number;
  inicioVigencia: string;
  fimVigencia?: string;
}

export interface CursoValoresDto {
  curso: CursosDto | { id: string };
  valor: number;
  inicioVigencia: string;
  fimVigencia?: string;
}

export interface CursoResponse {
  cursoDto: CursosDto;
  valor: number;
  status: string;
  inicioVigencia: string;
  fimVigencia?: string;
}

export interface Turma {
  id: string;
  nome: string;
  cursoId: string;
  curso?: Curso;
  dataInicio: string;
  dataTermino: string;
  turno?: string;
  capacidadeMaxima: number;
  numeroMatriculados?: number;
  ativo: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TurmasDto {
  id: string;
  nome: string;
  cursoId: string;
  dataInicio: string;
  dataTermino: string;
  turno?: string;
  capacidadeMaxima: number;
  status?: string;
  numeroMatriculados?: number;
  ativo: boolean;
}

export interface Matricula {
  id?: {
    aluno: Aluno;
    turma: Turma;
  };
  dataMatricula: string;
  status?: string;
  exibirNoLead?: boolean;
}

export interface SearchDto {
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
}

export interface CursoLead {
  id: string;
  nome: string;
  totalAlunos: number;
}

export interface AlunoLead {
  id: string;
  nome: string;
  totalCursos: number;
}
