# Instruções de Deploy

## Deploy no GitHub Pages

O projeto está configurado para deploy automático no GitHub Pages através do GitHub Actions.

### Configuração Inicial

1. Acesse as configurações do repositório no GitHub
2. Navegue até "Settings" > "Pages"
3. Em "Source", selecione "GitHub Actions"
4. Salve as configurações

### Deploy Automático

Após a configuração inicial, o deploy acontece automaticamente a cada push na branch `main`.

O site estará disponível em: https://se198361.github.io/sistema-vota-o-hinos/

## Deploy no Vercel

### Configuração

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "New Project"
3. Importe o repositório GitHub `Se198361/sistema-vota-o-hinos`
4. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL` (sua URL do Supabase)
   - `VITE_SUPABASE_PUBLISHABLE_KEY` (sua chave publicável do Supabase)
5. Clique em "Deploy"

### Variáveis de Ambiente Necessárias

Para ambos os ambientes de deploy, você precisa configurar as seguintes variáveis de ambiente:

```
VITE_SUPABASE_URL=seu_url_do_supabase
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publicavel_do_supabase
```

## Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com/)
2. Execute os scripts de migração na pasta `supabase/migrations/`
3. Configure o storage bucket para banners
4. Obtenha as chaves de acesso no dashboard do Supabase

## Uso da Aplicação

### Administrador

1. Acesse `/admin` para entrar no painel administrativo
2. Faça login com credenciais de administrador
3. Configure:
   - Hinos cadastrados
   - Conteúdo da página (título, subtítulo, descrição)
   - Banner do rodapé
4. Quando todos os campos estiverem preenchidos, gere o link público na aba "Configurações"

### Usuários

1. Acesse o link público gerado pelo administrador
2. Vote nos hinos disponíveis
3. Cada usuário pode votar apenas uma vez

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── hooks/               # Hooks personalizados
├── integrations/        # Integrações com serviços externos
├── lib/                 # Funções utilitárias
├── pages/               # Páginas da aplicação
└── App.tsx             # Componente principal
```

## Comandos Úteis

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Criar build de produção
npm run build

# Visualizar build localmente
npm run preview
```