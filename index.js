const express = require('express');
const ejs = require('ejs');
const app = express();
const port = 3000;

app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.send('Hello World!')
});
app.get('/movies', (req, res) => {
    res.render('movielist', {title:'List of all movies'})
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