// Import required modules
const express = require('express');
const bodyParser = express.json();

// Initialize the app
const app = express();
const PORT = 3000;

//Middleware de autenticação
const autenticar = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token == 123) {
        next();
    } else {
        res.status(401).send('Não Autorizado');
    }
}

// Rota GET para boas-vindas
app.get('/', (req, res) => {
    res.send('Bem-vindo ao nosso site!');
});

// Definir a rota dinâmica
app.get('/saudacao/:nome', autenticar, (req, res) => {
    const nome = req.params.nome;
    res.send(`Olá, ${nome}!`);
});

// Lista de exemplo
const produtos = [
    { id: 1, nome: 'Notebook', categoria: 'Eletronicos' },
    { id: 2, nome: 'Smartphone', categoria: 'Eletronicos' },
    { id: 3, nome: 'Camiseta', categoria: 'Roupas' },
    { id: 4, nome: 'Tênis', categoria: 'Calçados' }
];

app.use(express.json()); 

let idAtual = 5;
app.post('/produtos', bodyParser, (req, res) => {
    const { nome, categoria } = req.body; 
    const novoProduto = {id: lista.length + 1, nome, categoria};
    lista.push(novoProduto); 
    //console.log(lista);
    res.status(201).json(novoProduto); 
})

// Rota para adicionar um novo produto
/*
app.post('/produtos', bodyParser, (req, res) => {
    const { nome, categoria } = req.body;
    if (!nome) {
        return res.status(400).json({ erro: 'O campo "nome" é obrigatório.' });
    }
    
    const novoProduto = { id: idAtual++, nome, categoria };
    produtos.push(novoProduto);
    console.log(lista);
    res.status(201).json(novoProduto);
});
*/

//Path to filter products
app.get('/produtos', (req, res) => {
    const {categoria} = req.query;
    let resultado = produtos;

    if (categoria) {
        resultado = produtos.filter(produto => produto.categoria.toLowerCase() === categoria.toLocaleLowerCase());

    }
    res.json(resultado);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});