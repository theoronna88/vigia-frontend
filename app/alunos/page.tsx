"use client";

import { useEffect, useState } from "react";
import { type AlunoFormData } from "./schema";
import { AlunoForm } from "./components/aluno-form";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { getAlunos, createAluno, updateAluno, deleteAluno } from "@/lib/api";
import { Aluno, AlunosDto } from "@/types";

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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
    setDialogOpen(true);
  }

  function handleNew() {
    setEditingAluno(null);
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
            <AlunoForm
              editingAluno={editingAluno}
              onSubmit={handleSubmit}
              onCancel={() => setDialogOpen(false)}
            />
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
