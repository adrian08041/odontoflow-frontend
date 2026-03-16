# Padrões e Diretrizes do Projeto "Clínica Front"

Bem-vindos ao repositório do frontend do projeto da Clínica! Este documento define as convenções e padrões adotados para mantermos o código organizado e facilitarmos o trabalho em equipe até a nossa apresentação na faculdade.

Por favor, leiam e tentem seguir as regras descritas abaixo.

---

## 🏗️ 1. Arquitetura e Stack Tecnológica:

O projeto foi construído utilizando as seguintes tecnologias:

- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript / React 19
- **Estilização**: Tailwind CSS 4
- **Componentes Base**: Radix UI / Shadcn
- **Validação de Dados**: Zod & React Hook Form
- **Gerenciamento de Estado/Requisições**: React Query

---

## 🌿 2. Fluxo e Nomenclatura de Branches (Git Workflow)

Para que todos saibam exatamente o que está sendo desenvolvido em cada branch, utilizaremos o seguinte padrão de nomenclatura:

`<tipo>/<nome-da-tarefa-ou-descricao>`

**Tipos permitidos:**

- `feature/`: Para novas funcionalidades (ex: `feature/tela-de-login`, `feature/cadastro-paciente`)
- `bugfix/`: Para correção de bugs em testes internos (ex: `bugfix/erro-formulario-medico`)
- `hotfix/`: Para correções críticas de emergência
- `docs/`: Para criação ou ajustes em documentações
- `chore/`: Para atualizações de dependências, configurações ou tarefas menores

**Regras:**

- Use sempre letras minúsculas (lowercase).
- Substitua espaços por hífens (`-`).
- Mantenha descrições curtas e precisas.

---

## ✍️ 3. Padrão de Commits (Conventional Commits)

Nossos commits devem contar a "história" do projeto de forma clara. Siga o formato:

`<tipo>: <descrição curta no imperativo>`

**Exemplos Mapeados:**

- `feat:` Nova funcionalidade (Ex: `feat: adiciona botão de agendamento`)
- `fix:` Correção de bug (Ex: `fix: corrige alinhamento do cabeçalho`)
- `docs:` Alteração na documentação (Ex: `docs: atualiza guia no README`)
- `style:` Formatação de código ou estilos visuais sem mudar lógica (Ex: `style: ajusta padding do container`)
- `refactor:` Refatoração de código (Ex: `refactor: simplifica lógica de validação`)
- `test:` Adição/alteração de testes (Ex: `test: adiciona testes de integração no login`)

_(Dica: "Se este commit for aplicado, ele irá [descrição]". Exemplo: "Se este commit for aplicado, ele irá **adicionar o modal de sucesso**")_

---

## 🔀 4. Pull Requests (PRs) e Revisão de Código

Por ser um projeto em grupo para a faculdade, a revisão por pares é muito importante:

1. **Evite commitar direto na `main`**: Crie a sua branch a partir da `main`, faça seu trabalho lá e então crie um PR.
2. **Tamanho do PR**: Mantenha os PRs curtos e focados em _uma única coisa_. Evite misturar a criação de uma tela com a correção do layout de outra totalmente distante.
3. **Revisão**: Sempre que possível, peça para que um outro integrante da equipe revise (ou pelo menos teste visualmente) a sua alteração antes de fazer o Merge para a `main`.

---

## 💻 5. Rodando e Configurando o Projeto Localmente

Após clonar o projeto ou puxar mudanças (Git pull), o fluxo de desenvolvimento básico é:

```bash
# 1. Instalar pacotes após os últimos commits
npm install

# 2. Rodar o projeto em ambiente de desenvolvimento
npm run dev

# (Opcional) 3. Validar problemas de Linting / Formatação no código
npm run lint
```

---

## 🛡️ 6. Boas Práticas e Código Limpo

1. **Nomes em Inglês para Código**: Privilegie nomes de variáveis, funções, componentes e arquivos em _inglês_ (`UserProfile` ao invés de `PerfilUsuario`), para se habituar ao padrão de mercado (O conteúdo visível na tela continua em português).
2. **Componentização**: Se um código de UI estiver se repetindo, ou se a tela principal estiver passando de ~300 linhas, extraia partes em componentes menores em `/components`.
3. **Zero Logs em Produção**: Remova todos os comandos de debbuging (ex: `console.log`) do código final do PR.
4. **Sem Emojis no Código**: Não coloque emojis como comentários ou documentação dentro do código-fonte; deixe a seriedade para o código.

---

## 📂 7. Estrutura de Pastas e Arquitetura

O projeto utiliza o padrão mais recente do React: o **Next.js App Router**. Isso significa que a criação das telas é guiada completamente pelas pastas localizadas em `app/`.

Para manter a organização do código, a modularidade e facilitar a manutenção pela equipe, seguimos esta padronização de pastas:

```text
├── app/                  # ROTAS DA APLICAÇÃO (App Router)
│   ├── (auth)/           # Grupo de rotas de autenticação (Login, Cadastro). Parênteses criam pastas lógicas sem afetar a URL
│   ├── dashboard/        # Dashboard (Painel de Métricas da OdontoFlow)
│   ├── pacientes/        # CRUD e Listagem de Pacientes
│   ├── tratamentos/      # Workflow Clínico (Prontuário)
│   ├── financeiro/       # Faturamento e Pendências
│   ├── configuracoes/    # Setup e Customização da Clínica
│   ├── layout.tsx        # Casca/Layout geral que envolverá suas páginas
│   └── page.tsx          # A raiz do projeto (Ex: Landing Page Institucional)
│
├── components/           # COMPONENTES VISUAIS (React)
│   ├── home/             # Componentes específicos da Landing Page (Hero, ContactForm)
│   ├── pacientes/        # Componentes que só existem no escopo de pacientes (Ex: TabelaPacientes)
│   └── ui/               # Componentes genéricos base (ShadcnUI) - Botões, Inputs, Modais (Reaproveitáveis no app todo)
│
├── lib/                  # LÓGICA DE NEGÓCIO E UTILITÁRIOS
│   ├── mock-data.ts      # [MOCK] Centralização de constantes e dados falsos para alimentar o Front-end
│   ├── schemas/          # [ZOD] Regras e validações de todos os formulários do sistema
│   ├── types/            # [TYPESCRIPT] Interfaces globais (`User`, `Paciente`, `Tratamento`)
│   └── utils.ts          # Funções utilitárias reaproveitáveis (como merge de classes CSS)
│
└── public/               # DEPLOY ESTÁTICO
    └── ...               # Imagens, logotipos, fontes e SVGs expostos publicamente
```

### Regras de Ouro na Estrutura do Next.js

1. **Lógica separada da Visão**: Tudo na pasta `app/` serve como "Entry Point" (Ponto de Entrada) e Roteamento (`page.tsx`). Evite arquivos `page.tsx` gigantes. Crie elementos visuais (Ex: formulários, cabeçalhos, tabelas) na pasta `/components` e importe eles em sua página.
2. **"use client" apenas com Interatividade**: No Next.js 14+, componentes rodam nativamente no Servidor (Server Components). Se o seu componente precisar reagir ao usuário (usar `onClick`, ganchos como `useState` / `useEffect` ou for um Formulário React Hook Form), **lembre-se de adicionar a diretiva `"use client"` na primeira linha do seu arquivo**.

---

_Seguindo essas regrinhas simples, garantiremos um projeto consistente e profissional para a nossa apresentação! Boa codificação a todos! 🚀_
