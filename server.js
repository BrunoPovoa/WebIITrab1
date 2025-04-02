// Import required modules
const express = require('express');

// Initialize the app
const app = express();
const PORT = 3000;

app.use(express.json());

// Middleware de autenticação
const autenticar = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token === "123") {
        next();
    } else {
        next({ status: 401, message: 'Nao Autorizado' });
    }
};

// Middleware de validação para produtos
const validarProduto = (req, res, next) => {
    const { nome, categoria } = req.body;

    if (!nome || typeof nome !== 'string' || nome.trim() === '') {
        return next({ status: 400, message: "Nome Invalido!" });
    }
    if (!categoria || typeof categoria !== 'string' || categoria.trim() === '') {
        return next({ status: 400, message: "Categoria Invalida!" });
    }

    next();
};

// Middleware de validação para usuários
const validarUsuario = (req, res, next) => {
    const { nome, email } = req.body;

    if (!nome || typeof nome !== 'string' || nome.trim() === '') {
        return next({ status: 400, message: "Nome Invalido!" });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return next({ status: 400, message: "Email Invalido!" });
    }

    next();
};

// Rota GET para boas-vindas
app.get('/', (req, res) => {
    res.send('Bem-vindo');
});

// Definir a rota dinâmica
app.get('/saudacao/:nome', autenticar, (req, res) => {
    const nome = req.params.nome;
    res.send(`Olá, ${nome}!`);
});

// Lista de produtos
const produtos = [
    { id: 1, nome: 'Notebook', categoria: 'Eletronicos' },
    { id: 2, nome: 'Smartphone', categoria: 'Eletronicos' },
    { id: 3, nome: 'Camiseta', categoria: 'Roupas' },
    { id: 4, nome: 'Tênis', categoria: 'Calçados' }
];

let idAtual = 4;

// Rota para adicionar um novo produto com validação
app.post('/produtos', validarProduto, (req, res, next) => {
    try {
        const { nome, categoria } = req.body;

        idAtual++;
        const novoProduto = { id: idAtual, nome, categoria };
        produtos.push(novoProduto);

        res.status(201).json(novoProduto);
    } catch (error) {
        next(error); // Captura erros e passa para o middleware de erros
    }
});

// Rota para listar produtos e filtrar por categoria
app.get('/produtos', (req, res) => {
    const { categoria } = req.query;
    let resultado = produtos;

    if (categoria) {
        resultado = produtos.filter(produto => produto.categoria.toLowerCase() === categoria.toLowerCase());
    }

    res.json(resultado);
});

// Rota para adicionar um novo usuário com validação
app.post('/usuarios', validarUsuario, (req, res, next) => {
    try {
        const { nome, email } = req.body;

        res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!", nome, email });
    } catch (error) {
        next(error);
    }
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(`Erro: ${err.message}`);

    const statusCode = err.status || 500;
    res.status(statusCode).json({
        erro: err.message || "Erro interno do servidor",
        status: statusCode
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
