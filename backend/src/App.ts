import * as express from 'express';
import * as mongoose from 'mongoose';
import * as cors from 'cors';

class App {
  public app: any;
  public connection: any = mongoose.connection;
  public mongoPort: number = 27017
  public mongoAddress: string = 'localhost';
  public mongoDatabase: string = 'short'  

  constructor() {
    for (let i:number = 0; i < process.argv.length; i++){
      switch (process.argv[i]){
        case '--mongo-db':
          console.log(process.argv[i + 1]);
          if (process.argv[i + 1]){
            this.mongoDatabase = process.argv[i + 1];
          }
        
        case '--mongo-port':
          if (!isNaN(parseInt(process.argv[i + 1]))){
            this.mongoPort = parseInt(process.argv[i + 1]);
          }

        case '--mongo-host':
          if (process.argv[i + 1]){
            this.mongoAddress = process.argv[i + 1];
          }
      }
    }

    // Connection string to mongodb
    console.log(`MongoDB address on: 'mongodb://${this.mongoAddress}:${this.mongoPort}/${this.mongoDatabase}'`)
    mongoose.connect(`mongodb://${this.mongoAddress}:${this.mongoPort}/${this.mongoDatabase}`);


    // Express app
    this.app = express();
    this.mountRoutes();

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB error: ${err}`);
    });
  }

  private mountRoutes(): void {
    const router: any = express.Router();

    // CORS module to allow cross origin resource sharing
    router.use(cors());
        
    router.get('/:code', (req, res) => {
      console.log(`Resquested get ${req.params.code}`);
      // If request is /sites
      // Meaning its requesting a list of sites
      if (req.params.code == 'sites'){
        this.getSite('sites', {}, (err, docs)=>{
          if (err){
            res.status(500).send({ status: 'fail', code: '500', message: 'The server encountered an unexpected condition which prevented it from fulfilling the request.', error: err });
          }
          // By deafault response status is 200 so there is no need to specify it
          res.json(docs);
        });
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
    
    router.post('/sites/:site', (req, res) => {
      console.log(`Resquested post ${req.params.site}`);
      // Check if parameter is a valid URL
      if (this.validURL(req.params.site)){
        // postSite() adds a site to the Mongo collection and responds with the element added
        this.postSite('sites', req.params.site).then((site:any)=>{
          res.status(201).send({
            status: 'success',
            data: site
          });
        });
      }else{
        res.status(400).send({status: 'fail', code: 400, message: 'Bad request: Parameters is not a valid URL.'})
      }
    });
    
    // Set router location
    this.app.use('/', router);
  }

  postSite(name: string, url: string){
    if (!url.includes('http')){
      url = "https://" + url;
    }

    // Site schema
    // The code of each link is a pseudo-random number from 0 to 2176782335 in base 36
    const site = {
      url: url,
      code: (Math.floor(Math.random()*2176782335)).toString(36),
      count: 0,
      createdAt: new Date()
    };
    let cb: any = [];
        
    return new Promise ((siteRow)=>{
      // Get mongo collection
      mongoose.connection.db.collection(name, (err, collection)=>{        
        cb = collection.find( {url: url} ).toArray( (err, docs)=>{
          // Verify that the website hasn't been shorten before
          if (docs.length == 0){
            this.connection.collection(name).insertOne(site);
      
            console.log('Inserted Site:');
            console.log(site);
            siteRow(site);
          }else{
          // If it has been shorten before return the preexisting code.
            siteRow(docs[0]);
          }
         });
      });
    });
    // (Sorry for the function literal after function literal)
  }

  getSite (name: string, query:any, cb: any) {
    // Get mongo collection
    mongoose.connection.db.collection(name, (err, collection)=> {
      // Update query, by deafault 'count' will increment by 0 (it will not increment)
      let newVal = { $inc: {count: 0} };
      // If the query is not empty then increment by 1
      // If the user is requesting a singular site it must count it as a visit but
      //      if the user is requesting the list of websites it shouldn't add to the visit count of a link
      if (JSON.stringify(query) != '{}'){
        newVal = { $inc: {count: 1}};
      }

      // Send the update query
      collection.findOneAndUpdate(query, newVal, (e, res)=>{
        if (e) return console.log(e);
        console.log("1 document updated");

        collection.find(query).toArray(cb);
      })
    });    
  }

  // URL validator
  validURL(url:string) {
    const regexp: any =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return regexp.test(url);
  }
}

// Export this class
export default new App().app;