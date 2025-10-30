# Deploy na Vercel

## Configuração para Produção

### 1. Variáveis de Ambiente Necessárias

Para o correto funcionamento do sistema em produção, configure as seguintes variáveis de ambiente no dashboard da Vercel:

```
VITE_SUPABASE_URL=https://<seu-projeto>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<sua_chave_anon_do_supabase>
# Opcional (apenas se usar as rotas Node em /api):
POSTGRES_URL=postgres://...:6543/postgres?sslmode=require
```

Nota: configure a versão de Node para `20.x` nas configurações do projeto na Vercel.


### 2. Configuração do Banco de Dados

#### Opção A: Usar Vercel Postgres (Recomendado)
1. No dashboard da Vercel, vá para "Storage" → "Create New" → "Postgres"
2. Siga as instruções para criar um novo banco de dados
3. A variável `POSTGRES_URL` será automaticamente configurada

#### Opção B: Usar Banco de Dados Externo (Supabase)
Você já configurou as credenciais do Supabase, então basta adicioná-las como variáveis de ambiente no dashboard da Vercel.

### 3. Inicialização do Banco de Dados

Após o primeiro deploy, você tem duas opções para inicializar o banco de dados:

#### Opção 1: Usar a API route de inicialização (Recomendada)
1. Após o deploy, acesse a URL: `https://seu-dominio.vercel.app/api/init-db`
2. Faça uma requisição POST para esta URL (pode usar curl, Postman ou qualquer cliente HTTP)
3. Exemplo com curl:
   ```bash
   curl -X POST https://seu-dominio.vercel.app/api/init-db
   ```

#### Opção 2: Usar o terminal da Vercel
1. Conecte-se ao terminal da Vercel
2. Execute o script de inicialização:
   ```bash
   npm run init-db
   ```

Este script irá:
- Criar a tabela de usuários
- Criar a tabela de hinos
- Criar um usuário administrador padrão (usuário: admin, senha: inabalaveis2025)

### 4. Configurações Adicionais

#### Segurança
- Em produção, as senhas são armazenadas com hashing usando bcrypt
- O token de autenticação é armazenado no localStorage. Para maior segurança, considere implementar tokens JWT.

#### Escalabilidade
- Para aplicações com alto volume de votos, considere implementar cache com Redis
- Configure um CDN para servir os assets estáticos

### 5. URLs de Acesso

Após o deploy, o sistema estará disponível em:
- Página de votação: `https://seu-domínio.vercel.app/`
- Painel administrativo: `https://seu-domínio.vercel.app/login`

### 6. Acesso ao Painel Administrativo

Credenciais padrão:
- Usuário: `admin`
- Senha: `inabalaveis2025`

Após o login, você poderá:
- Visualizar resultados em tempo real
- Adicionar novos hinos
- Configurar informações do congresso
- Imprimir/exportar resultados

### 7. Monitoramento

Para monitorar o desempenho da aplicação:
1. Use o dashboard da Vercel para verificar métricas de desempenho
2. Configure logs de erro para acompanhar possíveis problemas
3. Monitore o uso do banco de dados

### 8. Atualizações

Para atualizar a aplicação:
1. Faça push das novas alterações para o repositório GitHub
2. A Vercel fará o deploy automático
3. Se houver migrações de banco de dados, execute-as manualmente

## Solução de Problemas

### Problemas Comuns

1. **Erro de conexão com o banco de dados**:
   - Verifique se a variável `POSTGRES_URL` está corretamente configurada
   - Confirme se as credenciais do banco de dados estão corretas

2. **Falha no login/cadastro**:
   - Verifique se o banco de dados foi inicializado corretamente
   - Confirme se as tabelas foram criadas

3. **Problemas com API routes**:
   - Verifique se os arquivos em `/api` estão corretamente configurados
   - Confirme se as dependências estão instaladas

### Suporte

Para suporte adicional, consulte:
- Documentação oficial da Vercel: https://vercel.com/docs
- Documentação do PostgreSQL: https://www.postgresql.org/docs/