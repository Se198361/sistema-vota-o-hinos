# Hymn Voting Application

Uma aplicação de votação para hinos com painel administrativo e integração com Supabase.

## Funcionalidades

- Votação em hinos com interface amigável
- Painel administrativo para gerenciar hinos, conteúdo e configurações
- Integração com Supabase para autenticação e banco de dados
- Design responsivo com Tailwind CSS
- Geração de link público para votação

## Tecnologias Utilizadas

- React com TypeScript
- Vite como bundler
- Supabase para backend (autenticação e banco de dados)
- Tailwind CSS para estilização
- shadcn/ui para componentes de interface

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente no arquivo `.env`:
   ```
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publicavel_do_supabase
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

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

## Deploy

### Vercel

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no dashboard do Vercel
3. Faça deploy automático em cada push

### Outras plataformas

O projeto pode ser construído usando:
```bash
npm run build
```

E o resultado estará na pasta `dist/`.

## Uso

1. Acesse o painel administrativo em `/admin`
2. Faça login com credenciais de administrador
3. Configure os hinos, conteúdo da página e banner
4. Gere o link público para votação
5. Compartilhe o link com os usuários

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto é de código aberto e não possui licença específica.