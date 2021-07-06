'use strict';
const express = require('express'); // require the express package
const app = express(); // initialize your express app instance
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const PORT = process.env.PORT;
app.use(cors()); // after you initialize your express app instance
app.use(express.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/cocktail', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cocktailSchema = new mongoose.Schema({
  strDrink: String,
  strDrinkThumb: String,
  idDrink: String,
});

const cocktailModel = mongoose.model('cocktail', cocktailSchema);

// a server endpoint
app.get(
  '/', // our endpoint name
  function (req, res) {
    // callback function of what we should do with our request
    res.send('Hello World 🍹'); // our endpoint function response
  }
);

app.get('/cocktailData', cocktailDataHandler);
app.post('/addFav', addFavHandler);
app.get('/getFav', getFavHandler);
app.delete('/deleteFav', deleteFavHandler);
app.get('/updateFav', updateFavHandler);

function cocktailDataHandler(req, res) {
  const url =
    'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic';
  axios.get(url).then((response) => {
    res.json(response.data.drinks);
  });
}

function addFavHandler(req, res) {
  const { strDrink, strDrinkThumb, idDrink } = req.body;
  const newDrink = new cocktailModel({
    strDrink: strDrink,
    strDrinkThumb: strDrinkThumb,
    idDrink: idDrink,
  });
  newDrink.save();
}

function getFavHandler(req, res) {
  cocktailModel.find({}, (err, data) => {
    res.send(data);
  });
}

function deleteFavHandler(req, res) {
  const idDrink = req.query.idDrink;
  cocktailModel.deleteOne({ idDrink: idDrink }, (err, data) => {
    cocktailModel.find({}, (err, data) => {
      res.send(data);
    });
  });
}

function updateFavHandler(req, res) {
  const { strDrink, strDrinkThumb, idDrink } = req.body;
  cocktailModel.findOne({ idDrink: idDrink }, (err, data) => {
    (data.strDrink = strDrink),
      (data.strDrinkThumb = strDrinkThumb),
      (data.idDrink = idDrink);
    data.save();
    cocktailModel.find({}, (err, data) => {
      res.send(data);
    });
  });
}
app.listen(PORT, () => {
  console.log(`Listening on PRT ${PORT}`);
}); // kick start the express server to work
