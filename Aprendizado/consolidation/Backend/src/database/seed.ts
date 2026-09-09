import { hashPassword } from 'better-auth/crypto';
import { prisma } from './prisma';

async function main() {
  // 1. Garante o Professor Oficial (RN02)
  let professor = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'alex@ensino.com' },
        { id: 'prof_alex' },
        { email: 'jp@ensino.com' },
        { id: 'prof_jp' },
      ],
    },
  });

  if (professor) {
    professor = await prisma.user.update({
      where: { id: professor.id },
      data: {
        name: 'Alex',
        email: 'alex@ensino.com',
        papel: 'PROFESSOR',
        emailVerified: true,
      },
    });
  } else {
    professor = await prisma.user.create({
      data: {
        id: 'prof_alex',
        name: 'Alex',
        email: 'alex@ensino.com',
        papel: 'PROFESSOR',
        emailVerified: true,
      },
    });
  }

  const senhaProfessor = 'Professor@123';
  const hashedPassword = await hashPassword(senhaProfessor);

  const accountExistente = await prisma.account.findFirst({
    where: { userId: professor.id },
  });

  if (accountExistente) {
    await prisma.account.update({
      where: { id: accountExistente.id },
      data: {
        password: hashedPassword,
      },
    });
  } else {
    await prisma.account.create({
      data: {
        id: 'prof_alex_account',
        accountId: professor.id,
        providerId: 'credential',
        userId: professor.id,
        password: hashedPassword,
      },
    });
  }

  console.log('Professor e conta de acesso Better Auth garantidos no banco:', professor.email);

  // 2. Garante Curso Oficial Publicado 1 com Módulos e Aulas
  const cursoTs = await prisma.curso.upsert({
    where: { id: 'curso-ts-zero-ao-pro' },
    update: {
      status: 'PUBLICADO',
      deletedAt: null,
    },
    create: {
      id: 'curso-ts-zero-ao-pro',
      titulo: 'TypeScript: Do Zero ao Profissional',
      descricao:
        'Domine tipagem estrita, generics avançados, utility types, typeguards e integração com Express, Prisma e Zod.',
      cargaHorariaEstimada: 30,
      nivel: 'INTERMEDIARIO',
      status: 'PUBLICADO',
      professorId: professor.id,
    },
  });

  const mod1Ts = await prisma.modulo.upsert({
    where: { id: 'mod-ts-1' },
    update: {},
    create: {
      id: 'mod-ts-1',
      titulo: 'Módulo 1: Fundamentos e Tipagem Estrita',
      descricao: 'Configurações de compilação, tipos primitivos e união de tipos.',
      ordem: 1,
      cursoId: cursoTs.id,
    },
  });

  await prisma.aula.upsert({
    where: { id: 'aula-ts-1' },
    update: {},
    create: {
      id: 'aula-ts-1',
      titulo: 'Aula 1: Configuração do TypeScript Strict e Boas Práticas',
      descricao:
        'Aprenda como habilitar strict mode e configurar o compilador para máxima segurança.',
      urlConteudo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duracaoMinutos: 18,
      ordem: 1,
      moduloId: mod1Ts.id,
      cursoId: cursoTs.id,
    },
  });

  await prisma.aula.upsert({
    where: { id: 'aula-ts-2' },
    update: {},
    create: {
      id: 'aula-ts-2',
      titulo: 'Aula 2: Interfaces, Types e Type Narrowing',
      descricao:
        'Diferenças fundamentais entre type e interface e técnicas de estreitamento de tipo.',
      urlConteudo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duracaoMinutos: 22,
      ordem: 2,
      moduloId: mod1Ts.id,
      cursoId: cursoTs.id,
    },
  });

  const mod2Ts = await prisma.modulo.upsert({
    where: { id: 'mod-ts-2' },
    update: {},
    create: {
      id: 'mod-ts-2',
      titulo: 'Módulo 2: Generics e Type Safety Avançado',
      descricao: 'Criação de abstrações genéricas reutilizáveis e type guards.',
      ordem: 2,
      cursoId: cursoTs.id,
    },
  });

  await prisma.aula.upsert({
    where: { id: 'aula-ts-3' },
    update: {},
    create: {
      id: 'aula-ts-3',
      titulo: 'Aula 3: Generics em Funções e Classes',
      descricao: 'Construção de repositórios e serviços fortemente tipados com Generics.',
      urlConteudo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duracaoMinutos: 25,
      ordem: 1,
      moduloId: mod2Ts.id,
      cursoId: cursoTs.id,
    },
  });

  await prisma.aula.upsert({
    where: { id: 'aula-ts-4' },
    update: {},
    create: {
      id: 'aula-ts-4',
      titulo: 'Aula 4: Utility Types e Integração com Zod',
      descricao: 'Uso de Pick, Omit, Partial e derivação de DTOs seguros com Zod infer.',
      urlConteudo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duracaoMinutos: 30,
      ordem: 2,
      moduloId: mod2Ts.id,
      cursoId: cursoTs.id,
    },
  });

  console.log('Curso e aulas de TypeScript cadastrados com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
