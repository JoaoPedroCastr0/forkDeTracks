import { app } from '../app';

interface RespostaCurso {
  id: string;
}

interface RespostaModulo {
  modulo: {
    id: string;
  };
}

interface RespostaAula {
  aula: {
    id: string;
  };
}

interface RespostaAlunoSignUp {
  user: {
    id: string;
    papel: string;
  };
}

interface RespostaConteudoCurso {
  modulos: Array<{
    aulas: unknown[];
  }>;
  progresso: {
    percentualProgresso: number;
  };
}

interface RespostaConclusaoAula {
  estatisticas: {
    percentual: number;
    cursoConcluido: boolean;
  };
}

interface RespostaDesmarcarAula {
  estatisticas: {
    percentual: number;
  };
}

interface RespostaProgressoCurso {
  percentual: number;
  statusMatricula: string;
}

interface ItemMinhasMatriculas {
  curso: {
    id: string;
    titulo: string;
  };
  percentualProgresso: number;
  status: string;
}

interface RespostaTrilha {
  id: string;
  titulo: string;
  alunoId?: string | null;
  aluno?: { id: string; name: string; email: string } | null;
  totalCursos?: number;
  cursos: Array<{ id: string; titulo: string }>;
}

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
    const cursoCriado = (await resCurso.json()) as RespostaCurso;
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
    const moduloData = (await resModulo.json()) as RespostaModulo;
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
    const aulaData = (await resAula.json()) as RespostaAula;
    const aulaId = aulaData.aula.id;
    console.log(`✅ Aula criada com sucesso! ID: ${aulaId}`);

    // 5.1 Professor cria uma Trilha de Especialização e vincula o Curso
    console.log('\n[5.1] Professor Alex criando Trilha de Especialização...');
    const resTrilha = await fetch(`${baseUrl}/trilhas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: profCookie,
      },
      body: JSON.stringify({
        titulo: 'Trilha de Sistemas e Alta Performance',
        descricao: 'Aprenda Rust, governança de memória, concorrência e backend seguro.',
        ordem: 1,
        cursosIds: [cursoId],
      }),
    });
    if (resTrilha.status !== 201) {
      const err = await resTrilha.text();
      throw new Error(`Erro ao criar trilha: ${resTrilha.status} - ${err}`);
    }
    const trilhaCriada = (await resTrilha.json()) as RespostaTrilha;
    const trilhaId = trilhaCriada.id;
    console.log(
      `✅ Trilha criada com sucesso! ID: ${trilhaId} (com ${trilhaCriada.cursos.length} curso(s) vinculado(s))`,
    );

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
    const alunoData = (await resSignUpAluno.json()) as RespostaAlunoSignUp;
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

    // 7.1 Teste de Segurança RBAC: Aluno tenta criar Trilha
    console.log('\n[7.1] Testando RBAC: Aluno tentando POST /trilhas...');
    const resAlunoCriarTrilha = await fetch(`${baseUrl}/trilhas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: alunoCookie,
      },
      body: JSON.stringify({
        titulo: 'Trilha Invasiva do Aluno',
        descricao: 'Tentativa não autorizada de criar trilha.',
      }),
    });
    if (resAlunoCriarTrilha.status !== 403) {
      throw new Error(
        `Falha de segurança! Aluno conseguiu criar trilha com status ${resAlunoCriarTrilha.status}`,
      );
    }
    console.log('✅ RBAC validado: Aluno bloqueado de criar trilha com 403 Forbidden.');

    // 7.2 Consulta pública de Trilhas e detalhes com Cursos
    console.log('\n[7.2] Consultando GET /trilhas e GET /trilhas/:id...');
    const resListarTrilhas = await fetch(`${baseUrl}/trilhas`);
    if (resListarTrilhas.status !== 200) {
      throw new Error(`Falha ao listar trilhas: ${resListarTrilhas.status}`);
    }
    const listaTrilhas = (await resListarTrilhas.json()) as RespostaTrilha[];
    if (listaTrilhas.length === 0) {
      throw new Error('Nenhuma trilha retornada no catálogo.');
    }
    const resObterTrilha = await fetch(`${baseUrl}/trilhas/${trilhaId}`);
    if (resObterTrilha.status !== 200) {
      throw new Error(`Falha ao obter trilha por id: ${resObterTrilha.status}`);
    }
    const trilhaDetalhe = (await resObterTrilha.json()) as RespostaTrilha;
    if (!trilhaDetalhe.cursos || trilhaDetalhe.cursos.length === 0) {
      throw new Error('Trilha retornada sem cursos associados.');
    }
    console.log(
      `✅ Trilhas consultadas com sucesso: ${listaTrilhas.length} trilha(s), com ${trilhaDetalhe.cursos.length} curso(s) na jornada.`,
    );

    // 7.3 RBAC e Listagem de Alunos
    console.log('\n[7.3] Testando RBAC em GET /alunos...');
    const resAlunoListarAlunos = await fetch(`${baseUrl}/alunos`, {
      headers: { Cookie: alunoCookie },
    });
    if (resAlunoListarAlunos.status !== 403) {
      throw new Error(
        `Esperado 403 para Aluno em /alunos, recebido ${resAlunoListarAlunos.status}`,
      );
    }
    console.log('✅ RBAC validado: Aluno bloqueado de listar alunos com 403 Forbidden.');

    const resProfListarAlunos = await fetch(`${baseUrl}/alunos`, {
      headers: { Cookie: profCookie },
    });
    if (resProfListarAlunos.status !== 200) {
      throw new Error(`Professor não conseguiu listar alunos: ${resProfListarAlunos.status}`);
    }
    const listaAlunos = (await resProfListarAlunos.json()) as Array<{ id: string; email: string }>;
    if (!listaAlunos.some((a) => a.id === alunoData.user.id)) {
      throw new Error('Aluno recém-cadastrado não encontrado na lista de alunos do Professor.');
    }
    console.log(`✅ Professor listou com sucesso ${listaAlunos.length} aluno(s) cadastrado(s).`);

    // 7.4 Professor Alex cria uma Trilha Personalizada para o Aluno
    console.log('\n[7.4] Professor Alex criando Trilha Personalizada para o Aluno...');
    const resTrilhaPersonalizada = await fetch(`${baseUrl}/trilhas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: profCookie,
      },
      body: JSON.stringify({
        titulo: 'Trilha Mentoria Rust VIP',
        descricao: 'Trilha desenhada especificamente para este aluno.',
        ordem: 2,
        alunoId: alunoData.user.id,
        cursosIds: [cursoId],
      }),
    });
    if (resTrilhaPersonalizada.status !== 201) {
      const err = await resTrilhaPersonalizada.text();
      throw new Error(
        `Erro ao criar trilha personalizada: ${resTrilhaPersonalizada.status} - ${err}`,
      );
    }
    const trilhaPersCriada = (await resTrilhaPersonalizada.json()) as RespostaTrilha;
    if (trilhaPersCriada.alunoId !== alunoData.user.id || !trilhaPersCriada.aluno) {
      throw new Error('Trilha personalizada não vinculou os dados do aluno corretamente.');
    }
    console.log(`✅ Trilha personalizada criada com sucesso para ${trilhaPersCriada.aluno.name}!`);

    // 7.5 Validação de Isolamento e Visibilidade de Trilhas Personalizadas
    console.log('\n[7.5] Validando isolamento e visibilidade de trilhas personalizadas...');
    // Visitante anônimo não deve ver a trilha personalizada na listagem
    const resTrilhasAnon = await fetch(`${baseUrl}/trilhas`);
    const trilhasAnon = (await resTrilhasAnon.json()) as RespostaTrilha[];
    if (trilhasAnon.some((t) => t.id === trilhaPersCriada.id)) {
      throw new Error(
        'Vazamento de privacidade! Trilha personalizada visível para visitante não autenticado na listagem.',
      );
    }

    // Aluno destinatário deve ver a sua trilha personalizada + trilhas públicas
    const resTrilhasAluno = await fetch(`${baseUrl}/trilhas`, {
      headers: { Cookie: alunoCookie },
    });
    const trilhasAluno = (await resTrilhasAluno.json()) as RespostaTrilha[];
    if (!trilhasAluno.some((t) => t.id === trilhaPersCriada.id)) {
      throw new Error('Aluno não conseguiu visualizar sua trilha personalizada!');
    }

    // Professor Alex deve visualizar todas as trilhas
    const resTrilhasProf = await fetch(`${baseUrl}/trilhas`, {
      headers: { Cookie: profCookie },
    });
    const trilhasProf = (await resTrilhasProf.json()) as RespostaTrilha[];
    if (!trilhasProf.some((t) => t.id === trilhaPersCriada.id)) {
      throw new Error('Professor não conseguiu visualizar todas as trilhas!');
    }

    // 7.5.1 BLINDAGEM CONTRA IDOR/BOLA: Cadastro de Aluno 2 para testar tentativa de interceptação direta
    console.log('\n[7.5.1] Cadastrando Aluno 2 para testar tentativa de invasão/interceptação...');
    const aluno2Email = `aluno_invasor_${Date.now()}@teste.com`;
    const resSignUpAluno2 = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Aluno Invasor',
        email: aluno2Email,
        password: 'SenhaSegura@123',
      }),
    });
    const aluno2Cookie = extractCookie(resSignUpAluno2);

    // Aluno 2 não deve ver a trilha do Aluno 1 na listagem
    const resTrilhasAluno2 = await fetch(`${baseUrl}/trilhas`, {
      headers: { Cookie: aluno2Cookie },
    });
    const trilhasAluno2 = (await resTrilhasAluno2.json()) as RespostaTrilha[];
    if (trilhasAluno2.some((t) => t.id === trilhaPersCriada.id)) {
      throw new Error(
        'Vazamento de privacidade! Aluno 2 enxergou trilha personalizada pertencente ao Aluno 1!',
      );
    }

    // Aluno 2 tenta ACESSAR DIRETAMENTE a trilha do Aluno 1 por ID (Tentativa de IDOR)
    const resAluno2AcessaTrilha1 = await fetch(`${baseUrl}/trilhas/${trilhaPersCriada.id}`, {
      headers: { Cookie: aluno2Cookie },
    });
    if (resAluno2AcessaTrilha1.status !== 403) {
      throw new Error(
        `Falha de segurança IDOR! Aluno 2 conseguiu acessar trilha do Aluno 1 com status ${resAluno2AcessaTrilha1.status}`,
      );
    }
    console.log('✅ Defesa contra IDOR/BOLA validada: Aluno 2 bloqueado com 403 Forbidden!');

    // Visitante anônimo tenta acessar diretamente por ID
    const resAnonAcessaTrilha1 = await fetch(`${baseUrl}/trilhas/${trilhaPersCriada.id}`);
    if (resAnonAcessaTrilha1.status !== 403) {
      throw new Error(
        `Falha de segurança IDOR! Visitante anônimo acessou trilha privada com status ${resAnonAcessaTrilha1.status}`,
      );
    }
    console.log('✅ Defesa contra IDOR validada: Visitante anônimo bloqueado com 403 Forbidden!');

    // Aluno 1 (proprietário legítimo) acessa diretamente por ID -> deve retornar 200 OK
    const resAluno1AcessaTrilha1 = await fetch(`${baseUrl}/trilhas/${trilhaPersCriada.id}`, {
      headers: { Cookie: alunoCookie },
    });
    if (resAluno1AcessaTrilha1.status !== 200) {
      throw new Error(
        `Aluno 1 não conseguiu acessar sua própria trilha por ID: status ${resAluno1AcessaTrilha1.status}`,
      );
    }
    console.log('✅ Acesso legítimo validado: Aluno 1 acessou sua própria trilha com 200 OK!');

    // Professor Alex acessa diretamente por ID -> deve retornar 200 OK
    const resProfAcessaTrilha1 = await fetch(`${baseUrl}/trilhas/${trilhaPersCriada.id}`, {
      headers: { Cookie: profCookie },
    });
    if (resProfAcessaTrilha1.status !== 200) {
      throw new Error(
        `Professor não conseguiu acessar trilha por ID: status ${resProfAcessaTrilha1.status}`,
      );
    }
    console.log('✅ Acesso do Professor validado: Professor acessou a trilha por ID com 200 OK!');

    // 7.6 Validação de Borda: Tentativa de vincular aluno inexistente
    console.log('\n[7.6] Validando tentativa de vincular aluno inválido...');
    const resAlunoInvalido = await fetch(`${baseUrl}/trilhas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: profCookie,
      },
      body: JSON.stringify({
        titulo: 'Trilha Aluno Fantasma',
        ordem: 3,
        alunoId: '00000000-0000-0000-0000-000000000000',
      }),
    });
    if (resAlunoInvalido.status !== 400) {
      throw new Error(
        `Esperado 400 Bad Request para aluno inexistente, recebido ${resAlunoInvalido.status}`,
      );
    }
    console.log('✅ Validação de integridade de aluno na Trilha validada (400 Bad Request).');

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
    const matriculaCriada = (await resMatricular.json()) as {
      mensagem: string;
      matricula: { id: string; status: string };
    };
    if (matriculaCriada.matricula.status !== 'PENDENTE') {
      throw new Error(
        `Esperado status 'PENDENTE' na matrícula recém-criada, recebido '${matriculaCriada.matricula.status}'`,
      );
    }
    console.log('✅ Matrícula realizada com status 201 Created (PENDENTE para confirmação).');

    // 9.1 Aluno tenta acessar conteúdo antes da confirmação do Professor Alex
    console.log('\n[9.1] Aluno tentando acessar conteúdo enquanto matrícula está PENDENTE...');
    const resConteudoPendente = await fetch(`${baseUrl}/cursos/${cursoId}/conteudo`, {
      headers: { Cookie: alunoCookie },
    });
    if (resConteudoPendente.status !== 403) {
      throw new Error(
        `Esperado 403 Forbidden para matrícula PENDENTE, recebido ${resConteudoPendente.status}`,
      );
    }
    console.log(
      '✅ Bloqueio validado: Conteúdo restrito enquanto aguarda confirmação do Professor.',
    );

    // 9.2 Professor Alex visualiza notificação de matrícula pendente
    console.log('\n[9.2] Professor Alex consultando matrículas pendentes...');
    const resPendentes = await fetch(`${baseUrl}/matriculas/pendentes`, {
      headers: { Cookie: profCookie },
    });
    if (resPendentes.status !== 200) {
      throw new Error(`Erro ao listar pendências: ${resPendentes.status}`);
    }
    const pendentes = (await resPendentes.json()) as Array<{ id: string }>;
    if (!pendentes.some((p) => p.id === matriculaCriada.matricula.id)) {
      throw new Error('Matrícula pendente não encontrada na lista do Professor.');
    }
    console.log(
      `✅ Professor recebeu notificação de ${pendentes.length} matrícula(s) pendente(s).`,
    );

    // 9.3 Professor Alex aprova a matrícula do aluno ("deixar")
    console.log('\n[9.3] Professor Alex aprovando a matrícula do aluno...');
    const resAprovar = await fetch(
      `${baseUrl}/matriculas/${matriculaCriada.matricula.id}/aprovar`,
      {
        method: 'PATCH',
        headers: { Cookie: profCookie },
      },
    );
    if (resAprovar.status !== 200) {
      const err = await resAprovar.text();
      throw new Error(`Erro ao aprovar matrícula: ${resAprovar.status} - ${err}`);
    }
    console.log('✅ Matrícula aprovada pelo Professor Alex com sucesso (status ATIVA).');

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
    const conteudoCurso = (await resConteudoComMatricula.json()) as RespostaConteudoCurso;
    if (conteudoCurso.modulos.length === 0 || conteudoCurso.progresso.percentualProgresso !== 0) {
      throw new Error('Conteúdo retornado inconsistente.');
    }
    console.log('✅ Conteúdo acessado com sucesso:', {
      modulos: conteudoCurso.modulos.length,
      aulas: conteudoCurso.modulos[0]?.aulas.length ?? 0,
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
    const dataConclusao = (await resConcluir.json()) as RespostaConclusaoAula;
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
    const dataDesmarcar = (await resDesmarcar.json()) as RespostaDesmarcarAula;
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
    const progresso = (await resProgresso.json()) as RespostaProgressoCurso;
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
    const matriculas = (await resMinhasMatriculas.json()) as ItemMinhasMatriculas[];
    const matriculaCurso = matriculas.find((m: ItemMinhasMatriculas) => m.curso.id === cursoId);
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
