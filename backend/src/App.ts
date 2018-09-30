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
      if (req.params.code == 'sites'){
        this.getSite('sites', {}, (err, docs)=>{
          if (err){
            res.status(500).send({ status: 'fail', code: '500', message: 'The server encountered an unexpected condition which prevented it from fulfilling the request.', error: err });
          }
          res.json(docs);
        });
      }else{
        this.getSite('sites', {code: req.params.code}, (err, docs)=>{
          if (err){
            res.status(500).send({ status: 'fail', code: '500', message: 'The server encountered an unexpected condition which prevented it from fulfilling the request.', error: err });
          }
          if (docs.length == 0){
            res.status(404).send({status: 'fail', code: 404, message: 'Not found: The server has not found anything matching the Request-URI.'})
          }else{
            console.log(docs[0]);
            res.writeHead(301,{Location: docs[0].url});
            res.end();
          }
        });
      }    
    });

    router.use(cors());
    router.post('/sites/:site', (req, res) => {
      console.log(`Resquested post ${req.params.site}`);
      if (this.validURL(req.params.site)){
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
    
    this.app.use('/', router);
  }

  postSite(name: string, url: string){    
    if (!url.includes('http')){
      url = "https://" + url;
    }   
    const site = {
      url: url,
      code: (Math.floor(Math.random()*2176782335)).toString(36),
      count: 0
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
      let newVal = { $inc: {count: 0} };
      console.log(JSON.stringify(query));
      if (JSON.stringify(query) != '{}'){
        newVal = { $inc: {count: 1}};
      }
      collection.findOneAndUpdate(query, newVal, (e, res)=>{
        if (e){
          if (err) return res.status(500).send({ status: 'fail', code: '500', message: 'The server encountered an unexpected condition which prevented it from fulfilling the request.', error: err });
          res.toArray(cb);
        }
        console.log("1 document updated");

        collection.find(query).toArray(cb);
      })
    });    
  }

  validURL(url:string) {
    var regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return regexp.test(url);
  }
}

export default new App().app