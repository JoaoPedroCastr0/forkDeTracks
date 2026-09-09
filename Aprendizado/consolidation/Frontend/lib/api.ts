import type { Curso } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function buscarCursos(): Promise<Curso[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/cursos`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`Falha ao buscar cursos: ${res.statusText}`);
    }
    const data: Curso[] = await res.json();
    if (data.length > 0) {
      return data;
    }
    // Se o banco recém-criado ainda não tiver cursos cadastrados,
    // usamos os cursos demonstrativos do catálogo
    return cursosDemonstracao;
  } catch (error) {
    console.warn('Backend offline ou sem cursos, exibindo catálogo de demonstração:', error);
    return cursosDemonstracao;
  }
}

export const cursosDemonstracao: Curso[] = [
  {
    id: 'curso-ts-zero-ao-pro',
    titulo: 'TypeScript: Do Zero ao Profissional',
    descricao:
      'Domine tipagem estrita, generics avançados, utility types, typeguards e integração com Express, Prisma e Zod.',
    cargaHorariaEstimada: 30,
    nivel: 'INTERMEDIARIO',
    status: 'PUBLICADO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modulosCount: 6,
    aulasCount: 42,
  },
  {
    id: 'curso-fullstack-next-bun',
    titulo: 'Arquitetura Full-Stack com Next.js & Bun',
    descricao:
      'Aprenda a construir APIs de alta performance com Bun, Express 5, Prisma 7, PostgreSQL e frontends modernos com Next.js App Router e Tailwind.',
    cargaHorariaEstimada: 45,
    nivel: 'AVANCADO',
    status: 'PUBLICADO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modulosCount: 8,
    aulasCount: 56,
  },
  {
    id: 'curso-fundamentos-logica-js',
    titulo: 'Fundamentos de Algoritmos e JavaScript Moderno',
    descricao:
      'Construa sua base sólida na programação: estruturas de dados, loops, manipulação de coleções e assincronismo.',
    cargaHorariaEstimada: 20,
    nivel: 'INICIANTE',
    status: 'PUBLICADO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modulosCount: 4,
    aulasCount: 28,
  },
  {
    id: 'curso-devops-docker-compose',
    titulo: 'Containers com Docker & Persistência de Dados',
    descricao:
      'Empacote serviços, orquestre instâncias PostgreSQL com volumes persistentes no Docker Compose e configure ambientes de desenvolvimento herméticos.',
    cargaHorariaEstimada: 25,
    nivel: 'INTERMEDIARIO',
    status: 'PUBLICADO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modulosCount: 5,
    aulasCount: 35,
  },
];
