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

export default async function handler(req: any, res: any) {
  // Verificar método
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  try {
    // Conectar ao banco de dados
    await client.connect();
    console.log('Conectado ao banco de dados com sucesso');

    // Criar tabela de usuários
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await client.query(createUsersTableQuery);
    console.log('Tabela de usuários criada/verificada com sucesso');

    // Criar tabela de hinos (se necessário)
    const createHymnsTableQuery = `
      CREATE TABLE IF NOT EXISTS hymns (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        artist VARCHAR(255) NOT NULL,
        video_url TEXT,
        author_image TEXT,
        votes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await client.query(createHymnsTableQuery);
    console.log('Tabela de hinos criada/verificada com sucesso');

    // Inserir usuário de teste, se não existir
    const existingUserQuery = 'SELECT * FROM users WHERE username = $1';
    const existingUserResult = await client.query(existingUserQuery, ['admin']);
    
    if (existingUserResult.rows.length === 0) {
      // Hash da senha usando bcrypt
      const hashedPassword = await bcrypt.hash('inabalaveis2025', 10);
      
      const insertUserQuery = `
        INSERT INTO users (name, email, username, password)
        VALUES ($1, $2, $3, $4)
      `;
      
      await client.query(insertUserQuery, [
        'Administrador',
        'admin@congresso.com',
        'admin',
        hashedPassword
      ]);
      
      console.log('Usuário administrador criado com sucesso');
    } else {
      console.log('Usuário administrador já existe');
    }

    // Fechar conexão
    await client.end();

    console.log('Banco de dados inicializado com sucesso!');
    return res.status(200).json({ message: 'Banco de dados inicializado com sucesso!' });
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
    // Fechar conexão em caso de erro
    await client.end();
    return res.status(500).json({ error: 'Erro ao inicializar o banco de dados: ' + (error as Error).message });
  }
}