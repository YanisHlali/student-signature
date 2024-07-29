const Home = require('../models/Home');

async function homepage(req, res) {
    Home.getHome((err, classes) => {
        if (err) res.status(500).json(err);
        else res.render('./home', {classe: classes})
    });
}

module.exports = {
    homepage

};