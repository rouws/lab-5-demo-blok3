const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const slug = require('slug')
const app = express();
const dotenv = require('dotenv').config();
const { MongoClient } = require('mongodb')
const port = 3000;

const years = ['2017', '2018', '2019', '2020'];
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
app.get('/movies', async (req, res) => {
      // create an empty list of movies
    let movies = {}
    // look for alle movies in database and sort them by year and name into an array
    movies = await db.collection('movies').find({},{sort: {year: -1, name: 1}}).toArray();
    res.render('movielist', {title:'List of all movies', movies})
})
app.get('/movies/add', (req, res) => {
  res.render('add', {title: "Add movie", categories});
});
app.post('/movies/add', async (req,res) => {
  const id = slug(req.body.name);
  const movie = {"id": "id", "name": req.body.name, "year": req.body.year, "categories": req.body.categories, "storyline": req.body.storyline};
  await db.collection('movies').insertOne(movie);
  res.render('moviedetails', {title: "Added a new movie", movie})
});
app.get('/movies/filter', (req, res) => {
  res.render('filter', {title: "Filter movies", categories, years})
});
app.post('/movies/filter', async (req, res) => {
    // a list of years that the user has chosen
    // if no years were chosen by user, show all years
    // idem for categories
    const chosenYears = req.body.years || years;
    const chosenCategories = req.body.categories || categories;
    console.log(chosenYears);
    console.log(chosenCategories);

    const allMovies = await db.collection('movies').find({}).toArray();
    let filteredMovies = allMovies.filter(movie => {
       if (chosenYears.includes(movie.year.toString())) {
         for (category of movie.categories) {
           if (chosenCategories.includes(category)) {
             return true;
           }
         }
       }
       return false;
    });
    res.render('movielist', {title:'Filtered list of movies', movies: filteredMovies})
});
app.get('/movies/:movieId', async (req, res) => {
    const movie = await db.collection('movies').findOne({ id: req.params.movieId });
    res.render('moviedetails', {title: "Movie details", movie})
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});