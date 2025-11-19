"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Autocomplete } from "@/components/ui/autocomplete";
import { Plus } from "lucide-react";
import { createMatricula, getAlunos, getTurmas } from "@/lib/api";
import { Aluno, Turma } from "@/types";

interface MatriculaFormProps {
  onMatriculaCreated: () => void;
}

export function MatriculaForm({ onMatriculaCreated }: MatriculaFormProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    alunoId: "",
    turmaId: "",
    dataMatricula: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (dialogOpen) {
      loadData();
    }
  }, [dialogOpen]);

  async function loadData() {
    try {
      const [alunosData, turmasData] = await Promise.all([
        getAlunos(),
        getTurmas(),
      ]);
      setAlunos(alunosData);
      setTurmas(turmasData as unknown as Turma[]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
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

    if (!formData.alunoId || !formData.turmaId) {
      alert("Por favor, selecione um aluno e uma turma.");
      return;
    }

    try {
      setIsSubmitting(true);

      const aluno = alunos.find((a) => a.id === formData.alunoId);
      const turma = turmas.find((t) => t.id === formData.turmaId);

      if (!aluno || !turma) {
        alert("Aluno ou turma não encontrado.");
        return;
      }

      await createMatricula({
        id: {
          aluno: {
            id: formData.alunoId,
            nome: aluno.nome,
            cpf: aluno.cpf,
            rg: aluno.rg,
            endereco: aluno.endereco || "",
            cidade: aluno.cidade || "",
            estado: aluno.estado || "",
            cep: aluno.cep || "",
            telefone: aluno.telefone,
            dataNascimento: aluno.dataNascimento,
            sexo: aluno.sexo,
            orgaoEmissor: aluno.orgaoEmissor,
            email: aluno.email,
            nomeMae: aluno.nomeMae,
            optin: aluno.optin,
          },
          turma: {
            id: formData.turmaId,
            nome: turma.nome,
            cursoId: turma.cursoId,
            dataInicio: turma.dataInicio,
            dataTermino: turma.dataTermino,
            capacidadeMaxima: turma.capacidadeMaxima,
            ativo: turma.ativo,
          },
        },
        dataMatricula: formData.dataMatricula,
      });

      setDialogOpen(false);
      alert("Matrícula criada com sucesso!");
      onMatriculaCreated();
    } catch (error) {
      console.error("Erro ao criar matrícula:", error);
      alert("Erro ao criar matrícula. Verifique os dados e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
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
              <Autocomplete
                options={alunos.map((aluno) => ({
                  value: aluno.id,
                  label: aluno.nome,
                }))}
                value={formData.alunoId}
                onSelect={(value) =>
                  setFormData({ ...formData, alunoId: value })
                }
                placeholder="Digite o nome do aluno..."
                emptyMessage="Nenhum aluno encontrado"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="turmaId">Turma *</Label>
              <Autocomplete
                options={turmas.map((turma) => ({
                  value: turma.id,
                  label: turma.nome,
                }))}
                value={formData.turmaId}
                onSelect={(value) =>
                  setFormData({ ...formData, turmaId: value })
                }
                placeholder="Digite o nome da turma..."
                emptyMessage="Nenhuma turma encontrada"
              />
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
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
