// Funções para comunicação com a API Spring Boot

import {
  Aluno,
  AlunosDto,
  Curso,
  CursoCreateDto,
  TurmasDto,
  Matricula,
  SearchDto,
  CursoValor,
  CursoValoresDto,
} from "@/types";

// Configuração da URL base da API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Classe customizada para erros da API
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public details?: unknown
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = "ApiError";
  }
}

// Função auxiliar para fazer requisições
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    // Tenta capturar o corpo da resposta de erro
    let errorDetails: unknown = null;
    try {
      errorDetails = await response.json();
    } catch {
      // Se não for possível parsear como JSON, tenta como texto
      try {
        errorDetails = await response.text();
      } catch {
        // Se falhar, deixa errorDetails como null
      }
    }

    throw new ApiError(response.status, response.statusText, errorDetails);
  }

  // Para respostas 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ========== ALUNOS ==========

export async function getAlunos(): Promise<Aluno[]> {
  return fetchAPI<Aluno[]>("/alunos");
}

export async function getAllAlunos(): Promise<Aluno[]> {
  return fetchAPI<Aluno[]>("/alunos/all");
}

export async function searchAlunos(searchDto: SearchDto): Promise<Aluno[]> {
  return fetchAPI<Aluno[]>("/alunos/search", {
    method: "POST",
    body: JSON.stringify(searchDto),
  });
}

export async function getAlunoById(id: string): Promise<Aluno> {
  return fetchAPI<Aluno>(`/alunos/${id}`);
}

export async function getAlunosLead(): Promise<unknown> {
  return fetchAPI<unknown>("/alunos/lead");
}

export async function createAluno(alunoDto: AlunosDto): Promise<Aluno> {
  return fetchAPI<Aluno>("/alunos", {
    method: "POST",
    body: JSON.stringify(alunoDto),
  });
}

export async function updateAluno(
  id: string,
  alunoDto: AlunosDto
): Promise<Aluno> {
  return fetchAPI<Aluno>(`/alunos/${id}`, {
    method: "PUT",
    body: JSON.stringify(alunoDto),
  });
}

export async function deleteAluno(id: string): Promise<void> {
  return fetchAPI<void>(`/alunos/${id}`, {
    method: "DELETE",
  });
}

// ========== CURSOS ==========

export async function getCursos(): Promise<Curso[]> {
  // Fetch de cursos e depois que pegar a lista, entra em um laço para usar o id e buscar os valores atuais de cada curso
  const cursos = await fetchAPI<Curso[]>("/cursos");

  const cursoResponse: Curso[] = [];
  for (const cursoOriginal of cursos) {
    const valores = await fetchAPI<CursoValor>(`/curso-valor/${cursoOriginal.id}`);

    // Mapeia explicitamente os valores do curso, mantendo type safety
    const cursoComValores: Curso = {
      ...cursoOriginal,
      valor: valores.valor,
      inicioVigencia: valores.inicioVigencia,
    };

    cursoResponse.push(cursoComValores);
  }

  console.log(cursoResponse);
  return cursoResponse;
}

export async function getCursoById(id: string): Promise<Curso> {
  return fetchAPI<Curso>(`/cursos/${id}`);
}

export async function getCursosLead(): Promise<unknown> {
  return fetchAPI<unknown>("/cursos/lead");
}

export async function createCurso(cursoDto: CursoCreateDto): Promise<Curso> {
  const cursoResponse = await fetchAPI<Curso>("/cursos", {
    method: "POST",
    body: JSON.stringify(cursoDto),
  });

  const cursoValor: CursoValoresDto = {
    curso: {
      id: cursoResponse.id,
    },
    valor: cursoDto.valor || 0,
    inicioVigencia: cursoDto.inicioVigencia || "1900-01-01",
  };

  const cursoValorResponse = await fetchAPI<CursoValoresDto>(
    `/curso-valor/${cursoResponse.id}/valor`,
    {
      method: "POST",
      body: JSON.stringify(cursoValor),
    }
  )
    .then((data) => {
      console.log(data);
      return cursoResponse;
    })
    .catch((error) => {
      console.error("Erro ao criar valor do curso:", error);
      return cursoResponse;
    });

  return cursoValorResponse;
}

