var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const getUrl = (req, res) => {
  res.status(200).json({ message: 'get url' });
 };
 
 const saveUrl = (req, res) => {
     res.status(200).json({ message: 'save url' });
 };
 /* Create a short URL */
 router.post('/', saveUrl);
 
 /* Get original URL */
 router.get('/:code', getUrl);
 
module.exports = router;