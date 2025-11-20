"use client";

import { useEffect, useState } from "react";
import { type CursoFormData } from "./schema";
import { CursoForm } from "./components/curso-form";
import { useCursos } from "./hooks/use-cursos";
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
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Curso, CursoCreateDto } from "@/types";
import { Badge } from "@/components/ui/badge";

export default function CursosPage() {
  const { cursos, loading, loadCursos, saveCurso, removeCurso } = useCursos();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [cursoToDelete, setCursoToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadCursos();
  }, [loadCursos]);

  function handleEdit(curso: Curso) {
    setEditingCurso(curso);
    setDialogOpen(true);
  }

  function handleNew() {
    setEditingCurso(null);
    setDialogOpen(true);
  }

  async function handleSubmit(data: CursoFormData) {
    const cursoData: CursoCreateDto = {
      id: data.id || "",
      nome: data.nome,
      descricao: data.descricao,
      cargaHoraria: data.cargaHoraria,
      valor: data.valor,
      inicioVigencia: data.inicioVigencia,
      ativo: data.ativo,
      status: data.status,
    };

    const success = await saveCurso(cursoData, editingCurso?.id);
    if (success) {
      setDialogOpen(false);
    }
  }

  function handleDelete(id: string) {
    setCursoToDelete(id);
    setConfirmDialogOpen(true);
  }

  async function confirmDelete() {
    if (!cursoToDelete) return;

    const success = await removeCurso(cursoToDelete);
    if (success) {
      setConfirmDialogOpen(false);
    }
    setCursoToDelete(null);
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
            <CursoForm
              editingCurso={editingCurso}
              onSubmit={handleSubmit}
              onCancel={() => setDialogOpen(false)}
            />
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

      <ConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
