const router = require('express').Router()
const jsonParser = require('body-parser').json()

const database = require('../database.js')
const SELECTtohblock  = require('../../database/queries/SELECTtohblock.js')


router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

router.get('/', jsonParser, (req, res) => {
    //console.log('You have submitted a GET on test');
    //res.render('index', { user: "Great User", title: "homepage" });
    //res.send('this is the response');
   
    let result = database.queryDB(SELECTtohblock, []);
    res.render('index', result);
    res.send('hi');
    console.log(result);
})

module.exports = router
