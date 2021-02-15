const express = require('express');
const ejs = require('ejs');
const app = express();
const port = 3000;

// dit is tijdelijk totdat we echt een database hebben waar we
// de films uithalen
const movies = [
  { "name": "Black Panther", "year": 2018, "categories": ["action","adventure","sci-fi"]},
  { "name": "Incredibles 2", "year": 2018, "categories": ["animation","action","adventure"]},
  { "name": "Halloween", "year": 2018, "categories": ["horror","thriller"]},
  { "name" : "Ad Astra", "year" : 2019, "categories" : ["adventure","fantasy","mystery","thriller","sci-fi"]},
  { "name" : "Toy Story 4", "year" : 2019, "categories" : ["animation","adventure","comedy","family","fantasy"]}
];

app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.send('Hello World!')
});
app.get('/movies', (req, res) => {
    res.render('movielist', {title:'List of all movies', movies})
})
app.get('/movies/:movieId', (req, res) => {
    res.send(`<h1>Detailpage of movie ${req.params.movieId} </h1>`)
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});