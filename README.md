# Node/Ionic URL Shortener
A simple url shortener made with Node and Mongo and a front end using said API made with Ionic.

## Getting started
The project has 2 parts, the backend (the actual url shortener) and a implementation of the url shortener in an Ionic app.
### Backend - Node Server
**Using**:
* [NodeJS](https://github.com/nodejs/node)
* [MongoDB](https://www.mongodb.com/)
* [Express](https://expressjs.com/)
* [CORS](https://www.npmjs.com/package/cors)

**Install and run:**

1. First install Mongo and Node, the links and steps for that are in the *Using* segment above.

2. Run the next lines after cloning the project:
```bash
$ cd ./url-shortener/backend
$ npm install
$ npm start
```

### Frontend - Ionic App
**Using**:
* [Ionic](https://ionicframework.com)
* [NodeJS](https://github.com/nodejs/node)

**Install and run:**
1. First install Mongo and Node, the links and steps for that are in the *Using* segment above.

2. Run the next lines after cloning the project:
```bash
$ cd ./url-shortener/url-shortener
$ npm install -g ionic
$ npm install
$ ionic serve
```

## Docs
### Backend - Node Server
[View specific documentation for the backend](backend/README.md)

The API is used through standard http requests. This are the expected results from get and post requests.

URL | GET | POST
--- | --- | ----
http://*youraddress*/sites | **List** of elements in the collection '*sites*'. | **Adds** an element to sites collection and returns status of transaction and inserted element or reason of failure.
http://*youraddress*/azb091 | **Redirects to website** if successful, if not then returns a 404. | **No POST request for /:code**.

#### Command line options
This are some command line options:
Usage url-shortener: node index *options* *arguments*
Options:

Command | Action
------- | ------
**-h, --help** | Prints all of the command line options
**-p, --port** [port number] | Sets port name of the node server (3000 by default)
**--mongo-db** [mongo collection name] | Sets the mongo collection ('*short*' by default)
**--mongo-host** [mongo hostname] | Sets the hostname where mongoDB is (localhost by default) 
**--mongo-port** [mongo port] | Sets the port where mongoDB is (27017 by default)

### Frontend - Ionic App
[View specific documentation for the frontend](#)

## Authors

* **Fabrizzio Rivera** - [fabrv](https://github.com/fabrv)

## License

This project is licensed under the GNU3.0 License - see the [LICENSE](LICENSE) file for details
