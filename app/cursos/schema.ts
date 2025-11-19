import { z } from "zod";

export const cursoFormSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  descricao: z.string().optional(),
  cargaHoraria: z.number().min(1, "Carga horária deve ser maior que 0"),
  valor: z.number().min(0, "Valor não pode ser negativo").optional(),
  inicioVigencia: z.string().min(1, "Início da vigência é obrigatório"),
  ativo: z.boolean(),
  status: z.string(),
});

export type CursoFormData = z.infer<typeof cursoFormSchema>;
