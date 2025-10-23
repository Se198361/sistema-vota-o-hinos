# Sistema de Votação de Hinos - 4º Congresso de Homens

## Descrição
Sistema de votação de hinos para o 4º Congresso de Homens com tema "Homens Inabaláveis, Firmes em Cristo em um Mundo Caído".

## Requisitos do Sistema
- Node.js (versão 16 ou superior)
- PostgreSQL (opcional para desenvolvimento local)
- npm ou yarn

## Configuração Inicial

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados (Opcional para Desenvolvimento)
Crie um arquivo `.env.local` na raiz do projeto com a URL do seu banco de dados PostgreSQL. Você pode usar o arquivo [.env.example](file://c:\Users\sergi\Downloads\inabalaveis-hymn-vote-main\inabalaveis-hymn-vote-main\.env.example) como referência:

```bash
cp .env.example .env.local
```

Em seguida, edite o arquivo `.env.local` com suas credenciais:

```env
POSTGRES_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco
```

**Nota**: Para desenvolvimento local, o sistema usa uma API mock que não requer banco de dados.

### 3. Inicializar o Banco de Dados (Apenas se estiver usando PostgreSQL)
```bash
npm run init-db
```

Este comando irá:
- Criar as tabelas necessárias (usuários e hinos)
- Criar um usuário administrador padrão (usuário: admin, senha: inabalaveis2025)

## Executar o Projeto Localmente

### Modo de Desenvolvimento
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:8080`

**Nota**: O sistema agora inclui uma API mock para desenvolvimento, então você pode criar contas e fazer login mesmo sem configurar o PostgreSQL.

### Build para Produção
```bash
npm run build
```

### Visualizar Build de Produção
```bash
npm run preview
```

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── pages/          # Páginas da aplicação
  ├── hooks/          # Hooks personalizados
  ├── mocks/          # API mocks para desenvolvimento
  └── lib/            # Funções utilitárias

api/
  └── auth.ts         # Endpoints de autenticação

scripts/
  └── init-db.js      # Script de inicialização do banco de dados
```

## Funcionalidades

### Para Usuários Comuns
- Visualizar hinos disponíveis
- Votar em hinos
- Ver vídeos relacionados aos hinos

### Para Administradores
- Registrar/Login no sistema
- Visualizar resultados em tempo real
- Adicionar novos hinos
- Configurar informações do congresso
- Imprimir/exportar resultados

## Deploy na Vercel

### Configuração Automática
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente necessárias no dashboard da Vercel (veja [VERCEL_DEPLOY.md](file://c:\Users\sergi\Downloads\inabalaveis-hymn-vote-main\inabalaveis-hymn-vote-main\VERCEL_DEPLOY.md) para detalhes)
3. Faça o deploy automático

### Configuração Manual
Consulte o arquivo [VERCEL_DEPLOY.md](file://c:\Users\sergi\Downloads\inabalaveis-hymn-vote-main\inabalaveis-hymn-vote-main\VERCEL_DEPLOY.md) para instruções detalhadas de deploy.

## Solução de Problemas

### Erro de Conexão ao Criar Conta
Se você estiver recebendo o erro "Erro de conexão. Verifique se o servidor está rodando" ao criar uma conta:

1. **Para desenvolvimento local**: O sistema agora usa uma API mock, então você pode criar contas mesmo sem configurar o PostgreSQL
2. **Para produção**: Certifique-se de que o PostgreSQL está instalado e em execução
3. Verifique se a variável de ambiente `POSTGRES_URL` está corretamente configurada
4. Execute `npm run init-db` para inicializar o banco de dados

### Problemas com o Banco de Dados
1. Certifique-se de que o PostgreSQL está instalado e rodando
2. Verifique as credenciais do banco de dados no arquivo `.env.local`
3. Execute o script de inicialização: `npm run init-db`

## Segurança
- Em produção, as senhas devem ser hasheadas usando bcrypt
- O token de autenticação é armazenado no localStorage (para ambientes de desenvolvimento)
- Em produção, recomenda-se usar tokens JWT mais seguros

## Contribuição
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request