import { app } from '../app';

async function rodarTestes() {
  console.log('🚀 Iniciando bateria de testes end-to-end (E2E)...');

  const server = app.listen(0);
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 4001;
  const baseUrl = `http://localhost:${port}`;

  console.log(`📡 Servidor de teste escutando em ${baseUrl}`);

  function extractCookie(res: Response): string {
    const rawCookie = res.headers.get('set-cookie');
    if (!rawCookie) return '';
    return rawCookie.split(';')[0] ?? '';
  }

  try {
    // 1. Healthcheck
    console.log('\n[1/17] Testando GET /health...');
    const resHealth = await fetch(`${baseUrl}/health`);
    if (resHealth.status !== 200) {
      throw new Error(`Falha no healthcheck: status ${resHealth.status}`);
    }
    const healthJson = await resHealth.json();
    console.log('✅ Healthcheck OK:', healthJson);

    // 2. Login do Professor
    console.log('\n[2/17] Autenticando Professor...');
    const resLoginProf = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alex@ensino.com',
        password: 'Professor@123',
      }),
    });
    if (resLoginProf.status !== 200) {
      const err = await resLoginProf.text();
      throw new Error(`Falha no login do professor: ${resLoginProf.status} - ${err}`);
    }
    const profCookie = extractCookie(resLoginProf);
    console.log('✅ Professor autenticado com sucesso. Cookie obtido.');

    // 3. Professor cria um Curso
    console.log('\n[3/17] Professor criando novo curso...');
    const resCurso = await fetch(`${baseUrl}/cursos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: profCookie,
      },
      body: JSON.stringify({
        titulo: 'Curso de Rust e Segurança E2E',
        descricao: 'Treinamento completo de Rust focado em concorrência e memória segura.',
        cargaHorariaEstimada: 30,
        nivel: 'AVANCADO',
      }),
    });
    if (resCurso.status !== 201) {
      const err = await resCurso.text();
      throw new Error(`Erro ao criar curso: ${resCurso.status} - ${err}`);
    }
    const cursoCriado = (await resCurso.json()) as any;
    const cursoId = cursoCriado.id;
    console.log(`✅ Curso criado com sucesso! ID: ${cursoId}`);

    // 4. Professor cria um Módulo no Curso
    console.log('\n[4/17] Professor criando módulo no curso...');
    const resModulo = await fetch(`${baseUrl}/cursos/${cursoId}/modulos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: profCookie,
      },
      body: JSON.stringify({
        titulo: 'Módulo 1: Fundamentos de Ownership',
        descricao: 'Compreendendo o borrow checker e lifetimes.',
        ordem: 1,
      }),
    });
    if (resModulo.status !== 201) {
      const err = await resModulo.text();
      throw new Error(`Erro ao criar módulo: ${resModulo.status} - ${err}`);
    }
    const moduloData = (await resModulo.json()) as any;
    const moduloId = moduloData.modulo.id;
    console.log(`✅ Módulo criado com sucesso! ID: ${moduloId}`);

    // 5. Professor cria uma Aula no Módulo
    console.log('\n[5/17] Professor criando aula no módulo...');
    const resAula = await fetch(`${baseUrl}/cursos/${cursoId}/aulas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: profCookie,
      },
      body: JSON.stringify({
        titulo: 'Aula 1: O Stack e o Heap',
        descricao: 'Como a memória é gerenciada em Rust.',
        urlConteudo: 'https://youtube.com/watch?v=rust-stack-heap',
        duracaoMinutos: 20,
        ordem: 1,
        moduloId: moduloId,
      }),
    });
    if (resAula.status !== 201) {
      const err = await resAula.text();
      throw new Error(`Erro ao criar aula: ${resAula.status} - ${err}`);
    }
    const aulaData = (await resAula.json()) as any;
    const aulaId = aulaData.aula.id;
    console.log(`✅ Aula criada com sucesso! ID: ${aulaId}`);

    // 6. Cadastro de Novo Aluno
    const alunoEmail = `aluno_e2e_${Date.now()}@teste.com`;
    console.log(`\n[6/17] Cadastrando novo aluno: ${alunoEmail}...`);
    const resSignUpAluno = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Aluno Teste E2E',
        email: alunoEmail,
        password: 'SenhaSegura@123',
      }),
    });
    if (resSignUpAluno.status !== 200) {
      const err = await resSignUpAluno.text();
      throw new Error(`Falha no cadastro do aluno: ${resSignUpAluno.status} - ${err}`);
    }
    const alunoData = (await resSignUpAluno.json()) as any;
    const alunoCookie = extractCookie(resSignUpAluno);
    if (alunoData.user.papel !== 'ALUNO') {
      throw new Error(`Violação RN02: Papel esperado 'ALUNO', recebido '${alunoData.user.papel}'`);
    }
    console.log('✅ Aluno cadastrado com papel ALUNO garantido por RN02.');

    // 7. Teste de Segurança RBAC: Aluno tenta criar curso
    console.log('\n[7/17] Testando RBAC: Aluno tentando POST /cursos...');
    const resAlunoCriarCurso = await fetch(`${baseUrl}/cursos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: alunoCookie,
      },
      body: JSON.stringify({
        titulo: 'Tentativa Invasiva de Curso',
        descricao: 'Este curso não pode ser criado por aluno.',
        cargaHorariaEstimada: 10,
        nivel: 'INICIANTE',
      }),
    });
    if (resAlunoCriarCurso.status !== 403) {
      throw new Error(
        `Falha de segurança! Status esperado 403, recebido ${resAlunoCriarCurso.status}`,
      );
    }
    console.log('✅ RBAC validado: Aluno bloqueado com 403 Forbidden.');

    // 8. Teste de Segurança: Aluno tenta ver conteúdo de curso sem matrícula
    console.log('\n[8/17] Aluno tentando ver conteúdo sem matrícula...');
    const resConteudoSemMatricula = await fetch(`${baseUrl}/cursos/${cursoId}/conteudo`, {
      headers: { Cookie: alunoCookie },
    });
    if (resConteudoSemMatricula.status !== 403) {
      throw new Error(
        `Falha de segurança! Aluno sem matrícula acessou conteúdo com status ${resConteudoSemMatricula.status}`,
      );
    }
    console.log('✅ RN06/RN09 validada: Acesso ao conteúdo bloqueado com 403 Forbidden.');

    // 9. Aluno realiza matrícula
    console.log('\n[9/17] Aluno realizando matrícula no curso...');
    const resMatricular = await fetch(`${baseUrl}/matriculas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: alunoCookie,
      },
      body: JSON.stringify({ cursoId }),
    });
    if (resMatricular.status !== 201) {
      const err = await resMatricular.text();
      throw new Error(`Erro ao matricular aluno: ${resMatricular.status} - ${err}`);
    }
    console.log('✅ Matrícula realizada com status 201 Created.');

    // 10. Matrícula Duplicada (RN03)
    console.log('\n[10/17] Testando RN03: Tentativa de matrícula duplicada...');
    const resMatriculaDuplicada = await fetch(`${baseUrl}/matriculas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: alunoCookie,
      },
      body: JSON.stringify({ cursoId }),
    });
    if (resMatriculaDuplicada.status !== 409) {
      throw new Error(`Esperado status 409 Conflict, recebido ${resMatriculaDuplicada.status}`);
    }
    console.log('✅ RN03 validada: Matrícula duplicada bloqueada com 409 Conflict.');

    // 11. Aluno acessa conteúdo do curso após matrícula
    console.log('\n[11/17] Aluno acessando conteúdo após matrícula...');
    const resConteudoComMatricula = await fetch(`${baseUrl}/cursos/${cursoId}/conteudo`, {
      headers: { Cookie: alunoCookie },
    });
    if (resConteudoComMatricula.status !== 200) {
      throw new Error(`Falha ao acessar conteúdo: status ${resConteudoComMatricula.status}`);
    }
    const conteudoCurso = (await resConteudoComMatricula.json()) as any;
    if (conteudoCurso.modulos.length === 0 || conteudoCurso.progresso.percentualProgresso !== 0) {
      throw new Error('Conteúdo retornado inconsistente.');
    }
    console.log('✅ Conteúdo acessado com sucesso:', {
      modulos: conteudoCurso.modulos.length,
      aulas: conteudoCurso.modulos[0].aulas.length,
      progressoInicial: conteudoCurso.progresso.percentualProgresso,
    });

    // 12. Aluno marca aula como concluída (RN07)
    console.log(`\n[12/17] Aluno concluindo aula ${aulaId}...`);
    const resConcluir = await fetch(`${baseUrl}/aulas/${aulaId}/concluir`, {
      method: 'POST',
      headers: { Cookie: alunoCookie },
    });
    if (resConcluir.status !== 200) {
      const err = await resConcluir.text();
      throw new Error(`Erro ao concluir aula: ${resConcluir.status} - ${err}`);
    }
    const dataConclusao = (await resConcluir.json()) as any;
    if (
      dataConclusao.estatisticas.percentual !== 100 ||
      !dataConclusao.estatisticas.cursoConcluido
    ) {
      throw new Error('Percentual ou transição de conclusão inconsistente.');
    }
    console.log('✅ Aula concluída! Progresso calculado:', dataConclusao.estatisticas);

    // 13. Idempotência ao concluir a mesma aula (RN05)
    console.log('\n[13/17] Testando RN05: Idempotência ao marcar mesma aula...');
    const resConcluirDeNovo = await fetch(`${baseUrl}/aulas/${aulaId}/concluir`, {
      method: 'POST',
      headers: { Cookie: alunoCookie },
    });
    if (resConcluirDeNovo.status !== 200) {
      throw new Error(`Erro na idempotência: status ${resConcluirDeNovo.status}`);
    }
    console.log('✅ RN05 validada: Conclusão repetida é idempotente.');

    // 14. Aluno desmarca aula
    console.log('\n[14/17] Aluno desmarcando aula...');
    const resDesmarcar = await fetch(`${baseUrl}/aulas/${aulaId}/concluir`, {
      method: 'DELETE',
      headers: { Cookie: alunoCookie },
    });
    if (resDesmarcar.status !== 200) {
      throw new Error(`Erro ao desmarcar aula: status ${resDesmarcar.status}`);
    }
    const dataDesmarcar = (await resDesmarcar.json()) as any;
    if (dataDesmarcar.estatisticas.percentual !== 0) {
      throw new Error('Percentual não foi recalculado para 0%.');
    }
    console.log('✅ Conclusão revertida com sucesso:', dataDesmarcar.estatisticas);

    // 15. Aluno marca aula novamente como concluída
    console.log('\n[15/17] Aluno remarcando aula como concluída...');
    const resReconcluir = await fetch(`${baseUrl}/aulas/${aulaId}/concluir`, {
      method: 'POST',
      headers: { Cookie: alunoCookie },
    });
    if (resReconcluir.status !== 200) {
      throw new Error(`Erro ao reconcluir aula: status ${resReconcluir.status}`);
    }
    console.log('✅ Aula reconcluída com sucesso.');

    // 16. Consulta detalhada de progresso
    console.log('\n[16/17] Consultando GET /cursos/:cursoId/progresso...');
    const resProgresso = await fetch(`${baseUrl}/cursos/${cursoId}/progresso`, {
      headers: { Cookie: alunoCookie },
    });
    if (resProgresso.status !== 200) {
      throw new Error(`Erro ao buscar progresso: status ${resProgresso.status}`);
    }
    const progresso = (await resProgresso.json()) as any;
    if (progresso.percentual !== 100 || progresso.statusMatricula !== 'CONCLUIDA') {
      throw new Error('Estatísticas de progresso inconsistentes.');
    }
    console.log('✅ Progresso verificado com sucesso:', progresso);

    // 17. Listar Minhas Matrículas
    console.log('\n[17/17] Consultando GET /matriculas/minhas...');
    const resMinhasMatriculas = await fetch(`${baseUrl}/matriculas/minhas`, {
      headers: { Cookie: alunoCookie },
    });
    if (resMinhasMatriculas.status !== 200) {
      throw new Error(`Erro ao listar matrículas: status ${resMinhasMatriculas.status}`);
    }
    const matriculas = (await resMinhasMatriculas.json()) as any[];
    const matriculaCurso = matriculas.find((m: any) => m.curso.id === cursoId);
    if (!matriculaCurso || matriculaCurso.percentualProgresso !== 100) {
      throw new Error('Matrícula do curso não listada ou com percentual incorreto.');
    }
    console.log('✅ Lista de matrículas validada com sucesso:', {
      totalMatriculas: matriculas.length,
      curso: matriculaCurso.curso.titulo,
      percentual: matriculaCurso.percentualProgresso,
      status: matriculaCurso.status,
    });

    console.log('\n🎉 TODOS OS 17 TESTES END-TO-END PASSARAM COM 100% DE SUCESSO!');
  } finally {
    server.close();
    console.log('🛑 Servidor de testes encerrado.');
  }
}

rodarTestes().catch((err) => {
  console.error('\n❌ ERRO NO TESTE E2E:', err);
  process.exit(1);
});
