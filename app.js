const express = require("express");
const app = express();
const fs = require('fs').promises;
const { Pool } = require('pg');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(3000, () => {
console.log("El servidor está inicializado en el puerto 3000");
});

let config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
}
const pool = new Pool(config)

app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/index.html") 
})

app.post("/post", async(req, res) =>{
    try {
        let {usuario, URL, descripcion} = req.body
        let likes = 0
        let query = {
            text: "INSERT INTO posts VALUES (default, $1, $2, $3, $4)",
            values: [usuario, URL, descripcion, likes]
        }
        let response = await pool.query(query)
        res.send(response)
    } catch (error) {
        console.log(error)
    }
})

 app.put("/post", async(req, res) =>{
     try {
         let {id} = req.query
         let query = {
             text: "UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *",
             values: [id]
         }
         let response = await pool.query(query)
         res.send(response.rows)
     } catch (error) {
         console.log("Ha ocurrido un error")
     }
 })


 app.get("/posts", async(req, res) =>{
     try {
         let query = {
             text: "SELECT * FROM posts",
         }
         let response = await pool.query(query)
         res.send(response.rows)
     } catch (error) {
         console.log("Ha ocurrido un error")
     }
 })