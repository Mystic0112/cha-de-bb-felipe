# Chá de Fraldas do Felipe - Lista de presentes

Site simples para os convidados escolherem presentes do chá de fraldas. Cada presente
escolhido é reservado no nome do convidado e some da lista para os demais, em tempo real.

- **Página pública** (`/#/`): lista agrupada por categoria, com a quantidade restante.
- **Painel do organizador** (`/#/admin`): login, resumo, reservas (com exportação CSV e
  cancelamento) e cadastro dos presentes. O nome dos convidados só aparece aqui.

Stack: Vite + React + TypeScript + Tailwind CSS v4 + Supabase (banco, autenticação e
realtime). Hospedagem gratuita no GitHub Pages.

---

## 1. Criar o projeto no Supabase

1. Acesse <https://supabase.com>, crie uma conta e clique em **New project**.
2. Escolha um nome, uma senha para o banco e a região (ex.: South America - São Paulo).
3. Aguarde o projeto ficar pronto.

## 2. Criar as tabelas e a lista inicial

1. No menu lateral, abra **SQL Editor** > **New query**.
2. Copie todo o conteúdo de [`supabase/schema.sql`](supabase/schema.sql), cole e clique em **Run**.
3. Abra outra query, cole o conteúdo de [`supabase/seed.sql`](supabase/seed.sql) e clique em **Run**.
   (Isso cria as sugestões iniciais de presentes; pode ajustar depois pelo painel.)

O schema já configura as regras de segurança (RLS): visitantes só conseguem ver os
presentes e reservar pela função `reserve_gift`; apenas o organizador logado vê as reservas.

## 3. Criar o usuário organizador

1. Vá em **Authentication** > **Users** > **Add user** > **Create new user**.
2. Informe e-mail e senha e marque **Auto Confirm User**.
3. Desative o cadastro público para ninguém mais criar conta:
   **Authentication** > **Sign In / Providers** (ou **Settings**) > desligue **Allow new users to sign up**.

## 4. Pegar as chaves do projeto

Em **Project Settings** > **API** (ou **Data API** / **API Keys**), copie:

- **Project URL** -> `VITE_SUPABASE_URL`
- **anon public** key (chave publicável) -> `VITE_SUPABASE_ANON_KEY`

> A chave `anon` é pública por natureza (vai para o navegador). A segurança é garantida
> pelas regras RLS do `schema.sql`. **Nunca** use a chave `service_role` no site.

## 5. Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie este projeto para a branch `main`.
2. No repositório: **Settings** > **Secrets and variables** > **Actions** > **New repository secret**:
   - `VITE_SUPABASE_URL` = URL do projeto
   - `VITE_SUPABASE_ANON_KEY` = chave anon
3. **Settings** > **Pages** > em **Source** escolha **GitHub Actions**.
4. Faça um push na `main` (ou rode o workflow manualmente em **Actions** > **Deploy no GitHub Pages** > **Run workflow**).
5. Ao terminar, o site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.
   O painel fica em `https://SEU-USUARIO.github.io/NOME-DO-REPO/#/admin`.

## 6. Rodar localmente

Requer Node.js 22.

```bash
cp .env.example .env      # no Windows: copy .env.example .env
# edite o .env com a URL e a chave anon
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente <http://localhost:5173>).
Para gerar a versão de produção: `npm run build` (saída em `dist/`).

> No Windows/PowerShell, se `npm` for bloqueado pela política de execução, use `npm.cmd`.

Sem o `.env` configurado o site mostra uma mensagem explicando o que falta, em vez de quebrar.

## 7. Editar a lista de presentes

Pelo painel `#/admin` (recomendado):

- **Adicionar**: preencha nome, categoria e quantidade e clique em **Adicionar**.
- **Editar quantidade**: altere o campo **Total** e clique em **Salvar**. A quantidade
  disponível é recalculada automaticamente; não é possível reduzir abaixo do que já foi escolhido.
- **Remover**: apaga o presente (e as reservas dele).
- **Cancelar reserva**: na tabela de reservas; a unidade volta a ficar disponível.
- **Exportar CSV**: baixa as reservas para abrir no Excel/Planilhas.

Também é possível editar direto no Supabase em **Table Editor** > `gifts`. Ao inserir
manualmente, preencha `available_quantity` igual a `total_quantity`.

## Estrutura

```
supabase/schema.sql        tabelas, RLS, funções reserve_gift/cancel_reservation, realtime
supabase/seed.sql          sugestões iniciais de presentes
src/pages/public/          página dos convidados
src/pages/admin/           painel do organizador
src/hooks/                 carregamento de dados e realtime
src/lib/                   cliente Supabase, tipos, CSV e mensagens de erro
.github/workflows/         deploy automático no GitHub Pages
```
