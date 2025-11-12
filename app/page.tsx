"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, ClipboardList } from "lucide-react";
import { getAlunos, getCursos, getTurmas } from "@/lib/api";

export default function Home() {
  const [stats, setStats] = useState({
    alunos: 0,
    cursos: 0,
    turmas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [alunos, cursos, turmas] = await Promise.all([
          getAlunos(),
          getCursos(),
          getTurmas(),
        ]);
        setStats({
          alunos: alunos.length,
          cursos: cursos.length,
          turmas: turmas.length,
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const cards = [
    {
      title: "Alunos",
      description: "Total de alunos cadastrados",
      value: stats.alunos,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Cursos",
      description: "Total de cursos disponíveis",
      value: stats.cursos,
      icon: BookOpen,
      color: "text-green-600",
    },
    {
      title: "Turmas",
      description: "Total de turmas ativas",
      value: stats.turmas,
      icon: GraduationCap,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Bem-vindo ao Sistema Vigia de Gestão Escolar
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : card.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sobre o Sistema</CardTitle>
          <CardDescription>
            Sistema de gestão completo para instituições de ensino
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            O Sistema Vigia oferece uma solução completa para gerenciar alunos,
            cursos, turmas e matrículas. Com uma interface moderna e intuitiva,
            você pode facilmente cadastrar novos alunos, criar cursos,
            organizar turmas e gerenciar matrículas de forma eficiente.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Gestão de Alunos
              </h3>
              <p className="text-sm text-muted-foreground">
                Cadastre e gerencie informações completas dos alunos, incluindo
                dados pessoais, contato e endereço.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Catálogo de Cursos
              </h3>
              <p className="text-sm text-muted-foreground">
                Crie e organize cursos com informações detalhadas sobre carga
                horária, valor e descrição.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Organização de Turmas
              </h3>
              <p className="text-sm text-muted-foreground">
                Crie turmas vinculadas a cursos, defina datas, horários e
                controle o número de vagas disponíveis.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Controle de Matrículas
              </h3>
              <p className="text-sm text-muted-foreground">
                Gerencie matrículas de alunos em turmas e acompanhe o status
                de cada matrícula.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
