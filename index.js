const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const slug = require('slug')
const app = express();
const dotenv = require('dotenv').config();
const { MongoClient } = require('mongodb')
const port = 3000;


const categories = ["action", "adventure", "sci-fi", "animation", "horror", "thriller", "fantasy", "mystery", "comedy", "family"];

let db = null;
// function connectDB
async function connectDB () {
  // get URI from .env file
  const uri = process.env.DB_URI
  // make connection to database
  const options = { useUnifiedTopology: true };
  const client = new MongoClient(uri, options)
  await client.connect();
  db = await client.db(process.env.DB_NAME)
}
connectDB()
  .then(() => {
    // if succesfull connections is made, show a message
    console.log('We have a connection to Mongo!')
  })
  .catch( error => {
    // if connnection is unsuccesful, show errors
    console.log(error)
  });


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.send('Hello World!')
});
app.get('/movies', (req, res) => {
    res.render('movielist', {title:'List of all movies', movies})
})
app.get('/movies/add', (req, res) => {
  res.render('add', {title: "Add movie", categories});
});
app.post('/movies/add', (req,res) => {
  const id = slug(req.body.name);
  const movie = {"id": "id", "name": req.body.name, "year": req.body.year, "categories": req.body.categories, "storyline": req.body.storyline};
  movies.push(movie);
  res.render('moviedetails', {title: "Added a new movie", movie})
});
app.get('/movies/:movieId', (req, res) => {
    const movie = movies.find( movie => movie.id == req.params.movieId);
    res.render('moviedetails', {title: "Movie details", movie})
});


app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});