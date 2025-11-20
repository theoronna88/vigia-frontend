import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  getCursos,
  getCursoById,
  createCurso,
  updateCurso,
  deleteCurso,
  ApiError,
} from "@/lib/api";
import type { Curso, CursoCreateDto } from "@/types";

interface UseCursosReturn {
  cursos: Curso[];
  loading: boolean;
  error: Error | null;
  loadCursos: () => Promise<void>;
  getCurso: (id: string) => Promise<Curso | null>;
  saveCurso: (data: CursoCreateDto, cursoId?: string) => Promise<boolean>;
  removeCurso: (id: string) => Promise<boolean>;
}

/**
 * Hook customizado para gerenciar operações CRUD de cursos.
 *
 * @returns {UseCursosReturn} Objeto contendo:
 *   - cursos: Lista de cursos carregada
 *   - loading: Estado de carregamento
 *   - error: Erro ocorrido durante operações (se houver)
 *   - loadCursos: Função para carregar/recarregar a lista de cursos
 *   - getCurso: Função para buscar um curso específico por ID
 *   - saveCurso: Função para criar ou atualizar um curso
 *   - removeCurso: Função para excluir um curso
 */
export function useCursos(): UseCursosReturn {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Carrega a lista de cursos da API
   */
  const loadCursos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCursos();
      setCursos(data);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? `Erro ao carregar cursos: ${err.message}`
          : "Erro ao carregar cursos. Tente novamente.";

      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca um curso específico por ID
   * @param id - ID do curso a ser buscado
   * @returns Curso encontrado ou null em caso de erro
   */
  const getCurso = useCallback(async (id: string): Promise<Curso | null> => {
    try {
      setLoading(true);
      setError(null);
      const curso = await getCursoById(id);
      return curso;
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? `Erro ao buscar curso: ${err.message}`
          : "Erro ao buscar curso. Tente novamente.";

      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cria um novo curso ou atualiza um existente
   * @param data - Dados do curso a serem salvos
   * @param cursoId - ID do curso (para atualização). Se não fornecido, cria um novo curso
   * @returns true se a operação foi bem-sucedida, false caso contrário
   */
  const saveCurso = useCallback(
    async (data: CursoCreateDto, cursoId?: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        if (cursoId) {
          await updateCurso(cursoId, data);
          toast.success("Curso atualizado com sucesso!");
        } else {
          await createCurso(data);
          toast.success("Curso criado com sucesso!");
        }

        // Recarrega a lista de cursos após a operação
        await loadCursos();
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof ApiError
            ? `Erro ao salvar curso: ${err.message}`
            : "Erro ao salvar curso. Verifique os dados e tente novamente.";

        setError(err instanceof Error ? err : new Error(String(err)));
        toast.error(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadCursos]
  );

  /**
   * Exclui um curso
   * @param id - ID do curso a ser excluído
   * @returns true se a operação foi bem-sucedida, false caso contrário
   */
  const removeCurso = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        await deleteCurso(id);
        toast.success("Curso excluído com sucesso!");

        // Recarrega a lista de cursos após a exclusão
        await loadCursos();
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof ApiError
            ? `Erro ao excluir curso: ${err.message}`
            : "Erro ao excluir curso. Tente novamente.";

        setError(err instanceof Error ? err : new Error(String(err)));
        toast.error(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadCursos]
  );

  return {
    cursos,
    loading,
    error,
    loadCursos,
    getCurso,
    saveCurso,
    removeCurso,
  };
}
