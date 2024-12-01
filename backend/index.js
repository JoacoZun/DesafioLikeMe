require('dotenv').config();  

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: process.env.DB_USER,          
  host: process.env.DB_HOST,         
  database: process.env.DB_NAME,     
  password: process.env.DB_PASSWORD, 
  port: process.env.DB_PORT,         
});

// Ruta GET para obtener los registros de la tabla posts
app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener los posts:', error);
    res.status(500).send('Error al obtener los posts.');
  }
});

// Ruta POST para agregar un nuevo registro a la tabla posts
app.post('/posts', async (req, res) => {
  const { titulo, img, descripcion, likes } = req.body;

  if (!titulo || !img || !descripcion || likes === undefined) {
    return res.status(400).send('Todos los campos son obligatorios.');
  }

  try {
    const query = 'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [titulo, img, descripcion, likes];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al agregar un nuevo post:', error);
    res.status(500).send('Error al agregar un nuevo post.');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
