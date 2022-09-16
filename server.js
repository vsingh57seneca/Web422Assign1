const express = require('express');
const app = express();
const HTTP_PORT = process.env.HTTP_PORT || 8080;
const cors = require('cors');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const MoviesDB = require("./modules/moviesDB.js");
const { read } = require('fs');
const db = new MoviesDB();


app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.json({message: "API Listening"});
  });

  app.post('/api/movies/', (req, res) => {
    db.addNewMovie(req.body).then(()=> {
        res.status(201).json({message: "movie added"});
    }).catch(()=> {
        res.status(201).json({message: "unable to add movie"});
    }).catch(()=> {
        res.status(400).json({message: "Unable to get movies"});
    })
  });

  app.get('/api/movies/', (req, res) => {
    let page = req.query.page;
    let perPage = req.query.perPage;
    let title = req.query.title;

    db.getAllMovies(page, perPage, title).then(data => {
        res.status(201).json(data);
    }).catch(()=> {
        res.status(400).json({message: "Unable to get movies"});;
    });
});

app.get('/api/movies/:id', (req, res) => {
    db.getMovieById(req.params.id).then(data => {
        res.status(201).json(data);
    }).catch(err => {
        res.status(400).json({message: err});
    });
});


app.put('/api/movie/:id',(req, res) => {
    db.updateMovieById(req.body, req.params.id).then(data => {
        res.status(201).json(data);
    }).catch(err => {
        res.status(400).json({message: err});
    });
});

app.delete('/api/movie/:id', (req, res) => {
    db.deleteMovieById(req.params.id).then(data => {
        res.status(201).json(data);
    }).catch(err => {
        res.status(400).json({message: err});
    });
})


db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});