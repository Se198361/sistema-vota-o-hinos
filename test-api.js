// Script para testar a API localmente
const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testando a API de registro...');
    
    const response = await fetch('http://localhost:8081/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Teste',
        email: 'teste@teste.com',
        username: 'teste',
        password: '123456'
      }),
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Resposta:', data);
  } catch (error) {
    console.error('Erro ao testar a API:', error);
  }
}

testAPI();