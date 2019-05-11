const express = require('express');
const morgan = require('morgan');

const app = express();
//.use is middleware
app.use(morgan('common'));

const playstore = require('./playstore.js');

app.get('/apps', (req, res) => {
    const { genres = "", sort } = req.query;

    if(sort) {
        if(!['App', 'Rating'].includes(sort)) {
            console.log(sort)
            return res.status(400).send('Sort must be one of App or Rating');
        }
    };

    let results = playstore
        .filter(app => app.Genres.includes(genres));
    
    if(sort) {
        results.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        });
    };

    res.json(results);

});

app.listen(8000, () => {
    console.log('Server started on PORT 8000');
});