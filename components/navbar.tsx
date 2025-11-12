"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { GraduationCap, Users, BookOpen, ClipboardList, Home } from "lucide-react";

const navItems = [
  {
    name: "Início",
    href: "/",
    icon: Home,
  },
  {
    name: "Alunos",
    href: "/alunos",
    icon: Users,
  },
  {
    name: "Cursos",
    href: "/cursos",
    icon: BookOpen,
  },
  {
    name: "Turmas",
    href: "/turmas",
    icon: GraduationCap,
  },
  {
    name: "Matrículas",
    href: "/matriculas",
    icon: ClipboardList,
  },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Sistema Vigia</span>
          </div>
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

