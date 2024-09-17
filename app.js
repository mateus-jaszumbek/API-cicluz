const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db.js').default;

const app = express();
const PORT = process.env.PORT || 8081;
const API_BASE_URL = '/api';  // Adicione a definição da URL base da API

app.use(bodyParser.json());
app.use(cors());

// Rota para criar tabelas
app.post(`${API_BASE_URL}/tabelas`, async (req, res) => {
    try {
        const result = await db.criarTabelas();
        res.status(201).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para inserir um tópico
app.post(`${API_BASE_URL}/topicos`, async (req, res) => {
    const { nome, id_est } = req.body;
    try {
        const result = await db.inserirTopico(nome, id_est);
        res.status(201).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para inserir um sub-tópico
app.post(`${API_BASE_URL}/subtopicos`, async (req, res) => {
    const { nome, id_topico } = req.body;
    if (!nome || !id_topico) {
        return res.status(400).json({ error: 'Nome e ID do tópico são obrigatórios' });
    }
    try {
        const result = await db.inserirSubtopico(nome, id_topico);
        res.status(201).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para consultar tópicos
app.get(`${API_BASE_URL}/topicos/:id`, async (req, res) => {
    const id_est = req.params.id || null;
    try {
        const topicos = await db.consultarTopicos(id_est);
        res.status(200).json(topicos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para consultar um tópico específico
app.get(`${API_BASE_URL}/topico/:id`, async (req, res) => {
    const id_topico = req.params.id || null;
    try {
        const topicos = await db.consultarTopico(id_topico);
        res.status(200).json(topicos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para consultar sub-tópicos
app.get(`${API_BASE_URL}/subtopicos/:id`, async (req, res) => {
    const id_topico = req.params.id || null;
    try {
        const subtopicos = await db.consultarSubtopicos(id_topico);
        res.status(200).json(subtopicos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para consultar áreas
app.get(`${API_BASE_URL}/areas/:est`, async (req, res) => {
    let est = req.params.est || null;
    try {
        let resultado = await db.consultarEstAreas(est);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para consultar uma área específica
app.get(`${API_BASE_URL}/area/:id`, async (req, res) => {
    let id_item = req.params.id || null;
    console.log(id_item);
    try {
        let resultado = await db.consultarEstArea(id_item);
        res.status(200).json(resultado);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
});

// Rota para deletar um tópico
app.delete(`${API_BASE_URL}/topicos/:id`, async (req, res) => {
    const id_topico = req.params.id || null;
    try {
        let teste = await db.deletarTopico(id_topico);
        console.log(teste);
        res.status(204).send(); // Alterado para enviar um status 204 sem corpo
    } catch (error) {
        console.log('deu ruim');
        res.status(500).json({ error: error.message });
    }
});

// Rota para deletar um sub-tópico
app.delete(`${API_BASE_URL}/subtopico/:id`, async (req, res) => {
    const id_subtopico = req.params.id || null;
    try {
        await db.deletarSubtopico(id_subtopico);
        res.status(204).send(); // Alterado para enviar um status 204 sem corpo
    } catch (error) {
        console.log('deu ruim');
        res.status(500).json({ error: error.message });
    }
});

// Rota para deletar sub-tópicos (parece redundante, considere revisar)
app.delete(`${API_BASE_URL}/subtopicos/:id`, async (req, res) => {
    const id_subtopico = req.params.id || null;
    try {
        await db.deletarSubtopicos(id_subtopico);
        res.status(204).send(); // Alterado para enviar um status 204 sem corpo
    } catch (error) {
        console.log('deu ruim');
        res.status(500).json({ error: error.message });
    }
});

// Rota de teste para fechar a conexão com o banco de dados
app.get(`${API_BASE_URL}/teste`, async (req, res) => {
    try {
        const result = await db.criarTabelas();
        res.status(201).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Servir arquivos estáticos
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
