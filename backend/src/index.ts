import app from './App'

let port: number = 3000;

for (let i:number = 0; i < process.argv.length; i++){
  switch(process.argv[i]){
    case '--help':
    case '-h':
      console.log(`
      Usage url-shortener: node index [options] [arguments]
      Options:
        -h, --help
        -p, --port [port number]
        --mongo-db [mongo dbname]
        --mongo-port [mongo port]
        --mongo-host [mongo hostname]  
      `);
      process.exit();
    
    case '-p':
    case '--port':
      if (!isNaN(parseInt(process.argv[i + 1]))){
        port = parseInt(process.argv[i + 1]);
      }
  }
}

app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }
  return console.log(`Server is listening on ${port}`);
});

process.on('SIGINT', function() {
  process.exit();
});