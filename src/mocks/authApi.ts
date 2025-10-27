// Mock API para desenvolvimento local
// Este arquivo simula a API quando o backend real não está disponível

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  created_at: string;
}

// Armazenamento em memória para simular o banco de dados
let users: User[] = [
  {
    id: 1,
    name: "Administrador",
    email: "admin@congresso.com",
    username: "admin",
    created_at: new Date().toISOString()
  }
];

let nextUserId = 2;

// Função para simular delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Função para registrar usuário
export async function registerUser(userData: { name: string; email: string; username: string; password: string }) {
  await delay(1000); // Simular delay de rede
  
  // Verificar se usuário ou email já existem
  const existingUser = users.find(u => u.username === userData.username || u.email === userData.email);
  if (existingUser) {
    throw new Error("Nome de usuário ou e-mail já cadastrado");
  }
  
  // Criar novo usuário
  const newUser: User = {
    id: nextUserId++,
    name: userData.name,
    email: userData.email,
    username: userData.username,
    created_at: new Date().toISOString()
  };
  
  users.push(newUser);
  
  return {
    message: "Usuário criado com sucesso",
    user: newUser
  };
}

// Função para login
export async function loginUser(credentials: { username: string; password: string }) {
  await delay(1000); // Simular delay de rede
  
  // Encontrar usuário
  const user = users.find(u => u.username === credentials.username);
  if (!user) {
    throw new Error("Credenciais inválidas");
  }
  
  // Verificar senha (em produção, isso seria uma verificação real)
  // Para o mock, aceitamos qualquer senha com 6 ou mais caracteres
  if (credentials.password.length < 6) {
    throw new Error("Credenciais inválidas");
  }
  
  return {
    message: "Login realizado com sucesso",
    user
  };
}

// Função para obter todos os usuários (apenas para demonstração)
export async function getUsers() {
  await delay(500); // Simular delay de rede
  return users;
}