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
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import {
  getTurmas,
  createTurma,
  updateTurma,
  deleteTurma,
  getCursos,
} from "@/lib/api";
import { Turma, TurmasDto, Curso } from "@/types";
import { Badge } from "@/components/ui/badge";

export default function TurmasPage() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState<TurmasDto>({
    id: "",
    nome: "",
    cursoId: "",
    dataInicio: "",
    dataTermino: "",
    turno: "",
    capacidadeMaxima: 0,
    status: "",
    ativo: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [turmasData, cursosData] = await Promise.all([
        getTurmas(),
        getCursos(),
      ]);
      setTurmas(turmasData as unknown as Turma[]);
      setCursos(cursosData as unknown as Curso[]);
      console.log("Turmas carregadas:", turmasData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(turma: Turma) {
    setEditingTurma(turma);
    setFormData({
      id: turma.id,
      nome: turma.nome,
      cursoId: turma.cursoId,
      dataInicio: turma.dataInicio,
      dataTermino: turma.dataTermino,
      turno: turma.turno || "",
      capacidadeMaxima: turma.capacidadeMaxima,
      status: turma.status,
      ativo: turma.ativo,
    });
    setDialogOpen(true);
  }

  function handleNew() {
    setEditingTurma(null);
    setFormData({
      id: "",
      nome: "",
      cursoId: "",
      dataInicio: "",
      dataTermino: "",
      turno: "",
      capacidadeMaxima: 0,
      status: "",
      ativo: true,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingTurma) {
        await updateTurma(editingTurma.id, formData);
      } else {
        await createTurma(formData);
      }
      setDialogOpen(false);
      loadData();
    } catch (error) {
      console.error("Erro ao salvar turma:", error);
      alert("Erro ao salvar turma. Verifique os dados e tente novamente.");
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir esta turma?")) {
      try {
        await deleteTurma(id);
        loadData();
      } catch (error) {
        console.error("Erro ao excluir turma:", error);
        alert("Erro ao excluir turma.");
      }
    }
  }

  const filteredTurmas = turmas.filter((turma) =>
    turma.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function getCursoNome(cursoId: string): string {
    const curso = cursos.find((c) => c.id === cursoId);
    return curso ? curso.nome : "Curso não encontrado";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Turmas</h1>
          <p className="text-muted-foreground">
            Gerencie as turmas cadastradas no sistema
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNew}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Turma
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingTurma ? "Editar Turma" : "Nova Turma"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados da turma abaixo
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
                <div className="grid gap-2">
                  <Label htmlFor="cursoId">Curso *</Label>
                  <Select
                    value={formData.cursoId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, cursoId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {cursos.map((curso) => (
                        <SelectItem key={curso.id} value={curso.id}>
                          {curso.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="dataInicio">Data de Início *</Label>
                    <Input
                      id="dataInicio"
                      type="date"
                      value={formData.dataInicio}
                      onChange={(e) =>
                        setFormData({ ...formData, dataInicio: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dataTermino">Data de Término *</Label>
                    <Input
                      id="dataTermino"
                      type="date"
                      value={formData.dataTermino}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataTermino: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="horario">Horário</Label>
                    <Input
                      id="horario"
                      placeholder="Ex: 19:00 - 22:00"
                      value={formData.turno}
                      onChange={(e) =>
                        setFormData({ ...formData, turno: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="vagas">Número de Vagas *</Label>
                    <Input
                      id="vagas"
                      type="number"
                      min="0"
                      value={formData.capacidadeMaxima}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          capacidadeMaxima: parseInt(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={formData.ativo}
                    onChange={(e) =>
                      setFormData({ ...formData, ativo: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="ativo">Turma ativa</Label>
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
          <CardTitle>Lista de Turmas</CardTitle>
          <CardDescription>
            Total de {filteredTurmas.length} turma(s) encontrada(s)
          </CardDescription>
          <div className="flex items-center gap-2 pt-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : filteredTurmas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma turma encontrada
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Vagas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTurmas.map((turma) => (
                  <TableRow key={turma.id}>
                    <TableCell className="font-medium">{turma.nome}</TableCell>
                    <TableCell>{getCursoNome(turma.cursoId)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {turma.dataInicio
                            ? turma.dataInicio.split("-").reverse().join("/")
                            : "-"}
                        </div>
                        <div className="text-muted-foreground">
                          até{" "}
                          {turma.dataTermino
                            ? turma.dataTermino.split("-").reverse().join("/")
                            : "-"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{turma.turno || "-"}</TableCell>
                    <TableCell>
                      {turma.capacidadeMaxima - (turma.numeroMatriculados || 0)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={turma.ativo ? "default" : "secondary"}>
                        {turma.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(turma)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(turma.id)}
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
