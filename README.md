# Sistema de Votação de Hinos

Aplicação de votação de hinos com painel administrativo, integrada ao Supabase, construída em React + Vite.

## Checklist Rápido (Deploy do Zero)
- Configurar `Node 20.x` no projeto da Vercel
- Adicionar `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` nas variáveis
- Build `npm run build` com output `dist`
- Confirmar rewrites SPA no `vercel.json`
- Aplicar migrações do Supabase em `supabase/migrations`

## Funcionalidades
- Votar em hinos com interface simples e responsiva
- Painel administrativo para gerenciar hinos, conteúdo e configurações
- Resultados em tempo real e geração de link público

## Tecnologias
- React + TypeScript
- Vite
- Supabase (auth, banco de dados, storage)
- Tailwind CSS
- shadcn/ui

## Ambiente
1. Instalar dependências:
   ```bash
   npm install
   ```
2. Variáveis de ambiente (crie `.env.local`):
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_anonima
   ```
   Opcional (somente se usar rotas Node em `/api`):
   ```
   POSTGRES_URL=postgres://...:6543/postgres?sslmode=require
   ```
3. Desenvolvimento:
   ```bash
   npm run dev
   ```
4. Build de produção:
   ```bash
   npm run build
   npm run preview
   ```

## Estrutura do Projeto
```
src/
  ├── components/    # Componentes reutilizáveis
  ├── pages/         # Páginas da aplicação
  ├── hooks/         # Hooks personalizados
  ├── integrations/  # Integrações externas (Supabase)
  ├── lib/           # Utilitários
  └── mocks/         # API mock para desenvolvimento
api/
  ├── auth.ts        # Endpoints de autenticação (opcional)
scripts/
  └── init-db.js     # Inicialização de banco (opcional)
```

## Deploy na Vercel (resumo)
- Node.js: `20.x` (Project Settings)
- Build: `npm run build`
- Output: `dist`
- Variáveis: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (e `POSTGRES_URL` se usar `/api`)
- SPA rewrites: já definido em `vercel.json`
- Detalhes completos: ver `VERCEL_DEPLOY.md`

## Supabase
- Aplique as migrações em `supabase/migrations/`
- Configure o bucket `banners` e políticas de acesso
- Garanta as RLS conforme migrações (leitura pública de `hymns`/`settings`, inserção pública em `votes`, etc.)

## Uso
- Admin: acesse `/admin`, faça login e configure hinos, conteúdo e banner
- Gere o link público na aba de configurações e compartilhe
- Usuários: acessem o link público e votem (1 voto por usuário)

## Solução de Problemas
- Erros de deploy: revise `VERCEL_DEPLOY.md` (Node 20, env vars, rewrites)
- Supabase: confirme URL/anon key, migrações e políticas aplicadas

## Contribuição
1. Crie uma branch: `git checkout -b feature/minha-feature`
2. Commit: `git commit -m "feat: minha feature"`
3. Push: `git push origin feature/minha-feature`
4. Abra um Pull Request
