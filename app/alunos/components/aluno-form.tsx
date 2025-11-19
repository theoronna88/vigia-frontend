"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { alunoFormSchema, type AlunoFormData } from "../schema";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Aluno } from "@/types";

interface AlunoFormProps {
  editingAluno: Aluno | null;
  onSubmit: (data: AlunoFormData) => Promise<void>;
  onCancel: () => void;
}

export function AlunoForm({ editingAluno, onSubmit, onCancel }: AlunoFormProps) {
  const {
    register,
    handleSubmit: handleFormSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AlunoFormData>({
    resolver: zodResolver(alunoFormSchema),
    defaultValues: {
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
    },
  });

  useEffect(() => {
    if (editingAluno) {
      reset({
        id: editingAluno.id,
        nome: editingAluno.nome,
        cpf: editingAluno.cpf,
        rg: editingAluno.rg,
        orgaoEmissor: editingAluno.orgaoEmissor,
        nacionalidade: editingAluno.nacionalidade,
        naturalidade: editingAluno.naturalidade,
        nomeMae: editingAluno.nomeMae,
        nomePai: editingAluno.nomePai,
        sexo: editingAluno.sexo,
        estadoCivil: editingAluno.estadoCivil,
        escolaridade: editingAluno.escolaridade,
        profissao: editingAluno.profissao,
        email: editingAluno.email,
        telefone: editingAluno.telefone,
        dataNascimento: editingAluno.dataNascimento,
        endereco: editingAluno.endereco || "",
        numero: editingAluno.numero || "",
        complemento: editingAluno.complemento || "",
        bairro: editingAluno.bairro || "",
        cidade: editingAluno.cidade || "",
        estado: editingAluno.estado || "",
        cep: editingAluno.cep || "",
        optin: editingAluno.optin,
      });
    } else {
      reset({
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
    }
  }, [editingAluno, reset]);

  return (
    <form onSubmit={handleFormSubmit(onSubmit)}>
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
          <Input id="nome" {...register("nome")} />
          {errors.nome && (
            <p className="text-sm text-red-500">{errors.nome.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="cpf">CPF *</Label>
            <Input id="cpf" {...register("cpf")} />
            {errors.cpf && (
              <p className="text-sm text-red-500">{errors.cpf.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
            <Input
              id="dataNascimento"
              type="date"
              {...register("dataNascimento")}
            />
            {errors.dataNascimento && (
              <p className="text-sm text-red-500">
                {errors.dataNascimento.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="rg">RG *</Label>
            <Input id="rg" {...register("rg")} />
            {errors.rg && (
              <p className="text-sm text-red-500">{errors.rg.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="orgaoEmissor">Órgão Emissor *</Label>
            <Input id="orgaoEmissor" {...register("orgaoEmissor")} />
            {errors.orgaoEmissor && (
              <p className="text-sm text-red-500">
                {errors.orgaoEmissor.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="naturalidade">Naturalidade</Label>
            <Input id="naturalidade" {...register("naturalidade")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nacionalidade">Nacionalidade</Label>
            <Input id="nacionalidade" {...register("nacionalidade")} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="telefone">Telefone *</Label>
            <Input id="telefone" {...register("telefone")} />
            {errors.telefone && (
              <p className="text-sm text-red-500">{errors.telefone.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="profissao">Profissão *</Label>
            <Input id="profissao" {...register("profissao")} />
            {errors.profissao && (
              <p className="text-sm text-red-500">
                {errors.profissao.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="nomeMae">Nome Completo da Mãe *</Label>
            <Input id="nomeMae" {...register("nomeMae")} />
            {errors.nomeMae && (
              <p className="text-sm text-red-500">{errors.nomeMae.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nomePai">Nome Completo do Pai *</Label>
            <Input id="nomePai" {...register("nomePai")} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sexo">Sexo *</Label>
            <Input id="sexo" {...register("sexo")} />
            {errors.sexo && (
              <p className="text-sm text-red-500">{errors.sexo.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="estadoCivil">Estado Civil *</Label>
            <Input id="estadoCivil" {...register("estadoCivil")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="escolaridade">Escolaridade *</Label>
            <Input id="escolaridade" {...register("escolaridade")} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2 col-span-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input id="endereco" {...register("endereco")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="numero">Número *</Label>
            <Input id="numero" {...register("numero")} />
            {errors.numero && (
              <p className="text-sm text-red-500">{errors.numero.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-2"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Input id="cidade" {...register("cidade")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="estado">Estado</Label>
            <Input id="estado" {...register("estado")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cep">CEP</Label>
            <Input id="cep" {...register("cep")} />
          </div>
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
