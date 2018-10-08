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

## Using the API
The API is used through standard http requests. This are the expected results from get and post requests.

URL | GET | POST
--- | --- | ----
http://*youraddress*/sites | **List** of elements in the collection sites | **Adds** an element to sites collection and returns status of transaction and inserted element or reason of failure.
http://*youraddress*/azb091 | **Redirects to website** if successful, if not then returns a 404 | **No POST request for /:code**

## Understading the code
Everything is written in Typescript but there is no need to sweat it with compiling, just run `npm run build` or `tsc` on this directory and the code will be built production ready on the *dist* folder. And if you want to live-run use `npm start`.

### Project structure
The source code is on the *src* folder and the build is in the *dist* folder. *App.ts* has the actual server and *index.ts* is where the server is run.

* *src*: Project source code (typescrypt)
* *dist*: Built code (javascript)

### Code
**Initiating the server** (In index.ts)

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
(All of the routes are in the funcition `mountRoutes()` in App.ts).  
This declares a GET route in *serverAddress*/parameter, the parameter is called '*code*'

```javascript
router.get('/:code', (req, res) => {
``` 
If the the request is *serverAddress*/sites then it's requesting the list of items in the sites collection
```javascript  
  if (req.params.code == 'sites'){
    this.getSite('sites', {}, (err, docs)=>{
      if (err){
        res.status(500).send({ 
          status: 'fail', 
          code: '500', 
          message: 'The server encountered an unexpected condition which prevented it from fulfilling the request.', 
          error: err });
      }
      res.json(docs);
    });
```
If the get request parameter is not '*sites*' then the next lines will look for the corresponding site in the Mongo collection and redirect the user to that website.
```javascript
  }else{
    this.getSite('sites', {code: req.params.code}, (err, docs)=>{
      if (err){
        res.status(500).send({ 
          status: 'fail', 
          code: '500', 
          message: 'The server encountered an unexpected condition which prevented it from fulfilling the request.', 
          error: err });
      }
      if (docs.length == 0){
        res.status(404).send({
          status: 'fail', 
          code: 404, 
          message: 'Not found: The server has not found anything matching the Request-URI.'})
      }else{
        console.log(docs[0]);
        res.writeHead(301,{Location: docs[0].url});
        res.end();
      }
    });
  }    
});
```

**MongoDB Insert and Queries** (also in App.ts).  
**Post** function, The code of each link is a pseudo-random number from 0 to 2176782335 in base 36
```javascript
postSite(name: string, url: string){
  const site = {
    url: url,
    code: (Math.floor(Math.random()*2176782335)).toString(36),
    count: 0,
    createdAt: new Date()
  };
  let cb: any = [];
```
Gets the Mongo Collection, verifies if the URL hasn't been shorten before and if it has return the previosly saved shorten link, if it hasn't return the newly uploaded shorten URL
```javascript
  return new Promise ((siteRow)=>{    
    mongoose.connection.db.collection(name, (err, collection)=>{        
      cb = collection.find( {url: url} ).toArray( (err, docs)=>{        
        if (docs.length == 0){
          this.connection.collection(name).insertOne(site);
    
          console.log('Inserted Site:');
          console.log(site);
          siteRow(site);
        }else{
          siteRow(docs[0]);
        }
        });
    });
  });
}
```
**Get** site from the DB function.  
Update query, by deafault 'count' will increment by 0 (it will not increment). If the query is not empty then increment by 1.  
If the user is requesting a singular site it must count it as a visit but if the user is requesting the list of websites it shouldn't add to the visit count of a link.
```javascript
getSite (name: string, query:any, cb: any) {
  mongoose.connection.db.collection(name, (err, collection)=> {    
    let newVal = { $inc: {count: 0} };
    if (JSON.stringify(query) != '{}'){
      newVal = { $inc: {count: 1}};
    }

    // Send the update query
    collection.findOneAndUpdate(query, newVal, (e, res)=>{
      if (e){
        if (err) return res.status(500).send({ 
          status: 'fail', 
          code: '500', 
          message: 'The server encountered an unexpected condition which prevented it from fulfilling the request.', 
          error: err });
        res.toArray(cb);
      }
      console.log("1 document updated");

      collection.find(query).toArray(cb);
    })
  });    
}
```