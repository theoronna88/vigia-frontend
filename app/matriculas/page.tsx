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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Autocomplete } from "@/components/ui/autocomplete";
import { Plus, Users, GraduationCap } from "lucide-react";
import {
  createMatricula,
  getMatriculasByAluno,
  getMatriculasByTurma,
  getAlunos,
  getTurmas,
} from "@/lib/api";
import { Matricula, Aluno, Turma } from "@/types";
import { Badge } from "@/components/ui/badge";

// TODO: Adicionar Edição geral e de status de matrícula
// TODO: Adicionar paginação e filtros avançados
// TODO: Mudar a busca de turmas e alunos para um componente texto com busca


export default function MatriculasPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"aluno" | "turma">("turma");
  const [selectedId, setSelectedId] = useState<string>("");

  const [formData, setFormData] = useState({
    alunoId: "",
    turmaId: "",
    dataMatricula: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadMatriculas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, viewMode]);

  async function loadData() {
    try {
      setLoading(true);
      const [alunosData, turmasData] = await Promise.all([
        getAlunos(),
        getTurmas(),
      ]);
      setAlunos(alunosData);
      setTurmas(turmasData as unknown as Turma[]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadMatriculas() {
    try {
      setLoading(true);
      let data: Matricula[] = [];
      if (viewMode === "aluno" && selectedId) {
        data = await getMatriculasByAluno(selectedId);
      } else if (viewMode === "turma" && selectedId) {
        data = await getMatriculasByTurma(selectedId);
      }
      console.log("Matrículas carregadas:", data);
      setMatriculas(data);
    } catch (error) {
      console.error("Erro ao carregar matrículas:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleNew() {
    setFormData({
      alunoId: "",
      turmaId: "",
      dataMatricula: new Date().toISOString().split("T")[0],
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createMatricula({
        id: {
          aluno: { 
            id: formData.alunoId, 
            nome: "",
            cpf: '',
            rg: '',
            endereco: '',
            cidade: '',
            estado: '',
            cep: '',
            telefone: '',
            dataNascimento: '',
            sexo: '',
            orgaoEmissor: '',
            email: '', 
            nomeMae: '',
            optin: true,
          },
          turma: { id: formData.turmaId,
            nome: '',
            cursoId: '',
            dataInicio: '',
            dataTermino: '',
            capacidadeMaxima: 0,
            ativo: true 
          },
        },
        dataMatricula: formData.dataMatricula,
      });
      setDialogOpen(false);
      alert("Matrícula criada com sucesso!");
      if (selectedId) {
        loadMatriculas();
      }
    } catch (error) {
      console.error("Erro ao criar matrícula:", error);
      alert("Erro ao criar matrícula. Verifique os dados e tente novamente.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matrículas</h1>
          <p className="text-muted-foreground">
            Gerencie as matrículas de alunos em turmas
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNew}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Matrícula
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Nova Matrícula</DialogTitle>
                <DialogDescription>
                  Vincule um aluno a uma turma
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="alunoId">Aluno *</Label>
                  <Select
                    value={formData.alunoId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, alunoId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um aluno" />
                    </SelectTrigger>
                    <SelectContent>
                      {alunos.map((aluno) => (
                        <SelectItem key={aluno.id} value={aluno.id}>
                          {aluno.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="turmaId">Turma *</Label>
                  <Select
                    value={formData.turmaId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, turmaId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma turma" />
                    </SelectTrigger>
                    <SelectContent>
                      {turmas.map((turma) => (
                        <SelectItem key={turma.id} value={turma.id}>
                          {turma.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dataMatricula">Data da Matrícula *</Label>
                  <Input
                    id="dataMatricula"
                    type="date"
                    value={formData.dataMatricula}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dataMatricula: e.target.value,
                      })
                    }
                    required
                  />
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Consultar por Turma
            </CardTitle>
            <CardDescription>
              Veja todos os alunos matriculados em uma turma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="turma-search">Buscar turma</Label>
                <Autocomplete
                  options={turmas.map((turma) => ({
                    value: turma.id,
                    label: turma.nome,
                  }))}
                  value={viewMode === "turma" ? selectedId : ""}
                  onSelect={(value) => {
                    setViewMode("turma");
                    setSelectedId(value);
                  }}
                  placeholder="Digite o nome da turma..."
                  emptyMessage="Nenhuma turma encontrada"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Consultar por Aluno
            </CardTitle>
            <CardDescription>
              Veja todas as turmas em que um aluno está matriculado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aluno-search">Buscar aluno</Label>
                <Autocomplete
                  options={alunos.map((aluno) => ({
                    value: aluno.id,
                    label: aluno.nome,
                  }))}
                  value={viewMode === "aluno" ? selectedId : ""}
                  onSelect={(value) => {
                    setViewMode("aluno");
                    setSelectedId(value);
                  }}
                  placeholder="Digite o nome do aluno..."
                  emptyMessage="Nenhum aluno encontrado"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedId && (
        <Card>
          <CardHeader>
            <CardTitle>
              {viewMode === "turma" ? "Alunos Matriculados" : "Turmas do Aluno"}
            </CardTitle>
            <CardDescription>
              Total de {matriculas.length} matrícula(s) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : matriculas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma matrícula encontrada
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    {viewMode === "turma" ? (
                      <TableHead>Aluno</TableHead>
                    ) : (
                      <TableHead>Turma</TableHead>
                    )}
                    <TableHead>Data da Matrícula</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matriculas.map((matricula, index) => (
                    <TableRow key={index}>
                      {viewMode === "turma" ? (
                        <TableCell className="font-medium">
                          {matricula.id?.aluno.nome}
                        </TableCell>
                      ) : (
                        <TableCell className="font-medium">
                          {matricula.id?.turma.nome}
                        </TableCell>
                      )}
                      <TableCell>
                        {matricula.dataMatricula
                          ? matricula.dataMatricula
                              .split("-")
                              .reverse()
                              .join("/")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge>{matricula.status || "Ativa"}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
