const shortUrl = require('node-url-shortener');
 
shortUrl.short(process.argv[2], function(err, url){
    console.log(url);
});