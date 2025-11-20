"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCursos } from "../hooks/use-cursos";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil } from "lucide-react";
import { Curso } from "@/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CursoForm } from "../components/curso-form";
import type { CursoFormData } from "../schema";
import { CursoCreateDto } from "@/types";

export default function CursoDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getCurso, saveCurso, loading } = useCursos();
  const [curso, setCurso] = useState<Curso | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const cursoId = params.id as string;

  async function loadCurso() {
    const data = await getCurso(cursoId);
    if (data) {
      setCurso(data);
    } else {
      router.push("/cursos");
    }
  }

  useEffect(() => {
    if (cursoId) {
      loadCurso();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursoId]);

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

    const success = await saveCurso(cursoData, curso?.id);
    if (success) {
      setDialogOpen(false);
      await loadCurso();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-lg font-medium">Carregando...</div>
          <p className="text-muted-foreground">Buscando informações do curso</p>
        </div>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-lg font-medium">Curso não encontrado</div>
          <p className="text-muted-foreground">
            O curso solicitado não existe ou foi removido
          </p>
          <Button className="mt-4" onClick={() => router.push("/cursos")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Cursos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/cursos")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{curso.nome}</h1>
            <p className="text-muted-foreground">
              Informações detalhadas do curso
            </p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Pencil className="mr-2 h-4 w-4" />
              Editar Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <CursoForm
              editingCurso={curso}
              onSubmit={handleSubmit}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>Dados principais do curso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Nome do Curso
              </label>
              <p className="text-lg font-medium mt-1">{curso.nome}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div className="mt-1">
                <Badge
                  variant={curso.status === "ATIVO" ? "default" : "secondary"}
                >
                  {curso.status ? "ATIVO" : "INATIVO"}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Carga Horária
              </label>
              <p className="text-lg font-medium mt-1">
                {curso.cargaHoraria} horas
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Valor Atual
              </label>
              <p className="text-lg font-medium mt-1">
                {curso.valor
                  ? `R$ ${curso.valor.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : "Não definido"}
              </p>
            </div>

            {curso.inicioVigencia && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Início da Vigência
                </label>
                <p className="text-lg font-medium mt-1">
                  {new Date(curso.inicioVigencia).toLocaleDateString("pt-BR")}
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Situação
              </label>
              <div className="mt-1">
                <Badge variant={curso.ativo ? "default" : "secondary"}>
                  {curso.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
          </div>

          {curso.descricao && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Descrição
              </label>
              <p className="text-base mt-2 leading-relaxed">
                {curso.descricao}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
          <CardDescription>Metadados e informações técnicas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                ID do Curso
              </label>
              <p className="text-sm font-mono mt-1 break-all">{curso.id}</p>
            </div>

            {curso.createdAt && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Data de Criação
                </label>
                <p className="text-sm mt-1">
                  {new Date(curso.createdAt).toLocaleString("pt-BR")}
                </p>
              </div>
            )}

            {curso.updatedAt && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Última Atualização
                </label>
                <p className="text-sm mt-1">
                  {new Date(curso.updatedAt).toLocaleString("pt-BR")}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card para histórico de valores - Funcionalidade futura */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-muted-foreground">
            Histórico de Valores
          </CardTitle>
          <CardDescription>
            Histórico de alterações de preços do curso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">
              Esta funcionalidade estará disponível em breve.
            </p>
            <p className="text-xs mt-2">
              Será necessário implementar endpoint no backend para consultar o
              histórico de valores.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