export async function updateCurso(
  id: string,
  cursoDto: CursoCreateDto
): Promise<Curso> {
  const cursoResponse = await fetchAPI<Curso>(`/cursos/${id}`, {
    method: "PUT",
    body: JSON.stringify(cursoDto),
  });

  const cursoValor: CursoValoresDto = {
    curso: {
      id: cursoResponse.id,
    },
    valor: cursoDto.valor || 0,
    inicioVigencia: cursoDto.inicioVigencia || "1900-01-01",
  };

  const cursoValorResponse = await fetchAPI<CursoValoresDto>(
    `/curso-valor/${cursoResponse.id}/valor`,
    {
      method: "POST",
      body: JSON.stringify(cursoValor),
    }
  )
    .then((data) => {
      console.log(data);
      return cursoResponse;
    })
    .catch((error) => {
      console.error("Erro ao criar valor do curso:", error);
      return cursoResponse;
    });

  return cursoValorResponse;
}

export async function deleteCurso(id: string): Promise<void> {
  return fetchAPI<void>(`/cursos/${id}`, {
    method: "DELETE",
  });
}

// ========== TURMAS ==========

export async function getTurmas(): Promise<TurmasDto[]> {
  return fetchAPI<TurmasDto[]>("/turmas");
}

export async function getTurmaById(id: string): Promise<TurmasDto> {
  return fetchAPI<TurmasDto>(`/turmas/${id}`);
}

export async function createTurma(turmaDto: TurmasDto): Promise<TurmasDto> {

  console.log("Criando turma:", turmaDto);

  // Converter TurmasDto para o formato esperado pela API
  const turmaPayload = {
    nome: turmaDto.nome,
    cursoId: turmaDto.cursoId,
    dataInicio: turmaDto.dataInicio,
    dataTermino: turmaDto.dataTermino,
    capacidadeMaxima: turmaDto.capacidadeMaxima,
    turno: turmaDto.turno,
  }

  return fetchAPI<TurmasDto>("/turmas", {
    method: "POST",
    body: JSON.stringify(turmaPayload),
  });
}

export async function updateTurma(
  id: string,
  turmasDto: TurmasDto
): Promise<TurmasDto> {
  return fetchAPI<TurmasDto>(`/turmas/${id}`, {
    method: "PUT",
    body: JSON.stringify(turmasDto),
  });
}

export async function updateExibicaoLead(
  turmaId: string,
  alunoId: string,
  exibirNoLead: boolean
): Promise<unknown> {
  return fetchAPI<unknown>(
    `/turmas/${turmaId}/aluno/${alunoId}/lead?exibirNoLead=${exibirNoLead}`,
    {
      method: "PATCH",
    }
  );
}

export async function deleteTurma(id: string): Promise<void> {
  return fetchAPI<void>(`/turmas/${id}`, {
    method: "DELETE",
  });
}

// ========== MATRÍCULAS ==========

export async function createMatricula(
  matricula: Matricula
): Promise<Matricula> {
  console.log("Criando matrícula:", matricula);

  // Converter Matricula em MatriculaDto para envio
  const matriculaDto = {
    "alunoId": matricula.id?.aluno.id,
    "turmaId": matricula.id?.turma.id,
    "dataMatricula": matricula.dataMatricula,
  };

  return fetchAPI<Matricula>("/matriculas", {
    method: "POST",
    body: JSON.stringify(matriculaDto),
  });
}

export async function getMatriculasByAluno(
  alunoId: string
): Promise<Matricula[]> {
  return fetchAPI<Matricula[]>(`/matriculas/aluno/${alunoId}`);
}

export async function getMatriculasByTurma(
  turmaId: string
): Promise<Matricula[]> {
  return fetchAPI<Matricula[]>(`/matriculas/turma/${turmaId}`);
}
