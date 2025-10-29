import { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from 'pg';
import bcrypt from 'bcryptjs';

// Configuração do cliente PostgreSQL
const client = new Client({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Conectar ao banco de dados
client.connect();

// Função para criar a tabela de usuários (se não existir)
async function createUsersTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  await client.query(query);
}

// Middleware para lidar com CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req: any, res: any) {
  // Lidar com preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  // Adicionar headers CORS a todas as respostas
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    // Criar tabela de usuários se não existir
    await createUsersTable();

    if (req.method === 'POST') {
      const { name, email, username, password } = req.body;

      // Validar dados obrigatórios
      if (!name || !email || !username || !password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      // Verificar se o usuário ou e-mail já existem
      const existingUserQuery = 'SELECT * FROM users WHERE username = $1 OR email = $2';
      const existingUserResult = await client.query(existingUserQuery, [username, email]);
      
      if (existingUserResult.rows.length > 0) {
        return res.status(409).json({ error: 'Nome de usuário ou e-mail já cadastrado' });
      }

      // Hash da senha usando bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Inserir novo usuário
      const insertQuery = `
        INSERT INTO users (name, email, username, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, username, created_at
      `;
      
      const insertResult = await client.query(insertQuery, [name, email, username, hashedPassword]);
      const newUser = insertResult.rows[0];

      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          username: newUser.username,
          created_at: newUser.created_at
        }
      });
    }

    if (req.method === 'GET') {
      // Obter todos os usuários (apenas para demonstração - em produção, isso deve ser protegido)
      const usersResult = await client.query('SELECT id, name, email, username, created_at FROM users');
      return res.status(200).json(usersResult.rows);
    }

    // Método não permitido
    res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    console.error('Erro na API de usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}