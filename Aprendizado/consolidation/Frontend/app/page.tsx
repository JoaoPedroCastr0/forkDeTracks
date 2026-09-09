import { HeroSection } from '@/components/cursos/HeroSection';
import { CourseGrid } from '@/components/cursos/CourseGrid';
import { TrilhasSection } from '@/components/cursos/TrilhasSection';
import { buscarCursos } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const cursos = await buscarCursos();

  return (
    <div className="flex flex-col">
      <HeroSection totalCursos={cursos.length} />

      <section className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
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

      <TrilhasSection />
    </div>
  );
}
