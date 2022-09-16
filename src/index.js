const { Pool } = require('pg')
const express = require('express')

require('dotenv').config()

const app = express();
const pool = new Pool({
  connectionString: process.env.PGURL
})

app.use(express.json())

app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await pool.query('SELECT * FROM usuarios ORDER BY id ASC')
    console.log(usuarios);
    return res.status(200).send(usuarios.rows)

  } 
  
  catch (error) {
    return res.status(400).send({error: true, message: error})
  }
})

app.get('/usuarios/:id', async (req, res) => {
  try {
    const id = req.params.id
    const usuarios = await pool.query('SELECT * FROM usuarios WHERE id=($1)',[id])

    return res.status(200).send(usuarios.rows)
  } 
  
  catch (error) {
    return res.status(400).send({error: true, message: error})
  }
})

app.post('/usuarios', async (req, res) => {
  try {
    const {nome, username, email} = req.body
    const query = {
      text: 'INSERT INTO usuarios (nome, username, email) VALUES ($1, $2, $3) RETURNING *',
      values : [nome, username, email]
    }

    const request = await pool.query(query)
    return res.status(200).send(request.rows)
  } 
  
  catch (error) {
    return res.status(400).send({error: true, message: error})
  }
})

app.put('/usuarios/:id', async (req, res) => {
  try {
    const id = req.params.id
    const { nome, username, email } = req.body
    const query = {
      text: 'UPDATE usuarios SET nome=($1), username=($2), email=($3) WHERE id=($4) RETURNING *',
      values : [nome, username, email, id]
    }

    const request = await pool.query(query)
    return res.status(200).send(request.rows)
  } 
  
  catch (error) {
    return res.status(400).send({error: true, message: error})
  }
})

app.delete('/usuarios/:id', async (req, res) =>  {
  try {
    const id = req.params.id

    const request = await pool.query('DELETE FROM usuarios WHERE id=($1) RETURNING *', [id])
    return res.status(200).send(request.rows)
  } 
  
  catch (error) {
    return res.status(400).send({error: true, message: error})
  }
})

app.listen(3333, () => {console.log('Server starting in http://localhost:3333/')})