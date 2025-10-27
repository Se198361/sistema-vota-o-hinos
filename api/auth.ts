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

// Função para conectar ao banco de dados
async function connectDB() {
  try {
    // Verificar se já está conectado
    if (client["_connected"]) {
      return;
    }
    
    await client.connect();
    console.log('Conectado ao banco de dados com sucesso');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    throw error;
  }
}

// Função para criar a tabela de usuários (se não existir)
async function createUsersTable() {
  try {
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
    console.log('Tabela de usuários verificada/criada com sucesso');
  } catch (error) {
    console.error('Erro ao criar tabela de usuários:', error);
    throw error;
  }
}

// Middleware para lidar com CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    // Conectar ao banco de dados se ainda não estiver conectado
    await connectDB();
    
    // Criar tabela de usuários se não existir
    await createUsersTable();

    // Rota de registro de usuários
    if (req.method === 'POST' && !req.body.username) {
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

    // Rota de login de usuários
    if (req.method === 'POST' && req.body.username && req.body.password) {
      const { username, password } = req.body;

      // Validar dados obrigatórios
      if (!username || !password) {
        return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
      }

      // Buscar usuário no banco de dados
      const userQuery = 'SELECT * FROM users WHERE username = $1';
      const userResult = await client.query(userQuery, [username]);
      
      if (userResult.rows.length === 0) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const user = userResult.rows[0];
      
      // Verificar senha usando bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Retornar os dados do usuário (sem a senha)
      return res.status(200).json({
        message: 'Login realizado com sucesso',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          created_at: user.created_at
        }
      });
    }

    // Método não permitido
    res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    console.error('Erro na API de autenticação:', error);
    res.status(500).json({ error: 'Erro interno do servidor: ' + (error as Error).message });
  }
}