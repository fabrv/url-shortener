# Node URL Shortener
This is the actual '*URL Shortener*' part of the project. This runs a RESTful API that *posts* new shorten links and *gets* websites.

## Install and run
1. First install Mongo and Node.

2. Run the next lines after cloning the project:
```bash
$ cd ./url-shortener/backend
$ npm install
$ npm start
```

## Understading the code
Everything is written in Typescript but there is no need to sweat it with compiling, just run `npm run build` or `tsc` on this directory and the code will be built production ready on the *dist* folder. And if you want to live-run use `npm start`.

### Project structure
The source code is on the *src* folder and the build is in the *dist* folder. *App.ts* has the actual server and *index.ts* is where the server is run.

* *src*: Project source code (typescrypt)
* *dist*: Built code (javascript)

### Code
**Initiating the server**

```javascript
import app from './App'

const port = process.env.PORT || 3000

app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }
  return console.log(`Server is listening on ${port}`);
});
```

**Routers** 
(All of the routes are in the funcition `mountRoutes()`)

```javascript
router.get('/:code', (req, res) => {
```
This declares a route for GET in *serverAddress*/parameter, the parameter is called '*code*' 

```javascript  
  if (req.params.code == 'sites'){
    this.getSite('sites', {}, (err, docs)=>{
      if (err){
        res.status(500).send({ status: 'fail', code: '500', message: 'The server encountered an unexpected condition which prevented it from fulfilling the request.', error: err });
      }
      res.json(docs);
    });
```


```javascript
  }else{  
    // getSites() returns a promise with the database result
    this.getSite('sites', {code: req.params.code}, (err, docs)=>{
      if (err){
        res.status(500).send({ status: 'fail', code: '500', message: 'The server encountered an unexpected condition which prevented it from fulfilling the request.', error: err });
      }
      if (docs.length == 0){
        res.status(404).send({status: 'fail', code: 404, message: 'Not found: The server has not found anything matching the Request-URI.'})
      }else{
        console.log(docs[0]);

        // Redirects to the corresponding website
        res.writeHead(301,{Location: docs[0].url});
        res.end();
      }
    });
  }    
});
```