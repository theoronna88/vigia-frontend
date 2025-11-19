import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { getAlunos, ApiError } from "@/lib/api";
import type { Aluno } from "@/types";

interface UseAlunosReturn {
  alunos: Aluno[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook customizado para gerenciar o fetch, cache e revalidação de dados de alunos.
 *
 * @returns {UseAlunosReturn} Objeto contendo:
 *   - alunos: Lista de alunos carregada
 *   - loading: Estado de carregamento
 *   - error: Erro ocorrido durante o fetch (se houver)
 *   - refetch: Função para recarregar os dados manualmente
 */
export function useAlunos(): UseAlunosReturn {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAlunos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAlunos();
      setAlunos(data);
    } catch (err) {
      const errorMessage = err instanceof ApiError
        ? `Erro ao carregar alunos: ${err.message}`
        : "Erro ao carregar alunos. Tente novamente.";

      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlunos();
  }, [fetchAlunos]);

  return {
    alunos,
    loading,
    error,
    refetch: fetchAlunos,
  };
}
