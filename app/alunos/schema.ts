import { z } from "zod";

export const alunoFormSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos"),
  rg: z.string().min(1, "RG é obrigatório"),
  orgaoEmissor: z.string().min(1, "Órgão emissor é obrigatório"),
  sexo: z.string().min(1, "Sexo é obrigatório"),
  nacionalidade: z.string().optional(),
  naturalidade: z.string().optional(),
  nomeMae: z.string().min(3, "Nome da mãe deve ter no mínimo 3 caracteres"),
  nomePai: z.string().optional(),
  estadoCivil: z.string().optional(),
  escolaridade: z.string().optional(),
  profissao: z.string().min(1, "Profissão é obrigatória"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone deve ter no mínimo 10 dígitos"),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  endereco: z.string().optional(),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  optin: z.boolean(),
});

export type AlunoFormData = z.infer<typeof alunoFormSchema>;
