import * as express from 'express';
import * as mongoose from 'mongoose';
import * as cors from 'cors';

class App {
  public app;
  public connection = mongoose.connection;

  constructor() {
    //Mongoose
    mongoose.connect('mongodb://localhost:27017/myapp');
    this.app = express();
    this.mountRoutes();

    mongoose.connection.on('error', (err) => {
      console.log(`MongoDB error: ${err}`);
    });
  }

  private mountRoutes(): void {
    const router = express.Router();

    router.use(cors());

    router.get('/:code', (req, res) => {
      console.log(`Resquested get ${req.params.code}`);
      this.getSite('sites', {code: req.params.code}, (err, docs)=>{
        console.log(docs[0]);
        res.writeHead(301,{Location: docs[0].url});
        res.end();
      })      
    });

    router.use(cors());
    router.post('/:site', (req, res) => {
      console.log(`Resquested post ${req.params.site}`);
      this.postSite('sites', req.params.site).then((site:any)=>{
        res.json({
          message: `Resquested post for ${req.params.site}`,
          answer: site
        });
      });
    });
    this.app.use('/', router);
  }

  postSite(name: string, url: string){
    if (!url.includes('http')){
      url = "http://" + url;
    }   
    const site = {
      url: url,
      code: (Math.floor(Math.random()*65535)).toString(16)
    };
    let cb: any = [];

    return new Promise ((siteRow)=>{
      mongoose.connection.db.collection(name, (err, collection)=>{
        cb = collection.find( {url: url} ).toArray( (err, docs)=>{
          console.log(docs.length);        
          if (docs.length == 0){
            this.connection.collection(name).insertOne(site);
      
            console.log('Inserted Site:');
            console.log(site);
            siteRow(site);
          }else{
            siteRow(docs[0]);
          }
         });
      })
    });
  }

  getSite (name: string, query:any, cb: any) {
    mongoose.connection.db.collection(name, (err, collection)=> {
      collection.find(query).toArray(cb);
    });
  }
}

export default new App().app