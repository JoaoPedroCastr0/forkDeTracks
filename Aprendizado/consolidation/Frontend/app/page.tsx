import { HeroSection } from '@/components/cursos/HeroSection';
import { CourseGrid } from '@/components/cursos/CourseGrid';
import { TrilhasSection } from '@/components/cursos/TrilhasSection';
import { buscarCursos, buscarTrilhas } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [cursos, trilhas] = await Promise.all([buscarCursos(), buscarTrilhas()]);

  return (
    <div className="flex flex-col">
      <HeroSection totalCursos={cursos.length} />

      <section id="cursos" className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 scroll-mt-16">
        <div className="mb-10 flex flex-col space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Catálogo de Cursos
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Filtre por nível de dificuldade ou busque por tópicos específicos de programação e engenharia.
          </p>
        </div>

        <CourseGrid cursosIniciais={cursos} />
      </section>

      <TrilhasSection trilhasIniciais={trilhas} />
    </div>
  );
}
