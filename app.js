const express = require('express');
const morgan = require('morgan');

const app = express();
//.use is middleware
app.use(morgan('common'));

const playstore = require('./playstore.js');

app.get('/apps', (req, res) => {
    const { genres = "", sort } = req.query;

    let results = playstore
        .filter(app => app.Genres.includes(genres));

    if(sort) {
        let sorting = sort[0].toUpperCase() + sort.slice(1).toLowerCase();
        if(!['App', 'Rating'].includes(sorting)) {
            return res.status(400).send('Sort must be one of App or Rating');
        }
        if(sorting === "App") {
            results.sort((a, b) => {
                return a[sorting] > b[sorting] ? 1 : a[sorting] < b[sorting] ? -1 : 0;
            });
        };
        if(sorting === "Rating") {
            results.sort((a, b) => {
                return a[sorting] < b[sorting] ? 1 : a[sorting] > b[sorting] ? -1 : 0;
            });
        };
    };
    
    res.json(results);
});

module.exports = app;