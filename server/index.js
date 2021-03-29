const express = require("express");
const app = express();
const cors = require('cors');
const pool = require('./db');
const PORT = 5000;

//middleware

app.use(cors());
app.use(express.json());

// ROUTES //
app.post("/todos", async(req, res) => {
    try {
        const {description, completed } = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description, completed) VALUES($1, $2) RETURNING *", 
        [description, completed]);

        res.json(newTodo.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
})

app.get("/todos", async(req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    } catch (error) {
        console.log(error.message)
    }
})
app.get("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        res.json(todo.rows[0]);
    } catch (error) {
        console.log(error.message)
    }
})

app.put("/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { description } = req.body;
      const updateTodo = await pool.query(
        "UPDATE todo SET description = $1 WHERE todo_id = $2",
        [description, id]
      );
      res.json("Todo was updated!");
    } catch (err) {
      console.error(err.message);
    }
  });
  app.put("/todos/completed/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { completed } = req.body;
      const updateTodo = await pool.query(
        "UPDATE todo SET completed = $1 WHERE todo_id = $2",
        [completed, id]
      );
      res.json("Todo was updated!");
    } catch (err) {
      console.error(err.message);
    }
  });

  app.delete("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        res.json("Todo was deleted!");
    } catch (error) {
        console.log(error.message)
    }
})


app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
})