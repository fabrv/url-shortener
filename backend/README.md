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
http://*youraddress*/sites | **List** of elements in the collection '*sites*'. | **Adds** an element to sites collection and returns status of transaction and inserted element or reason of failure.
http://*youraddress*/azb091 | **Redirects to website** if successful, if not then returns a 404. | **No POST request for /:code**.

## Command line options
Usage url-shortener: node index *options* *arguments*
Options:
 COMMAND | ACTION
 ------- | ------
 -h, --help | Prints all of the command line options
 -p, --port [port number] | Sets port name of the node server (3000 by default)
 --mongo-db [mongo collection name] | Sets the mongo collection ('*short*' by default)
 --mongo-host [mongo hostname] | Sets the hostname where mongoDB is (localhost by default) 
 --mongo-port [mongo port] | Sets the port where mongoDB is (27017 by default)

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

**The rest of the application**  
The rest of the application is in App.ts