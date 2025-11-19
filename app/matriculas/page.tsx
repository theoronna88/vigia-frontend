"use client";

import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Autocomplete } from "@/components/ui/autocomplete";
import { Users, GraduationCap } from "lucide-react";
import {
  getMatriculasByAluno,
  getMatriculasByTurma,
  getAlunos,
  getTurmas,
} from "@/lib/api";
import { Matricula, Aluno, Turma } from "@/types";
import { Badge } from "@/components/ui/badge";
import { MatriculaForm } from "./components/matricula-form";

// TODO: Adicionar Edição geral e de status de matrícula
// TODO: Adicionar paginação e filtros avançados


export default function MatriculasPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"aluno" | "turma">("turma");
  const [selectedId, setSelectedId] = useState<string>("");

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matrículas</h1>
          <p className="text-muted-foreground">
            Gerencie as matrículas de alunos em turmas
          </p>
        </div>
        <MatriculaForm onMatriculaCreated={loadMatriculas} />
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
