"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cursoFormSchema, type CursoFormData } from "./schema";
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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { getCursos, createCurso, updateCurso, deleteCurso } from "@/lib/api";
import { Curso, CursosDto } from "@/types";
import { Badge } from "@/components/ui/badge";

export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit: handleFormSubmit,
    reset,
    formState: { errors },
  } = useForm<CursoFormData>({
    resolver: zodResolver(cursoFormSchema),
    defaultValues: {
      id: "",
      nome: "",
      descricao: "",
      cargaHoraria: 0,
      valor: 0,
      inicioVigencia: "",
      ativo: true,
      status: "ATIVO",
    },
  });

  useEffect(() => {
    loadCursos();
  }, []);

  async function loadCursos() {
    try {
      setLoading(true);
      const data = await getCursos();
      setCursos(data as unknown as Curso[]);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(curso: Curso) {
    setEditingCurso(curso);
    reset({
      id: curso.id,
      nome: curso.nome,
      descricao: curso.descricao || "",
      cargaHoraria: curso.cargaHoraria,
      valor: curso.valor || 0,
      inicioVigencia: curso.inicioVigencia || "",
      ativo: curso.ativo,
      status: curso.status,
    });
    setDialogOpen(true);
  }

  function handleNew() {
    setEditingCurso(null);
    reset({
      id: "",
      nome: "",
      descricao: "",
      cargaHoraria: 0,
      inicioVigencia: "",
      valor: 0,
      ativo: true,
      status: "ATIVO",
    });
    setDialogOpen(true);
  }

  async function handleSubmit(data: CursoFormData) {
    try {
      const cursoData: CursosDto = {
        id: data.id || "",
        nome: data.nome,
        descricao: data.descricao,
        cargaHoraria: data.cargaHoraria,
        valor: data.valor,
        inicioVigencia: data.inicioVigencia,
        ativo: data.ativo,
        status: data.status,
      };

      if (editingCurso) {
        await updateCurso(editingCurso.id, cursoData);
      } else {
        await createCurso(cursoData);
      }
      setDialogOpen(false);
      loadCursos();
    } catch (error) {
      console.error("Erro ao salvar curso:", error);
      alert("Erro ao salvar curso. Verifique os dados e tente novamente.");
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir este curso?")) {
      try {
        await deleteCurso(id);
        loadCursos();
      } catch (error) {
        console.error("Erro ao excluir curso:", error);
        alert("Erro ao excluir curso.");
      }
    }
  }

  const filteredCursos = cursos.filter((curso) =>
    curso.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cursos</h1>
          <p className="text-muted-foreground">
            Gerencie os cursos disponíveis no sistema
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNew}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <form onSubmit={handleFormSubmit(handleSubmit)}>
              <DialogHeader>
                <DialogTitle>
                  {editingCurso ? "Editar Curso" : "Novo Curso"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do curso abaixo
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
                <div className="grid gap-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea id="descricao" {...register("descricao")} rows={4} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cargaHoraria">
                      Carga Horária (horas) *
                    </Label>
                    <Input
                      id="cargaHoraria"
                      type="number"
                      min="0"
                      {...register("cargaHoraria", { valueAsNumber: true })}
                    />
                    {errors.cargaHoraria && (
                      <p className="text-sm text-red-500">
                        {errors.cargaHoraria.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="inicioVigencia">Início da Vigência *</Label>
                    <Input
                      id="inicioVigencia"
                      type="date"
                      {...register("inicioVigencia")}
                    />
                    {errors.inicioVigencia && (
                      <p className="text-sm text-red-500">
                        {errors.inicioVigencia.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="valor">Valor (R$)</Label>
                    <Input
                      id="valor"
                      type="number"
                      min="0"
                      step="0.01"
                      {...register("valor", { valueAsNumber: true })}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="ativo"
                    {...register("ativo")}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="ativo">Curso ativo</Label>
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
          <CardTitle>Lista de Cursos</CardTitle>
          <CardDescription>
            Total de {filteredCursos.length} curso(s) encontrado(s)
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
          ) : filteredCursos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum curso encontrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Carga Horária</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Início de Vigência</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCursos.map((curso) => (
                  <TableRow key={curso.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{curso.nome}</div>
                        {curso.descricao && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {curso.descricao}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{curso.cargaHoraria}h</TableCell>
                    <TableCell>
                      {curso.valor ? `R$ ${curso.valor.toFixed(2)}` : "-"}
                    </TableCell>
                    <TableCell>
                      {curso.inicioVigencia
                        ? curso.inicioVigencia.split("-").reverse().join("/")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          curso.status === "ATIVO" ? "default" : "secondary"
                        }
                      >
                        {curso.status ? "ATIVO" : "INATIVO"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(curso)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(curso.id)}
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
