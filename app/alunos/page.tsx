"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { alunoFormSchema, type AlunoFormData } from "./schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { getAlunos, createAluno, updateAluno, deleteAluno } from "@/lib/api";
import { Aluno, AlunosDto } from "@/types";

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit: handleFormSubmit,
    reset,
    formState: { errors },
  } = useForm<AlunoFormData>({
    resolver: zodResolver(alunoFormSchema),
    defaultValues: {
      id: "",
      nome: "",
      cpf: "",
      rg: "",
      orgaoEmissor: "",
      sexo: "",
      nacionalidade: "",
      naturalidade: "",
      nomeMae: "",
      nomePai: "",
      estadoCivil: "",
      escolaridade: "",
      profissao: "",
      email: "",
      telefone: "",
      dataNascimento: "",
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      optin: true,
    },
  });

  useEffect(() => {
    loadAlunos();
  }, []);

  async function loadAlunos() {
    try {
      setLoading(true);
      const data = await getAlunos();
      setAlunos(data);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(aluno: Aluno) {
    setEditingAluno(aluno);
    reset({
      id: aluno.id,
      nome: aluno.nome,
      cpf: aluno.cpf,
      rg: aluno.rg,
      orgaoEmissor: aluno.orgaoEmissor,
      nacionalidade: aluno.nacionalidade,
      naturalidade: aluno.naturalidade,
      nomeMae: aluno.nomeMae,
      nomePai: aluno.nomePai,
      sexo: aluno.sexo,
      estadoCivil: aluno.estadoCivil,
      escolaridade: aluno.escolaridade,
      profissao: aluno.profissao,
      email: aluno.email,
      telefone: aluno.telefone,
      dataNascimento: aluno.dataNascimento,
      endereco: aluno.endereco || "",
      numero: aluno.numero || "",
      complemento: aluno.complemento || "",
      bairro: aluno.bairro || "",
      cidade: aluno.cidade || "",
      estado: aluno.estado || "",
      cep: aluno.cep || "",
      optin: aluno.optin,
    });
    setDialogOpen(true);
  }

  function handleNew() {
    setEditingAluno(null);
    reset({
      id: "",
      nome: "",
      cpf: "",
      rg: "",
      orgaoEmissor: "",
      sexo: "",
      nacionalidade: "",
      naturalidade: "",
      nomeMae: "",
      nomePai: "",
      estadoCivil: "",
      escolaridade: "",
      profissao: "",
      email: "",
      telefone: "",
      dataNascimento: "",
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      optin: true,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(data: AlunoFormData) {
    try {
      const alunoData: AlunosDto = {
        id: data.id || "",
        nome: data.nome,
        cpf: data.cpf,
        rg: data.rg,
        orgaoEmissor: data.orgaoEmissor,
        sexo: data.sexo,
        nacionalidade: data.nacionalidade,
        naturalidade: data.naturalidade,
        nomeMae: data.nomeMae,
        nomePai: data.nomePai,
        estadoCivil: data.estadoCivil,
        escolaridade: data.escolaridade,
        profissao: data.profissao,
        email: data.email,
        telefone: data.telefone,
        dataNascimento: data.dataNascimento,
        endereco: data.endereco,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
        cep: data.cep,
        optin: data.optin,
      };

      if (editingAluno) {
        await updateAluno(editingAluno.id, alunoData);
      } else {
        await createAluno(alunoData);
      }
      setDialogOpen(false);
      loadAlunos();
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
      alert("Erro ao salvar aluno. Verifique os dados e tente novamente.");
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir este aluno?")) {
      try {
        await deleteAluno(id);
        loadAlunos();
      } catch (error) {
        console.error("Erro ao excluir aluno:", error);
        alert("Erro ao excluir aluno.");
      }
    }
  }

  const filteredAlunos = alunos.filter(
    (aluno) =>
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.cpf.includes(searchTerm) ||
      aluno.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
          <p className="text-muted-foreground">
            Gerencie os alunos cadastrados no sistema
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNew}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Aluno
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleFormSubmit(handleSubmit)}>
              <DialogHeader>
                <DialogTitle>
                  {editingAluno ? "Editar Aluno" : "Novo Aluno"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do aluno abaixo
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input id="nome" {...register("nome")} />
                  {errors.nome && (
                    <p className="text-sm text-red-500">{errors.nome.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input id="cpf" {...register("cpf")} />
                    {errors.cpf && (
                      <p className="text-sm text-red-500">{errors.cpf.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                    <Input
                      id="dataNascimento"
                      type="date"
                      {...register("dataNascimento")}
                    />
                    {errors.dataNascimento && (
                      <p className="text-sm text-red-500">
                        {errors.dataNascimento.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="rg">RG *</Label>
                    <Input id="rg" {...register("rg")} />
                    {errors.rg && (
                      <p className="text-sm text-red-500">{errors.rg.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="orgaoEmissor">Órgão Emissor *</Label>
                    <Input id="orgaoEmissor" {...register("orgaoEmissor")} />
                    {errors.orgaoEmissor && (
                      <p className="text-sm text-red-500">
                        {errors.orgaoEmissor.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="naturalidade">Naturalidade</Label>
                    <Input id="naturalidade" {...register("naturalidade")} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="nacionalidade">Nacionalidade</Label>
                    <Input id="nacionalidade" {...register("nacionalidade")} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" {...register("email")} />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input id="telefone" {...register("telefone")} />
                    {errors.telefone && (
                      <p className="text-sm text-red-500">{errors.telefone.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="profissao">Profissão *</Label>
                    <Input id="profissao" {...register("profissao")} />
                    {errors.profissao && (
                      <p className="text-sm text-red-500">
                        {errors.profissao.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nomeMae">Nome Completo da Mãe *</Label>
                    <Input id="nomeMae" {...register("nomeMae")} />
                    {errors.nomeMae && (
                      <p className="text-sm text-red-500">{errors.nomeMae.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="nomePai">Nome Completo do Pai *</Label>
                    <Input id="nomePai" {...register("nomePai")} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sexo">Sexo *</Label>
                    <Input id="sexo" {...register("sexo")} />
                    {errors.sexo && (
                      <p className="text-sm text-red-500">{errors.sexo.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="estadoCivil">Estado Civil *</Label>
                    <Input id="estadoCivil" {...register("estadoCivil")} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="escolaridade">Escolaridade *</Label>
                    <Input id="escolaridade" {...register("escolaridade")} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2 col-span-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input id="endereco" {...register("endereco")} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="numero">Número *</Label>
                    <Input id="numero" {...register("numero")} />
                    {errors.numero && (
                      <p className="text-sm text-red-500">{errors.numero.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-2"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input id="cidade" {...register("cidade")} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Input id="estado" {...register("estado")} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input id="cep" {...register("cep")} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
          <CardDescription>
            Total de {filteredAlunos.length} aluno(s) encontrado(s)
          </CardDescription>
          <div className="flex items-center gap-2 pt-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, CPF ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : filteredAlunos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum aluno encontrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlunos.map((aluno) => (
                  <TableRow key={aluno.id}>
                    <TableCell className="font-medium">{aluno.nome}</TableCell>
                    <TableCell>{aluno.cpf}</TableCell>
                    <TableCell>{aluno.email}</TableCell>
                    <TableCell>{aluno.telefone}</TableCell>
                    <TableCell>{aluno.cidade || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(aluno)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(aluno.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
