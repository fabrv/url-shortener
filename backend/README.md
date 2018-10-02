# Node URL Shortener
This is the actual url shortener part of the project. This runs a RESTful API that *posts* new shorten links and *gets* websites.

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