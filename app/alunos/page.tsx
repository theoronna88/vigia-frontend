"use client";

import { useEffect, useState } from "react";
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

  const [formData, setFormData] = useState<AlunosDto>({
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
    setFormData({
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
    setFormData({
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingAluno) {
        await updateAluno(editingAluno.id, formData);
      } else {
        await createAluno(formData);
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
            <form onSubmit={handleSubmit}>
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
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) =>
                        setFormData({ ...formData, cpf: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                    <Input
                      id="dataNascimento"
                      type="date"
                      value={formData.dataNascimento}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataNascimento: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="rg">RG *</Label>
                    <Input
                      id="rg"
                      value={formData.rg}
                      onChange={(e) =>
                        setFormData({ ...formData, rg: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="orgaoEmissor">Órgão Emissor *</Label>
                    <Input
                      id="orgaoEmissor"
                      value={formData.orgaoEmissor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          orgaoEmissor: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="naturalidade">Naturalidade</Label>
                    <Input
                      id="naturalidade"
                      value={formData.naturalidade}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          naturalidade: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="nacionalidade">Nacionalidade</Label>
                    <Input
                      id="nacionalidade"
                      value={formData.nacionalidade}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nacionalidade: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) =>
                        setFormData({ ...formData, telefone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="profissao">Profissão *</Label>
                    <Input
                      id="profissao"
                      value={formData.profissao}
                      onChange={(e) =>
                        setFormData({ ...formData, profissao: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nomeMae">Nome Completo da Mãe *</Label>
                    <Input
                      id="nomeMae"
                      value={formData.nomeMae}
                      onChange={(e) =>
                        setFormData({ ...formData, nomeMae: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="nomePai">Nome Completo do Pai *</Label>
                    <Input
                      id="nomePai"
                      value={formData.nomePai}
                      onChange={(e) =>
                        setFormData({ ...formData, nomePai: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sexo">Sexo *</Label>
                    <Input
                      id="sexo"
                      value={formData.sexo}
                      onChange={(e) =>
                        setFormData({ ...formData, sexo: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="estadoCivil">Estado Civil *</Label>
                    <Input
                      id="estadoCivil"
                      value={formData.estadoCivil}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estadoCivil: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="escolaridade">Escolaridade *</Label>
                    <Input
                      id="escolaridade"
                      value={formData.escolaridade}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          escolaridade: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2 col-span-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) =>
                        setFormData({ ...formData, endereco: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="numero">Número *</Label>
                    <Input
                      id="numero"
                      value={formData.numero}
                      onChange={(e) =>
                        setFormData({ ...formData, numero: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) =>
                        setFormData({ ...formData, cidade: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      value={formData.estado}
                      onChange={(e) =>
                        setFormData({ ...formData, estado: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) =>
                        setFormData({ ...formData, cep: e.target.value })
                      }
                    />
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
