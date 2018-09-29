import * as express from 'express';
import * as mongoose from 'mongoose';

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
    router.get('/:code', (req, res) => {
      console.log(`Resquested get ${req.params.code}`);
      res.json({
        message: `Resquested get ${req.params.code}`
      });      
    });

    router.post('/:site', (req, res) => {
      console.log(`Resquested post ${req.params.site}`);
      const ans = this.postSite(req.params.site);
      res.json({
        message: `Resquested post for ${req.params.site}`,
        answer: ans
      });      
    });
    this.app.use('/', router);
  }

  postSite(url: string){      
    const site = {
      url: url,
      code: (Math.floor(Math.random()*65535)).toString(16)
    };

    this.connection.collection('sites').insertOne(site);
    
    console.log('Inserted Site:');
    console.log(site);
    return site;
  }

  getSite(code: string){

  }
}

export default new App().app