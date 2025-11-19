"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cursoFormSchema, type CursoFormData } from "../schema";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Curso } from "@/types";

interface CursoFormProps {
  editingCurso: Curso | null;
  onSubmit: (data: CursoFormData) => Promise<void>;
  onCancel: () => void;
}

export function CursoForm({ editingCurso, onSubmit, onCancel }: CursoFormProps) {
  const {
    register,
    handleSubmit: handleFormSubmit,
    reset,
    formState: { errors, isSubmitting },
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
    if (editingCurso) {
      reset({
        id: editingCurso.id,
        nome: editingCurso.nome,
        descricao: editingCurso.descricao || "",
        cargaHoraria: editingCurso.cargaHoraria,
        valor: editingCurso.valor || 0,
        inicioVigencia: editingCurso.inicioVigencia || "",
        ativo: editingCurso.ativo,
        status: editingCurso.status,
      });
    } else {
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
    }
  }, [editingCurso, reset]);

  return (
    <form onSubmit={handleFormSubmit(onSubmit)}>
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
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </DialogFooter>
    </form>
  );
}
